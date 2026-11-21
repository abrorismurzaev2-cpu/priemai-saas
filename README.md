# ПриёмAI

**Умный голосовой AI-ресепшнист для малого бизнеса в России и СНГ**

ПриёмAI принимает входящие звонки 24/7, ведёт естественный диалог на русском, записывает клиентов в календарь / CRM, отвечает на типовые вопросы и переводит сложные звонки живому сотруднику.

---

## Быстрый старт (демо за 2 минуты)

```bash
git clone https://github.com/abrorismurzaev2-cpu/priemai-saas.git
cd priemai-saas
npm install
cp .env.example .env.local
# DEMO_MODE уже включён по умолчанию — кабинет работает без ключей
npm run dev
```

Откройте http://localhost:3000

- **Лендинг:** http://localhost:3000  
- **Кабинет (демо):** http://localhost:3000/dashboard  
- **Вход:** http://localhost:3000/login → любой email / пароль (или demo@priemai.ru)

В демо-режиме показываются тестовые звонки, записи и сценарии салона «Элегант».

---

## Переход на реальные данные

1. Создайте проект на [supabase.com](https://supabase.com)
2. SQL Editor → выполните `supabase/migrations/001_initial_schema.sql`
3. Settings → API → скопируйте URL и ключи в `.env.local`:

```env
DEMO_MODE=false
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

4. Перезапустите `npm run dev` — появятся регистрация и реальный auth.

### Vapi (голосовой AI)

1. [dashboard.vapi.ai](https://dashboard.vapi.ai) → API Key
2. Webhook URL: `https://YOUR_DOMAIN/api/webhooks/vapi`
3. Добавьте в `.env.local`: `VAPI_API_KEY`, `VAPI_WEBHOOK_SECRET`

---

## Стек

| Слой | Технологии |
|------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind, shadcn/ui |
| Backend | Next.js API Routes |
| БД / Auth | Supabase (PostgreSQL + Auth + RLS) |
| Голосовой AI | Vapi.ai |
| Телефония | Zadarma / Twilio |
| Платежи | ЮKassa |
| Хостинг | Vercel |

---

## Структура

```
app/
  page.tsx              # Лендинг
  (auth)/login|register # Вход / регистрация
  (dashboard)/          # Кабинет
    dashboard/          # Обзор
    calls/              # История звонков
    scenarios/          # Сценарии AI
    appointments/       # Записи клиентов
    billing/            # Тарифы
    settings/           # Настройки
    onboarding/         # Мастер настройки
  api/webhooks/vapi/    # Webhook Vapi
components/ui/          # shadcn компоненты
lib/                    # supabase, vapi, demo-data, utils
supabase/migrations/    # SQL схема
types/                  # TypeScript типы
```

## Деплой на Vercel

1. Import репозитория на vercel.com  
2. Environment Variables из `.env.example`  
3. Deploy  
4. Обновите webhook URL в Vapi  

---

© 2026 ПриёмAI
