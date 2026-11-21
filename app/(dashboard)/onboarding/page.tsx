"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const industries = [
  "Салон красоты",
  "Медицинская клиника",
  "Автосервис",
  "Ресторан / Кафе",
  "Юридические услуги",
  "Фитнес / Спортзал",
  "Другое",
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [greeting, setGreeting] = useState("");
  const [transferPhone, setTransferPhone] = useState("");
  const router = useRouter();

  async function handleFinish() {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Необходимо войти в аккаунт");
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("businesses").insert({
      owner_id: user.id,
      name: businessName,
      industry,
      greeting:
        greeting ||
        `Здравствуйте! Вы позвонили в «${businessName}». Чем могу помочь?`,
      transfer_phone: transferPhone || null,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    await supabase
      .from("profiles")
      .update({ onboarding_completed: true, company_name: businessName })
      .eq("id", user.id);

    // Create default scenario
    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_id", user.id)
      .limit(1)
      .single();

    if (business) {
      await supabase.from("scenarios").insert({
        business_id: business.id,
        name: "Основной сценарий",
        description: "Приём звонков и запись клиентов",
        is_active: true,
        system_prompt: `Ты — вежливый AI-ресепшнист компании «${businessName}». Отвечай на русском языке коротко и по делу. Помогай клиентам записаться, отвечай на вопросы о часах работы и услугах. Если вопрос сложный — предложи перевести на живого сотрудника.`,
        first_message:
          greeting ||
          `Здравствуйте! Вы позвонили в «${businessName}». Чем могу помочь?`,
      });
    }

    toast.success("Онбординг завершён!");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Настройка ПриёмAI</CardTitle>
          <CardDescription>
            Шаг {step} из 3 — расскажите о своём бизнесе
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Название бизнеса</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Салон красоты «Элегант»"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Сфера деятельности</Label>
                <div className="flex flex-wrap gap-2">
                  {industries.map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => setIndustry(ind)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        industry === ind
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => setStep(2)}
                disabled={!businessName || !industry}
              >
                Далее
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="greeting">Приветствие AI (опционально)</Label>
                <Textarea
                  id="greeting"
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  placeholder={`Здравствуйте! Вы позвонили в «${businessName}». Чем могу помочь?`}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transferPhone">
                  Телефон для перевода сложных звонков
                </Label>
                <Input
                  id="transferPhone"
                  value={transferPhone}
                  onChange={(e) => setTransferPhone(e.target.value)}
                  placeholder="+7 999 000-00-00"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Назад
                </Button>
                <Button className="flex-1" onClick={() => setStep(3)}>
                  Далее
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                <p className="mb-2 font-medium">Проверьте данные:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Бизнес: {businessName}</li>
                  <li>Сфера: {industry}</li>
                  {transferPhone && <li>Перевод: {transferPhone}</li>}
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                После создания вы сможете подключить номер телефона и Vapi в
                настройках. Пока AI готов работать в тестовом режиме.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Назад
                </Button>
                <Button className="flex-1" onClick={handleFinish} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Завершить
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
