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

  let body: { question?: unknown; subject?: unknown; level?: unknown; image_base64?: unknown; image_mime_type?: unknown };
  try { body = await req.json(); } catch { return reply(400, { error: "Invalid JSON body." }); }
  const question = typeof body.question === "string" ? body.question.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim().slice(0, 120) : "General studies";
  const level = typeof body.level === "string" ? body.level.trim().slice(0, 40) : "student";
  const imageBase64 = typeof body.image_base64 === "string" ? body.image_base64 : "";
  const imageMime = typeof body.image_mime_type === "string" ? body.image_mime_type : "";
  if ((!question && !imageBase64) || question.length > 4000) return reply(400, { error: "Enter a question or attach an image." });
  if (imageBase64 && (!["image/jpeg","image/png","image/webp"].includes(imageMime) || imageBase64.length > 7_000_000)) return reply(400, { error: "Use a JPEG, PNG or WebP image smaller than 5 MB." });

  const preferredModel = Deno.env.get("GEMINI_MODEL")?.trim() || "gemini-3.8-flash";
  const models = [...new Set([preferredModel, "gemini-3.8-flash", "gemini-3.5-flash-lite", "gemini-2.5-flash"])];
  const prompt = [
    "You are a patient, encouraging teacher at Majesty International Academy.",
    "Teach the learner; do not merely give answers. Explain step by step, define important terms, include a relevant example, then finish with one short check-for-understanding question.",
    "Use age-appropriate language. Never request personal contact details. If a request is unsafe or unrelated to learning, redirect politely.",
    "Do not claim to know the learner's official curriculum or grades unless supplied.",
    `Learner level: ${level}`,
    `Subject: ${subject}`,
    `Learner question: ${question || "Please read and explain the attached question image."}`,
  ].join("\n\n");

  let ai: Response | null = null;
  let model = preferredModel;
  let lastDetail = "";
  for (const candidate of models) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent`, {
        method: "POST",
        headers: { "x-goog-api-key": geminiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }, ...(imageBase64 ? [{ inline_data: { mime_type: imageMime, data: imageBase64 } }] : [])] }],
          generationConfig: { maxOutputTokens: 2400 },
        }),
      });
      if (response.ok) { ai = response; model = candidate; break; }
      lastDetail = await response.text();
      console.error("Gemini request failed", candidate, response.status, lastDetail.slice(0, 700));
      if (![400, 404, 429, 500, 502, 503].includes(response.status)) break;
    } catch (error) {
      lastDetail = String(error);
      console.error("Gemini network request failed", candidate, lastDetail.slice(0, 500));
    }
  }
  if (!ai) {
    const lower = lastDetail.toLowerCase();
    const message = lower.includes("api_key_invalid") || lower.includes("api key not valid") || lower.includes("invalid api key")
      ? "Your Gemini API key is invalid. Update GEMINI_API_KEY in Supabase Edge Function secrets."
      : lower.includes("quota") || lower.includes("resource_exhausted") || lower.includes("429")
      ? "Your Gemini API quota has been reached. Check Google AI Studio usage and try again later."
      : "The AI provider rejected the lesson request. Check the Gemini API key, model access and quota in Supabase secrets.";
    return reply(502, { error: message });
  }
  const result = await ai.json();
  const answer = (result.candidates?.[0]?.content?.parts ?? [])
    .map((part: any) => typeof part.text === "string" ? part.text : "")
    .join("\n").trim();
  if (!answer) return reply(502, { error: "The tutor could not prepare an answer. Please try again." });

  return reply(200, { answer, model, subject, level });
});
