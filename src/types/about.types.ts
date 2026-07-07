export interface AboutContent {
  business_id: string
  heading: string | null
  body: string | null
  image_url: string | null
  highlights: string[] | null
  updated_at: string
}

export interface AboutContentFormData {
  heading: string
  body: string
  image_url?: string | null
  highlights?: string[] | null
}
