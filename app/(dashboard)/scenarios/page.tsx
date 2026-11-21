import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import { DEMO_MODE, demoScenarios } from "@/lib/demo-data";

export default async function ScenariosPage() {
  const scenarios = demoScenarios;
  return (
    <div className="space-y-6">
      {DEMO_MODE && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Демо-сценарии. После подключения Supabase можно создавать свои.
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Сценарии</h1>
          <p className="text-muted-foreground">Настройте, как AI общается с клиентами</p>
        </div>
        <Button disabled><Plus className="mr-2 h-4 w-4" />Новый сценарий</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {scenarios.map((s) => (
          <Card key={s.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{s.name}</CardTitle>
                  <CardDescription className="mt-1">{s.description || "Без описания"}</CardDescription>
                </div>
              </div>
              <Badge variant={s.is_active ? "success" : "secondary"}>{s.is_active ? "Активен" : "Выкл"}</Badge>
            </CardHeader>
            {s.first_message && (
              <CardContent>
                <p className="rounded-md bg-muted/50 p-3 text-sm italic text-muted-foreground">«{s.first_message}»</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
