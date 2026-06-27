import { Phone, MessageCircle, Navigation, MapPin, Star } from 'lucide-react'
import type { Business } from '../../types'
import { isBusinessOpen, formatPhone } from '../../utils/business.utils'
import { Leaf } from './LeafDecor'

interface HeroSectionProps {
  business: Business
}

export function HeroSection({ business }: HeroSectionProps) {
  const open = isBusinessOpen(business.opening_hours)

  return (
    <section className="relative bg-[#f7f5ef] overflow-x-hidden">
      {/* Decorative leaves — top left */}
      <div className="absolute top-0 left-0 hidden md:block pointer-events-none select-none">
        <Leaf size={80} rotate={-20} color="#1d5c3a" opacity={0.12} />
      </div>
      <div className="absolute top-8 left-16 hidden md:block pointer-events-none select-none">
        <Leaf size={48} rotate={40} color="#8ab04b" opacity={0.14} />
      </div>
      <div className="absolute top-2 left-28 hidden lg:block pointer-events-none select-none">
        <Leaf size={32} rotate={-70} color="#1d5c3a" opacity={0.1} />
      </div>

      {/* Decorative leaves — top right */}
      <div className="absolute top-0 right-0 hidden md:block pointer-events-none select-none">
        <Leaf size={90} rotate={30} color="#1d5c3a" opacity={0.1} />
      </div>
      <div className="absolute top-12 right-20 hidden md:block pointer-events-none select-none">
        <Leaf size={50} rotate={-40} color="#8ab04b" opacity={0.13} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">

          {/* LEFT: Text content */}
          <div className="flex-1 flex flex-col gap-5 relative z-10">
            {/* Business type label */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8ab04b] uppercase tracking-widest">
                <span className="w-5 h-px bg-[#8ab04b]" />
                {business.type}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${
                  open
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {open ? '● Open Now' : '● Closed'}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-['Hanken_Grotesk'] text-3xl md:text-5xl lg:text-6xl font-bold text-[#1a1f2e] leading-tight tracking-tight">
              {business.name}
            </h1>

            {/* Description */}
            {business.description && (
              <p className="text-[#666] text-base md:text-lg leading-relaxed max-w-lg">
                {business.description}
              </p>
            )}

            {/* Address */}
            {business.address && (
              <div className="flex items-center gap-2 text-sm text-[#888]">
                <MapPin size={14} className="text-[#1d5c3a]" />
                {business.address}
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mt-2">
              {business.phone && (
                <a
                  href={`tel:${formatPhone(business.phone)}`}
                  className="flex items-center gap-2 bg-[#1d5c3a] hover:bg-[#174d31] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <Phone size={15} />
                  Call Us
                </a>
              )}
              {business.whatsapp && (
                <a
                  href={`https://wa.me/${formatPhone(business.whatsapp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white hover:bg-[#f0ece4] text-[#1d5c3a] border-2 border-[#1d5c3a] px-6 py-3 rounded-full text-sm font-semibold transition-all active:scale-95"
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
                  className="flex items-center gap-2 text-[#666] hover:text-[#1d5c3a] text-sm font-medium transition-colors"
                >
                  <Navigation size={14} />
                  Get Directions
                </a>
              )}
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-3 mt-1">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-[#d4e8c2] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#1d5c3a]"
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
                <p className="text-xs text-[#888] mt-0.5">Trusted by our clients</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Cover image */}
          <div className="flex-1 flex justify-center items-center relative">
            {/* Decorative circle bg */}
            <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-[#d4e8c2] opacity-30" />
            <div className="absolute w-56 h-56 md:w-80 md:h-80 rounded-full bg-[#8ab04b] opacity-10" />

            {/* Image */}
            <div className="relative z-10 w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
              {business.cover_url ? (
                <img
                  src={business.cover_url}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#d4e8c2] to-[#8ab04b] flex flex-col items-center justify-center gap-3">
                  {business.logo_url ? (
                    <img src={business.logo_url} alt={business.name} className="w-32 h-32 object-contain" />
                  ) : (
                    <span className="font-['Hanken_Grotesk'] text-7xl font-bold text-white opacity-60">
                      {business.name.charAt(0)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Logo badge overlay */}
            {business.logo_url && business.cover_url && (
              <div className="absolute -bottom-4 -left-4 z-20 w-16 h-16 rounded-2xl bg-white shadow-lg border border-[#e8e3d8] overflow-hidden">
                <img src={business.logo_url} alt="Logo" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Floating leaves near image */}
            <div className="absolute -top-6 -right-4 pointer-events-none select-none">
              <Leaf size={56} rotate={30} color="#8ab04b" opacity={0.35} />
            </div>
            <div className="absolute -bottom-6 -left-6 pointer-events-none select-none">
              <Leaf size={44} rotate={-25} color="#1d5c3a" opacity={0.25} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
