export interface Category {
  id: string
  business_id: string
  name: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface CategoryFormData {
  name: string
  sort_order: number
}
