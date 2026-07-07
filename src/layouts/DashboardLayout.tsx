import { useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { setSidebarOpen } from '../store/slices/uiSlice'
import { fetchBusiness } from '../store/slices/businessSlice'
import { BusinessSetupModal } from '../features/settings/components/BusinessSetupModal'
import { Sidebar } from './Sidebar'
import { Topnav } from './Topnav'
import { Spinner } from '../components'

export function DashboardLayout() {
  const dispatch = useAppDispatch()
  const { user, initialized } = useAppSelector((s) => s.auth)
  const { business, loading, fetched } = useAppSelector((s) => s.business)
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen)

  useBodyScrollLock(sidebarOpen)

  // Fetch once — `fetched` flag prevents re-running when business is null
  useEffect(() => {
    if (user && !fetched && !loading) {
      dispatch(fetchBusiness(user.id))
    }
  }, [user, fetched, loading, dispatch])

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size={32} />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  // Still loading the business for the first time
  if (!fetched || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-3">
        <Spinner size={32} />
        <p className="text-sm text-on-surface-variant">Loading your storefront…</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar drawer — sits below the topnav so it stays visible/usable while open */}
      {sidebarOpen && (
        <div className="fixed top-16 left-0 right-0 bottom-0 z-40 lg:hidden flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => dispatch(setSidebarOpen(false))}
          />
          <div className="relative h-full">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topnav />
        <main className="flex-1 overflow-y-auto thin-scrollbar p-4 sm:p-6">
          <div className="max-w-[1440px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Business setup — blocks the UI until completed */}
      <BusinessSetupModal open={fetched && !business} />
    </div>
  )
}
