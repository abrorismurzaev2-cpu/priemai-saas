import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Clock, CalendarCheck, TrendingUp } from "lucide-react";
import { formatDuration, formatRub } from "@/lib/utils";

interface StatsCardsProps {
  totalCalls: number;
  totalMinutes: number;
  appointments: number;
  conversionRate: number;
}

export function StatsCards({
  totalCalls,
  totalMinutes,
  appointments,
  conversionRate,
}: StatsCardsProps) {
  const items = [
    {
      title: "Звонков за месяц",
      value: totalCalls.toString(),
      icon: Phone,
      description: "входящих + исходящих",
    },
    {
      title: "Минут разговора",
      value: formatDuration(totalMinutes * 60),
      icon: Clock,
      description: "использовано",
    },
    {
      title: "Записей",
      value: appointments.toString(),
      icon: CalendarCheck,
      description: "создано AI",
    },
    {
      title: "Конверсия",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      description: "звонок → запись",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
