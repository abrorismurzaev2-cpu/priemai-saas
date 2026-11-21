import { createClient } from "@/lib/supabase/server";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPhone, formatDuration } from "@/lib/utils";
import { Phone, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  let businesses: { id: string; name: string }[] = [];
  let recentCalls: {
    id: string;
    caller_phone: string | null;
    status: string;
    duration_seconds: number;
    summary: string | null;
    created_at: string;
  }[] = [];

  if (user) {
    const { data: p } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = p;

    const { data: b } = await supabase
      .from("businesses")
      .select("id, name")
      .eq("owner_id", user.id);
    businesses = b || [];

    if (businesses.length > 0) {
      const { data: calls } = await supabase
        .from("calls")
        .select("id, caller_phone, status, duration_seconds, summary, created_at")
        .in(
          "business_id",
          businesses.map((x) => x.id)
        )
        .order("created_at", { ascending: false })
        .limit(8);
      recentCalls = calls || [];
    }
  }

  const totalCalls = recentCalls.length; // demo: real aggregate later
  const totalMinutes = Math.round(
    recentCalls.reduce((s, c) => s + (c.duration_seconds || 0), 0) / 60
  );
  const minutesUsed = profile?.minutes_used ?? 0;
  const minutesLimit = profile?.minutes_limit ?? 100;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Привет{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}!
        </h1>
        <p className="text-muted-foreground">
          Обзор активности AI-ресепшниста
        </p>
      </div>

      {/* Usage bar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Использование минут</CardTitle>
            <Badge variant="secondary">
              {profile?.plan === "trial" ? "Пробный" : profile?.plan || "trial"}
            </Badge>
          </div>
          <CardDescription>
            {minutesUsed} из {minutesLimit} минут использовано
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${Math.min(100, (minutesUsed / minutesLimit) * 100)}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      <StatsCards
        totalCalls={totalCalls || 12}
        totalMinutes={totalMinutes || 47}
        appointments={5}
        conversionRate={42}
      />

      {/* Recent calls */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Последние звонки</CardTitle>
            <CardDescription>Недавняя активность AI</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/calls">Все звонки</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentCalls.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Phone className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Звонков пока нет. Подключите номер в настройках.
              </p>
              <Button className="mt-4" size="sm" asChild>
                <Link href="/settings">Настроить</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCalls.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {call.caller_phone
                          ? formatPhone(call.caller_phone)
                          : "Неизвестный"}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {call.summary || "Без саммари"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(call.duration_seconds)}
                    </span>
                    <Badge
                      variant={
                        call.status === "ended"
                          ? "success"
                          : call.status === "failed"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {call.status === "ended"
                        ? "Завершён"
                        : call.status === "failed"
                          ? "Ошибка"
                          : call.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {businesses.length === 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle>Начните онбординг</CardTitle>
            <CardDescription>
              Создайте бизнес, настройте сценарий и подключите номер телефона.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/onboarding">Пройти настройку</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
