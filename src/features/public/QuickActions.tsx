import { Phone, MessageCircle, Navigation, Share2, Mail } from 'lucide-react'
import type { Business } from '../../types'
import { formatPhone } from '../../utils/business.utils'

interface QuickActionsProps {
  business: Business
}

export function QuickActions({ business }: QuickActionsProps) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: business.name, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  const actions = [
    business.phone && {
      icon: Phone,
      label: 'Call Us',
      sub: business.phone,
      href: `tel:${formatPhone(business.phone)}`,
      bg: '#ffffff',
    },
    business.whatsapp && {
      icon: MessageCircle,
      label: 'WhatsApp',
      sub: 'Chat with us',
      href: `https://wa.me/${formatPhone(business.whatsapp)}`,
      bg: '#ffffff',
    },
    business.address && {
      icon: Navigation,
      label: 'Directions',
      sub: 'Get location',
      href: `https://maps.google.com/?q=${encodeURIComponent(business.address)}`,
      bg: '#ffffff',
    },
    {
      icon: Share2,
      label: 'Share',
      sub: 'Tell a friend',
      onClick: handleShare,
      bg: '#ffffff',
    },
    business.email && {
      icon: Mail,
      label: 'Email',
      sub: business.email,
      href: `mailto:${business.email}`,
      bg: '#ffffff',
    },
  ].filter(Boolean) as Array<{
    icon: React.ElementType
    label: string
    sub: string
    bg: string
    href?: string
    onClick?: () => void
  }>

  if (actions.length === 0) return null

  return (
    <section className="bg-[#1d5c3a] py-8 px-4 md:px-10 relative overflow-hidden">
      {/* Subtle leaf decoration */}
      <div className="absolute right-0 top-0 opacity-10 pointer-events-none select-none">
        <svg width="120" height="120" viewBox="0 0 60 80" fill="none">
          <path d="M30 2C12 18 8 48 30 78C52 48 48 18 30 2Z" fill="white" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {actions.map((action) => {
            const card = (
              <div className="bg-white rounded-2xl p-3 sm:p-4 flex flex-col items-center gap-2 text-center hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#f0f8ec] flex items-center justify-center group-hover:bg-[#1d5c3a] transition-colors">
                  <action.icon size={16} className="text-[#1d5c3a] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-[#1a1f2e]">{action.label}</p>
                  <p className="text-[10px] text-[#888] truncate w-full mt-0.5">{action.sub}</p>
                </div>
              </div>
            )

            if (action.href) {
              return (
                <a
                  key={action.label}
                  href={action.href}
                  target={action.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                >
                  {card}
                </a>
              )
            }
            return (
              <button key={action.label} onClick={action.onClick}>
                {card}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
