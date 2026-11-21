import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPhone, formatDuration } from "@/lib/utils";
import { Phone, Clock, FileText } from "lucide-react";
import { DEMO_MODE, demoCalls } from "@/lib/demo-data";

export default async function CallsPage() {
  const calls = demoCalls;
  return (
    <div className="space-y-6">
      {DEMO_MODE && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Демо-данные. Подключите Supabase для реальных звонков.
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Звонки</h1>
        <p className="text-muted-foreground">История всех разговоров AI-ресепшниста</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>История звонков</CardTitle>
          <CardDescription>Показано {calls.length} звонков</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {calls.map((call) => (
              <div key={call.id} className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{call.caller_phone ? formatPhone(call.caller_phone) : "Неизвестный номер"}</p>
                    {call.summary && (
                      <p className="mt-0.5 flex items-start gap-1 text-sm text-muted-foreground">
                        <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0" />{call.summary}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">{new Date(call.created_at).toLocaleString("ru-RU")}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />{formatDuration(call.duration_seconds)}
                  </span>
                  {call.sentiment && (
                    <Badge variant={call.sentiment === "positive" ? "success" : call.sentiment === "negative" ? "destructive" : "secondary"}>
                      {call.sentiment === "positive" ? "Позитив" : call.sentiment === "negative" ? "Негатив" : "Нейтрал"}
                    </Badge>
                  )}
                  <Badge variant={call.status === "ended" ? "success" : call.status === "failed" ? "destructive" : "secondary"}>
                    {call.status === "ended" ? "Завершён" : call.status === "failed" ? "Ошибка" : call.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
