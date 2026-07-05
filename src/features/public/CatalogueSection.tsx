import { useEffect, useRef } from 'react'
import { Package } from 'lucide-react'
import type { Category, CatalogueItem } from '../../types'
import { ItemCard } from './ItemCard'

interface CatalogueSectionProps {
  categories: Category[]
  items: CatalogueItem[]
  onCategoryVisible: (id: string) => void
}

export function CatalogueSection({ categories, items, onCategoryVisible }: CatalogueSectionProps) {
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
            Catalogue coming soon
          </h3>
          <p className="text-(--color-outline) text-sm">Products and services will appear here. Check back soon.</p>
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
            {categories.length === 0 ? 'All Items' : 'Browse by Category'}
          </h2>
        </div>

        {categories.length === 0 ? (
          /* Flat grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} featured={item.featured} />
            ))}
          </div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {catItems.map((item) => (
                      <ItemCard key={item.id} item={item} featured={item.featured} />
                    ))}
                  </div>
                </div>
              )
            })}

            {uncategorized.length > 0 && (
              <div id="section-other" data-catalogue-section className="scroll-mt-44">
                <SectionHeading name="Other Items" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {uncategorized.map((item) => (
                    <ItemCard key={item.id} item={item} featured={item.featured} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
