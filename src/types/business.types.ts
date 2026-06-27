export interface OpeningHours {
  day: string
  open: string
  close: string
  closed: boolean
}

export interface Business {
  id: string
  user_id: string
  slug: string
  name: string
  type: string
  phone: string | null
  whatsapp: string | null
  email: string | null
  address: string | null
  description: string | null
  logo_url: string | null
  cover_url: string | null
  opening_hours: OpeningHours[] | null
  created_at: string
  updated_at: string
}

export type BusinessFormData = Omit<Business, 'id' | 'user_id' | 'created_at' | 'updated_at'>
