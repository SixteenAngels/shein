-- Minimal starter schema stubs

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  phone text,
  name text,
  role text default 'user',
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  image_url text,
  in_stock boolean default true,
  ready_now boolean default false,
  group_buy_enabled boolean default false,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  status text default 'payment_confirmed',
  shipping_method text,
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  product_id uuid references products(id),
  quantity int not null,
  price numeric not null
);

create table if not exists order_tracking (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  lat double precision,
  lng double precision,
  status text,
  recorded_at timestamptz default now()
);

