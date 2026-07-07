export interface CatalogueItem {
  id: string
  business_id: string
  category_id: string | null
  title: string
  description: string | null
  price: number | null
  image_url: string | null
  available: boolean
  featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
  category?: { id: string; name: string }
}

export interface CatalogueItemFormData {
  title: string
  description: string
  price: string
  category_id: string
  available: boolean
  featured: boolean
  image_url?: string
}
