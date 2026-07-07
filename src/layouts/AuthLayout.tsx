import { Outlet, Navigate } from 'react-router-dom'
import { useAppSelector } from '../hooks/useAppSelector'
import { Spinner } from '../components'
import loginImage from '../assets/Login.png'

export function AuthLayout() {
  const { user, initialized } = useAppSelector((s) => s.auth)

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner size={32} />
      </div>
    )
  }

  if (user) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col p-12 relative overflow-hidden">
        <div className="flex items-center justify-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center p-1">
            <img src="/Logo.png" alt="SiteSelo" className="w-full h-full object-contain" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">SiteSelo</span>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Launch your business<br />online in minutes.
          </h2>
          <p className="text-on-primary-container text-base leading-relaxed mb-8">
            Add your business details, services, and photos from one dashboard.
            Then share one link with your customers.
          </p>

          <img
            src={loginImage}
            alt=""
            aria-hidden="true"
            className="w-full max-w-sm"
          />
        </div>

        {/* Decorative blob */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32" />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-outline-variant/60 p-8 md:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
