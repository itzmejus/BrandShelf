import { supabase } from '../lib/supabase'
import type { AnalyticsCounts, AnalyticsEventType } from '../types'

export const analyticsEventService = {
  async logEvent(businessId: string, eventType: AnalyticsEventType): Promise<void> {
    try {
      await supabase.from('analytics_events').insert({ business_id: businessId, event_type: eventType })
    } catch {
      // Best-effort — never let analytics break the storefront
    }
  },

  async getCounts(businessId: string, sinceISODate: string): Promise<AnalyticsCounts> {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('event_type')
      .eq('business_id', businessId)
      .gte('created_at', sinceISODate)
    if (error) throw error

    const counts: AnalyticsCounts = {
      page_view: 0,
      phone_click: 0,
      whatsapp_click: 0,
      direction_click: 0,
      booking_click: 0,
    }
    for (const row of data ?? []) {
      const type = row.event_type as AnalyticsEventType
      if (type in counts) counts[type] += 1
    }
    return counts
  },
}
