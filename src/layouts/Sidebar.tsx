import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Info,
  Package2,
  Images,
  Quote,
  Phone,
  Clock,
  CalendarDays,
  Star,
  MessageCircle,
  BarChart3,
  Megaphone,
  QrCode,
  Palette,
  UserCircle,
  LogOut,
  X,
} from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { signOut } from '../store/slices/authSlice'
import { setSidebarOpen } from '../store/slices/uiSlice'
import { Avatar } from '../components'
import { ROUTES } from '../utils/constants'
import { getCatalogueLabel } from '../utils/businessType'

function NavItem({
  to,
  label,
  icon: Icon,
  end,
  onClick,
}: {
  to: string
  label: string
  icon: React.ElementType
  end?: boolean
  onClick?: () => void
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
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

  const catalogueLabel = getCatalogueLabel(business?.type ?? '')

  const navWebsite = [
    { to: ROUTES.BUSINESS_INFO, label: 'Business Info', icon: Building2 },
    { to: ROUTES.ABOUT, label: 'About', icon: Info },
    { to: ROUTES.CATALOGUE, label: catalogueLabel, icon: Package2 },
    { to: ROUTES.GALLERY, label: 'Gallery', icon: Images },
    { to: ROUTES.TESTIMONIALS, label: 'Testimonials', icon: Quote },
    { to: ROUTES.CONTACT, label: 'Contact', icon: Phone },
    { to: ROUTES.WORKING_HOURS, label: 'Working Hours', icon: Clock },
  ]

  const navCustomers = [
    { to: ROUTES.BOOKINGS, label: 'Bookings', icon: CalendarDays },
    { to: ROUTES.REVIEWS, label: 'Reviews', icon: Star },
    { to: ROUTES.MESSAGES, label: 'Messages', icon: MessageCircle },
  ]

  const navGrowth = [
    { to: ROUTES.ANALYTICS, label: 'Analytics', icon: BarChart3 },
    { to: ROUTES.MARKETING, label: 'Marketing', icon: Megaphone },
    { to: ROUTES.QR, label: 'QR Codes', icon: QrCode },
  ]

  const navSettings = [
    { to: ROUTES.THEMES, label: 'Themes', icon: Palette },
    { to: ROUTES.ACCOUNT, label: 'Account', icon: UserCircle },
  ]

  const handleSignOut = async () => {
    await dispatch(signOut())
    navigate('/login')
  }

  const close = () => dispatch(setSidebarOpen(false))

  return (
    <aside className="w-[260px] h-full bg-surface border-r border-outline-variant flex flex-col py-6">
      {/* Brand header */}
      <div className="px-6 mb-6 flex items-center justify-between">
        <NavLink to={ROUTES.DASHBOARD} end className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-on-primary font-bold text-sm tracking-tight">BS</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-primary truncate tracking-tight">SiteSelo</h1>
            <p className="text-[11px] text-on-surface-variant">Business Dashboard</p>
          </div>
        </NavLink>
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
        <NavItem to={ROUTES.DASHBOARD} label="Dashboard" icon={LayoutDashboard} end onClick={mobile ? close : undefined} />

        <SectionLabel label="Website" />
        {navWebsite.map((item) => (
          <NavItem key={item.to} {...item} onClick={mobile ? close : undefined} />
        ))}

        <SectionLabel label="Customers" />
        {navCustomers.map((item) => (
          <NavItem key={item.to} {...item} onClick={mobile ? close : undefined} />
        ))}

        <SectionLabel label="Growth" />
        {navGrowth.map((item) => (
          <NavItem key={item.to} {...item} onClick={mobile ? close : undefined} />
        ))}

        <SectionLabel label="Settings" />
        {navSettings.map((item) => (
          <NavItem key={item.to} {...item} onClick={mobile ? close : undefined} />
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
