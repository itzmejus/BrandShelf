import { supabase } from '../lib/supabase'
import type { Category, CategoryFormData } from '../types'

export const categoryService = {
  async getByBusinessId(businessId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('business_id', businessId)
      .order('sort_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async create(businessId: string, formData: CategoryFormData): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert({ ...formData, business_id: businessId })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(categoryId: string, formData: Partial<CategoryFormData>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update({ ...formData, updated_at: new Date().toISOString() })
      .eq('id', categoryId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(categoryId: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', categoryId)
    if (error) throw error
  },
}
