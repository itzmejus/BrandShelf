import { Phone, MessageCircle, Navigation } from 'lucide-react'
import type { Business } from '../../types'
import { formatPhone } from '../../utils/business.utils'

interface StickyBottomBarProps {
  business: Business
}

export function StickyBottomBar({ business }: StickyBottomBarProps) {
  const hasActions = business.phone || business.whatsapp || business.address
  if (!hasActions) return null

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0f3d25] border-t border-white/10 px-3 py-3">
      <div className="flex gap-2">
        {business.phone && (
          <a
            href={`tel:${formatPhone(business.phone)}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#1d5c3a] hover:bg-[#174d31] text-white py-3 rounded-xl text-xs font-bold active:scale-95 transition-all border border-white/10"
          >
            <Phone size={15} />
            Call
          </a>
        )}
        {business.whatsapp && (
          <a
            href={`https://wa.me/${formatPhone(business.whatsapp)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#8ab04b] hover:bg-[#7da040] text-white py-3 rounded-xl text-xs font-bold active:scale-95 transition-all"
          >
            <MessageCircle size={15} />
            WhatsApp
          </a>
        )}
        {business.address && (
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl text-xs font-bold active:scale-95 transition-all border border-white/10"
          >
            <Navigation size={15} />
            Directions
          </a>
        )}
      </div>
    </div>
  )
}
