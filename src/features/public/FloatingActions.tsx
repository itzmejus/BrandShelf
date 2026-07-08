import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import type { Business } from '../../types'
import { formatPhone } from '../../utils/business.utils'
import { analyticsEventService } from '../../services/analyticsEvent.service'
import { WhatsAppIcon } from './WhatsAppIcon'

interface FloatingActionsProps {
  business: Business
}

export function FloatingActions({ business }: FloatingActionsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50 flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
        tabIndex={showScrollTop ? 0 : -1}
        className={`w-11 h-11 rounded-full bg-white border border-(--color-outline-variant) text-(--color-on-surface) shadow-lg grid place-items-center transition-all duration-200 hover:-translate-y-0.5 ${
          showScrollTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <ArrowUp size={18} />
      </button>

      {business.whatsapp && (
        <a
          href={`https://wa.me/${formatPhone(business.whatsapp)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => analyticsEventService.logEvent(business.id, 'whatsapp_click')}
          aria-label="Chat with us on WhatsApp"
          className="w-[52px] h-[52px] rounded-full bg-[#25D366] text-white shadow-lg grid place-items-center transition-transform duration-200 hover:-translate-y-0.5"
        >
          <WhatsAppIcon size={26} />
        </a>
      )}
    </div>
  )
}
