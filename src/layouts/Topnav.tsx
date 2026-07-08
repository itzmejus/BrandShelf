import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, Plus } from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { toggleSidebar } from '../store/slices/uiSlice'
import { SearchBar, Avatar } from '../components'
import { ROUTES } from '../utils/constants'

export function Topnav() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const business = useAppSelector((s) => s.business.business)
  const user = useAppSelector((s) => s.auth.user)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-surface border-b border-outline-variant sticky top-0 z-50 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-4 flex-1">
        <button
          className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
          onClick={() => dispatch(toggleSidebar())}
        >
          <Menu size={20} />
        </button>

        {/* Business name */}
        <span className="hidden sm:block text-sm font-semibold text-primary truncate max-w-[200px]">
          {business?.name ?? 'Your Business'}
        </span>

        {/* Search */}
        <SearchBar
          placeholder="Search your catalogue… (⌘K)"
          containerClassName="hidden md:block max-w-sm w-full"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate(ROUTES.CATALOGUE)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors text-xs font-medium"
        >
          <Plus size={16} />
          Add Item
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications((v) => !v); setShowUserMenu(false) }}
            className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <Bell size={18} />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border border-outline-variant shadow-lg py-4 px-4 z-50 text-center">
              <p className="text-sm font-medium text-on-surface">No new notifications</p>
              <p className="text-xs text-on-surface-variant mt-1">You're all caught up for now.</p>
            </div>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => { setShowUserMenu((v) => !v); setShowNotifications(false) }}
            className="ml-2 rounded-full ring-2 ring-transparent hover:ring-outline-variant transition-all"
          >
            <Avatar name={user?.email} src={null} size="sm" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-outline-variant shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-outline-variant">
                <p className="text-xs font-semibold text-on-surface truncate">{user?.email}</p>
                <p className="text-[11px] text-on-surface-variant">SiteSelo Account</p>
              </div>
              <button
                onClick={() => { navigate(ROUTES.ACCOUNT); setShowUserMenu(false) }}
                className="w-full text-left px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                Account
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
