import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** Simple in-memory rate limit (per isolate) */
const hits = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 60; // per minute per IP
const WINDOW_MS = 60_000;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= RATE_LIMIT;
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Vapi.ai webhook
 * Requires VAPI_WEBHOOK_SECRET in production (header x-vapi-secret).
 */
export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Body size guard
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > 1_000_000) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  try {
    const secret = process.env.VAPI_WEBHOOK_SECRET;
    const isProd = process.env.NODE_ENV === "production";
    const demo =
      process.env.DEMO_MODE === "true" ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("YOUR_PROJECT");

    if (secret) {
      const headerSecret = req.headers.get("x-vapi-secret");
      if (headerSecret !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } else if (isProd && !demo) {
      // In real production without demo — require secret
      console.warn("[vapi] VAPI_WEBHOOK_SECRET is not set");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "object" || !message.type) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Demo / no DB — acknowledge only
    if (demo) {
      return NextResponse.json({ ok: true, demo: true });
    }

    const supabase = createServiceClient();
    const type = String(message.type);

    switch (type) {
      case "call-start": {
        const call = message.call;
        if (!call?.id) break;

        const assistantId = call.assistantId || call.assistant?.id;
        let businessId: string | null = null;

        if (assistantId) {
          const { data } = await supabase
            .from("businesses")
            .select("id")
            .eq("vapi_assistant_id", assistantId)
            .limit(1)
            .maybeSingle();
          businessId = data?.id ?? null;
        }

        if (businessId) {
          await supabase.from("calls").insert({
            business_id: businessId,
            vapi_call_id: String(call.id).slice(0, 128),
            caller_phone: call.customer?.number
              ? String(call.customer.number).slice(0, 32)
              : null,
            direction:
              call.type === "outboundPhoneCall" ? "outbound" : "inbound",
            status: "in-progress",
            started_at: new Date().toISOString(),
          });
        }
        break;
      }

      case "end-of-call-report": {
        const call = message.call;
        const analysis = message.analysis;
        const artifact = message.artifact;
        if (!call?.id) break;

        const duration = Math.round(
          call.endedAt && call.startedAt
            ? (new Date(call.endedAt).getTime() -
                new Date(call.startedAt).getTime()) /
                1000
            : call.duration || 0
        );

        const transcript =
          artifact?.transcript ||
          (Array.isArray(artifact?.messages)
            ? artifact.messages
                .filter(
                  (m: { role: string }) =>
                    m.role === "user" || m.role === "bot"
                )
                .map(
                  (m: { role: string; message?: string }) =>
                    `${m.role === "user" ? "Клиент" : "AI"}: ${m.message || ""}`
                )
                .join("\n")
                .slice(0, 50_000)
            : null);

        const summary = analysis?.summary
          ? String(analysis.summary).slice(0, 2000)
          : null;
        const sentiment =
          analysis?.successEvaluation === "true" ||
          analysis?.successEvaluation === true
            ? "positive"
            : analysis?.successEvaluation === "false" ||
                analysis?.successEvaluation === false
              ? "negative"
              : "neutral";

        await supabase
          .from("calls")
          .update({
            status: "ended",
            duration_seconds: Math.min(Math.max(duration, 0), 86400),
            transcript,
            summary,
            sentiment,
            recording_url: artifact?.recordingUrl
              ? String(artifact.recordingUrl).slice(0, 500)
              : null,
            cost: typeof call.cost === "number" ? call.cost : 0,
            ended_at: call.endedAt || new Date().toISOString(),
            metadata: {
              endedReason: call.endedReason
                ? String(call.endedReason).slice(0, 100)
                : null,
            },
          })
          .eq("vapi_call_id", String(call.id));

        const { data: callRow } = await supabase
          .from("calls")
          .select("business_id")
          .eq("vapi_call_id", String(call.id))
          .maybeSingle();

        if (callRow) {
          const { data: business } = await supabase
            .from("businesses")
            .select("owner_id")
            .eq("id", callRow.business_id)
            .maybeSingle();

          if (business) {
            const minutes = Math.ceil(duration / 60);
            const { data: profile } = await supabase
              .from("profiles")
              .select("minutes_used")
              .eq("id", business.owner_id)
              .maybeSingle();

            if (profile) {
              await supabase
                .from("profiles")
                .update({
                  minutes_used: (profile.minutes_used || 0) + minutes,
                })
                .eq("id", business.owner_id);
            }
          }
        }
        break;
      }

      case "function-call": {
        const functionCall = message.functionCall;
        if (!functionCall) break;

        const name = String(functionCall.name || "");
        const parameters = functionCall.parameters || {};

        if (name === "book_appointment") {
          const call = message.call;
          const { data: callRow } = await supabase
            .from("calls")
            .select("business_id, id")
            .eq("vapi_call_id", call?.id)
            .maybeSingle();

          if (callRow && parameters) {
            const startsAt =
              parameters.starts_at || parameters.datetime || null;
            if (!startsAt) {
              return NextResponse.json({
                result: "Не указана дата и время записи.",
              });
            }

            await supabase.from("appointments").insert({
              business_id: callRow.business_id,
              call_id: callRow.id,
              client_name: parameters.client_name
                ? String(parameters.client_name).slice(0, 120)
                : parameters.name
                  ? String(parameters.name).slice(0, 120)
                  : null,
              client_phone: parameters.client_phone
                ? String(parameters.client_phone).slice(0, 32)
                : call?.customer?.number
                  ? String(call.customer.number).slice(0, 32)
                  : null,
              starts_at: String(startsAt),
              notes: parameters.notes
                ? String(parameters.notes).slice(0, 500)
                : parameters.service
                  ? String(parameters.service).slice(0, 500)
                  : null,
              status: "pending",
            });

            return NextResponse.json({
              result:
                "Запись успешно создана. Клиент будет ждать подтверждения.",
            });
          }
        }

        if (name === "transfer_call") {
          return NextResponse.json({
            result: "Перевожу звонок на сотрудника...",
          });
        }

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[vapi webhook]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/** Reject other methods */
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
