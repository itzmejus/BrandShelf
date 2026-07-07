interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-surface-container-high rounded-lg ${className}`}
    />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white p-5 rounded-xl border border-outline-variant">
      <div className="flex justify-between items-start mb-3">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <Skeleton className="w-10 h-4 rounded-full" />
      </div>
      <Skeleton className="w-20 h-3 mb-2" />
      <Skeleton className="w-16 h-6" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 7 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-outline-variant last:border-0">
      <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-40 h-3" />
        <Skeleton className="w-24 h-2.5" />
      </div>
      {cols > 2 && <Skeleton className="hidden lg:block w-20 h-5 rounded-full" />}
      {cols > 3 && <Skeleton className="hidden lg:block w-16 h-3" />}
      {cols > 4 && <Skeleton className="hidden lg:block w-10 h-5 rounded-full" />}
      {cols > 5 && <Skeleton className="hidden lg:block w-5 h-5 rounded-full mx-auto" />}
      {cols > 6 && <Skeleton className="hidden lg:block w-16 h-8 rounded-lg ml-auto" />}
    </div>
  )
}

export function CategoryRowSkeleton() {
  return (
    <div className="grid grid-cols-[40px_1fr_100px_120px] items-center px-6 py-4 border-b border-outline-variant last:border-0">
      <Skeleton className="w-4 h-4" />
      <div className="space-y-1.5">
        <Skeleton className="w-28 h-3" />
        <Skeleton className="w-20 h-2.5" />
      </div>
      <Skeleton className="w-6 h-3" />
      <div className="flex justify-end gap-1">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
    </div>
  )
}

export function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-outline-variant p-6 space-y-4">
        <Skeleton className="w-40 h-4 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="w-24 h-3" />
              <Skeleton className="w-full h-9 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
