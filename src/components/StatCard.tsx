import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  trend?: string
  trendUp?: boolean
}

export function StatCard({ icon: Icon, label, value, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 rounded-lg bg-surface-container text-primary">
          <Icon size={18} />
        </div>
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              trendUp
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-error bg-error-container/30'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="text-[11px] font-medium text-on-surface-variant">{label}</p>
      <p className="text-xl font-semibold text-primary mt-1">{value}</p>
    </div>
  )
}
