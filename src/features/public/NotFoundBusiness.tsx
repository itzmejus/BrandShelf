import { Link } from 'react-router-dom'
import { Leaf } from './LeafDecor'

interface NotFoundBusinessProps {
  slug: string
}

export function NotFoundBusiness({ slug }: NotFoundBusinessProps) {
  return (
    <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Leaf decorations */}
      <div className="absolute top-0 left-0 pointer-events-none select-none">
        <Leaf size={100} rotate={-15} color="#1d5c3a" opacity={0.08} />
      </div>
      <div className="absolute bottom-0 right-0 pointer-events-none select-none">
        <Leaf size={80} rotate={160} color="#8ab04b" opacity={0.1} />
      </div>

      <div className="text-center max-w-sm relative z-10">
        <div className="w-24 h-24 rounded-3xl bg-[#1d5c3a]/10 border border-[#1d5c3a]/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl" aria-hidden="true">🔍</span>
        </div>
        <h1 className="font-['Hanken_Grotesk'] text-3xl font-bold text-[#1a1f2e] mb-3">
          Business not found.
        </h1>
        <p className="text-[#888] text-sm mb-2 leading-relaxed">
          The business you're looking for may have been removed or the link is incorrect.
        </p>
        <p className="font-medium text-[#1d5c3a] text-sm mb-8 bg-[#edf7e6] px-4 py-2 rounded-full inline-block border border-[#c8e6b0]">
          brandshelf.com/{slug}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#1d5c3a] hover:bg-[#174d31] text-white px-8 py-3 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
