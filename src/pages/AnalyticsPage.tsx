import { useEffect } from 'react'
import { Eye, Phone, MessageCircle, Navigation, CalendarCheck, TrendingUp } from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { fetchAnalytics } from '../store/slices/analyticsSlice'
import { PageHeader, StatCard, StatCardSkeleton } from '../components'

const RANGE_DAYS = 30

export function AnalyticsPage() {
  const dispatch = useAppDispatch()
  const business = useAppSelector((s) => s.business.business)
  const { counts, loading } = useAppSelector((s) => s.analytics)

  useEffect(() => {
    if (!business) return
    const since = new Date()
    since.setDate(since.getDate() - RANGE_DAYS)
    dispatch(fetchAnalytics({ businessId: business.id, sinceISODate: since.toISOString() }))
  }, [business, dispatch])

  const interactions = counts
    ? counts.phone_click + counts.whatsapp_click + counts.direction_click + counts.booking_click
    : 0
  const conversionRate = counts && counts.page_view > 0 ? (interactions / counts.page_view) * 100 : 0

  const stats = counts
    ? [
        { icon: Eye, label: 'Website Visitors', value: counts.page_view.toLocaleString() },
        { icon: Phone, label: 'Phone Clicks', value: counts.phone_click.toLocaleString() },
        { icon: MessageCircle, label: 'WhatsApp Clicks', value: counts.whatsapp_click.toLocaleString() },
        { icon: Navigation, label: 'Direction Clicks', value: counts.direction_click.toLocaleString() },
        { icon: CalendarCheck, label: 'Booking Requests', value: counts.booking_click.toLocaleString() },
        { icon: TrendingUp, label: 'Conversion Rate', value: `${conversionRate.toFixed(1)}%` },
      ]
    : []

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Analytics"
        subtitle={`How customers are engaging with your website over the last ${RANGE_DAYS} days.`}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {loading || !counts
          ? Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {!loading && counts && counts.page_view === 0 && (
        <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-8 text-center">
          <p className="text-sm text-on-surface-variant">
            No visitors yet. Share your website link to start seeing data here.
          </p>
        </div>
      )}
    </div>
  )
}
