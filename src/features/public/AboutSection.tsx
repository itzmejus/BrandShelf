import { CheckCircle } from 'lucide-react'
import type { Business } from '../../types'
import { Leaf } from './LeafDecor'

interface AboutSectionProps {
  business: Business
}

export function AboutSection({ business }: AboutSectionProps) {
  if (!business.description) return null

  return (
    <section id="about" className="bg-[#f7f5ef] py-20 px-4 md:px-10 relative overflow-hidden">
      {/* Floating leaves */}
      <div className="absolute bottom-8 left-4 pointer-events-none select-none">
        <Leaf size={64} rotate={20} color="#1d5c3a" opacity={0.1} />
      </div>
      <div className="absolute top-8 right-8 pointer-events-none select-none">
        <Leaf size={44} rotate={-30} color="#8ab04b" opacity={0.12} />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-14 md:gap-20">

          {/* LEFT: Image */}
          <div className="w-full md:w-1/2 relative flex-shrink-0">
            <div className="relative">
              {/* Main image */}
              <div className="rounded-3xl overflow-hidden aspect-[4/5] max-w-sm mx-auto md:mx-0 shadow-xl">
                {business.cover_url ? (
                  <img
                    src={business.cover_url}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#d4e8c2] to-[#1d5c3a] flex items-center justify-center">
                    <span className="font-['Hanken_Grotesk'] text-8xl font-bold text-white/40">
                      {business.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Floating logo badge */}
              {business.logo_url && (
                <div className="absolute -bottom-5 -right-5 md:right-0 w-20 h-20 rounded-2xl bg-white shadow-xl border border-[#e8e3d8] overflow-hidden">
                  <img src={business.logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
                </div>
              )}

              {/* Stat badge */}
              <div className="absolute -top-4 -right-4 md:right-4 bg-[#1d5c3a] text-white rounded-2xl px-5 py-4 shadow-xl text-center">
                <p className="font-['Hanken_Grotesk'] text-3xl font-bold leading-none">
                  {business.type?.split(' ')[0] ?? '✓'}
                </p>
                <p className="text-[11px] opacity-80 mt-1 font-medium">Verified</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Content */}
          <div className="w-full md:w-1/2 flex flex-col gap-5">
            <div>
              <span className="flex items-center gap-2 text-xs font-bold text-[#8ab04b] uppercase tracking-widest mb-3">
                <span className="w-6 h-px bg-[#8ab04b]" />
                About Us
              </span>
              <h2 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-bold text-[#1a1f2e] leading-tight">
                {business.name}
              </h2>
            </div>

            {business.type && (
              <div className="inline-flex items-center gap-2 bg-[#edf7e6] text-[#1d5c3a] text-xs font-bold px-4 py-1.5 rounded-full w-fit border border-[#c8e6b0]">
                <span className="w-2 h-2 rounded-full bg-[#8ab04b]" />
                {business.type}
              </div>
            )}

            <p className="text-[#666] text-base leading-relaxed">{business.description}</p>

            {/* Feature bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {[
                business.phone && 'Available by Phone',
                business.whatsapp && 'WhatsApp Support',
                business.email && 'Email Inquiries',
                business.address && 'Physical Location',
              ]
                .filter(Boolean)
                .map((feature) => (
                  <div key={feature as string} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#edf7e6] flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={12} className="text-[#1d5c3a]" />
                    </div>
                    <span className="text-sm text-[#444] font-medium">{feature as string}</span>
                  </div>
                ))}
            </div>

            {/* CTA */}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-[#1d5c3a] hover:bg-[#174d31] text-white px-7 py-3 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 w-fit mt-2"
            >
              Contact Us
              <span className="text-lg leading-none">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
