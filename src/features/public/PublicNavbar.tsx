import { useState } from 'react'
import { Share2, Menu, X, Phone, MessageCircle } from 'lucide-react'
import type { Business } from '../../types'
import { formatPhone } from '../../utils/business.utils'

interface PublicNavbarProps {
  businessName?: string
  business?: Business
}

export function PublicNavbar({ businessName, business }: PublicNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: businessName, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-[#1d5c3a] text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            {business?.phone && (
              <a href={`tel:${formatPhone(business.phone)}`} className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                <Phone size={11} />
                {business.phone}
              </a>
            )}
            {business?.address && (
              <span className="hidden sm:block opacity-70 truncate max-w-[240px]">
                📍 {business.address}
              </span>
            )}
          </div>
          <div className="hidden md:flex items-center gap-4 opacity-80 text-xs">
            {business?.whatsapp && (
              <a
                href={`https://wa.me/${formatPhone(business.whatsapp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:opacity-100 transition-opacity"
              >
                <MessageCircle size={11} />
                WhatsApp
              </a>
            )}
            <span>Powered by BrandShelf</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="sticky top-0 w-full bg-white z-50 shadow-sm border-b border-[#e8e3d8]">
        <div className="flex items-center justify-between px-4 md:px-10 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1d5c3a] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {businessName?.charAt(0) ?? 'C'}
              </span>
            </div>
            <span className="font-['Hanken_Grotesk'] text-base font-bold text-[#1d5c3a] leading-tight hidden sm:block">
              {businessName ?? 'BrandShelf'}
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: 'Home', href: '#' },
              { label: 'About', href: '#about' },
              { label: 'Catalogue', href: '#catalogue' },
              { label: 'Gallery', href: '#gallery' },
              { label: 'Contact', href: '#contact' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-[#444] hover:text-[#1d5c3a] transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="hidden md:flex items-center gap-2 bg-[#1d5c3a] hover:bg-[#174d31] text-white px-5 py-2 rounded-full text-sm font-semibold transition-all active:scale-95"
            >
              <Share2 size={14} />
              Share
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 text-[#1d5c3a]"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[#e8e3d8] px-4 py-3 space-y-1">
            {[
              { label: 'Home', href: '#' },
              { label: 'About', href: '#about' },
              { label: 'Catalogue', href: '#catalogue' },
              { label: 'Gallery', href: '#gallery' },
              { label: 'Contact', href: '#contact' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 px-2 text-sm font-medium text-[#444] hover:text-[#1d5c3a] border-b border-[#f0ece4] last:border-0"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </>
  )
}
