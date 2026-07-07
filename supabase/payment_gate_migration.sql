-- ============================================================
-- Migration: Manual payment gate
-- Run in Supabase Dashboard → SQL Editor
--
-- Problem: any signed-up user can publish a business website today —
-- there's no payment check anywhere. This adds one.
--
-- Design: payment status lives in its own table (business_payments),
-- not as a column on `businesses`. That matters — `businesses` already
-- has an "owner can update their own row" policy with no column
-- restriction, so a `paid` column sitting there could be flipped by
-- the business owner themselves via a raw API call. `business_payments`
-- gets RLS enabled with a SELECT policy for the owner (so a future
-- "pending activation" banner is possible) but deliberately NO
-- insert/update/delete policy — with RLS on and no matching policy,
-- Postgres denies writes by default. Only a connection that bypasses
-- RLS (you, via the Supabase Table Editor or SQL Editor) can write it.
-- ============================================================

create table if not exists public.business_payments (
  business_id    uuid primary key references public.businesses(id) on delete cascade,
  business_name  text not null default '',
  paid           boolean not null default false,
  updated_at     timestamptz not null default now()
);

-- business_name is a denormalized copy of businesses.name, kept in sync by
-- the triggers below — purely so you can find the row to toggle by name in
-- Table Editor/SQL Editor instead of hunting for a business_id UUID.
alter table public.business_payments add column if not exists business_name text not null default '';

alter table public.business_payments enable row level security;

drop policy if exists "business_payments: owner select" on public.business_payments;
create policy "business_payments: owner select" on public.business_payments
  for select using (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );

-- Backfill a row for every existing business (and fix up the name for rows
-- inserted by an older version of this migration). Defaults to paid = false,
-- which is what actually turns the gate on for current accounts.
insert into public.business_payments (business_id, business_name)
select id, name from public.businesses
on conflict (business_id) do update set business_name = excluded.business_name;

-- Auto-create a (default unpaid) row whenever a new business signs up,
-- so every business always has exactly one row to toggle.
create or replace function public.handle_new_business()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.business_payments (business_id, business_name)
  values (new.id, new.name)
  on conflict (business_id) do update set business_name = excluded.business_name;
  return new;
end;
$$;

drop trigger if exists on_business_created on public.businesses;
create trigger on_business_created
  after insert on public.businesses
  for each row execute function public.handle_new_business();

-- Keep business_name in sync if the owner ever renames their business.
create or replace function public.sync_business_payment_name()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.name is distinct from old.name then
    update public.business_payments set business_name = new.name where business_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_business_renamed on public.businesses;
create trigger on_business_renamed
  after update on public.businesses
  for each row execute function public.sync_business_payment_name();

-- ── The gate ────────────────────────────────────────────────
-- One helper, reused by every public-facing policy below, so "live"
-- always means the same thing: owner has published it AND an admin
-- has marked it paid. security definer so the internal lookup runs
-- as the table owner and isn't itself blocked by the RLS it's enforcing.
create or replace function public.business_is_live(p_business_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.businesses b
    join public.business_payments bp on bp.business_id = b.id
    where b.id = p_business_id and b.published = true and bp.paid = true
  );
$$;

drop policy if exists "businesses: public select" on public.businesses;
create policy "businesses: public select" on public.businesses
  for select using (public.business_is_live(id));

drop policy if exists "categories: public select" on public.categories;
create policy "categories: public select" on public.categories
  for select using (public.business_is_live(business_id));

drop policy if exists "items: public select" on public.items;
create policy "items: public select" on public.items
  for select using (public.business_is_live(business_id));

drop policy if exists "about_content: public select" on public.about_content;
create policy "about_content: public select" on public.about_content
  for select using (public.business_is_live(business_id));

drop policy if exists "testimonials: public select" on public.testimonials;
create policy "testimonials: public select" on public.testimonials
  for select using (published = true and public.business_is_live(business_id));

drop policy if exists "gallery_images: public select" on public.gallery_images;
create policy "gallery_images: public select" on public.gallery_images
  for select using (public.business_is_live(business_id));

-- ── Public "paused" lookup ──────────────────────────────────
-- The public select policies above mean an unpaid/unpublished business's
-- row just isn't returned — the storefront (BusinessPage.tsx) can't tell
-- "this slug never existed" apart from "this slug exists but isn't live"
-- to show a real "this website is paused" message instead of a bare 404.
-- This function bypasses RLS (security definer) to answer only that
-- narrow question — business name + live status, nothing else (no phone,
-- address, catalogue, etc.) — for any slug, including ones that aren't
-- live yet.
create or replace function public.get_business_status(p_slug text)
returns table (business_name text, published boolean, paid boolean)
language sql
stable
security definer set search_path = public
as $$
  select b.name, b.published, coalesce(bp.paid, false)
  from public.businesses b
  left join public.business_payments bp on bp.business_id = b.id
  where b.slug = p_slug;
$$;

grant execute on function public.get_business_status(text) to anon, authenticated;

-- ── Turning a business on/off ───────────────────────────────
-- Table Editor → business_payments now shows business_name right next to
-- the paid checkbox, so you can just find the row and click it. Or, from
-- SQL Editor:
--
-- Mark paid (site goes live immediately, no redeploy needed):
--
--   update public.business_payments set paid = true, updated_at = now()
--   where business_name ilike '%acme%';
--
-- Mark unpaid (site goes dark immediately):
--
--   update public.business_payments set paid = false, updated_at = now()
--   where business_name ilike '%acme%';
--
-- Owner-facing pages (dashboard, catalogue editor, etc.) are untouched —
-- only the public storefront and its content are gated.
