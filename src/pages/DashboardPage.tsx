import { useNavigate } from 'react-router-dom'
import {
  Eye,
  MessageCircle,
  Phone,
  CalendarCheck,
  ShoppingBag,
  DollarSign,
  Plus,
  Tag,
  Upload,
  Share2,
  QrCode,
  Zap,
  PackagePlus,
  CalendarDays,
  Star,
  User,
} from 'lucide-react'
import { useAppSelector } from '../hooks/useAppSelector'
import { StatCard, StatCardSkeleton } from '../components'
import { ROUTES } from '../utils/constants'

const DUMMY_STATS = [
  { icon: Eye, label: 'Storefront Views', value: '2,845', trend: '+12%', trendUp: true },
  { icon: MessageCircle, label: 'WhatsApp Taps', value: '412', trend: '+8%', trendUp: true },
  { icon: Phone, label: 'Phone Calls', value: '89', trend: '-2%', trendUp: false },
  { icon: CalendarCheck, label: 'Bookings', value: '54', trend: '+15%', trendUp: true },
  { icon: ShoppingBag, label: 'Enquiries', value: '128', trend: '+5%', trendUp: true },
  { icon: DollarSign, label: 'Est. Revenue', value: '$12.4k', trend: '+22%', trendUp: true },
]

const RECENT_ACTIVITY = [
  {
    icon: CalendarDays,
    iconColor: 'text-secondary',
    title: 'New booking from',
    bold: 'Sarah Jenkins',
    sub: '45-min consultation • 2m ago',
  },
  {
    icon: MessageCircle,
    iconColor: 'text-emerald-600',
    title: 'WhatsApp enquiry',
    bold: '#ENQ-4921',
    sub: 'Pricing question • 15m ago',
  },
  {
    icon: Star,
    iconColor: 'text-amber-500',
    title: 'New',
    bold: '5-star review',
    sub: '"Absolutely loved the service!" • 1h ago',
  },
  {
    icon: User,
    iconColor: 'text-outline',
    title: 'New visitor from Instagram',
    bold: '',
    sub: 'Referral link • 3h ago',
    dim: true,
  },
]

const QUICK_ACTIONS = [
  { icon: PackagePlus, label: 'Add Item', to: ROUTES.CATALOGUE },
  { icon: Tag, label: 'Add Category', to: ROUTES.CATEGORIES },
  { icon: Upload, label: 'Upload Images', to: ROUTES.GALLERY },
  { icon: Share2, label: 'Share Link', to: ROUTES.SETTINGS },
  { icon: QrCode, label: 'QR Code', to: ROUTES.QR },
  { icon: Plus, label: 'View Settings', to: ROUTES.SETTINGS },
]

function TrafficChart() {
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
        <path d="M0,300 Q150,220 300,240 T600,150 T1000,75 L1000,300 L0,300 Z" fill="url(#chartGrad)" />
        <path d="M0,300 Q150,220 300,240 T600,150 T1000,75" fill="none" stroke="#4648d4" strokeWidth="2.5" />
        <circle cx="300" cy="240" r="4" fill="#4648d4" stroke="white" strokeWidth="2" />
        <circle cx="600" cy="150" r="4" fill="#4648d4" stroke="white" strokeWidth="2" />
        <circle cx="1000" cy="75" r="4" fill="#4648d4" stroke="white" strokeWidth="2" />
      </svg>
      <div className="absolute top-6 right-[8%] bg-primary text-on-primary px-2 py-1 rounded text-[10px] font-bold shadow-lg">
        Today: 842 views
      </div>
      <div className="flex justify-between mt-2 px-1 text-[10px] text-outline font-medium" aria-hidden="true">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const business = useAppSelector((s) => s.business.business)
  const catalogue = useAppSelector((s) => s.catalogue)
  const businessLoading = useAppSelector((s) => s.business.loading)

  const availableCount = catalogue.items.filter((i) => i.available).length

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          {business ? `Welcome back, ${business.name}.` : 'Welcome back.'}
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5">
          Your digital storefront is ready to grow. Manage everything your customers see from one place.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {businessLoading
          ? Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
          : DUMMY_STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Traffic chart */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
            <div>
              <h3 className="text-base font-semibold text-primary">Storefront Traffic</h3>
              <p className="text-xs text-on-surface-variant">Views and customer interactions over time</p>
            </div>
            <select
              className="bg-surface-container border border-outline-variant text-xs font-medium rounded-lg px-3 py-1.5 outline-none focus:border-secondary"
              aria-label="Select time range"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="px-6 pb-6">
            <TrafficChart />
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

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-primary">Recent Activity</h3>
              <button className="text-[10px] text-secondary font-bold hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {RECENT_ACTIVITY.map((item, i) => (
                <div key={i} className={`flex gap-3 ${item.dim ? 'opacity-60' : ''}`}>
                  <div className="w-8 h-8 rounded-full bg-surface-container flex-shrink-0 flex items-center justify-center">
                    <item.icon size={14} className={item.iconColor} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-on-surface">
                      {item.title}{' '}
                      {item.bold && <span className="font-bold">{item.bold}</span>}
                    </p>
                    <p className="text-[10px] text-outline">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bento row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Storefront status */}
        <div className="md:col-span-2 bg-primary p-8 rounded-xl text-on-primary flex flex-col justify-between overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-2">Your Storefront</h3>
            <p className="text-sm opacity-80 max-w-xs">
              {catalogue.items.length > 0
                ? `${catalogue.items.length} item${catalogue.items.length !== 1 ? 's' : ''} published — ${availableCount} available to customers.`
                : 'Your storefront is live. Start adding products and services.'}
            </p>
          </div>
          <div className="mt-8 relative z-10">
            <button
              onClick={() => navigate(ROUTES.CATALOGUE)}
              className="bg-white text-primary font-bold px-6 py-2.5 rounded-lg text-xs hover:bg-secondary-fixed transition-colors"
            >
              Manage Catalogue
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-10 rounded-full blur-3xl -mr-20 -mt-20" />
        </div>

        {/* Catalogue summary */}
        <div className="bg-white border border-outline-variant rounded-xl p-6 flex flex-col gap-2">
          <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
            Catalogue Items
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
            Share your storefront anywhere — print, post, or display.
          </p>
        </button>
      </div>
    </div>
  )
}
