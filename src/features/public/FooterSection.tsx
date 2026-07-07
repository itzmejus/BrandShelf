import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react'
import type { Business } from '../../types'
import { formatPhone } from '../../utils/business.utils'
import { WhatsAppIcon } from './WhatsAppIcon'

interface FooterSectionProps {
  business: Business
  catalogueLabel: string
}

export function FooterSection({ business, catalogueLabel }: FooterSectionProps) {
  return (
    <footer className="bg-(--color-inverse-surface) text-(--color-inverse-on-surface)">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-(--color-brand) flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-base">{business.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-(--color-inverse-on-surface) leading-tight">
                  {business.name}
                </h3>
                <p className="text-xs text-(--color-inverse-on-surface)/50">{business.type}</p>
              </div>
            </div>
            {business.description && (
              <p className="text-(--color-inverse-on-surface)/60 text-sm leading-relaxed max-w-xs mx-auto md:mx-0 mb-6">
                {business.description.length > 120
                  ? business.description.slice(0, 120) + '…'
                  : business.description}
              </p>
            )}
            <p className="text-xs text-(--color-inverse-on-surface)/40 leading-relaxed">
              Powered by{' '}
              <a href="/" className="text-(--color-inverse-on-surface) hover:opacity-80 transition-opacity font-semibold">
                BrandShelf
              </a>
              <br />
              <span className="text-(--color-inverse-on-surface)/25">Everything Your Customers Need. One Link.</span>
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-['Hanken_Grotesk'] text-sm font-bold text-white mb-4 uppercase tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '#' },
                { label: 'About Us', href: '#about' },
                { label: catalogueLabel, href: '#catalogue' },
                { label: 'Gallery', href: '#gallery' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2"
                  >
                    <span className="w-3 h-px bg-white/30" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-['Hanken_Grotesk'] text-sm font-bold text-white mb-4 uppercase tracking-widest">
              Contact Us
            </h4>
            <ul className="space-y-3">
              {business.phone && (
                <li>
                  <a href={`tel:${formatPhone(business.phone)}`} className="flex items-center justify-center md:justify-start gap-2.5 text-sm text-white/60 hover:text-white transition-colors">
                    <Phone size={13} className="flex-shrink-0" />
                    {business.phone}
                  </a>
                </li>
              )}
              {business.whatsapp && (
                <li>
                  <a href={`https://wa.me/${formatPhone(business.whatsapp)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start gap-2.5 text-sm text-white/60 hover:text-white transition-colors">
                    <WhatsAppIcon size={13} className="flex-shrink-0" />
                    WhatsApp
                  </a>
                </li>
              )}
              {business.email && (
                <li>
                  <a href={`mailto:${business.email}`} className="flex items-center justify-center md:justify-start gap-2.5 text-sm text-white/60 hover:text-white transition-colors">
                    <Mail size={13} className="flex-shrink-0" />
                    {business.email}
                  </a>
                </li>
              )}
              {business.address && (
                <li className="flex items-start justify-center md:justify-start gap-2.5 text-sm text-white/60">
                  <MapPin size={13} className="flex-shrink-0 mt-0.5" />
                  {business.address}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {business.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="/privacy" className="text-xs text-white/50 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-xs text-white/50 hover:text-white transition-colors">
              Terms
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"
            >
              <ArrowUp size={13} />
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
