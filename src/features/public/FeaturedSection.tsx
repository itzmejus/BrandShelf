import { Star } from 'lucide-react'
import type { CatalogueItem } from '../../types'
import { ItemCard } from './ItemCard'

interface FeaturedSectionProps {
  items: CatalogueItem[]
}

export function FeaturedSection({ items }: FeaturedSectionProps) {
  const featured = items.filter((i) => i.featured && i.available)
  if (featured.length === 0) return null

  return (
    <section className="bg-white py-16 md:py-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <span className="flex items-center gap-1.5 text-xs font-bold text-(--color-on-surface-variant) uppercase tracking-widest mb-3">
            <Star size={11} className="fill-(--color-brand) text-(--color-brand)" />
            Staff Picks
          </span>
          <h2 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-bold text-(--color-on-surface) leading-tight">
            Featured Items
          </h2>
          <p className="text-(--color-outline) text-base mt-3 max-w-md">
            Handpicked products and services — the best of what we offer
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {featured.slice(0, 8).map((item) => (
            <ItemCard key={item.id} item={item} featured />
          ))}
        </div>
      </div>
    </section>
  )
}
