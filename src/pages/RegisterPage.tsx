import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Lock, ArrowRight, Check } from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { signUp } from '../store/slices/authSlice'
import { Input, Button } from '../components'

const schema = z
  .object({
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password is too long'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export function RegisterPage() {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.auth)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    const result = await dispatch(
      signUp({ email: values.email, password: values.password }),
    )
    if (signUp.fulfilled.match(result)) setSuccess(true)
  }

  if (success) {
    return (
      <div className="space-y-5 text-center">
        <div
          className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
          aria-hidden="true"
        >
          <Check size={22} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary">Check your inbox.</h2>
          <p className="text-sm text-on-surface-variant mt-2 max-w-xs mx-auto">
            We've sent you a confirmation link. Click it to activate your SiteSelo account.
          </p>
        </div>
        <Link to="/login" className="text-secondary text-sm font-semibold hover:underline">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mobile brand mark */}
      <div className="lg:hidden flex items-center justify-center gap-3 mb-2">
        <img src="/Logo.png" alt="" aria-hidden="true" className="w-9 h-9 rounded-lg object-contain" />
        <span className="font-bold text-lg text-primary tracking-tight">SiteSelo</span>
      </div>

      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={22} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary">Create your account.</h1>
          <p className="text-sm text-on-surface-variant mt-1.5">
            Start building your business presence today.
          </p>
        </div>
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
          icon={<Mail size={16} />}
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          icon={<Lock size={16} />}
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="Repeat password"
          autoComplete="new-password"
          icon={<Lock size={16} />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Create account
          <ArrowRight size={16} />
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-outline-variant" />
        <span className="text-xs text-outline">or</span>
        <div className="h-px flex-1 bg-outline-variant" />
      </div>

      <p className="text-sm text-on-surface-variant text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-secondary font-semibold hover:underline inline-flex items-center gap-1">
          Sign in
          <ArrowRight size={12} />
        </Link>
      </p>
    </div>
  )
}
