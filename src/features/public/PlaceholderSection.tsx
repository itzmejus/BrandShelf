import { Leaf } from './LeafDecor'

interface PlaceholderSectionProps {
  title: string
  description: string
}

export function PlaceholderSection({ title, description }: PlaceholderSectionProps) {
  return (
    <section className="bg-[#f7f5ef] py-12 px-4 md:px-10 relative overflow-hidden">
      <div className="absolute right-8 top-4 pointer-events-none select-none">
        <Leaf size={36} rotate={25} color="#8ab04b" opacity={0.1} />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-[#e8e3d8] rounded-3xl p-10 md:p-14 flex flex-col items-center text-center relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'radial-gradient(circle, #1d5c3a 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-[#edf7e6] border border-[#c8e6b0] flex items-center justify-center mx-auto mb-5 shadow-sm">
              <span className="text-2xl">🌿</span>
            </div>
            <h2 className="font-['Hanken_Grotesk'] text-2xl font-bold text-[#1a1f2e] mb-2">{title}</h2>
            <p className="text-[#888] text-sm max-w-xs mx-auto mb-5">{description}</p>
            <span className="inline-flex items-center gap-2 bg-[#1d5c3a] text-white text-xs font-bold px-5 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8ab04b] animate-pulse" />
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
