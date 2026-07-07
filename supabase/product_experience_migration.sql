-- ============================================================
-- Migration: Product experience overhaul
-- (tagline/trust badges/publish status, about highlights, analytics)
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── businesses: hero content + publish status ──────────────

alter table public.businesses
  add column if not exists tagline text,
  add column if not exists trust_badges text[],
  add column if not exists published boolean not null default true;

-- Drafts (published = false) are no longer publicly readable.
-- Owner-scoped select policy is untouched, so the dashboard is unaffected.
drop policy if exists "businesses: public select" on public.businesses;
create policy "businesses: public select" on public.businesses
  for select using (published = true);

-- ── about_content: short highlight checkpoints ─────────────

alter table public.about_content
  add column if not exists highlights text[];

-- ── analytics_events ────────────────────────────────────────

create table if not exists public.analytics_events (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references public.businesses(id) on delete cascade,
  event_type   text not null check (event_type in ('page_view', 'phone_click', 'whatsapp_click', 'direction_click', 'booking_click')),
  created_at   timestamptz default now()
);

create index if not exists analytics_events_business_type_created_idx
  on public.analytics_events (business_id, event_type, created_at);

alter table public.analytics_events enable row level security;

create policy "analytics_events: owner select" on public.analytics_events
  for select using (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );

-- Anonymous storefront visitors log their own events
create policy "analytics_events: public insert" on public.analytics_events
  for insert with check (true);
