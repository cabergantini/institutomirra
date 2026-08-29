-- Mapeamento de Vida Apaixonante — schema do Supabase
-- Rode este script no SQL Editor do seu projeto Supabase (Database > SQL Editor).

-- 1. Perfis das alunas -------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome_completo text not null default '',
  email text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Usuárias veem o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuárias atualizam o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Usuárias criam o próprio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Cria o perfil automaticamente quando uma nova usuária se cadastra.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome_completo, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome_completo', ''),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Mapeamento de Vida Apaixonante -------------------------------------

create table if not exists public.mapeamentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  negociaveis jsonb not null default '[]'::jsonb,
  inegociaveis jsonb not null default '[]'::jsonb,
  rotina jsonb not null default '{}'::jsonb,
  status text not null default 'rascunho' check (status in ('rascunho', 'concluido')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Cada aluna mantém um único mapeamento (é atualizado ao longo do tempo).
create unique index if not exists mapeamentos_user_id_key on public.mapeamentos (user_id);

alter table public.mapeamentos enable row level security;

create policy "Usuárias veem o próprio mapeamento"
  on public.mapeamentos for select
  using (auth.uid() = user_id);

create policy "Usuárias criam o próprio mapeamento"
  on public.mapeamentos for insert
  with check (auth.uid() = user_id);

create policy "Usuárias atualizam o próprio mapeamento"
  on public.mapeamentos for update
  using (auth.uid() = user_id);

create policy "Usuárias apagam o próprio mapeamento"
  on public.mapeamentos for delete
  using (auth.uid() = user_id);

-- Atualiza updated_at automaticamente a cada alteração.
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_mapeamentos_updated_at on public.mapeamentos;
create trigger set_mapeamentos_updated_at
  before update on public.mapeamentos
  for each row execute procedure public.handle_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
