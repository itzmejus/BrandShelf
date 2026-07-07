export interface GalleryImage {
  id: string
  business_id: string
  image_url: string
  caption: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface GalleryImageFormData {
  image_url: string
  caption?: string | null
  sort_order: number
}
