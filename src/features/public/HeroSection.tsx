import { Phone, Navigation, MapPin, Star } from 'lucide-react'
import type { Business } from '../../types'
import { isBusinessOpen, formatPhone } from '../../utils/business.utils'
import { WhatsAppIcon } from './WhatsAppIcon'

interface HeroSectionProps {
  business: Business
}

export function HeroSection({ business }: HeroSectionProps) {
  const open = isBusinessOpen(business.opening_hours)

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
            {business.phone && (
              <a
                href={`tel:${formatPhone(business.phone)}`}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 bg-(--color-brand) hover:bg-(--color-brand-hover) text-white px-3 md:px-6 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <Phone size={15} />
                <span className="md:hidden">Call</span>
                <span className="hidden md:inline">Call Us</span>
              </a>
            )}
            {business.whatsapp && (
              <a
                href={`https://wa.me/${formatPhone(business.whatsapp)}`}
                target="_blank"
                rel="noopener noreferrer"
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
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 text-(--color-on-surface-variant) hover:text-(--color-on-surface) px-3 md:px-0 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-medium transition-colors whitespace-nowrap"
              >
                <Navigation size={14} />
                <span className="md:hidden">Directions</span>
                <span className="hidden md:inline">Get Directions</span>
              </a>
            )}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center gap-3 mt-6">
          <div className="flex -space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-(--color-surface-container-high) border-2 border-white flex items-center justify-center text-[10px] font-bold text-(--color-on-surface-variant)"
              >
                {['A', 'B', 'C', 'D'][i]}
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-(--color-outline) mt-0.5">Trusted by our clients</p>
          </div>
        </div>
      </div>
    </section>
  )
}
