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

  async getDailyPageViews(businessId: string, days: number): Promise<{ date: string; count: number }[]> {
    const since = new Date()
    since.setHours(0, 0, 0, 0)
    since.setDate(since.getDate() - (days - 1))

    const { data, error } = await supabase
      .from('analytics_events')
      .select('created_at')
      .eq('business_id', businessId)
      .eq('event_type', 'page_view')
      .gte('created_at', since.toISOString())
    if (error) throw error

    const counts = new Map<string, number>()
    for (const row of data ?? []) {
      const day = (row.created_at as string).slice(0, 10)
      counts.set(day, (counts.get(day) ?? 0) + 1)
    }

    return Array.from({ length: days }, (_, i) => {
      const d = new Date(since)
      d.setDate(d.getDate() + i)
      const key = d.toISOString().slice(0, 10)
      return { date: key, count: counts.get(key) ?? 0 }
    })
  },
}
