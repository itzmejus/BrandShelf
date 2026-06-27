import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package2,
  Tag,
  Images,
  CalendarDays,
  BarChart3,
  Megaphone,
  QrCode,
  Palette,
  Settings,
  LogOut,
  X,
} from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { signOut } from '../store/slices/authSlice'
import { setSidebarOpen } from '../store/slices/uiSlice'
import { Avatar } from '../components'
import { ROUTES } from '../utils/constants'

const NAV_MAIN = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: ROUTES.CATALOGUE, label: 'Catalogue', icon: Package2 },
  { to: ROUTES.CATEGORIES, label: 'Categories', icon: Tag },
  { to: ROUTES.GALLERY, label: 'Gallery', icon: Images },
  { to: ROUTES.BOOKINGS, label: 'Bookings', icon: CalendarDays },
]

const NAV_INSIGHTS = [
  { to: ROUTES.ANALYTICS, label: 'Analytics', icon: BarChart3 },
  { to: ROUTES.MARKETING, label: 'Marketing', icon: Megaphone },
  { to: ROUTES.QR, label: 'QR Codes', icon: QrCode },
  { to: ROUTES.THEMES, label: 'Themes', icon: Palette },
]

const NAV_CONFIG = [
  { to: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
]

function NavItem({
  to,
  label,
  icon: Icon,
  end,
}: {
  to: string
  label: string
  icon: React.ElementType
  end?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all
        ${
          isActive
            ? 'bg-secondary-fixed text-on-secondary-fixed border-l-2 border-secondary rounded-l-none -ml-px pl-[15px]'
            : 'text-on-surface-variant hover:bg-surface-container-high'
        }`
      }
    >
      <Icon size={18} aria-hidden="true" />
      <span>{label}</span>
    </NavLink>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-4 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-outline">
      {label}
    </div>
  )
}

interface SidebarProps {
  mobile?: boolean
}

export function Sidebar({ mobile }: SidebarProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const business = useAppSelector((s) => s.business.business)
  const user = useAppSelector((s) => s.auth.user)

  const handleSignOut = async () => {
    await dispatch(signOut())
    navigate('/login')
  }

  const close = () => dispatch(setSidebarOpen(false))

  return (
    <aside className="w-[260px] h-full bg-surface border-r border-outline-variant flex flex-col py-6">
      {/* Brand header */}
      <div className="px-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-on-primary font-bold text-sm tracking-tight">BS</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-primary truncate tracking-tight">BrandShelf</h1>
            <p className="text-[11px] text-on-surface-variant">Business Dashboard</p>
          </div>
        </div>
        {mobile && (
          <button
            onClick={close}
            aria-label="Close navigation"
            className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Active business card */}
      {business && (
        <div className="mx-3 mb-4 px-3 py-2.5 bg-surface-container rounded-lg">
          <div className="flex items-center gap-2.5">
            <Avatar name={business.name} size="sm" src={business.logo_url} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-primary truncate">{business.name}</p>
              <p className="text-[10px] text-on-surface-variant truncate">{business.type}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto thin-scrollbar px-3 space-y-0.5" aria-label="Main navigation">
        {NAV_MAIN.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <SectionLabel label="Insights" />
        {NAV_INSIGHTS.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <SectionLabel label="Settings" />
        {NAV_CONFIG.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* User footer */}
      <div className="mt-auto px-3 pt-4 border-t border-outline-variant">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar name={user?.email} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-on-surface truncate">{user?.email}</p>
            <p className="text-[10px] text-on-surface-variant">Account</p>
          </div>
          <button
            onClick={handleSignOut}
            aria-label="Sign out"
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-error transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
