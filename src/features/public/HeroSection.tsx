import { Phone, Navigation, MapPin } from 'lucide-react'
import type { Business, AnalyticsEventType } from '../../types'
import { isBusinessOpen, formatPhone } from '../../utils/business.utils'
import { getHeroCta, getCatalogueLabel, getDefaultTrustBadges } from '../../utils/businessType'
import { analyticsEventService } from '../../services/analyticsEvent.service'
import { WhatsAppIcon } from './WhatsAppIcon'

interface HeroSectionProps {
  business: Business
}

interface PrimaryCta {
  label: string
  href: string
  external?: boolean
  eventType?: AnalyticsEventType
}

function getPrimaryCta(business: Business): PrimaryCta | null {
  const cta = getHeroCta(business.type)

  if (cta === 'menu') {
    return { label: `View ${getCatalogueLabel(business.type)}`, href: '#catalogue' }
  }

  const label = cta === 'booking' ? 'Book Appointment' : cta === 'quote' ? 'Get Quote' : 'Contact Us'
  const eventType: AnalyticsEventType =
    cta === 'booking' || cta === 'quote'
      ? 'booking_click'
      : business.whatsapp
        ? 'whatsapp_click'
        : 'phone_click'

  if (business.whatsapp) {
    return { label, href: `https://wa.me/${formatPhone(business.whatsapp)}`, external: true, eventType }
  }
  if (business.phone) {
    return { label, href: `tel:${formatPhone(business.phone)}`, eventType }
  }
  return null
}

export function HeroSection({ business }: HeroSectionProps) {
  const open = isBusinessOpen(business.opening_hours)
  const primaryCta = getPrimaryCta(business)
  const trustBadges = business.trust_badges?.length ? business.trust_badges : getDefaultTrustBadges(business.type)
  const track = (eventType: AnalyticsEventType) => analyticsEventService.logEvent(business.id, eventType)

  return (
    <section className="relative bg-white overflow-x-hidden">
      {/* Banner image */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-6 md:pt-10">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-(--color-outline-variant) shadow-sm">
          {business.cover_url ? (
            <img
              src={business.cover_url}
              alt={business.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-(--color-surface-container-low) flex items-center justify-center">
              {business.logo_url ? (
                <img src={business.logo_url} alt={business.name} className="w-24 h-24 md:w-32 md:h-32 object-contain" />
              ) : (
                <span className="font-['Hanken_Grotesk'] text-6xl md:text-8xl font-bold text-(--color-outline-variant)">
                  {business.name.charAt(0)}
                </span>
              )}
            </div>
          )}

          {/* Logo badge overlay */}
          {business.logo_url && business.cover_url && (
            <div className="absolute -bottom-4 left-4 md:left-6 z-10 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white shadow-sm border border-(--color-outline-variant) overflow-hidden">
              <img src={business.logo_url} alt="Logo" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Content below banner */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-8 pb-10 md:pt-12 md:pb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex flex-col gap-4">
            {/* Business type label */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-(--color-on-surface-variant) uppercase tracking-widest">
                {business.type}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${
                  open
                    ? 'bg-(--color-brand)/10 text-(--color-brand)'
                    : 'bg-(--color-surface-container-high) text-(--color-outline)'
                }`}
              >
                {open ? '● Open Now' : '● Closed'}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-['Hanken_Grotesk'] text-3xl md:text-5xl lg:text-6xl font-bold text-(--color-on-surface) leading-tight tracking-tight">
              {business.name}
            </h1>

            {/* Tagline */}
            {business.tagline && (
              <p className="text-base md:text-lg text-(--color-on-surface-variant) max-w-xl">{business.tagline}</p>
            )}

            {/* Address */}
            {business.address && (
              <div className="flex items-center gap-2 text-sm text-(--color-outline)">
                <MapPin size={14} className="text-(--color-brand)" />
                {business.address}
              </div>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex gap-2 md:gap-3">
            {primaryCta && (
              <a
                href={primaryCta.href}
                target={primaryCta.external ? '_blank' : undefined}
                rel={primaryCta.external ? 'noopener noreferrer' : undefined}
                onClick={() => primaryCta.eventType && track(primaryCta.eventType)}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 bg-(--color-brand) hover:bg-(--color-brand-hover) text-white px-3 md:px-6 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-semibold transition-colors whitespace-nowrap"
              >
                {primaryCta.href.startsWith('tel:') && <Phone size={15} />}
                {primaryCta.href.startsWith('https://wa.me') && <WhatsAppIcon size={15} />}
                {primaryCta.label}
              </a>
            )}
            {business.phone && primaryCta?.href !== `tel:${formatPhone(business.phone)}` && (
              <a
                href={`tel:${formatPhone(business.phone)}`}
                onClick={() => track('phone_click')}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 bg-white hover:bg-(--color-surface-container-low) text-(--color-brand) border border-(--color-brand) px-3 md:px-6 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <Phone size={15} />
                <span className="md:hidden">Call</span>
                <span className="hidden md:inline">Call Us</span>
              </a>
            )}
            {business.whatsapp && primaryCta?.href !== `https://wa.me/${formatPhone(business.whatsapp)}` && (
              <a
                href={`https://wa.me/${formatPhone(business.whatsapp)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('whatsapp_click')}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 bg-white hover:bg-(--color-surface-container-low) text-(--color-brand) border border-(--color-brand) px-3 md:px-6 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <WhatsAppIcon size={15} />
                WhatsApp
              </a>
            )}
            {business.address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('direction_click')}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 text-(--color-on-surface-variant) hover:text-(--color-on-surface) border border-(--color-outline-variant) hover:border-(--color-brand) bg-white px-3 md:px-6 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-medium transition-colors whitespace-nowrap"
              >
                <Navigation size={14} />
                <span className="md:hidden">Directions</span>
                <span className="hidden md:inline">Get Directions</span>
              </a>
            )}
          </div>
        </div>

        {/* Trust badges — single row on mobile (swipe if needed) rather than wrapping */}
        {trustBadges.length > 0 && (
          <div className="flex items-center gap-2 mt-6 overflow-x-auto no-scrollbar">
            {trustBadges.map((badge) => (
              <span
                key={badge}
                className="flex-shrink-0 inline-flex items-center bg-(--color-surface-container-low) border border-(--color-outline-variant) text-(--color-on-surface-variant) text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
