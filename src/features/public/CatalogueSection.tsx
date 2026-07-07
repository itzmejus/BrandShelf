import { useEffect, useRef } from 'react'
import { Package } from 'lucide-react'
import type { Category, CatalogueItem } from '../../types'
import { ItemCard } from './ItemCard'

interface CatalogueSectionProps {
  categories: Category[]
  items: CatalogueItem[]
  catalogueLabel: string
  onCategoryVisible: (id: string) => void
}

function ItemsDisplay({ items }: { items: CatalogueItem[] }) {
  const hasAnyImage = items.some((i) => i.image_url)

  if (!hasAnyImage) {
    // Quick bullet list — cleaner than empty photo cards for service businesses
    return (
      <ul className="divide-y divide-(--color-outline-variant) bg-white rounded-2xl border border-(--color-outline-variant) overflow-hidden">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-(--color-on-surface) truncate">{item.title}</p>
              {item.description && (
                <p className="text-xs text-(--color-outline) truncate mt-0.5">{item.description}</p>
              )}
            </div>
            <span className="text-sm font-bold text-(--color-brand) flex-shrink-0">
              {item.price != null ? `$${item.price.toFixed(2)}` : 'Get Quote'}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} featured={item.featured} />
      ))}
    </div>
  )
}

export function CatalogueSection({ categories, items, catalogueLabel, onCategoryVisible }: CatalogueSectionProps) {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onCategoryVisible(entry.target.id.replace('section-', ''))
          }
        }
      },
      { rootMargin: '-25% 0px -65% 0px' },
    )
    const sections = document.querySelectorAll('[data-catalogue-section]')
    sections.forEach((s) => observerRef.current?.observe(s))
    return () => observerRef.current?.disconnect()
  }, [categories, onCategoryVisible])

  const uncategorized = items.filter((i) => !i.category_id)

  if (items.length === 0) {
    return (
      <section id="catalogue" className="bg-(--color-surface-container-low) py-20 px-4 md:px-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-white border border-(--color-outline-variant) flex items-center justify-center mx-auto mb-5">
            <Package size={32} className="text-(--color-outline-variant)" />
          </div>
          <h3 className="font-['Hanken_Grotesk'] text-2xl font-bold text-(--color-on-surface) mb-2">
            {catalogueLabel} coming soon
          </h3>
          <p className="text-(--color-outline) text-sm">Check back soon — we're setting things up.</p>
        </div>
      </section>
    )
  }

  const SectionHeading = ({ name, sub }: { name: string; sub?: string }) => (
    <div className="mb-8">
      <span className="text-xs font-bold text-(--color-on-surface-variant) uppercase tracking-widest mb-2 block">Category</span>
      <h2 className="font-['Hanken_Grotesk'] text-2xl md:text-3xl font-bold text-(--color-on-surface)">{name}</h2>
      {sub && <p className="text-(--color-outline) text-sm mt-1">{sub}</p>}
    </div>
  )

  return (
    <section id="catalogue" className="bg-white py-16 md:py-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Page heading */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-(--color-on-surface-variant) uppercase tracking-widest mb-3 block">
            Our Offerings
          </span>
          <h2 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-bold text-(--color-on-surface)">
            {categories.length === 0 ? `All ${catalogueLabel}` : `Browse Our ${catalogueLabel}`}
          </h2>
        </div>

        {categories.length === 0 ? (
          <ItemsDisplay items={items} />
        ) : (
          /* Grouped by category */
          <div className="space-y-16">
            {categories.map((cat) => {
              const catItems = items.filter((i) => i.category_id === cat.id)
              if (catItems.length === 0) return null
              return (
                <div
                  key={cat.id}
                  id={`section-${cat.id}`}
                  data-catalogue-section
                  className="scroll-mt-44"
                >
                  <SectionHeading name={cat.name} sub={`${catItems.length} item${catItems.length !== 1 ? 's' : ''}`} />
                  <ItemsDisplay items={catItems} />
                </div>
              )
            })}

            {uncategorized.length > 0 && (
              <div id="section-other" data-catalogue-section className="scroll-mt-44">
                <SectionHeading name="Other" />
                <ItemsDisplay items={uncategorized} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
