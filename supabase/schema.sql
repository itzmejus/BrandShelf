-- ============================================================
-- Stitch Catalogue — Initial Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── Tables ──────────────────────────────────────────────────

create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.businesses (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  name           text not null,
  type           text not null default 'Retail Shop',
  phone          text,
  whatsapp       text,
  email          text,
  address        text,
  description    text,
  logo_url       text,
  cover_url      text,
  opening_hours  jsonb,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table if not exists public.categories (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references public.businesses(id) on delete cascade,
  name         text not null,
  sort_order   integer not null default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table if not exists public.items (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references public.businesses(id) on delete cascade,
  category_id  uuid references public.categories(id) on delete set null,
  title        text not null,
  description  text,
  price        numeric(10,2),
  image_url    text,
  available    boolean not null default true,
  featured     boolean not null default false,
  sort_order   integer not null default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── Row Level Security ───────────────────────────────────────

alter table public.profiles  enable row level security;
alter table public.businesses enable row level security;
alter table public.categories enable row level security;
alter table public.items      enable row level security;

-- profiles
create policy "profiles: owner select" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: owner update" on public.profiles
  for update using (auth.uid() = id);

-- businesses
create policy "businesses: owner select" on public.businesses
  for select using (auth.uid() = user_id);
create policy "businesses: owner insert" on public.businesses
  for insert with check (auth.uid() = user_id);
create policy "businesses: owner update" on public.businesses
  for update using (auth.uid() = user_id);
create policy "businesses: owner delete" on public.businesses
  for delete using (auth.uid() = user_id);

-- categories (scoped through businesses)
create policy "categories: owner select" on public.categories
  for select using (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );
create policy "categories: owner insert" on public.categories
  for insert with check (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );
create policy "categories: owner update" on public.categories
  for update using (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );
create policy "categories: owner delete" on public.categories
  for delete using (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );

-- items (scoped through businesses)
create policy "items: owner select" on public.items
  for select using (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );
create policy "items: owner insert" on public.items
  for insert with check (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );
create policy "items: owner update" on public.items
  for update using (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );
create policy "items: owner delete" on public.items
  for delete using (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );

-- ── Storage Buckets ──────────────────────────────────────────

insert into storage.buckets (id, name, public)
values
  ('logos',   'logos',   true),
  ('covers',  'covers',  true),
  ('items',   'items',   true),
  ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- logos
create policy "logos: public read"        on storage.objects for select using (bucket_id = 'logos');
create policy "logos: auth insert"        on storage.objects for insert with check (bucket_id = 'logos' and auth.role() = 'authenticated');
create policy "logos: auth update"        on storage.objects for update using (bucket_id = 'logos' and auth.role() = 'authenticated');
create policy "logos: auth delete"        on storage.objects for delete using (bucket_id = 'logos' and auth.role() = 'authenticated');

-- covers
create policy "covers: public read"       on storage.objects for select using (bucket_id = 'covers');
create policy "covers: auth insert"       on storage.objects for insert with check (bucket_id = 'covers' and auth.role() = 'authenticated');
create policy "covers: auth update"       on storage.objects for update using (bucket_id = 'covers' and auth.role() = 'authenticated');
create policy "covers: auth delete"       on storage.objects for delete using (bucket_id = 'covers' and auth.role() = 'authenticated');

-- items
create policy "items storage: public read"  on storage.objects for select using (bucket_id = 'items');
create policy "items storage: auth insert"  on storage.objects for insert with check (bucket_id = 'items' and auth.role() = 'authenticated');
create policy "items storage: auth update"  on storage.objects for update using (bucket_id = 'items' and auth.role() = 'authenticated');
create policy "items storage: auth delete"  on storage.objects for delete using (bucket_id = 'items' and auth.role() = 'authenticated');

-- gallery
create policy "gallery: public read"      on storage.objects for select using (bucket_id = 'gallery');
create policy "gallery: auth insert"      on storage.objects for insert with check (bucket_id = 'gallery' and auth.role() = 'authenticated');
create policy "gallery: auth update"      on storage.objects for update using (bucket_id = 'gallery' and auth.role() = 'authenticated');
create policy "gallery: auth delete"      on storage.objects for delete using (bucket_id = 'gallery' and auth.role() = 'authenticated');

-- ── Auth trigger: auto-create profile ───────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
