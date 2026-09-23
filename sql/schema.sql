-- =========================================================
-- Bero Bazart — Supabase schema
-- Run this once in Supabase Dashboard → SQL Editor → New query
-- =========================================================

-- ---------- PRODUCTS ----------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name_fr text not null,
  name_en text not null,
  description_fr text default '',
  description_en text default '',
  category text default '',
  price numeric(10,2) not null default 0,
  sizes text[] default '{}',
  colors text[] default '{}',
  images text[] default '{}',
  sale_price numeric(10,2),
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table products enable row level security;

-- anyone (including anonymous shoppers) can view active products
create policy "Public can read products"
  on products for select
  using (true);

-- only logged-in staff can add/edit/delete products
create policy "Staff can insert products"
  on products for insert
  to authenticated
  with check (true);

create policy "Staff can update products"
  on products for update
  to authenticated
  using (true);

create policy "Staff can delete products"
  on products for delete
  to authenticated
  using (true);

-- ---------- ORDERS ----------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  items jsonb not null,       -- always stored in French
  note text default '',
  delivery_fee numeric(10,2) default 0,
  total numeric(10,2) not null,
  language text default 'fr', -- language the customer browsed in
  created_at timestamptz default now()
);

alter table orders enable row level security;

-- anyone can place an order (INSERT only)
create policy "Anyone can create an order"
  on orders for insert
  to anon, authenticated
  with check (true);

-- only logged-in staff can view orders
create policy "Staff can read orders"
  on orders for select
  to authenticated
  using (true);

-- ---------- SETTINGS (delivery fee) ----------
create table if not exists settings (
  key text primary key,
  value text not null
);

alter table settings enable row level security;

-- anyone can read settings (needed for the delivery fee at checkout) — never store secrets here
create policy "Public can read settings"
  on settings for select
  using (true);

-- only staff can change settings (so the delivery fee can be updated from the admin panel)
create policy "Staff can update settings"
  on settings for update
  to authenticated
  using (true);

create policy "Staff can insert settings"
  on settings for insert
  to authenticated
  with check (true);

-- placeholder delivery fee (staff accounts are created by hand in Supabase, no invite code)
insert into settings (key, value) values ('delivery_fee', '7')
  on conflict (key) do nothing;

-- =========================================================
-- STORAGE — run this part too (creates the bucket for product photos)
-- =========================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Staff can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Staff can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- =========================================================
-- SAMPLE PRODUCTS (delete these later from the admin panel, or leave as a starting point)
-- =========================================================
insert into products (name_fr, name_en, description_fr, description_en, category, price, sizes, colors, images)
values
  ('Abaya Brodée Sable', 'Embroidered Abaya - Sand',
   'Abaya fluide en crêpe avec broderie fine sur les manches. Doublure intérieure incluse.',
   'Flowing crepe abaya with fine embroidery on the sleeves. Inner lining included.',
   'Abayas', 145.00, '{S,M,L,XL}', '{Sable,Noir}', '{}'),
  ('Ensemble Kimono Lin', 'Linen Kimono Set',
   'Kimono long en lin naturel, ceinture assortie, coupe ample et légère.',
   'Long natural linen kimono, matching belt, loose and light cut.',
   'Kimonos', 98.00, '{S/M,L/XL}', '{Beige,Olive}', '{}'),
  ('Robe Maxi Plissée', 'Pleated Maxi Dress',
   'Robe longue plissée à manches longues, tissu doux et non transparent.',
   'Long pleated dress with long sleeves, soft opaque fabric.',
   'Robes', 89.00, '{S,M,L}', '{Camel,Bordeaux}', '{}'),
  ('Foulard Chiffon Premium', 'Premium Chiffon Hijab',
   'Foulard en chiffon premium, tombé fluide, non glissant.',
   'Premium chiffon hijab, fluid drape, non-slip.',
   'Foulards', 22.00, '{Standard}', '{Beige,Taupe,Noir,Blush}', '{}')
on conflict do nothing;