import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react'
import { Leaf } from './LeafDecor'

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
      <section id="gallery" className="bg-[#f7f5ef] py-16 md:py-20 px-4 md:px-10 relative overflow-hidden">
        {/* Leaf decorations */}
        <div className="absolute left-4 bottom-8 pointer-events-none select-none">
          <Leaf size={52} rotate={15} color="#1d5c3a" opacity={0.1} />
        </div>
        <div className="absolute right-4 top-8 pointer-events-none select-none">
          <Leaf size={40} rotate={-45} color="#8ab04b" opacity={0.12} />
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-8 h-px bg-[#8ab04b]" />
              <span className="text-xs font-bold text-[#8ab04b] uppercase tracking-widest flex items-center gap-1.5">
                <Images size={11} />
                Our Gallery
              </span>
              <span className="w-8 h-px bg-[#8ab04b]" />
            </div>
            <h2 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-bold text-[#1a1f2e]">
  Our Gallery
            </h2>
          </div>

          {/* Bento-style grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className={`rounded-2xl overflow-hidden bg-[#e8e3d8] group shadow-sm hover:shadow-md transition-shadow ${
                  i === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                style={{ aspectRatio: i === 0 ? '1' : '1' }}
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
