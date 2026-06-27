function Sk({ className = '' }) {
  return <div className={`animate-pulse bg-[#e8e3d8] rounded-xl ${className}`} />
}

export function PublicPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#f7f5ef]">
      {/* Top bar */}
      <div className="h-9 bg-[#1d5c3a]" />
      {/* Navbar */}
      <div className="h-16 bg-white border-b border-[#e8e3d8]" />

      {/* Hero */}
      <div className="bg-[#f7f5ef] py-16 px-4 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-4">
            <Sk className="w-24 h-4" />
            <Sk className="w-3/4 h-14 rounded-2xl" />
            <Sk className="w-2/3 h-14 rounded-2xl" />
            <Sk className="w-full h-16 rounded-xl" />
            <div className="flex gap-3 mt-4">
              <Sk className="w-28 h-11 rounded-full" />
              <Sk className="w-32 h-11 rounded-full" />
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <Sk className="w-72 h-72 md:w-80 md:h-80 rounded-3xl" />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-[#1d5c3a] py-8 px-4 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white/10 rounded-2xl h-20" />
          ))}
        </div>
      </div>

      {/* Items grid */}
      <div className="bg-[#f7f5ef] py-16 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Sk className="w-56 h-8 mx-auto mb-10 rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="animate-pulse bg-[#e8e3d8] rounded-2xl w-full h-40" />
                <Sk className="h-4 w-3/4" />
                <Sk className="h-3 w-full" />
                <Sk className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
