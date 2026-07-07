import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Sparkles, Link } from 'lucide-react'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useBodyScrollLock } from '../../../hooks/useBodyScrollLock'
import { saveBusiness } from '../../../store/slices/businessSlice'
import { addToast } from '../../../store/slices/uiSlice'
import { Input, Select, Button } from '../../../components'
import { BUSINESS_TYPES } from '../../../utils/constants'
import { getDefaultTrustBadges } from '../../../utils/businessType'
import { generateSlug } from '../../../utils/slug'

const phoneRegex = /^[+\d\s\-().]{7,20}$/

const schema = z.object({
  name: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name is too long'),
  type: z.string().min(1, 'Please select a business type'),
  phone: z
    .string()
    .regex(phoneRegex, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  whatsapp: z
    .string()
    .regex(phoneRegex, 'Enter a valid WhatsApp number')
    .optional()
    .or(z.literal('')),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  address: z.string().max(300, 'Address is too long').optional(),
})

type FormValues = z.infer<typeof schema>

interface BusinessSetupModalProps {
  open: boolean
}

export function BusinessSetupModal({ open }: BusinessSetupModalProps) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const { saving, error } = useAppSelector((s) => s.business)

  useBodyScrollLock(open)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      type: '',
      phone: '',
      whatsapp: '',
      email: user?.email ?? '',
      address: '',
    },
  })

  const nameValue = watch('name')
  const slug = generateSlug(nameValue || '')

  const onSubmit = async (values: FormValues) => {
    if (!user) return

    const result = await dispatch(
      saveBusiness({
        businessId: null,
        userId: user.id,
        formData: {
          slug: generateSlug(values.name),
          name: values.name,
          type: values.type,
          tagline: null,
          phone: values.phone || null,
          whatsapp: values.whatsapp || null,
          email: values.email || null,
          address: values.address || null,
          description: null,
          logo_url: null,
          cover_url: null,
          opening_hours: null,
          trust_badges: getDefaultTrustBadges(values.type),
          published: true,
        },
      }),
    )

    if (saveBusiness.fulfilled.match(result)) {
      dispatch(addToast({ message: `Your storefront for "${values.name}" is live. Welcome to SiteSelo!`, type: 'success' }))
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-primary px-8 py-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/20 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
              <Sparkles size={22} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Set up your website.</h2>
            <p className="text-sm text-on-primary-container mt-1">
              Step 1 of 8 — a few details and your SiteSelo website will be ready to share. You can add your logo, images, and working hours afterward.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-8 py-6 space-y-4 max-h-[60vh] overflow-y-auto thin-scrollbar">
            {error && (
              <div className="bg-error-container text-on-error-container text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <Input
              label="Business Name *"
              placeholder="e.g. Just Cuts, Pizza Palace, Dr. Smile"
              error={errors.name?.message}
              {...register('name')}
            />

            {/* Live URL preview */}
            {slug && (
              <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant">
                <Link size={13} className="text-secondary flex-shrink-0" />
                <p className="text-xs text-on-surface-variant truncate">
                  Your storefront link:{' '}
                  <span className="font-semibold text-secondary">
                    siteselo.com/{slug}
                  </span>
                </p>
              </div>
            )}

            <Select
              label="Business Type *"
              options={BUSINESS_TYPES.map((t) => ({ value: t, label: t }))}
              placeholder="Select your business type…"
              error={errors.type?.message}
              {...register('type')}
            />

            <div className="border-t border-outline-variant pt-4">
              <p className="text-xs font-medium text-on-surface-variant mb-3">
                Contact details{' '}
                <span className="font-normal opacity-70">— optional, can be added later</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="+971 50 000 0000"
                  {...register('phone')}
                />
                <Input
                  label="WhatsApp"
                  type="tel"
                  placeholder="+971 50 000 0000"
                  {...register('whatsapp')}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="hello@business.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="City / Area"
                  placeholder="Dubai, UAE"
                  {...register('address')}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-surface-container-low border-t border-outline-variant flex items-center justify-between gap-4">
            <p className="text-xs text-on-surface-variant leading-tight">
              Your website goes live instantly. We'll walk you through the rest — logo, contact info, services, and more — right after this.
            </p>
            <Button type="submit" loading={saving} size="lg" className="flex-shrink-0">
              {saving ? 'Creating website…' : 'Create Website'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
