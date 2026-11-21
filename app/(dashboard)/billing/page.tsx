import { PLAN_LIMITS, formatRub } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const planDetails = [
  {
    key: "start" as const,
    features: ["1 телефонный номер", "300 минут/мес", "Базовые сценарии", "Email-поддержка"],
  },
  {
    key: "business" as const,
    features: [
      "2 номера",
      "800 минут/мес",
      "Все сценарии",
      "CRM-интеграции (amoCRM, Bitrix24)",
      "Приоритетная поддержка",
    ],
    popular: true,
  },
  {
    key: "pro" as const,
    features: [
      "5 номеров",
      "2000 минут/мес",
      "Кастомные сценарии",
      "API-доступ",
      "Персональный менеджер",
    ],
  },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Тарифы и оплата</h1>
        <p className="text-muted-foreground">
          Выберите подходящий план. Оплата через ЮKassa.
        </p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Текущий план</CardTitle>
            <Badge>Пробный</Badge>
          </div>
          <CardDescription>
            100 минут бесплатно. После окончания — выберите тариф.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {planDetails.map((plan) => {
          const info = PLAN_LIMITS[plan.key];
          return (
            <Card
              key={plan.key}
              className={plan.popular ? "border-primary shadow-lg shadow-primary/10" : ""}
            >
              <CardHeader>
                {plan.popular && (
                  <span className="mb-2 w-fit rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                    Популярный
                  </span>
                )}
                <CardTitle>{info.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{formatRub(info.price)}</span>
                  <span className="text-muted-foreground">/мес</span>
                </div>
                <CardDescription>{info.minutes} минут разговора</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  Подключить
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Интеграция с ЮKassa будет доступна после подключения ключей в .env
      </p>
    </div>
  );
}
