import { Link } from 'react-router-dom'
import { PauseCircle } from 'lucide-react'

interface PausedBusinessProps {
  businessName: string
}

export function PausedBusiness({ businessName }: PausedBusinessProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-24 h-24 rounded-2xl bg-(--color-surface-container-low) border border-(--color-outline-variant) flex items-center justify-center mx-auto mb-6">
          <PauseCircle size={32} className="text-(--color-on-surface-variant)" />
        </div>
        <h1 className="font-['Hanken_Grotesk'] text-3xl font-bold text-(--color-on-surface) mb-3">
          This website is paused.
        </h1>
        <p className="text-(--color-outline) text-sm mb-8 leading-relaxed">
          {businessName}'s website isn't active right now. If you're the owner, contact SiteSelo support to reactivate it.
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
