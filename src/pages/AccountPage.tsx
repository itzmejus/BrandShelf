import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { signOut } from '../store/slices/authSlice'
import { addToast } from '../store/slices/uiSlice'
import { authService } from '../services/auth.service'
import { normalizeAuthError } from '../utils/errors'
import { Button, Input, PageHeader } from '../components'

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password is too long'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export function AccountPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setSaving(true)
    try {
      await authService.updatePassword(values.password)
      dispatch(addToast({ message: 'Password updated', type: 'success' }))
      reset({ password: '', confirmPassword: '' })
    } catch (err: unknown) {
      dispatch(addToast({ message: normalizeAuthError((err as Error).message), type: 'error' }))
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await dispatch(signOut())
    navigate('/login')
  }

  return (
    <div className="space-y-6 pb-8">
      <PageHeader title="Account" subtitle="Manage your SiteSelo login." />

      <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant">
          <h2 className="text-sm font-semibold text-primary">Email</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-on-surface">{user?.email}</p>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant">
          <h2 className="text-sm font-semibold text-primary">Change Password</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="New Password"
            type="password"
            placeholder="Min. 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Repeat password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <div className="md:col-span-2">
            <Button type="submit" loading={saving}>
              Update Password
            </Button>
          </div>
        </form>
      </section>

      <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-primary">Sign Out</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">You'll need to sign in again to access your dashboard.</p>
          </div>
          <Button variant="danger" onClick={handleSignOut} className="w-full sm:w-auto">
            <LogOut size={14} />
            Sign Out
          </Button>
        </div>
      </section>
    </div>
  )
}
