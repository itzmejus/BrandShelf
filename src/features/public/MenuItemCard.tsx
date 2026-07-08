import { Package } from 'lucide-react'
import type { CatalogueItem } from '../../types'

interface MenuItemCardProps {
  item: CatalogueItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-(--color-outline-variant) hover:shadow-md transition-shadow duration-200 flex flex-row sm:flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-(--color-secondary-fixed)/40 w-28 sm:w-full aspect-square sm:aspect-[4/3] flex-shrink-0">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={28} className="text-(--color-secondary)/40" />
          </div>
        )}

        {!item.available && (
          <span className="absolute top-2 left-2 bg-white/90 text-(--color-outline) text-[10px] font-bold px-2 py-0.5 rounded-full border border-(--color-outline-variant)">
            Unavailable
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col gap-1 sm:gap-1.5 flex-1 min-w-0">
        <h3 className="font-['Hanken_Grotesk'] text-base font-bold text-(--color-on-surface) leading-snug line-clamp-1">
          {item.title}
        </h3>

        {item.category && (
          <span className="text-xs font-semibold text-(--color-brand)">{item.category.name}</span>
        )}

        {item.description && (
          <p className="text-xs text-(--color-outline) leading-relaxed line-clamp-2 mt-0.5">
            {item.description}
          </p>
        )}

        {/* Price */}
        <div className="mt-auto pt-2 sm:pt-3">
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
