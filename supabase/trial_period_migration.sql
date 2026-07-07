-- ============================================================
-- Migration: 7-day free trial
-- Run in Supabase Dashboard → SQL Editor
--
-- Problem: business_is_live() (see payment_gate_migration.sql) requires
-- paid = true before a business's storefront becomes publicly visible.
-- Since `paid` is only ever set manually, a brand new signup couldn't see
-- their own site working until an admin marked them paid — which kills
-- first-run excitement for genuinely new users.
--
-- Fix: business_is_live() now also treats a business as live during the
-- first 7 days after it was created (businesses.created_at), regardless
-- of `paid`. No new column, no cron job — it's a plain date comparison
-- evaluated on every request, so it "expires" itself automatically once
-- created_at falls outside the window. After 7 days, the existing
-- paid-gate behavior takes back over exactly as before.
-- ============================================================

create or replace function public.business_is_live(p_business_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.businesses b
    join public.business_payments bp on bp.business_id = b.id
    where b.id = p_business_id
      and b.published = true
      and (bp.paid = true or b.created_at > now() - interval '7 days')
  );
$$;
