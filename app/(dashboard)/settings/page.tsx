"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [transferPhone, setTransferPhone] = useState("");
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || "");
        setCompanyName(profile.company_name || "");
        setPhone(profile.phone || "");
      }

      const { data: business } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", user.id)
        .limit(1)
        .single();

      if (business) {
        setBusinessId(business.id);
        setBusinessName(business.name || "");
        setGreeting(business.greeting || "");
        setTransferPhone(business.transfer_phone || "");
      }

      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }

    await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        company_name: companyName,
        phone,
      })
      .eq("id", user.id);

    if (businessId) {
      await supabase
        .from("businesses")
        .update({
          name: businessName,
          greeting,
          transfer_phone: transferPhone,
        })
        .eq("id", businessId);
    } else if (businessName) {
      await supabase.from("businesses").insert({
        owner_id: user.id,
        name: businessName,
        greeting,
        transfer_phone: transferPhone,
      });
    }

    toast.success("Настройки сохранены");
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Настройки</h1>
        <p className="text-muted-foreground">Профиль, бизнес и параметры AI</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Профиль</CardTitle>
            <CardDescription>Личные данные аккаунта</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Имя</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Компания</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 999 123-45-67"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Бизнес и AI</CardTitle>
            <CardDescription>
              Как ресепшнист представляется и куда переводит звонки
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Название бизнеса</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Салон красоты «Элегант»"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="greeting">Приветствие AI</Label>
              <Textarea
                id="greeting"
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                placeholder="Здравствуйте! Вы позвонили в салон «Элегант». Чем могу помочь?"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transferPhone">Телефон для перевода звонка</Label>
              <Input
                id="transferPhone"
                value={transferPhone}
                onChange={(e) => setTransferPhone(e.target.value)}
                placeholder="+7 999 000-00-00"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Сохранить
        </Button>
      </form>
    </div>
  );
}
