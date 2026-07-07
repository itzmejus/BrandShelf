import { useState } from 'react'
import { Share2, Menu, X } from 'lucide-react'

interface PublicNavbarProps {
  businessName?: string
  catalogueLabel?: string
}

export function PublicNavbar({ businessName, catalogueLabel = 'Catalogue' }: PublicNavbarProps) {
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
      {/* Main navbar */}
      <nav className="sticky top-0 w-full bg-white z-50 shadow-sm border-b border-(--color-outline-variant)">
        <div className="flex items-center justify-between px-4 md:px-10 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-(--color-brand) flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {businessName?.charAt(0) ?? 'C'}
              </span>
            </div>
            <span className="font-['Hanken_Grotesk'] text-base font-bold text-(--color-on-surface) leading-tight truncate max-w-[130px] sm:max-w-none">
              {businessName ?? 'BrandShelf'}
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: 'Home', href: '#' },
              { label: 'About', href: '#about' },
              { label: catalogueLabel, href: '#catalogue' },
              { label: 'Gallery', href: '#gallery' },
              { label: 'Contact', href: '#contact' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-(--color-on-surface-variant) hover:text-(--color-brand) transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="hidden md:flex items-center gap-2 bg-(--color-brand) hover:bg-(--color-brand-hover) text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <Share2 size={14} />
              Share
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 text-(--color-on-surface)"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-(--color-outline-variant) px-4 py-3 space-y-1">
            {[
              { label: 'Home', href: '#' },
              { label: 'About', href: '#about' },
              { label: catalogueLabel, href: '#catalogue' },
              { label: 'Gallery', href: '#gallery' },
              { label: 'Contact', href: '#contact' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 px-2 text-sm font-medium text-(--color-on-surface-variant) hover:text-(--color-brand) border-b border-(--color-outline-variant) last:border-0"
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
