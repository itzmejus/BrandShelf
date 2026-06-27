import { Clock } from 'lucide-react'

interface ComingSoonPageProps {
  title?: string
}

export function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center mb-6">
        <Clock size={32} className="text-outline" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold text-primary mb-2">{title ?? 'Coming Soon'}</h1>
      <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed">
        This feature is in development and will be available in an upcoming BrandShelf update.
      </p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold bg-surface-container text-on-surface-variant px-4 py-2 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
        In Development
      </span>
    </div>
  )
}
