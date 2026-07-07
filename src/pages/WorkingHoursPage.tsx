import { useEffect, useState } from 'react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { saveBusiness } from '../store/slices/businessSlice'
import { addToast } from '../store/slices/uiSlice'
import { Button, PageHeader } from '../components'
import { OpeningHoursEditor, DEFAULT_HOURS } from '../features/settings/components/OpeningHoursEditor'
import type { OpeningHours } from '../types'

export function WorkingHoursPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const { business, saving } = useAppSelector((s) => s.business)

  const [hours, setHours] = useState<OpeningHours[]>(DEFAULT_HOURS)

  useEffect(() => {
    if (business) {
      setHours((business.opening_hours as OpeningHours[]) ?? DEFAULT_HOURS)
    }
  }, [business])

  const handleHourChange = (index: number, field: keyof OpeningHours, value: string | boolean) => {
    setHours((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)))
  }

  const handleSave = async () => {
    if (!user || !business) return

    const { id, user_id, created_at, updated_at, ...rest } = business
    const formData = { ...rest, opening_hours: hours }

    const result = await dispatch(saveBusiness({ businessId: business.id, userId: user.id, formData }))

    if (saveBusiness.fulfilled.match(result)) {
      dispatch(addToast({ message: 'Working hours saved', type: 'success' }))
    } else {
      dispatch(addToast({ message: 'Failed to save working hours', type: 'error' }))
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Working Hours"
        subtitle="Set your opening hours. Shown to customers on your public website."
        action={
          <Button onClick={handleSave} loading={saving}>
            Save Changes
          </Button>
        }
      />

      <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant">
          <h2 className="text-sm font-semibold text-primary">Opening Hours</h2>
        </div>
        <div className="p-4 sm:p-6">
          <OpeningHoursEditor hours={hours} onChange={handleHourChange} />
        </div>
      </section>

      <div className="flex justify-end sm:hidden">
        <Button onClick={handleSave} loading={saving} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  )
}
