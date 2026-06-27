import type { OpeningHours } from '../types'

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
