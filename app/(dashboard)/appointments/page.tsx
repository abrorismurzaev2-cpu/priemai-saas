import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { formatPhone } from "@/lib/utils";
import { DEMO_MODE, demoAppointments } from "@/lib/demo-data";

export default async function AppointmentsPage() {
  const appointments = demoAppointments;
  return (
    <div className="space-y-6">
      {DEMO_MODE && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Демо-записи. Реальные появятся после звонков через Vapi.
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Записи</h1>
        <p className="text-muted-foreground">Клиенты, которых AI записал на услуги</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Предстоящие записи</CardTitle>
          <CardDescription>{appointments.length} записей</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {appointments.map((a) => (
              <div key={a.id} className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{a.client_name || "Без имени"}</p>
                    {a.client_phone && <p className="text-sm text-muted-foreground">{formatPhone(a.client_phone)}</p>}
                    {a.notes && <p className="mt-1 text-sm text-muted-foreground">{a.notes}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {new Date(a.starts_at).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <Badge variant={a.status === "confirmed" ? "success" : a.status === "cancelled" ? "destructive" : "secondary"}>
                    {a.status === "confirmed" ? "Подтверждена" : a.status === "cancelled" ? "Отменена" : a.status === "completed" ? "Завершена" : "Ожидает"}
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
