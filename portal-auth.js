(()=>{"use strict";
const $=id=>document.getElementById(id),status=$("auth-status"),signin=$("auth-signin"),signup=$("auth-signup"),signout=$("auth-signout"),google=$("auth-google");
const url=window.MAJESTY_SUPABASE_URL,key=window.MAJESTY_SUPABASE_ANON_KEY;let client=null,session=null;
function say(m){status.textContent=m}
function configured(){return url&&key&&!url.includes("YOUR_PROJECT")&&!key.includes("YOUR_SUPABASE")}
if(!window.supabase||!configured())say("Supabase setup is incomplete. Check supabase-config.js.");
else{client=window.supabase.createClient(url,key);client.auth.getSession().then(({data,error})=>{if(error)say(error.message);setSession(data?.session||null)});client.auth.onAuthStateChange((_event,s)=>{setSession(s)})}
async function loadProfile(s){
  if(!client||!s)return;
  const {data,error}=await client.from("profiles").select("full_name,level").eq("id",s.user.id).maybeSingle();
  if(error){say("Signed in, but profile could not load: "+error.message);return}
  if(data){
    $("student-name").value=data.full_name||"";
    $("level").value=data.level||"";
    $("auth-name").value=data.full_name||"";
    $("auth-level").value=data.level||"";
    $("save-profile").click();
  }else say("Signed in. Your student profile is being prepared.");
}
function setSession(s){
  session=s;const active=!!s;
  signin.classList.toggle("hidden",active);signup.classList.toggle("hidden",active);google.classList.toggle("hidden",active);signout.classList.toggle("hidden",!active);
  ["auth-email","auth-password","auth-name","auth-level"].forEach(id=>$(id).classList.toggle("hidden",active));
  if(active){say("Signed in as "+(s.user.email||"student")+". Your secure student account is connected.");$("student-label").textContent=(s.user.email||"Student")+" · secure account";Promise.resolve().then(()=>loadProfile(s))}
  else if(client){say("You are signed out. Sign in to use your student account and live AI tutor.");$("student-label").textContent="Student workspace"}
}
google.onclick=async()=>{if(!client)return say("Supabase is not configured.");const {error}=await client.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin+window.location.pathname}});if(error)say(error.message)};
signin.onclick=async()=>{
  if(!client)return say("Supabase is not configured. Check supabase-config.js.");
  const email=$("auth-email").value.trim(),password=$("auth-password").value;
  if(!email||!password)return say("Enter your email and password.");
  signin.disabled=true;const {error}=await client.auth.signInWithPassword({email,password});signin.disabled=false;
  if(error)say(error.message);
};
signup.onclick=async()=>{
  if(!client)return say("Supabase is not configured. Check supabase-config.js.");
  const name=$("auth-name").value.trim(),email=$("auth-email").value.trim(),password=$("auth-password").value,level=$("auth-level").value;
  if(!name||!email||password.length<8||!level)return say("Enter your name, email, password (at least 8 characters) and level.");
  signup.disabled=true;
  const {data,error}=await client.auth.signUp({email,password,options:{data:{full_name:name,level}}});
  signup.disabled=false;
  if(error)say(error.message);
  else if(data.session)say("Account created and signed in. Your student profile is connected.");
  else say("Account created. Check your email to confirm, then sign in.");
};
signout.onclick=async()=>{if(client){const {error}=await client.auth.signOut();say(error?error.message:"You have signed out.")}};
$("save-profile").addEventListener("click",async()=>{
  if(!client||!session)return;
  const full_name=$("student-name").value.trim(),level=$("level").value;
  if(!full_name||!level)return;
  const {error}=await client.from("profiles").update({full_name,level,updated_at:new Date().toISOString()}).eq("id",session.user.id);
  if(error)say("Profile saved on this device, but database update failed: "+error.message);
  else say("Student profile saved securely to Majesty Academy.");
});
$("ask-assistant").addEventListener("click",async()=>{
  if(!client||!session)return say("Sign in to use the live AI tutor.");
  const question=$("assistant-question").value.trim();if(!question){$("assistant-answer").textContent="Type a question first.";return}
  const button=$("ask-assistant");button.disabled=true;$("assistant-answer").textContent="Your AI teacher is preparing an explanation…";
  try{const {data,error}=await client.functions.invoke("ai-tutor",{body:{question,subject:$("assistant-subject").value,level:$("level").value||"student"}});
    if(error)throw error;if(data?.error)throw new Error(data.error);$("assistant-answer").textContent=data.answer||"No answer was returned.";if(window.MAJESTY_CLASS_AUTOSPEAK&&data.answer&&"speechSynthesis" in window){window.MAJESTY_CLASS_AUTOSPEAK=false;window.speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(data.answer);voice.rate=.94;voice.onstart=()=>$("speech-status").textContent="Majesty AI teacher is speaking…";voice.onend=()=>$("speech-status").textContent="Lesson finished. Ask your teacher a question.";window.speechSynthesis.speak(voice);}if($("class-lesson"))$("class-lesson").textContent=data.answer||"";if($("teacher-status"))$("teacher-status").textContent="Teaching session ready";if("speechSynthesis" in window){window.speechSynthesis.cancel();const speech=new SpeechSynthesisUtterance(data.answer||"");speech.rate=.94;speech.onstart=()=>{if($("speech-status"))$("speech-status").textContent="AI teacher is speaking…";if($("teacher-status"))$("teacher-status").textContent="Speaking to the class"};speech.onend=()=>{if($("speech-status"))$("speech-status").textContent="Lesson explanation finished";if($("teacher-status"))$("teacher-status").textContent="Ready for student questions"};window.speechSynthesis.speak(speech)}
  }catch(e){$("assistant-answer").textContent="The live tutor could not respond: "+(e.message||"Please try again.")}finally{button.disabled=false}
});

