-- ============================================================
-- Migration: Checklist leads
-- Run in Supabase Dashboard → SQL Editor
--
-- Captures the email a visitor submits on the marketing site's
-- "Get your free website launch checklist" card. Anonymous, unauthenticated
-- writes only — no public read access, since these are raw leads rather
-- than storefront content. Reviewed via the Supabase dashboard.
-- ============================================================

create table if not exists public.checklist_leads (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  created_at  timestamptz default now()
);

alter table public.checklist_leads enable row level security;

-- Anonymous visitors submit their own email; nobody can read them back
-- through the anon key
create policy "checklist_leads: public insert" on public.checklist_leads
  for insert with check (true);
