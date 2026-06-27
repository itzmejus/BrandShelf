import { Package, Star } from 'lucide-react'
import type { CatalogueItem } from '../../types'

interface ItemCardProps {
  item: CatalogueItem
  featured?: boolean
}

export function ItemCard({ item, featured }: ItemCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#e8e3d8] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-[#f7f5ef]" style={{ paddingBottom: '75%' }}>
        <div className="absolute inset-0">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={36} className="text-[#c8c0b0]" />
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {featured && item.featured && (
            <span className="flex items-center gap-1 bg-[#1d5c3a] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              <Star size={9} className="fill-white" />
              Featured
            </span>
          )}
          {!item.available && (
            <span className="bg-[#f3f0ea] text-[#999] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#e0dbd0]">
              Unavailable
            </span>
          )}
        </div>

        {/* Category tag */}
        {item.category && (
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 text-[#8ab04b] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#d4e8c2]">
              {item.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        {/* Stars (decorative for featured) */}
        {item.featured && (
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
        )}

        <h3 className="font-['Hanken_Grotesk'] text-base font-bold text-[#1a1f2e] leading-snug line-clamp-2">
          {item.title}
        </h3>

        {item.description && (
          <p className="text-xs text-[#888] leading-relaxed line-clamp-2">{item.description}</p>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#f0ece4]">
          {item.price != null ? (
            <span className="font-['Hanken_Grotesk'] text-lg font-bold text-[#1d5c3a]">
              ${item.price.toFixed(2)}
            </span>
          ) : (
            <span className="text-sm text-[#aaa]">Price on request</span>
          )}
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
              item.available
                ? 'bg-[#edf7e6] text-[#1d5c3a]'
                : 'bg-[#f3f0ea] text-[#aaa]'
            }`}
          >
            {item.available ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
    </div>
  )
}
