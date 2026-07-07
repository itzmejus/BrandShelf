import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react'

interface GallerySectionProps {
  images: string[]
  businessName: string
}

export function GallerySection({ images }: GallerySectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (images.length === 0) return null

  const prev = () =>
    setLightboxIndex((i) => (i != null ? (i - 1 + images.length) % images.length : null))
  const next = () =>
    setLightboxIndex((i) => (i != null ? (i + 1) % images.length : null))

  return (
    <>
      <section id="gallery" className="bg-(--color-surface-container-low) py-16 md:py-20 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <span className="flex items-center justify-center gap-1.5 text-xs font-bold text-(--color-on-surface-variant) uppercase tracking-widest mb-3">
              <Images size={11} />
              Gallery
            </span>
            <h2 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-bold text-(--color-on-surface)">
              Our Gallery
            </h2>
          </div>

          {/* Grid — consistent square tiles, no awkward empty gaps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className={`aspect-square rounded-2xl overflow-hidden bg-(--color-surface-container-low) group border border-(--color-outline-variant) hover:shadow-sm transition-shadow ${
                  images.length >= 5 && i === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <img
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex != null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={20} />
          </button>
          <button
            className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); prev() }}
          >
            <ChevronLeft size={22} />
          </button>
          <img
            src={images[lightboxIndex]}
            alt="Gallery"
            className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); next() }}
          >
            <ChevronRight size={22} />
          </button>
          <div className="absolute bottom-5 flex items-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                className={`w-2 h-2 rounded-full transition-all ${i === lightboxIndex ? 'bg-white scale-125' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
