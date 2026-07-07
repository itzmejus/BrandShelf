import { Package, Star } from 'lucide-react'
import type { CatalogueItem } from '../../types'

interface ItemCardProps {
  item: CatalogueItem
  featured?: boolean
}

export function ItemCard({ item, featured }: ItemCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-(--color-outline-variant) hover:shadow-sm transition-shadow duration-200 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-(--color-surface-container-low)" style={{ paddingBottom: '75%' }}>
        <div className="absolute inset-0">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={36} className="text-(--color-outline-variant)" />
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {featured && item.featured && (
            <span className="flex items-center gap-1 bg-(--color-brand) text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              <Star size={9} className="fill-white" />
              Featured
            </span>
          )}
          {!item.available && (
            <span className="bg-white/90 text-(--color-outline) text-[10px] font-bold px-2.5 py-1 rounded-full border border-(--color-outline-variant)">
              Unavailable
            </span>
          )}
        </div>

        {/* Category tag */}
        {item.category && (
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 text-(--color-on-surface-variant) text-[10px] font-bold px-2.5 py-1 rounded-full border border-(--color-outline-variant)">
              {item.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-['Hanken_Grotesk'] text-base font-bold text-(--color-on-surface) leading-snug line-clamp-2">
            {item.title}
          </h3>
          {item.featured && (
            <div className="flex items-center gap-0.5 flex-shrink-0 mt-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={9} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
          )}
        </div>

        {item.description && (
          <p className="text-xs text-(--color-outline) leading-relaxed line-clamp-2">{item.description}</p>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-(--color-outline-variant)">
          {item.price != null ? (
            <span className="font-['Hanken_Grotesk'] text-lg font-bold text-(--color-brand)">
              ${item.price.toFixed(2)}
            </span>
          ) : (
            <span className="text-sm text-(--color-outline)">Price on request</span>
          )}
        </div>
      </div>
    </div>
  )
}
