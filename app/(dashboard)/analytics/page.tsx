import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoAnalytics } from "@/lib/demo-data";
import { formatRub } from "@/lib/utils";
import {
  Phone,
  PhoneMissed,
  CalendarCheck,
  Clock,
  TrendingUp,
  Wallet,
} from "lucide-react";

export default function AnalyticsPage() {
  const a = demoAnalytics;
  const maxDayCalls = Math.max(...a.callsByDay.map((d) => d.calls), 1);
  const maxHourCalls = Math.max(...a.peakHours.map((h) => h.calls), 1);
  const maxService = Math.max(...a.topServices.map((s) => s.count), 1);

  const kpis = [
    {
      title: "Всего звонков",
      value: a.totalCalls,
      sub: `${a.answeredCalls} отвечено · ${a.missedCalls} пропущено`,
      icon: Phone,
    },
    {
      title: "Записей создано",
      value: a.appointmentsCreated,
      sub: `конверсия ${a.conversionRate}%`,
      icon: CalendarCheck,
    },
    {
      title: "Минут разговора",
      value: a.totalMinutes,
      sub: `среднее ${a.avgCallDuration} мин/звонок`,
      icon: Clock,
    },
    {
      title: "Оценка выручки",
      value: formatRub(a.revenueEstimate),
      sub: "по созданным записям",
      icon: Wallet,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Аналитика</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Статистика AI-ресепшниста за {a.period}
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          Демо-данные · {a.period}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {k.title}
              </CardTitle>
              <k.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{k.value}</div>
              <p className="text-xs text-muted-foreground">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Звонки по дням недели</CardTitle>
            <CardDescription>Количество звонков и записей</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {a.callsByDay.map((d) => (
              <div key={d.day} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="w-8 font-medium">{d.day}</span>
                  <span className="text-muted-foreground">
                    {d.calls} зв. · {d.appointments} зап.
                  </span>
                </div>
                <div className="flex h-2 gap-0.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="rounded-full bg-primary transition-all"
                    style={{ width: `${(d.calls / maxDayCalls) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Пиковые часы</CardTitle>
            <CardDescription>Когда клиенты звонят чаще всего</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {a.peakHours.map((h) => (
              <div key={h.hour} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="w-12 font-medium">{h.hour}</span>
                  <span className="text-muted-foreground">{h.calls} звонков</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/80 transition-all"
                    style={{ width: `${(h.calls / maxHourCalls) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Популярные услуги</CardTitle>
          <CardDescription>По количеству записей через AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {a.topServices.map((s, i) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate font-medium">{s.name}</span>
                  <span className="ml-2 shrink-0 text-muted-foreground">{s.count}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(s.count / maxService) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-start gap-3 space-y-0">
          <TrendingUp className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-base">Выводы</CardTitle>
            <CardDescription className="mt-1 space-y-1">
              <span className="block">
                • Пик звонков — пятница и 15:00–16:00. Имеет смысл держать больше слотов.
              </span>
              <span className="block">
                • Конверсия {a.conversionRate}% — выше среднего по салонам красоты (~35%).
              </span>
              <span className="block">
                • {a.missedCalls} пропущенных — AI ответил на {Math.round((a.answeredCalls / a.totalCalls) * 100)}% звонков.
              </span>
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
