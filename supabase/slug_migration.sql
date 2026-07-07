-- ============================================================
-- Migration: Add slug + public read access
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Add slug column to businesses
alter table public.businesses
  add column if not exists slug text unique;

-- 2. Back-fill slugs for any existing rows
update public.businesses
set slug = lower(
  regexp_replace(
    regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  )
)
where slug is null;

-- 3. Public SELECT policies (anyone can read; owner policies already exist)
--    Supabase ORs multiple SELECT policies, so adding `using (true)` makes rows
--    readable without authentication — required for the public business page.

drop policy if exists "businesses: public select" on public.businesses;
create policy "businesses: public select" on public.businesses
  for select using (true);

drop policy if exists "categories: public select" on public.categories;
create policy "categories: public select" on public.categories
  for select using (true);

drop policy if exists "items: public select" on public.items;
create policy "items: public select" on public.items
  for select using (true);
