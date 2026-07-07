import type { OpeningHours } from '../../../types'

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const DEFAULT_HOURS: OpeningHours[] = DAYS.map((day) => ({
  day,
  open: '09:00',
  close: '18:00',
  closed: day === 'Sunday',
}))

interface OpeningHoursEditorProps {
  hours: OpeningHours[]
  onChange: (index: number, field: keyof OpeningHours, value: string | boolean) => void
}

export function OpeningHoursEditor({ hours, onChange }: OpeningHoursEditorProps) {
  return (
    <div className="space-y-3">
      {hours.map((h, i) => (
        <div key={h.day} className="flex flex-col sm:grid sm:grid-cols-[100px_1fr_1fr_80px] sm:items-center gap-2 sm:gap-3 pb-3 sm:pb-0 border-b sm:border-0 border-outline-variant last:border-0">
          <div className="flex items-center justify-between sm:contents">
            <span className="text-sm font-medium text-on-surface">{h.day}</span>
            <label className="flex items-center gap-2 cursor-pointer sm:hidden">
              <input
                type="checkbox"
                checked={h.closed}
                onChange={(e) => onChange(i, 'closed', e.target.checked)}
                className="rounded border-outline-variant accent-secondary"
              />
              <span className="text-xs text-on-surface-variant">Closed</span>
            </label>
          </div>
          <div className="flex gap-2 sm:contents">
            <input
              type="time"
              value={h.open}
              disabled={h.closed}
              onChange={(e) => onChange(i, 'open', e.target.value)}
              className="flex-1 sm:flex-none border border-outline-variant rounded-lg px-3 py-1.5 text-sm outline-none focus:border-secondary disabled:opacity-40"
            />
            <input
              type="time"
              value={h.close}
              disabled={h.closed}
              onChange={(e) => onChange(i, 'close', e.target.value)}
              className="flex-1 sm:flex-none border border-outline-variant rounded-lg px-3 py-1.5 text-sm outline-none focus:border-secondary disabled:opacity-40"
            />
          </div>
          <label className="hidden sm:flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={h.closed}
              onChange={(e) => onChange(i, 'closed', e.target.checked)}
              className="rounded border-outline-variant accent-secondary"
            />
            <span className="text-xs text-on-surface-variant">Closed</span>
          </label>
        </div>
      ))}
    </div>
  )
}
