-- Ihsan Supabase RLS and Role Helpers

-- 1) Role type and profile table (id references auth.users)
do $$ begin
  create type public.user_role as enum ('user','manager','admin');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'user',
  created_at timestamptz default now()
);

-- 2) Helper functions
create or replace function public.auth_user_id() returns uuid
language sql stable as $$ select auth.uid() $$;

create or replace function public.current_role() returns public.user_role
language sql stable as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'user'::public.user_role)
$$;

create or replace function public.is_admin() returns boolean
language sql stable as $$ select current_role() = 'admin'::public.user_role $$;

create or replace function public.is_manager() returns boolean
language sql stable as $$ select current_role() = 'manager'::public.user_role $$;

create or replace function public.is_staff() returns boolean
language sql stable as $$ select current_role() in ('admin'::public.user_role, 'manager'::public.user_role) $$;

-- 3) Enable RLS
alter table if exists public.profiles enable row level security;
alter table if exists public.products enable row level security;
alter table if exists public.orders enable row level security;
alter table if exists public.order_items enable row level security;
alter table if exists public.order_tracking enable row level security;

-- 4) Profiles policies
drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles for select using (
  auth.uid() = id or is_staff()
);

drop policy if exists "profiles admin manage" on public.profiles;
create policy "profiles admin manage" on public.profiles for all using (is_admin()) with check (is_admin());

-- 5) Products policies
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products for select using (true);

drop policy if exists "products staff write" on public.products;
create policy "products staff write" on public.products for insert with check (is_staff());
create policy "products staff update" on public.products for update using (is_staff()) with check (is_staff());

drop policy if exists "products admin delete" on public.products;
create policy "products admin delete" on public.products for delete using (is_admin());

-- 6) Orders policies
drop policy if exists "orders self or staff select" on public.orders;
create policy "orders self or staff select" on public.orders for select using (
  auth.uid() = user_id or is_staff()
);

drop policy if exists "orders self insert" on public.orders;
create policy "orders self insert" on public.orders for insert with check (
  user_id = auth.uid()
);

drop policy if exists "orders staff update" on public.orders;
create policy "orders staff update" on public.orders for update using (is_staff()) with check (is_staff());

drop policy if exists "orders admin delete" on public.orders;
create policy "orders admin delete" on public.orders for delete using (is_admin());

-- 7) Order items policies
drop policy if exists "order_items self or staff select" on public.order_items;
create policy "order_items self or staff select" on public.order_items for select using (
  exists (
    select 1 from public.orders o where o.id = order_items.order_id and (o.user_id = auth.uid() or is_staff())
  )
);

drop policy if exists "order_items self insert" on public.order_items;
create policy "order_items self insert" on public.order_items for insert with check (
  exists (
    select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid()
  )
);

drop policy if exists "order_items staff update" on public.order_items;
create policy "order_items staff update" on public.order_items for update using (
  exists (
    select 1 from public.orders o where o.id = order_items.order_id and (o.user_id = auth.uid() or is_staff())
  )
) with check (true);

drop policy if exists "order_items admin delete" on public.order_items;
create policy "order_items admin delete" on public.order_items for delete using (is_admin());

-- 8) Order tracking policies
drop policy if exists "order_tracking self or staff select" on public.order_tracking;
create policy "order_tracking self or staff select" on public.order_tracking for select using (
  exists (
    select 1 from public.orders o where o.id = order_tracking.order_id and (o.user_id = auth.uid() or is_staff())
  )
);

drop policy if exists "order_tracking staff write" on public.order_tracking;
create policy "order_tracking staff write" on public.order_tracking for insert with check (is_staff());
create policy "order_tracking staff update" on public.order_tracking for update using (is_staff()) with check (is_staff());

