-- ПриёмAI — начальная схема БД
-- Выполните в SQL Editor Supabase

-- Profiles (расширение auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  company_name text,
  phone text,
  avatar_url text,
  plan text not null default 'trial' check (plan in ('trial', 'start', 'business', 'pro')),
  minutes_used integer not null default 0,
  minutes_limit integer not null default 100,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Businesses
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  industry text,
  address text,
  timezone text not null default 'Europe/Moscow',
  working_hours jsonb not null default '{
    "mon": {"from": "09:00", "to": "18:00"},
    "tue": {"from": "09:00", "to": "18:00"},
    "wed": {"from": "09:00", "to": "18:00"},
    "thu": {"from": "09:00", "to": "18:00"},
    "fri": {"from": "09:00", "to": "18:00"},
    "sat": null,
    "sun": null
  }'::jsonb,
  greeting text,
  transfer_phone text,
  vapi_assistant_id text,
  phone_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Calls
create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  vapi_call_id text,
  caller_phone text,
  direction text not null default 'inbound' check (direction in ('inbound', 'outbound')),
  status text not null default 'queued' check (status in ('queued', 'ringing', 'in-progress', 'ended', 'failed')),
  duration_seconds integer not null default 0,
  transcript text,
  summary text,
  sentiment text check (sentiment in ('positive', 'neutral', 'negative')),
  recording_url text,
  cost numeric(10, 4) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

-- Scenarios
create table if not exists public.scenarios (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean not null default true,
  system_prompt text not null,
  first_message text,
  tools jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Appointments
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  call_id uuid references public.calls(id) on delete set null,
  client_name text,
  client_phone text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  notes text,
  google_event_id text,
  created_at timestamptz not null default now()
);

-- Subscriptions
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan text not null check (plan in ('trial', 'start', 'business', 'pro')),
  status text not null default 'trialing' check (status in ('active', 'cancelled', 'past_due', 'trialing')),
  yookassa_payment_id text,
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_businesses_owner on public.businesses(owner_id);
create index if not exists idx_calls_business on public.calls(business_id);
create index if not exists idx_calls_created on public.calls(created_at desc);
create index if not exists idx_calls_vapi on public.calls(vapi_call_id);
create index if not exists idx_scenarios_business on public.scenarios(business_id);
create index if not exists idx_appointments_business on public.appointments(business_id);
create index if not exists idx_appointments_starts on public.appointments(starts_at);
create index if not exists idx_subscriptions_user on public.subscriptions(user_id);

-- RLS
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.calls enable row level security;
alter table public.scenarios enable row level security;
alter table public.appointments enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Businesses policies
create policy "Owners can manage own businesses"
  on public.businesses for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Calls policies
create policy "Owners can view own calls"
  on public.calls for select
  using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );

create policy "Service role can manage calls"
  on public.calls for all
  using (true)
  with check (true);

-- Scenarios policies
create policy "Owners can manage own scenarios"
  on public.scenarios for all
  using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  )
  with check (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );

-- Appointments policies
create policy "Owners can manage own appointments"
  on public.appointments for all
  using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  )
  with check (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );

-- Subscriptions policies
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Trigger: create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger businesses_updated_at
  before update on public.businesses
  for each row execute procedure public.set_updated_at();

create trigger scenarios_updated_at
  before update on public.scenarios
  for each row execute procedure public.set_updated_at();
