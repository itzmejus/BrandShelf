import { supabase } from '../lib/supabase'
import type { Business, BusinessFormData } from '../types'
import { validateImageFile, safeImagePath } from '../utils/upload'
import { normalizeStorageError } from '../utils/errors'

export const businessService = {
  async getByUserId(userId: string): Promise<Business | null> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async create(userId: string, formData: BusinessFormData): Promise<Business> {
    const { data, error } = await supabase
      .from('businesses')
      .insert({ ...formData, user_id: userId })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(businessId: string, formData: Partial<BusinessFormData>): Promise<Business> {
    const { data, error } = await supabase
      .from('businesses')
      .update({ ...formData, updated_at: new Date().toISOString() })
      .eq('id', businessId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getPaymentStatus(businessId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('business_payments')
      .select('paid')
      .eq('business_id', businessId)
      .maybeSingle()
    if (error) throw error
    return data?.paid ?? false
  },

  async uploadImage(bucket: string, businessId: string, file: File): Promise<string> {
    const validationError = validateImageFile(file)
    if (validationError) throw new Error(validationError)

    const path = safeImagePath(businessId, file.type)

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: false, contentType: file.type })

    if (error) throw new Error(normalizeStorageError(error.message))

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  },
}
