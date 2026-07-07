import { supabase } from '../lib/supabase'
import type { Business, Category, CatalogueItem, AboutContent, Testimonial, GalleryImage } from '../types'

export const publicService = {
  async getBusinessBySlug(slug: string): Promise<Business | null> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async getCategoriesByBusinessId(businessId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('business_id', businessId)
      .order('sort_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getItemsByBusinessId(businessId: string): Promise<CatalogueItem[]> {
    const { data, error } = await supabase
      .from('items')
      .select('*, category:categories(id, name)')
      .eq('business_id', businessId)
      .eq('available', true)
      .order('sort_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getAboutContentByBusinessId(businessId: string): Promise<AboutContent | null> {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .eq('business_id', businessId)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async getTestimonialsByBusinessId(businessId: string): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('business_id', businessId)
      .eq('published', true)
      .order('sort_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getGalleryImagesByBusinessId(businessId: string): Promise<GalleryImage[]> {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('business_id', businessId)
      .order('sort_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },
}
