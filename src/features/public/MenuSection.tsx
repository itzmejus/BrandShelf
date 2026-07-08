import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, LayoutGrid, List, Package, Search } from 'lucide-react'
import type { Category, CatalogueItem } from '../../types'
import { MenuItemCard } from './MenuItemCard'

interface MenuSectionProps {
  categories: Category[]
  items: CatalogueItem[]
  catalogueLabel: string
}

type ViewMode = 'grid' | 'list'

const PAGE_SIZE = 8

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)

  const result: (number | '...')[] = []
  let prev = 0
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push('...')
    result.push(p)
    prev = p
  }
  return result
}

export function MenuSection({ categories, items, catalogueLabel }: MenuSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [page, setPage] = useState(1)

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    const result = items.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        (item.description?.toLowerCase().includes(query) ?? false)
      return matchesCategory && matchesQuery
    })

    return [...result].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      return a.sort_order - b.sort_order
    })
  }, [items, searchQuery, selectedCategory])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedCategory])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  if (items.length === 0) return null

  const itemNounLower = catalogueLabel.toLowerCase()

  return (
    <section id="catalogue" className="bg-white py-16 md:py-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative rounded-3xl bg-(--color-secondary-fixed)/30 py-12 px-4 mb-10 text-center overflow-hidden">
          <span className="text-xs font-bold text-(--color-brand) uppercase tracking-widest mb-3 block">
            Our Offerings
          </span>
          <h2 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-bold text-(--color-on-surface)">
            All {catalogueLabel}
          </h2>
          <p className="text-(--color-outline) text-sm md:text-base mt-3 max-w-md mx-auto">
            Browse our full selection, thoughtfully put together for you.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="relative w-full sm:w-64 flex-shrink-0">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-outline)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${itemNounLower}...`}
              className="w-full bg-(--color-surface-container-low) border border-(--color-outline-variant) rounded-lg pl-9 pr-4 py-2 text-sm text-(--color-on-surface) placeholder:text-(--color-outline) outline-none transition-all focus:border-(--color-secondary) focus:ring-2 focus:ring-(--color-secondary)/20"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 min-w-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-colors flex-shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-(--color-brand) text-white'
                  : 'bg-(--color-surface-container-low) text-(--color-on-surface-variant) hover:bg-(--color-surface-container-high)'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-colors flex-shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-(--color-brand) text-white'
                    : 'bg-(--color-surface-container-low) text-(--color-on-surface-variant) hover:bg-(--color-surface-container-high)'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1 border border-(--color-outline-variant) rounded-lg p-1 bg-white flex-shrink-0 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
              className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                viewMode === 'grid'
                  ? 'bg-(--color-brand) text-white'
                  : 'text-(--color-outline) hover:bg-(--color-surface-container-low)'
              }`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                viewMode === 'list'
                  ? 'bg-(--color-brand) text-white'
                  : 'text-(--color-outline) hover:bg-(--color-surface-container-low)'
              }`}
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* Items */}
        {pageItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-(--color-surface-container-low) flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-(--color-outline-variant)" />
            </div>
            <p className="text-(--color-on-surface) font-semibold mb-1">No items found</p>
            <p className="text-(--color-outline) text-sm">Try a different search term or category.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {pageItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-(--color-outline-variant) border border-(--color-outline-variant) rounded-2xl overflow-hidden bg-white">
            {pageItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-(--color-secondary-fixed)/40 flex-shrink-0 flex items-center justify-center">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={22} className="text-(--color-secondary)/40" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-['Hanken_Grotesk'] font-bold text-(--color-on-surface) truncate">
                    {item.title}
                  </h3>
                  {item.category && (
                    <span className="text-xs font-semibold text-(--color-brand)">{item.category.name}</span>
                  )}
                  {item.description && (
                    <p className="text-xs text-(--color-outline) truncate mt-0.5">{item.description}</p>
                  )}
                </div>
                <span className="font-['Hanken_Grotesk'] font-bold text-(--color-brand) flex-shrink-0">
                  {item.price != null ? `$${item.price.toFixed(2)}` : 'Get Quote'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-(--color-outline-variant) text-sm font-semibold text-(--color-on-surface-variant) hover:bg-(--color-surface-container-low) disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft size={14} /> Prev
            </button>

            {pageNumbers.map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="px-1 text-(--color-outline)">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                    p === currentPage
                      ? 'bg-(--color-brand) text-white'
                      : 'text-(--color-on-surface-variant) hover:bg-(--color-surface-container-low)'
                  }`}
                >
                  {p}
                </button>
              ),
            )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-(--color-outline-variant) text-sm font-semibold text-(--color-on-surface-variant) hover:bg-(--color-surface-container-low) disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
