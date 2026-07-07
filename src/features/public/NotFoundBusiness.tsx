import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'

interface NotFoundBusinessProps {
  slug: string
}

export function NotFoundBusiness({ slug }: NotFoundBusinessProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-24 h-24 rounded-2xl bg-(--color-surface-container-low) border border-(--color-outline-variant) flex items-center justify-center mx-auto mb-6">
          <SearchX size={32} className="text-(--color-on-surface-variant)" />
        </div>
        <h1 className="font-['Hanken_Grotesk'] text-3xl font-bold text-(--color-on-surface) mb-3">
          Business not found.
        </h1>
        <p className="text-(--color-outline) text-sm mb-2 leading-relaxed">
          The business you're looking for may have been removed or the link is incorrect.
        </p>
        <p className="font-medium text-(--color-on-surface-variant) text-sm mb-8 bg-(--color-surface-container-low) px-4 py-2 rounded-lg inline-block border border-(--color-outline-variant)">
          siteselo.com/{slug}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-(--color-brand) hover:bg-(--color-brand-hover) text-white px-8 py-3 rounded-xl text-sm font-bold transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
