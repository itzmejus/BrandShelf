import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Eye,
  MessageCircle,
  CalendarCheck,
  Plus,
  Tag,
  Upload,
  Share2,
  QrCode,
  Zap,
  PackagePlus,
  Globe,
  Copy,
  ExternalLink,
  ArrowRight,
  Clock,
} from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { fetchGalleryImages } from '../store/slices/gallerySlice'
import { saveBusiness } from '../store/slices/businessSlice'
import { addToast } from '../store/slices/uiSlice'
import { fetchAnalytics } from '../store/slices/analyticsSlice'
import { analyticsEventService } from '../services/analyticsEvent.service'
import { StatCard, StatCardSkeleton, Switch, Badge } from '../components'
import { ROUTES } from '../utils/constants'
import { mainSiteUrl } from '../utils/domainRouting'
import { formatRelativeTime, getTrialDaysRemaining, isInTrial } from '../utils/business.utils'
import { computeSetupProgress } from '../utils/setupProgress'
import { getCatalogueLabel } from '../utils/businessType'

const STATS_RANGE_DAYS = 30

const QUICK_ACTIONS = [
  { icon: PackagePlus, label: 'Add Item', to: ROUTES.CATALOGUE },
  { icon: Tag, label: 'Add Category', to: ROUTES.CATEGORIES },
  { icon: Upload, label: 'Upload Images', to: ROUTES.GALLERY },
  { icon: Share2, label: 'Share Link', to: ROUTES.BUSINESS_INFO },
  { icon: QrCode, label: 'QR Code', to: ROUTES.QR },
  { icon: Plus, label: 'Business Info', to: ROUTES.BUSINESS_INFO },
]

interface DailyPoint { date: string; count: number }

function formatAxisLabel(dateStr: string, rangeDays: number): string {
  const date = new Date(`${dateStr}T00:00:00`)
  if (rangeDays <= 7) return date.toLocaleDateString('en-US', { weekday: 'short' })
  if (rangeDays <= 30) return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  return date.toLocaleDateString('en-US', { month: 'short' })
}

