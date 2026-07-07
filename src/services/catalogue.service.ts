import { supabase } from '../lib/supabase'
import type { CatalogueItem, CatalogueItemFormData } from '../types'
import { STORAGE_BUCKETS } from '../utils/constants'
import { validateImageFile, safeImagePath, ALLOWED_IMAGE_TYPES } from '../utils/upload'
import { normalizeStorageError } from '../utils/errors'

export const catalogueService = {
  async getByBusinessId(businessId: string): Promise<CatalogueItem[]> {
    const { data, error } = await supabase
      .from('items')
      .select('*, category:categories(id, name)')
      .eq('business_id', businessId)
      .order('sort_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async create(businessId: string, formData: CatalogueItemFormData): Promise<CatalogueItem> {
    const payload = {
      business_id: businessId,
      title: formData.title.trim(),
      description: formData.description?.trim() || null,
      price: formData.price ? parseFloat(formData.price) : null,
      category_id: formData.category_id || null,
      available: formData.available,
      featured: formData.featured,
      image_url: formData.image_url || null,
      sort_order: 0,
    }
    const { data, error } = await supabase
      .from('items')
      .insert(payload)
      .select('*, category:categories(id, name)')
      .single()
    if (error) throw error
    return data
  },

  async update(itemId: string, formData: Partial<CatalogueItemFormData>): Promise<CatalogueItem> {
    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    if (formData.title !== undefined) payload.title = formData.title.trim()
    if (formData.description !== undefined) payload.description = formData.description?.trim() || null
    if (formData.price !== undefined) payload.price = formData.price ? parseFloat(formData.price) : null
    if (formData.category_id !== undefined) payload.category_id = formData.category_id || null
    if (formData.available !== undefined) payload.available = formData.available
    if (formData.featured !== undefined) payload.featured = formData.featured
    if (formData.image_url !== undefined) payload.image_url = formData.image_url || null

    const { data, error } = await supabase
      .from('items')
      .update(payload)
      .eq('id', itemId)
      .select('*, category:categories(id, name)')
      .single()
    if (error) throw error
    return data
  },

  async delete(itemId: string): Promise<void> {
    const { error } = await supabase.from('items').delete().eq('id', itemId)
    if (error) throw error
  },

  async uploadImage(file: File, businessId: string): Promise<string> {
    // Validate before sending to Supabase
    const validationError = validateImageFile(file)
    if (validationError) throw new Error(validationError)

    if (!Object.prototype.hasOwnProperty.call(ALLOWED_IMAGE_TYPES, file.type)) {
      throw new Error('Unsupported image type')
    }

    const path = safeImagePath(businessId, file.type)

    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.ITEMS)
      .upload(path, file, { upsert: false, contentType: file.type })

    if (error) throw new Error(normalizeStorageError(error.message))

    const { data } = supabase.storage.from(STORAGE_BUCKETS.ITEMS).getPublicUrl(path)
    return data.publicUrl
  },
}
