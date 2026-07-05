import { useRef } from 'react'
import type { Category } from '../../types'

interface CategoryTabsProps {
  categories: Category[]
  activeId: string
  onSelect: (id: string) => void
}

export function CategoryTabs({ categories, activeId, onSelect }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (categories.length === 0) return null

  const handleClick = (id: string) => {
    onSelect(id)
    // Scroll tab into view
    const el = document.getElementById(`cat-tab-${id}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    // Scroll to section
    const section = document.getElementById(`section-${id}`)
    if (section) {
      const offset = 120
      const top = section.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-white border-y border-(--color-outline-variant)">
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 md:px-10 py-4 max-w-7xl mx-auto"
      >
        <button
          id="cat-tab-all"
          onClick={() => handleClick('all')}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-colors flex-shrink-0 ${
            activeId === 'all'
              ? 'bg-(--color-brand) text-white'
              : 'bg-(--color-surface-container-low) text-(--color-on-surface-variant) hover:bg-(--color-surface-container-high)'
          }`}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`cat-tab-${cat.id}`}
            onClick={() => handleClick(cat.id)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-colors flex-shrink-0 ${
              activeId === cat.id
                ? 'bg-(--color-brand) text-white'
                : 'bg-(--color-surface-container-low) text-(--color-on-surface-variant) hover:bg-(--color-surface-container-high)'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
