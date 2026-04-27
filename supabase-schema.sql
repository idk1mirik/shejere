create extension if not exists pgcrypto;

create table if not exists public.family_tree_states (
    slug text primary key,
    data jsonb not null default '{"people":[],"focusPersonId":null}'::jsonb,
    updated_at timestamptz not null default timezone('utc', now()),
    updated_by uuid references auth.users (id)
);

create table if not exists public.family_tree_roles (
    user_id uuid primary key references auth.users (id) on delete cascade,
    role text not null check (role in ('admin', 'viewer')),
    created_at timestamptz not null default timezone('utc', now())
);

alter table public.family_tree_states enable row level security;
alter table public.family_tree_roles enable row level security;

create or replace function public.is_family_tree_admin()
returns boolean
language sql
stable
as $$
    select exists (
        select 1
        from public.family_tree_roles role_map
        where role_map.user_id = auth.uid()
          and role_map.role = 'admin'
    );
$$;

drop policy if exists "Public can read the family tree" on public.family_tree_states;
create policy "Public can read the family tree"
on public.family_tree_states
for select
to anon, authenticated
using (true);

drop policy if exists "Users can read their own role" on public.family_tree_roles;
create policy "Users can read their own role"
on public.family_tree_roles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Admins can insert family tree rows" on public.family_tree_states;
create policy "Admins can insert family tree rows"
on public.family_tree_states
for insert
to authenticated
with check (public.is_family_tree_admin());

drop policy if exists "Admins can update family tree rows" on public.family_tree_states;
create policy "Admins can update family tree rows"
on public.family_tree_states
for update
to authenticated
using (public.is_family_tree_admin())
with check (public.is_family_tree_admin());

drop policy if exists "Admins can delete family tree rows" on public.family_tree_states;
create policy "Admins can delete family tree rows"
on public.family_tree_states
for delete
to authenticated
using (public.is_family_tree_admin());

insert into public.family_tree_states (slug)
values ('main-family-tree')
on conflict (slug) do nothing;
