/**
 * Vapi.ai client helpers
 * https://docs.vapi.ai
 */

const VAPI_BASE = "https://api.vapi.ai";

function headers() {
  return {
    Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function createAssistant(params: {
  name: string;
  systemPrompt: string;
  firstMessage?: string;
  model?: string;
}) {
  const res = await fetch(`${VAPI_BASE}/assistant`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      name: params.name,
      model: {
        provider: "openai",
        model: params.model || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: params.systemPrompt,
          },
        ],
      },
      voice: {
        provider: "11labs",
        voiceId: "rachel", // or russian-capable voice
      },
      firstMessage: params.firstMessage,
      serverUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/vapi`,
      serverUrlSecret: process.env.VAPI_WEBHOOK_SECRET,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vapi createAssistant failed: ${text}`);
  }

  return res.json();
}

export async function listPhoneNumbers() {
  const res = await fetch(`${VAPI_BASE}/phone-number`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error("Failed to list phone numbers");
  return res.json();
}

export async function getCall(callId: string) {
  const res = await fetch(`${VAPI_BASE}/call/${callId}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error("Failed to get call");
  return res.json();
}
