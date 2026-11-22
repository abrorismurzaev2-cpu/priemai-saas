"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatRub } from "@/lib/utils";
import { demoServices, demoMasters } from "@/lib/demo-data";
import { Plus, Trash2, User, Scissors, Clock, Phone, Pencil, X, Check } from "lucide-react";
import { toast } from "sonner";

type Service = {
  id: string;
  name: string;
  category: string;
  price: number;
  duration_min: number;
  master_ids: string[];
};

type Master = {
  id: string;
  name: string;
  role: string;
  phone: string;
  experience_years: number;
  services: string[];
  schedule: string;
  active: boolean;
  duties: string;
};

const initialMasters: Master[] = demoMasters.map((m, i) => ({
  ...m,
  duties:
    i === 0
      ? "Стрижки, укладки, консультации по уходу за волосами. Приём клиентов по записи."
      : i === 1
        ? "Окрашивание, тонирование, сложные техники. Работа с цветом и восстановлением."
        : "Маникюр, педикюр, брови. Соблюдение стерильности, запись клиентов к себе.",
}));

export default function SalonPage() {
  const [tab, setTab] = useState<"services" | "masters">("services");
  const [services, setServices] = useState<Service[]>([...demoServices]);
  const [masters, setMasters] = useState<Master[]>(initialMasters);

  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDuration, setNewDuration] = useState("60");

  const [masterName, setMasterName] = useState("");
  const [masterRole, setMasterRole] = useState("");
  const [masterPhone, setMasterPhone] = useState("");
  const [masterSchedule, setMasterSchedule] = useState("");
  const [masterDuties, setMasterDuties] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Master>>({});

  function addService(e: React.FormEvent) {
    e.preventDefault();
    if (!newName || !newPrice) {
      toast.error("Укажите название и цену");
      return;
    }
    setServices((prev) => [
      ...prev,
      {
        id: `svc-${Date.now()}`,
        name: newName.trim(),
        category: (newCategory || "Другое").trim(),
        price: Math.max(0, Number(newPrice) || 0),
        duration_min: Math.max(5, Number(newDuration) || 60),
        master_ids: [],
      },
    ]);
    setNewName("");
    setNewCategory("");
    setNewPrice("");
    setNewDuration("60");
    toast.success("Услуга добавлена");
  }

  function removeService(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id));
    toast.success("Услуга удалена");
  }

  function addMaster(e: React.FormEvent) {
    e.preventDefault();
    if (!masterName.trim()) {
      toast.error("Укажите имя сотрудника");
      return;
    }
    setMasters((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        name: masterName.trim(),
        role: (masterRole || "Мастер").trim(),
        phone: masterPhone.trim(),
        experience_years: 0,
        services: [],
        schedule: (masterSchedule || "По записи").trim(),
        active: true,
        duties: masterDuties.trim(),
      },
    ]);
    setMasterName("");
    setMasterRole("");
    setMasterPhone("");
    setMasterSchedule("");
    setMasterDuties("");
    toast.success("Сотрудник добавлен");
  }

  function removeMaster(id: string) {
    setMasters((prev) => prev.filter((m) => m.id !== id));
    setEditingId(null);
    toast.success("Сотрудник удалён");
  }

  function startEdit(m: Master) {
    setEditingId(m.id);
    setEditForm({
      name: m.name,
      role: m.role,
      phone: m.phone,
      schedule: m.schedule,
      duties: m.duties,
      active: m.active,
    });
  }

  function saveEdit() {
    if (!editingId) return;
    if (!editForm.name?.trim()) {
      toast.error("Имя обязательно");
      return;
    }
    setMasters((prev) =>
      prev.map((m) =>
        m.id === editingId
          ? {
              ...m,
              name: String(editForm.name).trim(),
              role: String(editForm.role || m.role).trim(),
              phone: String(editForm.phone || "").trim(),
              schedule: String(editForm.schedule || m.schedule).trim(),
              duties: String(editForm.duties || "").trim(),
              active: editForm.active ?? m.active,
            }
          : m
      )
    );
    setEditingId(null);
    setEditForm({});
    toast.success("Данные сотрудника сохранены");
  }

  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Салон</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Услуги, цены и сотрудники — AI использует эти данные при записи клиентов
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <Button
          size="sm"
          variant={tab === "services" ? "default" : "outline"}
          onClick={() => setTab("services")}
        >
          <Scissors className="mr-1.5 h-4 w-4" />
          Услуги и цены
        </Button>
        <Button
          size="sm"
          variant={tab === "masters" ? "default" : "outline"}
          onClick={() => setTab("masters")}
        >
          <User className="mr-1.5 h-4 w-4" />
          Сотрудники
        </Button>
      </div>

      {tab === "services" && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Добавить услугу</CardTitle>
              <CardDescription>Эти данные AI озвучивает клиентам по телефону</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addService} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="svc-name">Название</Label>
                  <Input id="svc-name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Маникюр" maxLength={80} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="svc-cat">Категория</Label>
                  <Input id="svc-cat" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Ногти" maxLength={40} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="svc-price">Цена, ₽</Label>
                  <Input id="svc-price" type="number" min={0} value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="2500" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="svc-dur">Минут</Label>
                  <Input id="svc-dur" type="number" min={5} value={newDuration} onChange={(e) => setNewDuration(e.target.value)} placeholder="60" />
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="w-full">
                    <Plus className="mr-1 h-4 w-4" />
                    Добавить
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {categories.map((cat) => (
            <div key={cat} className="space-y-2">
              <h2 className="text-sm font-semibold text-muted-foreground">{cat}</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {services
                  .filter((s) => s.category === cat)
                  .map((s) => (
                    <Card key={s.id}>
                      <CardContent className="flex items-start justify-between gap-3 p-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium leading-tight">{s.name}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-semibold text-primary">{formatRub(s.price)}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {s.duration_min} мин
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeService(s.id)}
                          className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "masters" && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Добавить сотрудника</CardTitle>
              <CardDescription>
                Укажите обязанности — AI будет знать, к кому направлять клиента
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addMaster} className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="m-name">Имя *</Label>
                  <Input id="m-name" value={masterName} onChange={(e) => setMasterName(e.target.value)} placeholder="Анна К." maxLength={80} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="m-role">Должность</Label>
                  <Input id="m-role" value={masterRole} onChange={(e) => setMasterRole(e.target.value)} placeholder="Парикмахер" maxLength={60} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="m-phone">Телефон</Label>
                  <Input id="m-phone" value={masterPhone} onChange={(e) => setMasterPhone(e.target.value)} placeholder="+7 999..." maxLength={20} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="m-sch">График</Label>
                  <Input id="m-sch" value={masterSchedule} onChange={(e) => setMasterSchedule(e.target.value)} placeholder="Пн–Пт 10–19" maxLength={80} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="m-duties">Обязанности</Label>
                  <Textarea
                    id="m-duties"
                    value={masterDuties}
                    onChange={(e) => setMasterDuties(e.target.value)}
                    placeholder="Стрижки, укладки, консультации. Работа с постоянными клиентами..."
                    rows={3}
                    maxLength={500}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit">
                    <Plus className="mr-1 h-4 w-4" />
                    Добавить сотрудника
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {masters.map((m) => (
              <Card key={m.id} className={editingId === m.id ? "border-primary/50" : ""}>
                {editingId === m.id ? (
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Редактирование</span>
                      <button type="button" onClick={() => setEditingId(null)} className="rounded-md p-1 hover:bg-muted">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Имя</Label>
                      <Input
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                        maxLength={80}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Должность</Label>
                      <Input
                        value={editForm.role || ""}
                        onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                        maxLength={60}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Телефон</Label>
                      <Input
                        value={editForm.phone || ""}
                        onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                        maxLength={20}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>График</Label>
                      <Input
                        value={editForm.schedule || ""}
                        onChange={(e) => setEditForm((f) => ({ ...f, schedule: e.target.value }))}
                        maxLength={80}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Обязанности</Label>
                      <Textarea
                        value={editForm.duties || ""}
                        onChange={(e) => setEditForm((f) => ({ ...f, duties: e.target.value }))}
                        rows={3}
                        maxLength={500}
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editForm.active ?? true}
                        onChange={(e) => setEditForm((f) => ({ ...f, active: e.target.checked }))}
                        className="rounded border-input"
                      />
                      Активен (принимает записи)
                    </label>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEdit}>
                        <Check className="mr-1 h-4 w-4" />
                        Сохранить
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        Отмена
                      </Button>
                    </div>
                  </CardContent>
                ) : (
                  <>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{m.name}</CardTitle>
                          <CardDescription>{m.role}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Badge variant={m.active ? "success" : "secondary"}>
                          {m.active ? "Активен" : "Выкл"}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => startEdit(m)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label="Редактировать"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeMaster(m.id)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      {m.phone && (
                        <p className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          {m.phone}
                        </p>
                      )}
                      <p className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        {m.schedule}
                      </p>
                      {m.duties && (
                        <p className="rounded-md bg-muted/50 p-2 text-xs leading-relaxed">
                          <span className="font-medium text-foreground">Обязанности: </span>
                          {m.duties}
                        </p>
                      )}
                      {m.services.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {m.services.map((s) => (
                            <Badge key={s} variant="outline" className="text-xs font-normal">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
