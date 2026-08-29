-- Ficha GURPS Fantasy — schema Supabase (contas, papéis, fichas, histórico de XP)
--
-- Como aplicar:
--   1. Crie um projeto em https://supabase.com (gratuito).
--   2. Abra "SQL Editor" no painel do projeto, cole este arquivo inteiro e rode.
--   3. Em Project Settings > API, copie "Project URL" e "anon public key" para o .env
--      do app (veja .env.example).
--   4. A PRIMEIRA pessoa a criar uma conta no app vira automaticamente "narrador"
--      (administrador da campanha). Todas as contas seguintes entram como "jogador".
--      Para promover/rebaixar alguém depois, rode manualmente:
--        update public.profiles set role = 'narrador' where email = 'email@exemplo.com';

create extension if not exists pgcrypto;

-- ============================== PERFIS ==============================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text not null default '',
  role text not null default 'jogador' check (role in ('narrador', 'jogador')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  is_first boolean;
begin
  select not exists (select 1 from public.profiles) into is_first;
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    case when is_first then 'narrador' else 'jogador' end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select
  using (
    id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'narrador')
  );

drop policy if exists profiles_update_own_name on public.profiles;
create policy profiles_update_own_name on public.profiles
  for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ============================== FICHAS ==============================

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,

  name text not null default 'Novo Aventureiro',
  player text not null default '',
  race text not null default 'Humano',
  homeland text not null default '',
  height text not null default '',
  weight text not null default '',
  age text not null default '',
  gender text not null default '',
  appearance text not null default '',

  total_points integer not null default 150,

  attributes jsonb not null default '{"st":10,"dx":10,"iq":10,"ht":10}',
  secondary jsonb not null default '{"hp":0,"will":0,"per":0,"fp":0,"speedSteps":0,"move":0}',
  advantages jsonb not null default '[]',
  disadvantages jsonb not null default '[]',
  perks jsonb not null default '[]',
  quirks jsonb not null default '[]',
  skills jsonb not null default '[]',
  spells jsonb not null default '[]',
  equipment jsonb not null default '[]',
  weapons jsonb not null default '[]',
  cash numeric not null default 0,
  notes text not null default '',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists characters_owner_id_idx on public.characters (owner_id);

alter table public.characters enable row level security;

-- Só o narrador pode alterar total_points fora do fluxo de concessão de XP
-- (jogador não pode inflar o próprio orçamento de pontos).
create or replace function public.characters_before_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  acting_role text;
begin
  select role into acting_role from public.profiles where id = auth.uid();
  if acting_role is distinct from 'narrador' and new.total_points is distinct from old.total_points then
    new.total_points := old.total_points;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists characters_before_update on public.characters;
create trigger characters_before_update
  before update on public.characters
  for each row execute function public.characters_before_update();

drop policy if exists characters_select on public.characters;
create policy characters_select on public.characters
  for select
  using (
    owner_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'narrador')
  );

drop policy if exists characters_insert on public.characters;
create policy characters_insert on public.characters
  for insert
  with check (owner_id = auth.uid());

drop policy if exists characters_update on public.characters;
create policy characters_update on public.characters
  for update
  using (
    owner_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'narrador')
  )
  with check (
    owner_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'narrador')
  );

drop policy if exists characters_delete on public.characters;
create policy characters_delete on public.characters
  for delete
  using (
    owner_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'narrador')
  );

-- ========================== HISTÓRICO DE XP ==========================

create table if not exists public.xp_grants (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters (id) on delete cascade,
  granted_by uuid not null references public.profiles (id),
  amount integer not null,
  reason text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists xp_grants_character_id_idx on public.xp_grants (character_id);

alter table public.xp_grants enable row level security;

create or replace function public.apply_xp_grant()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.characters
  set total_points = total_points + new.amount
  where id = new.character_id;
  return new;
end;
$$;

drop trigger if exists xp_grants_apply on public.xp_grants;
create trigger xp_grants_apply
  after insert on public.xp_grants
  for each row execute function public.apply_xp_grant();

drop policy if exists xp_grants_select on public.xp_grants;
create policy xp_grants_select on public.xp_grants
  for select
  using (
    granted_by = auth.uid()
    or exists (select 1 from public.characters c where c.id = character_id and c.owner_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'narrador')
  );

-- Só o narrador concede XP.
drop policy if exists xp_grants_insert on public.xp_grants;
create policy xp_grants_insert on public.xp_grants
  for insert
  with check (
    granted_by = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'narrador')
  );
