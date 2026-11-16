import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};
const reply = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: cors });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply(405, { error: "Method not allowed" });

  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return reply(401, { error: "Sign in is required." });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publishableKeys = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");
  const anonKey = publishableKeys ? JSON.parse(publishableKeys).default : Deno.env.get("SUPABASE_ANON_KEY");
  const geminiKey = Deno.env.get("GEMINI_API_KEY");
  if (!supabaseUrl || !anonKey || !geminiKey) return reply(503, { error: "Backend secrets are not configured." });

  const supabase = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return reply(401, { error: "Your session is invalid. Sign in again." });

  let body: { question?: unknown; subject?: unknown; level?: unknown };
  try { body = await req.json(); } catch { return reply(400, { error: "Invalid JSON body." }); }
  const question = typeof body.question === "string" ? body.question.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim().slice(0, 120) : "General studies";
  const level = typeof body.level === "string" ? body.level.trim().slice(0, 40) : "student";
  if (!question || question.length > 4000) return reply(400, { error: "Enter a question of up to 4,000 characters." });

  const model = Deno.env.get("GEMINI_MODEL") ?? "gemini-3.8-flash";
  const prompt = [
    "You are a patient, encouraging teacher at Majesty International Academy.",
    "Teach the learner; do not merely give answers. Explain step by step, define important terms, include a relevant example, then finish with one short check-for-understanding question.",
    "Use age-appropriate language. Never request personal contact details. If a request is unsafe or unrelated to learning, redirect politely.",
    "Do not claim to know the learner's official curriculum or grades unless supplied.",
    `Learner level: ${level}`,
    `Subject: ${subject}`,
    `Learner question: ${question}`,
  ].join("\n\n");

  const ai = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "x-goog-api-key": geminiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 900 } }),
  });
  if (!ai.ok) {
    const detail = await ai.text();
    console.error("Gemini request failed", ai.status, detail.slice(0, 500));
    return reply(502, { error: "The tutor service is temporarily unavailable. Check the Gemini model and API quota." });
  }
  const result = await ai.json();
  const answer = (result.candidates?.[0]?.content?.parts ?? [])
    .map((part: any) => typeof part.text === "string" ? part.text : "")
    .join("\n").trim();
  if (!answer) return reply(502, { error: "The tutor could not prepare an answer. Please try again." });

  return reply(200, { answer, model, subject, level });
});
