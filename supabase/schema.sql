create extension if not exists pgcrypto;

create table if not exists profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  preferred_unit text not null default 'C' check (preferred_unit in ('C', 'F')),
  created_at timestamptz not null default now()
);

create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null,
  latitude double precision not null check (latitude >= -90 and latitude <= 90),
  longitude double precision not null check (longitude >= -180 and longitude <= 180),
  created_at timestamptz not null default now()
);

create table if not exists history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  latitude double precision not null check (latitude >= -90 and latitude <= 90),
  longitude double precision not null check (longitude >= -180 and longitude <= 180),
  weather_payload jsonb not null,
  ai_conversation jsonb not null,
  created_at timestamptz not null default now()
);

create unique index if not exists favorites_user_location_idx
  on favorites (user_id, latitude, longitude);

create index if not exists favorites_user_created_at_idx
  on favorites (user_id, created_at desc);

create index if not exists history_user_created_at_idx
  on history (user_id, created_at desc);

alter table profiles enable row level security;
alter table favorites enable row level security;
alter table history enable row level security;

drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = user_id);

drop policy if exists "profiles_insert_own" on profiles;
create policy "profiles_insert_own"
  on profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = user_id);

drop policy if exists "favorites_select_own" on favorites;
create policy "favorites_select_own"
  on favorites for select
  using (auth.uid() = user_id);

drop policy if exists "favorites_insert_own" on favorites;
create policy "favorites_insert_own"
  on favorites for insert
  with check (auth.uid() = user_id);

drop policy if exists "favorites_delete_own" on favorites;
create policy "favorites_delete_own"
  on favorites for delete
  using (auth.uid() = user_id);

drop policy if exists "history_select_own" on history;
create policy "history_select_own"
  on history for select
  using (auth.uid() = user_id);

drop policy if exists "history_insert_own" on history;
create policy "history_insert_own"
  on history for insert
  with check (auth.uid() = user_id);
