import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import Link from "next/link";

export default async function ScenariosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let scenarios: {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    first_message: string | null;
  }[] = [];

  if (user) {
    const { data: businesses } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_id", user.id);

    if (businesses && businesses.length > 0) {
      const { data } = await supabase
        .from("scenarios")
        .select("id, name, description, is_active, first_message")
        .in(
          "business_id",
          businesses.map((b) => b.id)
        )
        .order("created_at", { ascending: false });
      scenarios = data || [];
    }
  }

  // Demo scenarios if empty
  const demoScenarios = [
    {
      id: "demo-1",
      name: "Запись на услугу",
      description: "Клиент хочет записаться. AI уточняет услугу, дату и время.",
      is_active: true,
      first_message: "Здравствуйте! Чем могу помочь? Хотите записаться?",
    },
    {
      id: "demo-2",
      name: "Часы работы и адрес",
      description: "Ответы на типовые вопросы о режиме и локации.",
      is_active: true,
      first_message: "Здравствуйте! Я виртуальный администратор. Чем помочь?",
    },
    {
      id: "demo-3",
      name: "Перевод на менеджера",
      description: "Сложные вопросы — перевод на живого сотрудника.",
      is_active: false,
      first_message: null,
    },
  ];

  const list = scenarios.length > 0 ? scenarios : demoScenarios;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Сценарии</h1>
          <p className="text-muted-foreground">
            Настройте, как AI общается с клиентами
          </p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Новый сценарий
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {list.map((s) => (
          <Card key={s.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{s.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {s.description || "Без описания"}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={s.is_active ? "success" : "secondary"}>
                {s.is_active ? "Активен" : "Выкл"}
              </Badge>
            </CardHeader>
            {s.first_message && (
              <CardContent>
                <p className="rounded-md bg-muted/50 p-3 text-sm italic text-muted-foreground">
                  «{s.first_message}»
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {scenarios.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Показаны демо-сценарии. Создайте бизнес и добавьте свои в настройках.
        </p>
      )}
    </div>
  );
}
