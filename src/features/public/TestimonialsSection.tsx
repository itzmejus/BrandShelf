import { Star, Quote } from 'lucide-react'
import type { Testimonial } from '../../types'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null

  return (
    <section id="testimonials" className="bg-white py-16 md:py-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="flex items-center justify-center gap-1.5 text-xs font-bold text-(--color-on-surface-variant) uppercase tracking-widest mb-3">
            <Quote size={11} />
            Testimonials
          </span>
          <h2 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-bold text-(--color-on-surface)">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-(--color-surface-container-low) rounded-2xl p-8 border border-(--color-outline-variant) flex flex-col gap-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < t.rating ? 'fill-(--color-brand) text-(--color-brand)' : 'text-(--color-outline-variant)'}
                    />
                  ))}
                </div>
                <Quote size={28} className="text-(--color-outline-variant)" />
              </div>

              <p className="text-(--color-on-surface) text-base leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>

              <div className="flex items-center gap-3 pt-4 border-t border-(--color-outline-variant)">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt={t.author_name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-(--color-brand)/10 flex items-center justify-center text-(--color-brand) font-bold text-base">
                    {t.author_name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-(--color-on-surface) truncate">{t.author_name}</p>
                  {t.author_role && (
                    <p className="text-xs text-(--color-on-surface-variant) truncate">{t.author_role}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
