# ПриёмAI

**Умный голосовой AI-ресепшнист для малого бизнеса в России и СНГ**

ПриёмAI принимает входящие звонки 24/7, ведёт естественный диалог на русском, записывает клиентов в Google Calendar / CRM, отвечает на типовые вопросы и переводит сложные звонки живому сотруднику.

---

## Стек

| Слой | Технологии |
|------|------------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes + Server Actions |
| БД / Auth | Supabase (PostgreSQL + Auth + Realtime + RLS) |
| Голосовой AI | Vapi.ai (рекомендуется) / Retell AI |
| Телефония | Zadarma (РФ/СНГ) или Twilio |
| Календарь | Google Calendar API |
| CRM | amoCRM, Bitrix24 (webhook + API) |
| Платежи | ЮKassa |
| Хостинг | Vercel + Supabase |
| CI/CD | GitHub Actions + Docker |

---

## Быстрый старт

### 1. Клонирование и зависимости

```bash
git clone https://github.com/abrorismurzaev2-cpu/priemai-saas.git
cd priemai-saas
npm install
```

### 2. Переменные окружения

```bash
cp .env.example .env.local
```

Заполните все ключи (см. раздел «Как получить ключи» ниже).

### 3. База данных (Supabase)

1. Создайте проект на [supabase.com](https://supabase.com)
2. В SQL Editor выполните миграцию из `supabase/migrations/001_initial_schema.sql`

### 4. Запуск локально

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

---

## Как получить ключи

### Supabase
1. https://supabase.com → New Project
2. Settings → API → Project URL + `anon` key + `service_role` key

### Vapi.ai
1. https://dashboard.vapi.ai → Sign up
2. API Keys → Private Key
3. Webhook URL: `https://YOUR_DOMAIN/api/webhooks/vapi`

### Zadarma (рекомендуется для РФ)
1. https://zadarma.com → регистрация
2. API → User Key + Secret Key

### Twilio (альтернатива)
1. https://console.twilio.com
2. Account SID + Auth Token

### Google Calendar
1. https://console.cloud.google.com → создайте проект
2. Enable Google Calendar API
3. OAuth 2.0 Client ID

### ЮKassa
1. https://yookassa.ru → подключение
2. Shop ID + Secret Key

---

## Структура проекта

```
priemai/
├── app/                 # Next.js App Router
├── components/
├── lib/                 # vapi, supabase, google-calendar, scenarios
├── supabase/migrations/
├── types/
├── .env.example
├── docker-compose.yml
└── README.md
```

## Деплой на Vercel

1. https://vercel.com → Import Project → выбери этот репозиторий
2. Добавь Environment Variables из `.env.example`
3. Deploy
4. Обнови webhook URL в Vapi на production

© 2026 ПриёмAI
