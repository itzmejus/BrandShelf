import { CheckCircle } from 'lucide-react'
import type { Business } from '../../types'

interface AboutSectionProps {
  business: Business
}

export function AboutSection({ business }: AboutSectionProps) {
  if (!business.description) return null

  return (
    <section id="about" className="bg-(--color-surface-container-low) py-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-14 md:gap-20">

          {/* LEFT: Image */}
          <div className="w-full md:w-1/2 relative flex-shrink-0">
            <div className="relative">
              {/* Main image */}
              <div className="rounded-2xl overflow-hidden aspect-[4/5] max-w-sm mx-auto md:mx-0 shadow-sm border border-(--color-outline-variant)">
                {business.cover_url ? (
                  <img
                    src={business.cover_url}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-(--color-surface-container-low) flex items-center justify-center">
                    <span className="font-['Hanken_Grotesk'] text-8xl font-bold text-(--color-outline-variant)">
                      {business.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Floating logo badge */}
              {business.logo_url && (
                <div className="absolute bottom-2 right-2 md:-bottom-5 md:-right-5 w-20 h-20 rounded-2xl bg-white shadow-sm border border-(--color-outline-variant) overflow-hidden">
                  <img src={business.logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Content */}
          <div className="w-full md:w-1/2 flex flex-col gap-5">
            <div>
              <span className="text-xs font-bold text-(--color-on-surface-variant) uppercase tracking-widest mb-3 block">
                About Us
              </span>
              <h2 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-bold text-(--color-on-surface) leading-tight">
                {business.name}
              </h2>
            </div>

            {business.type && (
              <div className="inline-flex items-center gap-2 bg-(--color-brand)/10 text-(--color-brand) text-xs font-bold px-4 py-1.5 rounded-full w-fit">
                <span className="w-2 h-2 rounded-full bg-(--color-brand)" />
                {business.type}
              </div>
            )}

            <p className="text-(--color-on-surface-variant) text-base leading-relaxed">{business.description}</p>

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
                    <div className="w-5 h-5 rounded-full bg-(--color-brand)/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={12} className="text-(--color-brand)" />
                    </div>
                    <span className="text-sm text-(--color-on-surface-variant) font-medium">{feature as string}</span>
                  </div>
                ))}
            </div>

            {/* CTA */}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-(--color-brand) hover:bg-(--color-brand-hover) text-white px-7 py-3 rounded-xl text-sm font-semibold transition-colors w-fit mt-2"
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
