import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService } from '../services/auth.service'
import { normalizeAuthError } from '../utils/errors'
import { Input, Button } from '../components'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
})

type FormValues = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async ({ email }: FormValues) => {
    setLoading(true)
    setError(null)
    try {
      await authService.resetPassword(email)
      setSuccess(true)
    } catch (err: unknown) {
      setError(normalizeAuthError((err as Error).message))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-5 text-center">
        <div
          className="w-16 h-16 bg-secondary-fixed rounded-full flex items-center justify-center mx-auto"
          aria-hidden="true"
        >
          <span className="text-3xl">✉️</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary">Check your inbox.</h2>
          <p className="text-sm text-on-surface-variant mt-2 max-w-xs mx-auto">
            If that email is registered with SiteSelo, we've sent a secure reset link.
          </p>
        </div>
        <Link to="/login" className="text-secondary text-sm font-semibold hover:underline">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Reset your password.</h1>
        <p className="text-sm text-on-surface-variant mt-1.5">
          Enter your email address and we'll send you a secure reset link.
        </p>
      </div>

      {error && (
        <div role="alert" className="bg-error-container text-on-error-container text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Send reset link
        </Button>
      </form>

      <p className="text-sm text-on-surface-variant text-center">
        <Link to="/login" className="text-secondary font-semibold hover:underline">
          ← Back to sign in
        </Link>
      </p>
    </div>
  )
}
