import { Phone, MessageCircle, Mail, MapPin, ArrowUp } from 'lucide-react'
import type { Business } from '../../types'
import { Leaf } from './LeafDecor'
import { formatPhone } from '../../utils/business.utils'

interface FooterSectionProps {
  business: Business
}

export function FooterSection({ business }: FooterSectionProps) {
  return (
    <footer className="bg-[#0f3d25] text-white relative overflow-hidden">
      {/* Leaf decorations */}
      <div className="absolute bottom-0 left-0 pointer-events-none select-none opacity-20">
        <Leaf size={100} rotate={-10} color="white" opacity={0.3} />
      </div>
      <div className="absolute top-0 right-12 pointer-events-none select-none opacity-10">
        <Leaf size={80} rotate={160} color="#8ab04b" opacity={1} />
      </div>
      <div className="absolute bottom-0 right-0 pointer-events-none select-none opacity-15">
        <Leaf size={64} rotate={120} color="white" opacity={0.4} />
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-14 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[#8ab04b] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-base">{business.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-white leading-tight">
                  {business.name}
                </h3>
                <p className="text-xs text-white/50">{business.type}</p>
              </div>
            </div>
            {business.description && (
              <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-6">
                {business.description.length > 120
                  ? business.description.slice(0, 120) + '…'
                  : business.description}
              </p>
            )}
            <p className="text-xs text-white/40 leading-relaxed">
              Powered by{' '}
              <a href="/" className="text-[#8ab04b] hover:text-[#a0c060] transition-colors font-semibold">
                BrandShelf
              </a>
              <br />
              <span className="text-white/25">Everything Your Customers Need. One Link.</span>
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
                { label: 'Catalogue', href: '#catalogue' },
                { label: 'Gallery', href: '#gallery' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-[#8ab04b] transition-colors flex items-center gap-2"
                  >
                    <span className="w-3 h-px bg-[#8ab04b]/50" />
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
                  <a href={`tel:${formatPhone(business.phone)}`} className="flex items-center gap-2.5 text-sm text-white/60 hover:text-[#8ab04b] transition-colors">
                    <Phone size={13} className="flex-shrink-0 text-[#8ab04b]" />
                    {business.phone}
                  </a>
                </li>
              )}
              {business.whatsapp && (
                <li>
                  <a href={`https://wa.me/${formatPhone(business.whatsapp)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-white/60 hover:text-[#8ab04b] transition-colors">
                    <MessageCircle size={13} className="flex-shrink-0 text-[#8ab04b]" />
                    WhatsApp
                  </a>
                </li>
              )}
              {business.email && (
                <li>
                  <a href={`mailto:${business.email}`} className="flex items-center gap-2.5 text-sm text-white/60 hover:text-[#8ab04b] transition-colors">
                    <Mail size={13} className="flex-shrink-0 text-[#8ab04b]" />
                    {business.email}
                  </a>
                </li>
              )}
              {business.address && (
                <li className="flex items-start gap-2.5 text-sm text-white/60">
                  <MapPin size={13} className="flex-shrink-0 text-[#8ab04b] mt-0.5" />
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
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-xs text-white/50 hover:text-[#8ab04b] transition-colors"
          >
            <ArrowUp size={13} />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  )
}
