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

-- Group Buy tables
create table if not exists group_buys (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  creator_user_id uuid references users(id),
  min_qty int not null,
  max_qty int not null,
  tiers jsonb not null, -- e.g. [{"min":5,"max":6,"price":10},{"min":7,"max":8,"price":9}]
  status text not null default 'open', -- open | successful | failed | closed
  started_at timestamptz not null default now(),
  expires_at timestamptz not null, -- dynamic deadline
  extended_until timestamptz, -- optional extension
  created_at timestamptz default now()
);

create table if not exists group_buy_participants (
  id uuid primary key default gen_random_uuid(),
  group_buy_id uuid references group_buys(id) on delete cascade,
  user_id uuid references users(id),
  quantity int not null,
  unit_price numeric not null, -- captured at join time based on tier
  payment_status text not null default 'pending', -- pending | paid | refunded
  created_at timestamptz default now()
);

