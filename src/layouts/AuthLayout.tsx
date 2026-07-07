import { Outlet, Navigate } from 'react-router-dom'
import { useAppSelector } from '../hooks/useAppSelector'
import { Spinner } from '../components'

const FEATURES = [
  {
    title: 'Beautiful Digital Storefront',
    desc: 'Your customers get a clean, professional page — no app required.',
  },
  {
    title: 'Full Catalogue Management',
    desc: 'Add products and services with images, prices, and availability.',
  },
  {
    title: 'One Shareable Link',
    desc: 'Share via WhatsApp, Instagram, QR code, or anywhere online.',
  },
]

export function AuthLayout() {
  const { user, initialized } = useAppSelector((s) => s.auth)

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner size={32} />
      </div>
    )
  }

  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <span className="text-white font-bold text-lg tracking-tight">B</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">BrandShelf</span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Create a beautiful<br />digital storefront.
          </h2>
          <p className="text-on-primary-container text-base leading-relaxed max-w-sm">
            Manage your catalogue, gallery, and business details from one dashboard.
            Then share one beautiful link with your customers.
          </p>
        </div>

        <div className="relative z-10 space-y-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-secondary/30 border border-secondary/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-secondary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{f.title}</p>
                <p className="text-xs text-on-primary-container mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
          <p className="text-xs text-on-primary-container/60 pt-4 border-t border-white/10">
            Everything Your Customers Need. One Link.
          </p>
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -ml-24 -mb-24" />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
