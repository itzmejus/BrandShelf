import { Star } from 'lucide-react'
import type { CatalogueItem } from '../../types'
import { ItemCard } from './ItemCard'
import { Leaf } from './LeafDecor'

interface FeaturedSectionProps {
  items: CatalogueItem[]
}

export function FeaturedSection({ items }: FeaturedSectionProps) {
  const featured = items.filter((i) => i.featured && i.available)
  if (featured.length === 0) return null

  return (
    <section className="bg-[#f7f5ef] py-16 md:py-20 px-4 md:px-10 relative overflow-hidden">
      {/* Leaf decorations */}
      <div className="absolute top-0 left-0 pointer-events-none select-none">
        <Leaf size={56} rotate={-15} color="#8ab04b" opacity={0.12} />
      </div>
      <div className="absolute bottom-0 right-8 pointer-events-none select-none">
        <Leaf size={48} rotate={160} color="#1d5c3a" opacity={0.1} />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-px bg-[#8ab04b]" />
            <span className="text-xs font-bold text-[#8ab04b] uppercase tracking-widest flex items-center gap-1">
              <Star size={10} className="fill-[#8ab04b]" />
              Staff Picks
            </span>
            <span className="w-8 h-px bg-[#8ab04b]" />
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-bold text-[#1a1f2e] leading-tight">
            Featured Items
          </h2>
          <p className="text-[#888] text-base mt-3 max-w-md mx-auto">
            Handpicked products and services — the best of what we offer
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {featured.slice(0, 8).map((item) => (
            <ItemCard key={item.id} item={item} featured />
          ))}
        </div>

        {/* Bottom trust bar */}
        <div className="mt-12 bg-[#1d5c3a] rounded-2xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          {[
            { icon: '✓', label: 'Premium Quality' },
            { icon: '⚡', label: 'Fast Service' },
            { icon: '💬', label: 'WhatsApp Support' },
            { icon: '★', label: 'Top Rated' },
          ].map((feat) => (
            <div key={feat.label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white text-base">
                {feat.icon}
              </div>
              <span className="text-white text-sm font-semibold">{feat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
