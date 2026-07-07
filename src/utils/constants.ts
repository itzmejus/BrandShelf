export const APP_NAME = 'SiteSelo'
export const APP_TAGLINE = 'Launch your business online in minutes.'
export const APP_SHORT_TAGLINE = 'From details to website.'

export const BUSINESS_TYPES = [
  'Restaurant',
  'Cafe',
  'Dental Clinic',
  'Medical Clinic',
  'Beauty Salon',
  'Spa',
  'Gym',
  'Moving Company',
  'Electrician',
  'HVAC Company',
  'Cleaning Company',
  'Landscaping Company',
  'Photographer',
  'Real Estate',
  'Other',
] as const

export const STORAGE_BUCKETS = {
  LOGOS: 'logos',
  COVERS: 'covers',
  ITEMS: 'items',
  GALLERY: 'gallery',
} as const

// Dashboard routes are bare paths (no /dashboard prefix) — the subdomain
// itself (dashboard.siteselo.com) is what scopes them, via a separate route
// tree in AppRouter.tsx. See src/utils/domainRouting.ts.
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  DASHBOARD: '/',
  SETUP: '/setup',
  CATALOGUE: '/catalogue',
  CATEGORIES: '/categories',
  BUSINESS_INFO: '/business-info',
  ABOUT: '/about',
  TESTIMONIALS: '/testimonials',
  GALLERY: '/gallery',
  CONTACT: '/contact',
  WORKING_HOURS: '/working-hours',
  BOOKINGS: '/bookings',
  REVIEWS: '/reviews',
  MESSAGES: '/messages',
  ANALYTICS: '/analytics',
  MARKETING: '/marketing',
  QR: '/qr',
  THEMES: '/themes',
  ACCOUNT: '/account',
} as const
