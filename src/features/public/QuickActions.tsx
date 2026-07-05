import { Phone, Navigation, Share2, Mail } from 'lucide-react'
import type { Business } from '../../types'
import { formatPhone } from '../../utils/business.utils'
import { WhatsAppIcon } from './WhatsAppIcon'

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
      icon: WhatsAppIcon,
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
    <section className="bg-(--color-surface-container-low) border-y border-(--color-outline-variant) py-8 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {actions.map((action) => {
            const card = (
              <div className="bg-white rounded-xl border border-(--color-outline-variant) p-3 sm:p-4 flex flex-col items-center gap-2 text-center hover:border-(--color-brand) hover:shadow-sm transition-all duration-200 cursor-pointer group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-(--color-surface-container-low) flex items-center justify-center group-hover:bg-(--color-brand) transition-colors">
                  <action.icon size={16} className="text-(--color-on-surface-variant) group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-(--color-on-surface)">{action.label}</p>
                  <p className="text-[10px] text-(--color-outline) truncate w-full mt-0.5">{action.sub}</p>
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
