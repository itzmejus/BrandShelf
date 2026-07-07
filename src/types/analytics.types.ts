export type AnalyticsEventType =
  | 'page_view'
  | 'phone_click'
  | 'whatsapp_click'
  | 'direction_click'
  | 'booking_click'

export interface AnalyticsEvent {
  id: string
  business_id: string
  event_type: AnalyticsEventType
  created_at: string
}

export interface AnalyticsCounts {
  page_view: number
  phone_click: number
  whatsapp_click: number
  direction_click: number
  booking_click: number
}
