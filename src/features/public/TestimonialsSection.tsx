import { useEffect, useRef, useState } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Testimonial } from '../../types'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

const AUTO_ADVANCE_MS = 3000

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [index, setIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])

  const canSwipe = testimonials.length > 1

  useEffect(() => {
    const container = containerRef.current
    const card = cardRefs.current[index]
    if (!container || !card) return
    const targetLeft = container.scrollLeft + (card.getBoundingClientRect().left - container.getBoundingClientRect().left)
    container.scrollTo({ left: targetLeft, behavior: 'smooth' })
  }, [index])

  useEffect(() => {
    if (!canSwipe) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [index, canSwipe, testimonials.length])

  if (testimonials.length === 0) return null

  const goPrev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
  const goNext = () => setIndex((i) => (i + 1) % testimonials.length)

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

        <div className="relative">
          <div ref={containerRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2">
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                ref={(el) => { cardRefs.current[i] = el }}
                className="flex-shrink-0 snap-start w-full lg:w-[calc((100%-1.5rem)/2)] bg-(--color-surface-container-low) rounded-2xl p-8 border border-(--color-outline-variant) flex flex-col gap-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Star
                        key={star}
                        size={16}
                        className={star < t.rating ? 'fill-(--color-brand) text-(--color-brand)' : 'text-(--color-outline-variant)'}
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

          {canSwipe && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous testimonial"
                className="absolute top-1/2 -translate-y-1/2 left-2 md:-left-5 w-10 h-10 rounded-full bg-white border border-(--color-outline-variant) shadow-md flex items-center justify-center text-(--color-on-surface) hover:bg-(--color-surface-container-low) transition-colors z-10"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next testimonial"
                className="absolute top-1/2 -translate-y-1/2 right-2 md:-right-5 w-10 h-10 rounded-full bg-white border border-(--color-outline-variant) shadow-md flex items-center justify-center text-(--color-on-surface) hover:bg-(--color-surface-container-low) transition-colors z-10"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
