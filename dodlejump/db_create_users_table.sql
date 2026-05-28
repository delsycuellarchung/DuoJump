-- SQL para crear la tabla `users` en Postgres (Supabase)
-- Ejecuta esto en SQL Editor de Supabase (o con psql)

-- 1) Crear la tabla
create table if not exists public.users (
  id text primary key,
  email text not null,
  full_name text,
  avatar_url text,
  provider text,
  hearts int default 5,
  coins int default 0,
  streak int default 0,
  best_score int default 0,
  words_completed int default 0,
  last_played timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) Trigger para mantener updated_at actualizado
create or replace function public.trigger_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_set_updated_at
before update on public.users
for each row
execute procedure public.trigger_set_updated_at();

-- 3) Índices útiles
create index if not exists idx_users_email on public.users(email);

-- 4) Habilitar Row Level Security (RLS)
alter table public.users enable row level security;

create policy users_select_own on public.users
  for select
  using (auth.uid()::text = id);

-- Permitir INSERT si auth.uid() = id (usuario crea su propia fila)
create policy users_insert_own on public.users
  for insert
  with check (auth.uid()::text = id);

-- Permitir UPDATE solo al propietario
create policy users_update_own on public.users
  for update
  using (auth.uid()::text = id)
  with check (auth.uid()::text = id);

