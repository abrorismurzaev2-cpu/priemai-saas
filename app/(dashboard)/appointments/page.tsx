import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { formatPhone } from "@/lib/utils";

export default async function AppointmentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let appointments: {
    id: string;
    client_name: string | null;
    client_phone: string | null;
    starts_at: string;
    status: string;
    notes: string | null;
  }[] = [];

  if (user) {
    const { data: businesses } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_id", user.id);

    if (businesses && businesses.length > 0) {
      const { data } = await supabase
        .from("appointments")
        .select("id, client_name, client_phone, starts_at, status, notes")
        .in(
          "business_id",
          businesses.map((b) => b.id)
        )
        .order("starts_at", { ascending: true })
        .limit(50);
      appointments = data || [];
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Записи</h1>
        <p className="text-muted-foreground">
          Клиенты, которых AI записал на услуги
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Предстоящие записи</CardTitle>
          <CardDescription>
            {appointments.length > 0
              ? `${appointments.length} записей`
              : "Записей пока нет"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Calendar className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-muted-foreground">
                Здесь появятся записи, созданные AI во время звонков
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {appointments.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {a.client_name || "Без имени"}
                      </p>
                      {a.client_phone && (
                        <p className="text-sm text-muted-foreground">
                          {formatPhone(a.client_phone)}
                        </p>
                      )}
                      {a.notes && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {a.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {new Date(a.starts_at).toLocaleString("ru-RU", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <Badge
                      variant={
                        a.status === "confirmed"
                          ? "success"
                          : a.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {a.status === "confirmed"
                        ? "Подтверждена"
                        : a.status === "cancelled"
                          ? "Отменена"
                          : a.status === "completed"
                            ? "Завершена"
                            : "Ожидает"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
