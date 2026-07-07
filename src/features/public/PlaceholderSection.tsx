import { Clock } from 'lucide-react'

interface PlaceholderSectionProps {
  title: string
  description: string
}

export function PlaceholderSection({ title, description }: PlaceholderSectionProps) {
  return (
    <section className="bg-white py-12 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-(--color-surface-container-low) border border-(--color-outline-variant) rounded-2xl p-10 md:p-14 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-(--color-outline-variant) flex items-center justify-center mx-auto mb-5">
            <Clock size={24} className="text-(--color-on-surface-variant)" />
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-2xl font-bold text-(--color-on-surface) mb-2">{title}</h2>
          <p className="text-(--color-outline) text-sm max-w-xs mx-auto mb-5">{description}</p>
          <span className="inline-flex items-center gap-2 bg-(--color-brand) text-white text-xs font-bold px-5 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Coming Soon
          </span>
        </div>
      </div>
    </section>
  )
}