function TrafficChart({ data, loading, rangeDays }: { data: DailyPoint[]; loading: boolean; rangeDays: number }) {
  if (loading) {
    return <div className="w-full h-48 mt-4 rounded-lg bg-surface-container-low animate-pulse" />
  }

  const total = data.reduce((sum, d) => sum + d.count, 0)
  if (total === 0) {
    return (
      <div className="w-full h-48 mt-4 flex items-center justify-center text-center px-6">
        <p className="text-sm text-on-surface-variant">
          No visitors yet. Share your website link to start seeing traffic here.
        </p>
      </div>
    )
  }

  const max = Math.max(...data.map((d) => d.count), 1)
  const stepX = data.length > 1 ? 1000 / (data.length - 1) : 0
  const points = data.map((d, i) => ({ x: i * stepX, y: 290 - (d.count / max) * 270 }))
  const linePoints = points.map((p) => `${p.x},${p.y}`).join(' ')
  const areaPath = `M0,300 L${linePoints} L1000,300 Z`
  const labelEvery = rangeDays <= 7 ? 1 : rangeDays <= 30 ? 5 : 30
  const todayCount = data[data.length - 1]?.count ?? 0

  return (
    <div className="w-full h-48 relative mt-4">
      <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(70,72,212,0.2)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(70,72,212,0)' }} />
          </linearGradient>
        </defs>
        {[0, 75, 150, 225, 300].map((y) => (
          <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#f1f1f1" strokeWidth="1" />
        ))}
        <path d={areaPath} fill="url(#chartGrad)" />
        <polyline points={linePoints} fill="none" stroke="#4648d4" strokeWidth="2.5" />
        {points.map((p, i) =>
          i % labelEvery === 0 || i === points.length - 1 ? (
            <circle key={data[i].date} cx={p.x} cy={p.y} r="4" fill="#4648d4" stroke="white" strokeWidth="2" />
          ) : null,
        )}
      </svg>
      <div className="absolute top-6 right-[4%] bg-primary text-on-primary px-2 py-1 rounded text-[10px] font-bold shadow-lg">
        Today: {todayCount} view{todayCount !== 1 ? 's' : ''}
      </div>
      <div className="flex justify-between mt-2 px-1 text-[10px] text-outline font-medium" aria-hidden="true">
        {data.map((d, i) =>
          i % labelEvery === 0 || i === data.length - 1 ? (
            <span key={d.date}>{formatAxisLabel(d.date, rangeDays)}</span>
          ) : null,
        )}
      </div>
    </div>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const business = useAppSelector((s) => s.business.business)
  const catalogue = useAppSelector((s) => s.catalogue)
  const businessLoading = useAppSelector((s) => s.business.loading)
  const businessSaving = useAppSelector((s) => s.business.saving)
  const paid = useAppSelector((s) => s.business.paid)
  const paidFetched = useAppSelector((s) => s.business.paidFetched)
  const trialActive = !!business && business.published && !paid && isInTrial(business.created_at)
  const trialDaysLeft = business ? getTrialDaysRemaining(business.created_at) : 0
  const paymentPending = business?.published && paidFetched && !paid && !trialActive
  const galleryImages = useAppSelector((s) => s.gallery.images)
  const analyticsCounts = useAppSelector((s) => s.analytics.counts)
  const analyticsLoading = useAppSelector((s) => s.analytics.loading)

  const availableCount = catalogue.items.filter((i) => i.available).length
  const catalogueLabel = getCatalogueLabel(business?.type ?? '')

  const [chartRange, setChartRange] = useState(7)
  const [dailyViews, setDailyViews] = useState<DailyPoint[]>([])
  const [dailyViewsLoading, setDailyViewsLoading] = useState(true)

  useEffect(() => {
    if (business) dispatch(fetchGalleryImages(business.id))
  }, [business, dispatch])

  useEffect(() => {
    if (!business) return
    const since = new Date()
    since.setDate(since.getDate() - STATS_RANGE_DAYS)
    dispatch(fetchAnalytics({ businessId: business.id, sinceISODate: since.toISOString() }))
  }, [business, dispatch])

  useEffect(() => {
    if (!business) return
    let cancelled = false
    setDailyViewsLoading(true)
    analyticsEventService
      .getDailyPageViews(business.id, chartRange)
      .then((data) => { if (!cancelled) setDailyViews(data) })
      .finally(() => { if (!cancelled) setDailyViewsLoading(false) })
    return () => { cancelled = true }
  }, [business, chartRange])

  const stats = analyticsCounts
    ? [
        { icon: Eye, label: 'Website Views', value: analyticsCounts.page_view.toLocaleString() },
        { icon: MessageCircle, label: 'WhatsApp Taps', value: analyticsCounts.whatsapp_click.toLocaleString() },
        { icon: CalendarCheck, label: 'Booking Requests', value: analyticsCounts.booking_click.toLocaleString() },
      ]
    : []

  const setupProgress = computeSetupProgress({
    business,
    itemCount: catalogue.items.length,
    galleryCount: galleryImages.length,
  })

  const websiteUrl = business?.slug ? mainSiteUrl(`/${business.slug}`) : null

  const handleTogglePublished = async () => {
    if (!business) return
    const { id, user_id, created_at, updated_at, ...rest } = business
    const result = await dispatch(
      saveBusiness({
        businessId: business.id,
        userId: business.user_id,
        formData: { ...rest, published: !business.published },
      }),
    )
    if (saveBusiness.fulfilled.match(result)) {
      dispatch(
        addToast({
          message: business.published ? 'Website set to draft' : 'Website is now live',
          type: 'success',
        }),
      )
    }
  }

  const handleCopyLink = async () => {
    if (!websiteUrl) return
    await navigator.clipboard.writeText(websiteUrl)
    dispatch(addToast({ message: 'Link copied!', type: 'success' }))
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          {business ? `Welcome to SiteSelo, ${business.name}.` : 'Welcome to SiteSelo.'}
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5">
          Set up your business profile and publish your website in minutes.
        </p>
      </div>

      {/* Website Status */}
      {business && (
        <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center flex-shrink-0">
              <Globe size={20} className="text-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-primary">Website Status</h3>
                <Badge
                  variant={!business.published ? 'default' : paymentPending ? 'warning' : trialActive ? 'info' : 'success'}
                >
                  {!business.published ? 'Draft' : paymentPending ? 'Pending Payment' : trialActive ? 'Free Trial' : 'Live'}
                </Badge>
              </div>
              <p className="text-sm text-on-surface-variant truncate">{websiteUrl ?? 'No website link yet'}</p>
              <p className="text-xs text-outline mt-0.5">Last updated {formatRelativeTime(business.updated_at)}</p>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 flex-shrink-0">
            <Switch checked={business.published} onChange={handleTogglePublished} disabled={businessSaving} />
            <button
              onClick={handleCopyLink}
              disabled={!websiteUrl}
              className="flex items-center gap-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Copy size={13} />
              Copy Link
            </button>
            <a
              href={websiteUrl ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!websiteUrl}
              className="flex items-center gap-1.5 bg-primary text-on-primary text-xs font-semibold px-3 py-2 rounded-lg hover:opacity-90 transition-colors"
            >
              <ExternalLink size={13} />
              View Website
            </a>
          </div>
        </div>
      )}

      {/* Free trial notice */}
      {trialActive && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 md:p-6 flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="text-blue-700" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-900">
              Your website is live on a free trial, {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left
            </p>
            <p className="text-sm text-blue-800 mt-1">
              Visitors can see it right now. Once your payment is confirmed it'll stay live automatically,
              otherwise it'll pause when the trial ends.
            </p>
          </div>
        </div>
      )}

      {/* Payment pending notice */}
      {paymentPending && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 md:p-6 flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="text-amber-700" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-900">Your free trial has ended — payment pending</p>
            <p className="text-sm text-amber-800 mt-1">
              Your website is fully built, but it's no longer visible to visitors until your payment is confirmed.
              Once we receive it, your site goes live automatically — no action needed from you.
            </p>
          </div>
        </div>
      )}

      {/* Setup progress banner */}
      {business && setupProgress.percent < 100 && (
        <button
          onClick={() => navigate(ROUTES.SETUP)}
          className="w-full text-left bg-primary rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden hover:opacity-95 transition-opacity"
        >
          <div className="absolute top-0 right-0 w-56 h-56 bg-secondary/20 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <p className="text-xs font-bold text-on-primary-container uppercase tracking-widest mb-1">
              Complete your business profile to launch your website
            </p>
            <p className="text-white text-sm font-semibold">
              Step {setupProgress.completedSteps + 1} of {setupProgress.totalSteps} · {setupProgress.percent}% complete
            </p>
            <div className="w-full max-w-xs h-1.5 rounded-full bg-white/20 mt-3 overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${setupProgress.percent}%` }} />
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-2 bg-white text-primary font-bold px-5 py-2.5 rounded-lg text-xs flex-shrink-0">
            Finish Setup
            <ArrowRight size={14} />
          </div>
        </button>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {businessLoading || analyticsLoading || !analyticsCounts
          ? Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Traffic chart */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
            <div>
              <h3 className="text-base font-semibold text-primary">Website Traffic</h3>
              <p className="text-xs text-on-surface-variant">Views over time</p>
            </div>
            <select
              className="bg-surface-container border border-outline-variant text-xs font-medium rounded-lg px-3 py-1.5 outline-none focus:border-secondary"
              aria-label="Select time range"
              value={chartRange}
              onChange={(e) => setChartRange(Number(e.target.value))}
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={365}>This Year</option>
            </select>
          </div>
          <div className="px-6 pb-6">
            <TrafficChart data={dailyViews} loading={dailyViewsLoading} rangeDays={chartRange} />
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-6">
            <h3 className="text-xs font-bold text-primary mb-4 flex items-center gap-2">
              <Zap size={14} aria-hidden="true" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.to)}
                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-outline-variant hover:border-secondary hover:bg-secondary/5 transition-all group"
                >
                  <action.icon
                    size={20}
                    className="text-on-surface-variant group-hover:text-secondary mb-2"
                    aria-hidden="true"
                  />
                  <span className="text-[10px] font-semibold text-center leading-tight">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bento row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Website status */}
        <div className="md:col-span-2 bg-primary p-5 md:p-8 rounded-xl text-on-primary flex flex-col justify-between overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-2">Your Website</h3>
            <p className="text-sm opacity-80 max-w-xs">
              {catalogue.items.length > 0
                ? `${catalogue.items.length} item${catalogue.items.length !== 1 ? 's' : ''} published. ${availableCount} available to customers.`
                : 'Your website is live. Start adding services or menu items.'}
            </p>
          </div>
          <div className="mt-8 relative z-10">
            <button
              onClick={() => navigate(ROUTES.CATALOGUE)}
              className="bg-white text-primary font-bold px-6 py-2.5 rounded-lg text-xs hover:bg-secondary-fixed transition-colors"
            >
              Manage {catalogueLabel}
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-10 rounded-full blur-3xl -mr-20 -mt-20" />
        </div>

        {/* Catalogue summary */}
        <div className="bg-white border border-outline-variant rounded-xl p-6 flex flex-col gap-2">
          <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
            {catalogueLabel}
          </span>
          <h3 className="text-2xl font-bold text-primary">{catalogue.items.length}</h3>
          <p className="text-xs text-on-surface-variant">
            {availableCount} available · {catalogue.items.length - availableCount} hidden
          </p>
        </div>

        {/* QR code CTA */}
        <button
          onClick={() => navigate(ROUTES.QR)}
          className="bg-surface-container-low border-2 border-dashed border-outline rounded-xl flex flex-col items-center justify-center text-center p-6 hover:bg-surface-container transition-colors cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full border border-outline flex items-center justify-center mb-3">
            <QrCode size={22} className="text-outline" aria-hidden="true" />
          </div>
          <h4 className="text-xs font-bold text-on-surface">Generate QR Code</h4>
          <p className="text-[11px] text-on-surface-variant mt-1">
            Share your website anywhere: print, post, or display.
          </p>
        </button>
      </div>
    </div>
  )
}
