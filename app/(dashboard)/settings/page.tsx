"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("Алексей Демо");
  const [companyName, setCompanyName] = useState("Салон «Элегант»");
  const [phone, setPhone] = useState("+7 999 123-45-67");
  const [businessName, setBusinessName] = useState("Салон красоты «Элегант»");
  const [greeting, setGreeting] = useState("Здравствуйте! Вы позвонили в салон красоты «Элегант». Чем могу помочь?");
  const [transferPhone, setTransferPhone] = useState("+7 999 000-11-22");
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Настройки сохранены (демо)");
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
        Демо-режим: изменения сохраняются локально в сессии.
      </div>
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
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Компания</Label>
              <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Бизнес и AI</CardTitle>
            <CardDescription>Как ресепшнист представляется и куда переводит звонки</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Название бизнеса</Label>
              <Input id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="greeting">Приветствие AI</Label>
              <Textarea id="greeting" value={greeting} onChange={(e) => setGreeting(e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transferPhone">Телефон для перевода звонка</Label>
              <Input id="transferPhone" value={transferPhone} onChange={(e) => setTransferPhone(e.target.value)} />
            </div>
          </CardContent>
        </Card>
        <Button type="submit" disabled={saving}>{saving ? "Сохранение..." : "Сохранить"}</Button>
      </form>
    </div>
  );
}
