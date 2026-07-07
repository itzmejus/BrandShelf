-- ============================================================
-- Migration: About Us, Testimonials, Gallery content tables
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Tables ──────────────────────────────────────────────────

create table if not exists public.about_content (
  business_id  uuid primary key references public.businesses(id) on delete cascade,
  heading      text,
  body         text,
  image_url    text,
  updated_at   timestamptz default now()
);

create table if not exists public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  business_id   uuid not null references public.businesses(id) on delete cascade,
  author_name   text not null,
  author_role   text,
  quote         text not null,
  rating        smallint not null default 5 check (rating >= 1 and rating <= 5),
  avatar_url    text,
  published     boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create table if not exists public.gallery_images (
  id            uuid primary key default gen_random_uuid(),
  business_id   uuid not null references public.businesses(id) on delete cascade,
  image_url     text not null,
  caption       text,
  sort_order    integer not null default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── Row Level Security ───────────────────────────────────────

alter table public.about_content  enable row level security;
alter table public.testimonials   enable row level security;
alter table public.gallery_images enable row level security;

-- about_content (scoped through businesses)
create policy "about_content: owner select" on public.about_content
  for select using (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );
create policy "about_content: owner insert" on public.about_content
  for insert with check (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );
create policy "about_content: owner update" on public.about_content
  for update using (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );
create policy "about_content: owner delete" on public.about_content
  for delete using (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );
create policy "about_content: public select" on public.about_content
  for select using (true);

-- testimonials (scoped through businesses)
create policy "testimonials: owner select" on public.testimonials
  for select using (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );
create policy "testimonials: owner insert" on public.testimonials
  for insert with check (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );
create policy "testimonials: owner update" on public.testimonials
  for update using (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );
create policy "testimonials: owner delete" on public.testimonials
  for delete using (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );
create policy "testimonials: public select" on public.testimonials
  for select using (published = true);

-- gallery_images (scoped through businesses)
create policy "gallery_images: owner select" on public.gallery_images
  for select using (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );
create policy "gallery_images: owner insert" on public.gallery_images
  for insert with check (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );
create policy "gallery_images: owner update" on public.gallery_images
  for update using (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );
create policy "gallery_images: owner delete" on public.gallery_images
  for delete using (
    exists (select 1 from public.businesses where id = business_id and user_id = auth.uid())
  );
create policy "gallery_images: public select" on public.gallery_images
  for select using (true);
