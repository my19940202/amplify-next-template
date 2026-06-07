-- Run in Supabase SQL Editor (Dashboard → SQL)
-- Tracks monthly analysis quota for authenticated users (Freemium)

create table if not exists public.analysis_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month_key text not null,
  count integer not null default 0 check (count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, month_key)
);

create index if not exists analysis_usage_user_month_idx
  on public.analysis_usage (user_id, month_key);

alter table public.analysis_usage enable row level security;

create policy "Users can read own analysis usage"
  on public.analysis_usage for select
  using (auth.uid() = user_id);

create policy "Users can insert own analysis usage"
  on public.analysis_usage for insert
  with check (auth.uid() = user_id);

create policy "Users can update own analysis usage"
  on public.analysis_usage for update
  using (auth.uid() = user_id);
