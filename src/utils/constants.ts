export const BUSINESS_TYPES = [
  'Restaurant',
  'Salon',
  'Clinic',
  'Movers',
  'Garage',
  'Bakery',
  'Gym',
  'Retail Shop',
  'Service Business',
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
  DASHBOARD: '/dashboard',
  CATALOGUE: '/dashboard/catalogue',
  CATEGORIES: '/dashboard/categories',
  GALLERY: '/dashboard/gallery',
  BOOKINGS: '/dashboard/bookings',
  ANALYTICS: '/dashboard/analytics',
  MARKETING: '/dashboard/marketing',
  QR: '/dashboard/qr',
  THEMES: '/dashboard/themes',
  SETTINGS: '/dashboard/settings',
} as const
