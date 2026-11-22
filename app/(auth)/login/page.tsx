"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { toast } from "sonner";

const isDemo =
  typeof window !== "undefined"
    ? true
    : !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("YOUR_PROJECT") ||
      process.env.DEMO_MODE === "true";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@priemai.ru");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Demo mode: skip real auth
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR_PROJECT") ||
      process.env.DEMO_MODE === "true" ||
      email === "demo@priemai.ru"
    ) {
      toast.success("Вход в демо-кабинет");
      router.push("/dashboard");
      return;
    }

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message === "Invalid login credentials" ? "Неверный email или пароль" : error.message);
        setLoading(false);
        return;
      }
      toast.success("Вход выполнен");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.success("Вход в демо-кабинет");
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3">
            <BrandLogo size="lg" className="justify-center" />
          </div>
          <CardTitle className="text-2xl">Вход в кабинет</CardTitle>
          <CardDescription>
            Демо: demo@priemai.ru / demo123 — или любой email
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Войти в кабинет
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Нет аккаунта?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">Зарегистрироваться</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
