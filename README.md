# BrandShelf

> **Everything Your Customers Need. One Link.**

BrandShelf is a digital storefront platform that lets any business create a professional online presence in minutes. Manage your catalogue, gallery, and contact details from one dashboard — then share a single link with your customers.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| State | Redux Toolkit |
| Routing | React Router v7 |
| Backend | Supabase (Auth + PostgreSQL + Storage) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |

---

## Getting Started

### 1. Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### 2. Clone and install

```bash
git clone <your-repo-url>
cd stitch-dashboard
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your Supabase credentials (found in **Project Settings → API**):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Set up the database

In your Supabase project, open **SQL Editor** and run these files in order:

```
supabase/schema.sql           ← Tables, RLS policies, Storage buckets, auth trigger
supabase/slug_migration.sql   ← Slug column + public read access for storefronts
```

### 5. Run locally

```bash
npm run dev
```

### 6. Build for production

```bash
npm run build
```

---

## Project Structure

```
src/
├── app/            # Redux Provider, AuthListener (session watcher)
├── components/     # Shared UI components (Button, Modal, Toast, etc.)
├── features/
│   ├── catalogue/  # ItemFormModal
│   ├── public/     # Customer-facing storefront sections
│   └── settings/   # BusinessSetupModal
├── hooks/          # useAppDispatch, useAppSelector, usePageMeta
├── layouts/        # AuthLayout, DashboardLayout, Sidebar, Topnav
├── lib/            # Supabase client (validated env vars)
├── pages/          # Route-level page components (lazy-loaded)
├── routes/         # AppRouter with code splitting
├── services/       # auth, business, catalogue, category, public
├── store/
│   └── slices/     # authSlice, businessSlice, catalogueSlice, categorySlice, uiSlice
├── types/          # TypeScript interfaces
└── utils/          # constants, errors, slug, upload
```

---

## Public Storefronts

Every business automatically gets a shareable URL:

```
yourdomain.com/business-slug
```

The storefront reads live data from Supabase — any dashboard change is reflected immediately.

---

## Deployment

Deploy to Vercel, Netlify, or Cloudflare Pages. Set the following environment variables on your host:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

**Recommended production HTTP headers** (configure at host/CDN level):

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## License

Private — All rights reserved.
