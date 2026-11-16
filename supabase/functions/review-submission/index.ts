import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const headers = { "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Content-Type": "application/json" };
const json = (status:number, body:Record<string,unknown>) => new Response(JSON.stringify(body),{status,headers});
Deno.serve(async req=>{
  if(req.method==="OPTIONS") return new Response("ok",{headers});
  if(req.method!=="POST") return json(405,{error:"Method not allowed"});
  const auth=req.headers.get("Authorization");
  if(!auth?.startsWith("Bearer ")) return json(401,{error:"Sign in is required."});
  const url=Deno.env.get("SUPABASE_URL"), key=Deno.env.get("SUPABASE_ANON_KEY"), serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"), aiKey=Deno.env.get("OPENAI_API_KEY");
  if(!url||!key||!serviceKey||!aiKey) return json(503,{error:"Backend secrets are not configured."});
  const sb=createClient(url,key,{global:{headers:{Authorization:auth}}});
  const admin=createClient(url,serviceKey);
  const {data:{user}}=await sb.auth.getUser();
  if(!user) return json(401,{error:"Invalid session."});
  let body:any; try{body=await req.json()}catch{return json(400,{error:"Invalid request."})}
  if(typeof body.assignment_id!=="string"||typeof body.answer!=="string"||!body.answer.trim()||body.answer.length>12000) return json(400,{error:"A valid assignment and answer are required."});
  const {data:assignment,error}=await sb.from("assignments").select("id,title,instructions").eq("id",body.assignment_id).single();
  if(error||!assignment) return json(404,{error:"Assignment not found or access denied."});
  const model=Deno.env.get("OPENAI_MODEL")??"gpt-6-luna";
  const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":`Bearer ${aiKey}`,"Content-Type":"application/json"},body:JSON.stringify({model,input:[
    {role:"system",content:"You are an assistant teacher. Evaluate the student's work against the task. Give constructive feedback and a suggested score out of 100. Return concise plain text with sections: Strengths, Improvements, Suggested score. The score is provisional and must never be treated as the official grade; a human teacher must review it."},
    {role:"user",content:`Assignment: ${assignment.title}\nInstructions: ${assignment.instructions}\nStudent response: ${body.answer}`}
  ],max_output_tokens:700})});
  if(!response.ok){console.error("AI review failed",response.status,await response.text());return json(502,{error:"AI review is temporarily unavailable."})}
  const result=await response.json();
  const feedback=(result.output??[]).filter((x:any)=>x.type==="message").flatMap((x:any)=>x.content??[]).filter((x:any)=>x.type==="output_text").map((x:any)=>x.text).join("\n").trim();
  const {data:profile}=await sb.from("profiles").select("role").eq("id",user.id).single();
  const {data:submission,error:saveError}=await admin.from("submissions").upsert({assignment_id:assignment.id,student_id:user.id,answer:body.answer,ai_feedback:feedback,status:"ai_reviewed"},{onConflict:"assignment_id,student_id"}).select("id,status").single();
  if(saveError){console.error(saveError);return json(500,{error:"Could not save the submission."})}
  return json(200,{submission,feedback,official_score:null,note:"AI feedback is provisional. A teacher must review and enter the official score."});
});
