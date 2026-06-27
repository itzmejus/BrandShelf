import { useEffect, useRef } from 'react'
import { Package } from 'lucide-react'
import type { Category, CatalogueItem } from '../../types'
import { ItemCard } from './ItemCard'
import { Leaf } from './LeafDecor'

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
      <section id="catalogue" className="bg-[#f7f5ef] py-20 px-4 md:px-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-white border border-[#e8e3d8] flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Package size={32} className="text-[#c8c0b0]" />
          </div>
          <h3 className="font-['Hanken_Grotesk'] text-2xl font-bold text-[#1a1f2e] mb-2">
            Catalogue coming soon
          </h3>
          <p className="text-[#888] text-sm">Products and services will appear here. Check back soon.</p>
        </div>
      </section>
    )
  }

  const SectionHeading = ({ name, sub }: { name: string; sub?: string }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-5 h-px bg-[#8ab04b]" />
        <span className="text-xs font-bold text-[#8ab04b] uppercase tracking-widest">Category</span>
      </div>
      <h2 className="font-['Hanken_Grotesk'] text-2xl md:text-3xl font-bold text-[#1a1f2e]">{name}</h2>
      {sub && <p className="text-[#888] text-sm mt-1">{sub}</p>}
    </div>
  )

  return (
    <section id="catalogue" className="bg-white py-16 md:py-20 px-4 md:px-10 relative">
      {/* Background leaves */}
      <div className="absolute right-0 top-20 pointer-events-none select-none opacity-40">
        <Leaf size={80} rotate={30} color="#1d5c3a" opacity={0.07} />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Page heading */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-px bg-[#8ab04b]" />
            <span className="text-xs font-bold text-[#8ab04b] uppercase tracking-widest">
              Our Offerings
            </span>
            <span className="w-8 h-px bg-[#8ab04b]" />
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-bold text-[#1a1f2e]">
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
