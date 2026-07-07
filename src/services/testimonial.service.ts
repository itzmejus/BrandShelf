import { supabase } from '../lib/supabase'
import type { Testimonial, TestimonialFormData } from '../types'
import { STORAGE_BUCKETS } from '../utils/constants'
import { validateImageFile, safeImagePath } from '../utils/upload'
import { normalizeStorageError } from '../utils/errors'

export const testimonialService = {
  async getByBusinessId(businessId: string): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('business_id', businessId)
      .order('sort_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async create(businessId: string, formData: TestimonialFormData): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .insert({ ...formData, business_id: businessId })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(testimonialId: string, formData: Partial<TestimonialFormData>): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .update({ ...formData, updated_at: new Date().toISOString() })
      .eq('id', testimonialId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(testimonialId: string): Promise<void> {
    const { error } = await supabase.from('testimonials').delete().eq('id', testimonialId)
    if (error) throw error
  },

  async uploadImage(businessId: string, file: File): Promise<string> {
    const validationError = validateImageFile(file)
    if (validationError) throw new Error(validationError)

    const path = safeImagePath(businessId, file.type)

    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.GALLERY)
      .upload(path, file, { upsert: false, contentType: file.type })

    if (error) throw new Error(normalizeStorageError(error.message))

    const { data } = supabase.storage.from(STORAGE_BUCKETS.GALLERY).getPublicUrl(path)
    return data.publicUrl
  },
}
