import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Vapi.ai webhook handler
 * Docs: https://docs.vapi.ai/server-url
 *
 * Events: call-start, speech-update, transcript, function-call, hang, end-of-call-report
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || !message.type) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const type = message.type as string;

    // Optional: verify webhook secret
    const secret = process.env.VAPI_WEBHOOK_SECRET;
    if (secret) {
      const headerSecret = req.headers.get("x-vapi-secret");
      if (headerSecret !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    switch (type) {
      case "call-start": {
        const call = message.call;
        if (!call?.id) break;

        // Find business by assistant id
        const assistantId = call.assistantId || call.assistant?.id;
        let businessId: string | null = null;

        if (assistantId) {
          const { data } = await supabase
            .from("businesses")
            .select("id")
            .eq("vapi_assistant_id", assistantId)
            .limit(1)
            .single();
          businessId = data?.id ?? null;
        }

        if (businessId) {
          await supabase.from("calls").insert({
            business_id: businessId,
            vapi_call_id: call.id,
            caller_phone: call.customer?.number || null,
            direction: call.type === "outboundPhoneCall" ? "outbound" : "inbound",
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

        const duration = Math.round((call.endedAt && call.startedAt
          ? (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000
          : call.duration || 0));

        const transcript =
          artifact?.transcript ||
          (Array.isArray(artifact?.messages)
            ? artifact.messages
                .filter((m: { role: string }) => m.role === "user" || m.role === "bot")
                .map((m: { role: string; message?: string }) =>
                  `${m.role === "user" ? "Клиент" : "AI"}: ${m.message || ""}`
                )
                .join("\n")
            : null);

        const summary = analysis?.summary || null;
        const sentiment =
          analysis?.successEvaluation === "true" || analysis?.successEvaluation === true
            ? "positive"
            : analysis?.successEvaluation === "false" || analysis?.successEvaluation === false
              ? "negative"
              : "neutral";

        await supabase
          .from("calls")
          .update({
            status: "ended",
            duration_seconds: duration,
            transcript,
            summary,
            sentiment,
            recording_url: artifact?.recordingUrl || null,
            cost: call.cost || 0,
            ended_at: call.endedAt || new Date().toISOString(),
            metadata: {
              analysis,
              endedReason: call.endedReason,
            },
          })
          .eq("vapi_call_id", call.id);

        // Increment minutes used for the owner
        const { data: callRow } = await supabase
          .from("calls")
          .select("business_id")
          .eq("vapi_call_id", call.id)
          .single();

        if (callRow) {
          const { data: business } = await supabase
            .from("businesses")
            .select("owner_id")
            .eq("id", callRow.business_id)
            .single();

          if (business) {
            const minutes = Math.ceil(duration / 60);
            const { data: profile } = await supabase
              .from("profiles")
              .select("minutes_used")
              .eq("id", business.owner_id)
              .single();

            if (profile) {
              await supabase
                .from("profiles")
                .update({ minutes_used: (profile.minutes_used || 0) + minutes })
                .eq("id", business.owner_id);
            }
          }
        }
        break;
      }

      case "function-call": {
        // Handle tool calls: book_appointment, transfer_call, etc.
        const functionCall = message.functionCall;
        if (!functionCall) break;

        const { name, parameters } = functionCall;

        if (name === "book_appointment") {
          const call = message.call;
          const { data: callRow } = await supabase
            .from("calls")
            .select("business_id, id")
            .eq("vapi_call_id", call?.id)
            .single();

          if (callRow && parameters) {
            await supabase.from("appointments").insert({
              business_id: callRow.business_id,
              call_id: callRow.id,
              client_name: parameters.client_name || parameters.name || null,
              client_phone: parameters.client_phone || call?.customer?.number || null,
              starts_at: parameters.starts_at || parameters.datetime,
              notes: parameters.notes || parameters.service || null,
              status: "pending",
            });

            return NextResponse.json({
              result: "Запись успешно создана. Клиент будет ждать подтверждения.",
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
        // speech-update, transcript, hang — ignore or log
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[vapi webhook]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
