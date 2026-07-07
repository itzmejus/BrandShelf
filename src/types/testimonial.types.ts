export interface Testimonial {
  id: string
  business_id: string
  author_name: string
  author_role: string | null
  quote: string
  rating: number
  avatar_url: string | null
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface TestimonialFormData {
  author_name: string
  author_role: string
  quote: string
  rating: number
  published: boolean
  sort_order: number
  avatar_url?: string | null
}
