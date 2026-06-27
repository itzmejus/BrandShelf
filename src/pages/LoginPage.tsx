import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { signIn, clearError } from '../store/slices/authSlice'
import { Input, Button } from '../components'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    return () => { dispatch(clearError()) }
  }, [dispatch])

  const onSubmit = (values: FormValues) => {
    dispatch(signIn(values))
  }

  return (
    <div className="space-y-8">
      {/* Mobile brand mark */}
      <div className="lg:hidden flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center" aria-hidden="true">
          <span className="text-on-primary font-bold text-xs tracking-tight">BS</span>
        </div>
        <span className="font-bold text-lg text-primary tracking-tight">BrandShelf</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-primary">Welcome back.</h1>
        <p className="text-sm text-on-surface-variant mt-1.5">
          Sign in to manage your digital storefront.
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
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-secondary hover:underline">
            Forgot your password?
          </Link>
        </div>
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Sign in
        </Button>
      </form>

      <p className="text-sm text-on-surface-variant text-center">
        New to BrandShelf?{' '}
        <Link to="/register" className="text-secondary font-semibold hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
