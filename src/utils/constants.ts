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

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  DASHBOARD: '/dashboard',
  SETUP: '/dashboard/setup',
  CATALOGUE: '/dashboard/catalogue',
  CATEGORIES: '/dashboard/categories',
  BUSINESS_INFO: '/dashboard/business-info',
  ABOUT: '/dashboard/about',
  TESTIMONIALS: '/dashboard/testimonials',
  GALLERY: '/dashboard/gallery',
  CONTACT: '/dashboard/contact',
  WORKING_HOURS: '/dashboard/working-hours',
  BOOKINGS: '/dashboard/bookings',
  REVIEWS: '/dashboard/reviews',
  MESSAGES: '/dashboard/messages',
  ANALYTICS: '/dashboard/analytics',
  MARKETING: '/dashboard/marketing',
  QR: '/dashboard/qr',
  THEMES: '/dashboard/themes',
  ACCOUNT: '/dashboard/account',
} as const
