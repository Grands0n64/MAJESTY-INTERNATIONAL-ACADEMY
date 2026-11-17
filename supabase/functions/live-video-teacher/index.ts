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
  if (req.method !== "POST") return reply(405, { error: "Method not allowed." });

  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return reply(401, { error: "Sign in is required." });
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publishableKeys = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");
  let anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (publishableKeys) {
    try { anonKey = JSON.parse(publishableKeys).default || anonKey; } catch { /* use anon key fallback */ }
  }
  if (!supabaseUrl || !anonKey) return reply(503, { error: "Supabase authentication is not configured." });
  const supabase = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return reply(401, { error: "Your session is invalid. Sign in again." });

  const apiKey = Deno.env.get("TAVUS_API_KEY");
  const palId = Deno.env.get("TAVUS_PAL_ID");
  const faceId = Deno.env.get("TAVUS_FACE_ID");
  if (!apiKey || !palId) {
    return reply(503, { error: "Live video is not configured yet. Add TAVUS_API_KEY and TAVUS_PAL_ID to Supabase Edge Function secrets. Your Gemini key alone cannot create a real-time video avatar." });
  }
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return reply(400, { error: "Invalid request body." }); }

  if (body.action === "end") {
    const conversationId = typeof body.conversation_id === "string" ? body.conversation_id : "";
    if (!conversationId || !/^[a-zA-Z0-9_-]{3,100}$/.test(conversationId)) return reply(400, { error: "A valid live conversation ID is required." });
    const ended = await fetch(`https://tavusapi.com/v2/conversations/${encodeURIComponent(conversationId)}/end`, {
      method: "POST", headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    });
    if (!ended.ok) {
      const detail = await ended.text();
      console.error("Tavus end conversation failed", ended.status, detail.slice(0, 500));
      return reply(502, { error: "The video provider could not end the session. You can close the video window." });
    }
    return reply(200, { ended: true });
  }

  if (body.action !== "start") return reply(400, { error: "Choose start or end." });
  const level = typeof body.level === "string" ? body.level.slice(0, 40) : "Student";
  const subject = typeof body.subject === "string" ? body.subject.slice(0, 120) : "General studies";
  const topic = typeof body.topic === "string" ? body.topic.slice(0, 180) : "Today's lesson";
  const context = [
    "You are the live video teacher for Majesty International Academy.",
    "Teach like a patient, highly skilled classroom teacher. Speak directly to the student, explain one concept at a time, define key terms, give practical examples, ask short comprehension questions, wait for answers, correct misunderstandings kindly, and recap the lesson.",
    "Keep the conversation educational and age appropriate. Do not claim to be a human teacher. Never provide an official grade or claim to monitor cheating.",
    `Student level: ${level}`,
    `Subject/course: ${subject}`,
    `Today's topic: ${topic}`,
    "Begin by greeting the student and starting the lesson on the selected topic.",
  ].join("\n");
  const payload: Record<string, unknown> = {
    pal_id: palId,
    conversation_name: `Majesty lesson: ${subject} — ${topic}`.slice(0, 180),
    conversational_context: context,
    custom_greeting: `Hello! Welcome to Majesty International Academy. Today we are learning ${topic} in ${subject}. Are you ready to begin?`,
    audio_only: false,
    properties: { max_call_duration: 1800, participant_left_timeout: 60, enable_closed_captions: true },
  };
  if (faceId) payload.face_id = faceId;
  const response = await fetch("https://tavusapi.com/v2/conversations", {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("Tavus create conversation failed", response.status, JSON.stringify(result).slice(0, 700));
    const detail = typeof result.message === "string" ? result.message : typeof result.error === "string" ? result.error : "";
    return reply(502, { error: detail ? `Live video provider: ${detail}` : "The live video provider could not start a session. Check your Tavus API key and persona ID." });
  }
  if (typeof result.conversation_url !== "string" || !result.conversation_url.startsWith("https://")) {
    return reply(502, { error: "The live video provider returned an invalid room URL." });
  }
  return reply(200, { conversation_id: result.conversation_id, conversation_url: result.conversation_url });
});
