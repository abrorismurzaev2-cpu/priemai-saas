import { StatsCards } from "@/components/dashboard/stats-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPhone, formatDuration } from "@/lib/utils";
import { Phone, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DEMO_MODE, demoProfile, demoBusiness, demoCalls } from "@/lib/demo-data";

export default async function DashboardPage() {
  const profile = demoProfile;
  const recentCalls = demoCalls.slice(0, 8);
  const minutesUsed = profile.minutes_used;
  const minutesLimit = profile.minutes_limit;

  return (
    <div className="space-y-8">
      {DEMO_MODE && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <strong>Демо-режим.</strong> Данные тестовые. Подключите Supabase в <code className="rounded bg-black/30 px-1">.env.local</code> для реального аккаунта.
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Привет, {profile.full_name.split(" ")[0]}!</h1>
        <p className="text-muted-foreground">Обзор активности AI-ресепшниста · {demoBusiness.name}</p>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Использование минут</CardTitle>
            <Badge variant="secondary">Пробный</Badge>
          </div>
          <CardDescription>{minutesUsed} из {minutesLimit} минут использовано</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(minutesUsed / minutesLimit) * 100}%` }} />
          </div>
        </CardContent>
      </Card>
      <StatsCards totalCalls={12} totalMinutes={47} appointments={3} conversionRate={50} />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Последние звонки</CardTitle>
            <CardDescription>Недавняя активность AI</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild><Link href="/calls">Все звонки</Link></Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCalls.map((call) => (
              <div key={call.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{call.caller_phone ? formatPhone(call.caller_phone) : "Неизвестный"}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{call.summary || "Без саммари"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDuration(call.duration_seconds)}</span>
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
