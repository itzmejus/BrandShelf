import { supabase } from '../lib/supabase'
import type { AboutContent, AboutContentFormData } from '../types'
import { STORAGE_BUCKETS } from '../utils/constants'
import { validateImageFile, safeImagePath } from '../utils/upload'
import { normalizeStorageError } from '../utils/errors'

export const aboutContentService = {
  async getByBusinessId(businessId: string): Promise<AboutContent | null> {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .eq('business_id', businessId)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async upsert(businessId: string, formData: AboutContentFormData): Promise<AboutContent> {
    const { data, error } = await supabase
      .from('about_content')
      .upsert(
        { ...formData, business_id: businessId, updated_at: new Date().toISOString() },
        { onConflict: 'business_id' },
      )
      .select()
      .single()
    if (error) throw error
    return data
  },

  async uploadImage(businessId: string, file: File): Promise<string> {
    const validationError = validateImageFile(file)
    if (validationError) throw new Error(validationError)

    const path = safeImagePath(businessId, file.type)

    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.COVERS)
      .upload(path, file, { upsert: false, contentType: file.type })

    if (error) throw new Error(normalizeStorageError(error.message))

    const { data } = supabase.storage.from(STORAGE_BUCKETS.COVERS).getPublicUrl(path)
    return data.publicUrl
  },
}
