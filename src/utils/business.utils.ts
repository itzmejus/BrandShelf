import type { OpeningHours } from '../types'
import { TRIAL_PERIOD_DAYS } from './constants'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function isBusinessOpen(hours: OpeningHours[] | null): boolean {
  if (!hours || hours.length === 0) return false

  const now = new Date()
  const today = DAY_NAMES[now.getDay()]
  const todayHours = hours.find((h) => h.day === today)

  if (!todayHours || todayHours.closed) return false

  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  return currentTime >= todayHours.open && currentTime <= todayHours.close
}

export function getTodayHours(hours: OpeningHours[] | null): OpeningHours | null {
  if (!hours) return null
  const today = DAY_NAMES[new Date().getDay()]
  return hours.find((h) => h.day === today) ?? null
}

export function formatPhone(phone: string): string {
  return phone.replace(/\s+/g, '')
}

// Mirrors the `created_at > now() - interval '7 days'` check in
// business_is_live() (supabase/trial_period_migration.sql) — the actual
// gate is enforced server-side; this is just for dashboard messaging.
export function getTrialDaysRemaining(createdAt: string): number {
  const trialEnd = new Date(createdAt).getTime() + TRIAL_PERIOD_DAYS * 24 * 60 * 60 * 1000
  const msRemaining = trialEnd - Date.now()
  return Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)))
}

export function isInTrial(createdAt: string): boolean {
  return getTrialDaysRemaining(createdAt) > 0
}

export function formatRelativeTime(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const diffSec = Math.max(0, Math.round(diffMs / 1000))

  if (diffSec < 60) return 'just now'
  const diffMin = Math.round(diffSec / 60)
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`
  const diffHour = Math.round(diffMin / 60)
  if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`
  const diffDay = Math.round(diffHour / 24)
  if (diffDay < 30) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`
  const diffMonth = Math.round(diffDay / 30)
  return `${diffMonth} month${diffMonth !== 1 ? 's' : ''} ago`
}
