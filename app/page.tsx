import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bot,
  Phone,
  Calendar,
  MessageSquare,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Phone,
    title: "24/7 приём звонков",
    description: "AI-ресепшнист отвечает на русском языке круглосуточно, не пропускает ни одного звонка.",
  },
  {
    icon: Calendar,
    title: "Запись в календарь",
    description: "Автоматически записывает клиентов в Google Calendar или вашу CRM.",
  },
  {
    icon: MessageSquare,
    title: "Умные сценарии",
    description: "Настройте диалоги под ваш бизнес: салон, клиника, сервис, ресторан.",
  },
  {
    icon: Shield,
    title: "Перевод на живого",
    description: "Сложные вопросы — мгновенный перевод на сотрудника с полным контекстом.",
  },
  {
    icon: Zap,
    title: "Интеграции",
    description: "amoCRM, Bitrix24, ЮKassa, Zadarma, Twilio — всё из коробки.",
  },
  {
    icon: Bot,
    title: "Естественный голос",
    description: "Голосовой AI на базе Vapi — клиенты не замечают, что говорят с ботом.",
  },
];

const plans = [
  {
    name: "Старт",
    price: "4 900",
    minutes: 300,
    features: ["1 номер", "300 минут/мес", "Базовые сценарии", "Email-поддержка"],
  },
  {
    name: "Бизнес",
    price: "9 900",
    minutes: 800,
    popular: true,
    features: ["2 номера", "800 минут/мес", "Все сценарии", "CRM-интеграции", "Приоритетная поддержка"],
  },
  {
    name: "Про",
    price: "19 900",
    minutes: 2000,
    features: ["5 номеров", "2000 минут/мес", "Кастомные сценарии", "API-доступ", "Персональный менеджер"],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <BrandLogo size="lg" />
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Возможности
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Тарифы
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
              <Link href="/login">Войти</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Начать</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-12 text-center sm:py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            100 минут бесплатно при регистрации
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
            Умный голосовой{" "}
            <span className="text-primary">AI-ресепшнист</span>
            <br />
            для вашего бизнеса
          </h1>
          <p className="mb-6 text-base text-muted-foreground sm:mb-8 sm:text-lg md:text-xl">
            Принимает звонки 24/7, записывает клиентов в календарь, отвечает на вопросы
            и переводит сложные разговоры живому сотруднику. На русском языке.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register">
                Попробовать бесплатно
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Как это работает</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">Всё, что нужно малому бизнесу</h2>
            <p className="text-muted-foreground">
              Один AI-сотрудник вместо целого call-центра
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                  <CardDescription>{f.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">Прозрачные тарифы</h2>
            <p className="text-muted-foreground">Без скрытых платежей. Отмена в любой момент.</p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={plan.popular ? "border-primary shadow-lg shadow-primary/10" : ""}
              >
                <CardHeader>
                  {plan.popular && (
                    <span className="mb-2 w-fit rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                      Популярный
                    </span>
                  )}
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">₽/мес</span>
                  </div>
                  <CardDescription>{plan.minutes} минут разговора</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="mb-6 space-y-2">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                    <Link href="/register">Выбрать</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Готовы не терять клиентов?</h2>
          <p className="mb-8 text-muted-foreground">
            Подключите AI-ресепшниста за 5 минут. 100 минут бесплатно.
          </p>
          <Button size="lg" asChild>
            <Link href="/register">
              Начать бесплатно
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <BrandLogo size="sm" />
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Конфиденциальность</Link>
            <Link href="/terms" className="hover:text-foreground">Соглашение</Link>
            <Link href="/offer" className="hover:text-foreground">Оферта</Link>
          </nav>
          <p className="text-sm text-muted-foreground">© 2026 Приём<span className="text-red-500">AI</span></p>
        </div>
      </footer>
    </div>
  );
}