$("generate-assignment").onclick=async()=>{
 if(!client||!session){say("Sign in to generate an AI assignment.");return}
 const subject=$("assignment-subject").value,topic=$("assignment-topic").selectedOptions[0]?.textContent||"Revision";
 const button=$("generate-assignment");button.disabled=true;button.textContent="Preparing assignment…";
 try{
  const {data,error}=await client.functions.invoke("ai-tutor",{body:{subject,level:$("level").value||"student",question:"Create a fair, level-appropriate homework assignment on "+topic+" for "+subject+". Include a clear title, short instructions, 5 objective questions with four options each, 3 theory questions, and a marking guide at the end. Separate the student questions from the marking guide. Do not invent official exam questions."}});
  if(error)throw error;if(data?.error)throw new Error(data.error);
  window.MAJESTY_CURRENT_ASSIGNMENT={subject,topic,content:data.answer,created_at:new Date().toISOString()};
  $("assignment-list").innerHTML='<div class="record"><b>AI assignment: '+subject+' — '+topic+'</b><pre class="answerbox">'+data.answer.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))+'</pre><small>Generated for practice. The marking guide is included for review after attempting the work.</small></div>';
  $("assignment-feedback").textContent="Your AI assignment is ready. Complete your answers below.";
 }catch(e){$("assignment-feedback").textContent="Could not generate assignment: "+(e.message||"Please try again.")}
 finally{button.disabled=false;button.textContent="Set an AI assignment"}
};
\n
$("generate-exam-practice").onclick=async()=>{
 if(!client||!session){say("Sign in to generate examination practice.");return}
 const subject=$("quiz-subject").value,exam=$("exam-type").value,level=$("level").value||"student";
 const button=$("generate-exam-practice");button.disabled=true;button.textContent="Generating practice paper…";
 try{
  const {data,error}=await client.functions.invoke("ai-tutor",{body:{subject,level,question:"Create an original "+exam+"-style practice paper for "+subject+" at "+level+" level. Include 15 multiple-choice questions with A-D options and 5 theory/short-answer questions. Vary difficulty, cover different syllabus topics, and include a separate answer key with brief explanations at the end. These must be original practice questions, not claimed to be official past questions."}});
  if(error)throw error;if(data?.error)throw new Error(data.error);
  const examCode={"WAEC revision":"WAEC","NECO revision":"NECO","JAMB practice":"JAMB","Common Entrance":"COMMON_ENTRANCE","School practice":"UNIVERSITY"}[exam]||"UNIVERSITY";const {error:saveError}=await client.from("exam_practice_attempts").insert({student_id:session.user.id,exam_type:examCode,subject,level,paper:data.answer});if(saveError)throw saveError;\n  window.MAJESTY_CURRENT_EXAM={subject,exam,level,paper:data.answer,created_at:new Date().toISOString()};
  $("ai-exam-paper").textContent=data.answer;
  $("exam-ai-feedback").textContent="Practice paper generated. Attempt the questions before requesting feedback.";
 }catch(e){$("exam-ai-feedback").textContent="Could not generate practice paper: "+(e.message||"Please try again.")}
 finally{button.disabled=false;button.textContent="Generate WAEC / NECO / JAMB practice"}
};
$("review-exam-answer").onclick=async()=>{
 if(!client||!session){say("Sign in to get AI marking feedback.");return}
 const paper=window.MAJESTY_CURRENT_EXAM?.paper,answer=$("ai-exam-answer").value.trim();
 if(!paper||!answer){$("exam-ai-feedback").textContent="Generate a practice paper and write your answers first.";return}
 const button=$("review-exam-answer");button.disabled=true;$("exam-ai-feedback").textContent="Your answers are being reviewed…";
 try{
  const {data,error}=await client.functions.invoke("ai-tutor",{body:{subject:$("quiz-subject").value,level:$("level").value||"student",question:"Mark this student's answers against the practice paper. Explain each correction, identify strengths and gaps, and give a provisional score out of 100. Do not claim this is an official examination grade. Practice paper: "+paper+"\n\nStudent answers: "+answer}});
  if(error)throw error;if(data?.error)throw new Error(data.error);
  $("exam-ai-feedback").textContent=data.answer||"No feedback returned.";
  const history=JSON.parse(localStorage.getItem("majestyExamPracticeHistory")||"[]");history.push({subject:$("quiz-subject").value,exam:$("exam-type").value,answer,feedback:data.answer,date:new Date().toISOString()});localStorage.setItem("majestyExamPracticeHistory",JSON.stringify(history));
 }catch(e){$("exam-ai-feedback").textContent="Could not review answers: "+(e.message||"Please try again.")}
 finally{button.disabled=false}
};
\nwindow.MAJESTY_AUTH={get client(){return client},get session(){return session}};
})();