import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Copy, ExternalLink } from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { saveBusiness } from '../store/slices/businessSlice'
import { addToast } from '../store/slices/uiSlice'
import { businessService } from '../services/business.service'
import { BUSINESS_TYPES, STORAGE_BUCKETS } from '../utils/constants'
import { Button, Input, Textarea, Select, ImageUpload, PageHeader, SettingsSkeleton } from '../components'
import type { OpeningHours } from '../types'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const phoneRegex = /^[+\d\s\-().]{7,20}$/

const schema = z.object({
  name: z.string().min(1, 'Business name is required').max(100, 'Business name is too long'),
  type: z.string().min(1, 'Business type is required'),
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
  description: z.string().max(1000, 'Description must be under 1000 characters').optional(),
  logo_url: z.string().optional().nullable(),
  cover_url: z.string().optional().nullable(),
  opening_hours: z.array(
    z.object({
      day: z.string(),
      open: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
      close: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
      closed: z.boolean(),
    }),
  ).optional().nullable(),
})

type FormValues = z.infer<typeof schema>

const DEFAULT_HOURS: OpeningHours[] = DAYS.map((day) => ({
  day,
  open: '09:00',
  close: '18:00',
  closed: day === 'Sunday',
}))

export function SettingsPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const { business, saving, loading: businessLoading } = useAppSelector((s) => s.business)

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [hours, setHours] = useState<OpeningHours[]>(DEFAULT_HOURS)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      type: '',
      phone: '',
      whatsapp: '',
      email: '',
      address: '',
      description: '',
      logo_url: null,
      cover_url: null,
      opening_hours: DEFAULT_HOURS,
    },
  })

  useEffect(() => {
    if (business) {
      reset({
        name: business.name,
        type: business.type,
        phone: business.phone ?? '',
        whatsapp: business.whatsapp ?? '',
        email: business.email ?? '',
        address: business.address ?? '',
        description: business.description ?? '',
        logo_url: business.logo_url,
        cover_url: business.cover_url,
        opening_hours: (business.opening_hours as OpeningHours[]) ?? DEFAULT_HOURS,
      })
      setLogoPreview(business.logo_url)
      setCoverPreview(business.cover_url)
      setHours((business.opening_hours as OpeningHours[]) ?? DEFAULT_HOURS)
    }
  }, [business, reset])

  const handleHourChange = (
    index: number,
    field: keyof OpeningHours,
    value: string | boolean,
  ) => {
    setHours((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)))
  }

  const onSubmit = async (values: FormValues) => {
    if (!user) return
    setUploadingImages(true)

    let logoUrl = values.logo_url ?? null
    let coverUrl = values.cover_url ?? null

    try {
      if (logoFile) {
        logoUrl = await businessService.uploadImage(STORAGE_BUCKETS.LOGOS, user.id, logoFile)
      }
      if (coverFile) {
        coverUrl = await businessService.uploadImage(STORAGE_BUCKETS.COVERS, user.id, coverFile)
      }
    } catch {
      dispatch(addToast({ message: 'Image upload failed', type: 'error' }))
      setUploadingImages(false)
      return
    }

    setUploadingImages(false)

    const formData = {
      ...values,
      slug: business?.slug ?? '',
      phone: values.phone ?? null,
      whatsapp: values.whatsapp ?? null,
      email: values.email ?? null,
      address: values.address ?? null,
      description: values.description ?? null,
      logo_url: logoUrl,
      cover_url: coverUrl,
      opening_hours: hours,
      tagline: business?.tagline ?? null,
      trust_badges: business?.trust_badges ?? null,
      published: business?.published ?? true,
    }

    const result = await dispatch(
      saveBusiness({ businessId: business?.id ?? null, userId: user.id, formData }),
    )

    if (saveBusiness.fulfilled.match(result)) {
      dispatch(addToast({ message: 'Settings saved successfully', type: 'success' }))
    } else {
      dispatch(addToast({ message: 'Failed to save settings', type: 'error' }))
    }
  }

  const businessTypeOptions = BUSINESS_TYPES.map((t) => ({ value: t, label: t }))
  const isLoading = saving || uploadingImages

  if (businessLoading) {
    return (
      <div className="space-y-6 pb-8">
        <PageHeader title="Business Settings" subtitle="Preparing your storefront settings…" />
        <SettingsSkeleton />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6 pb-8">
        <PageHeader
          title="Business Settings"
          subtitle="Manage your business profile and what customers see on your storefront."
          action={
            <Button type="submit" loading={isLoading}>
              Save Changes
            </Button>
          }
        />

        {/* Public URL banner */}
        {business?.slug && (
          <section className="bg-primary rounded-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/20 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative z-10 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-on-primary-container uppercase tracking-widest mb-1">
                  Your BrandShelf Storefront
                </p>
                <p className="text-white font-semibold text-sm break-all">
                  {window.location.origin}/{business.slug}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(`${window.location.origin}/${business.slug}`)
                    dispatch(addToast({ message: 'Link copied!', type: 'success' }))
                  }}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                  <Copy size={13} />
                  Copy Link
                </button>
                <a
                  href={`/${business.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-white text-primary text-xs font-semibold px-3 py-2 rounded-lg hover:bg-secondary-fixed transition-colors"
                >
                  <ExternalLink size={13} />
                  Preview
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Basic info */}
        <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant">
            <h2 className="text-sm font-semibold text-primary">Business Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Business Name *"
              placeholder="Gourmet Bakery Co."
              error={errors.name?.message}
              {...register('name')}
            />
            <Select
              label="Business Type *"
              options={businessTypeOptions}
              placeholder="Select type..."
              error={errors.type?.message}
              {...register('type')}
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+971 50 000 0000"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              label="WhatsApp Number"
              type="tel"
              placeholder="+971 50 000 0000"
              error={errors.whatsapp?.message}
              {...register('whatsapp')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="hello@yourbusiness.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Address"
              placeholder="123 Main St, Dubai"
              error={errors.address?.message}
              {...register('address')}
            />
            <div className="md:col-span-2">
              <Textarea
                label="Description"
                placeholder="Describe your business, what you offer, and what makes you unique…"
                rows={3}
                error={errors.description?.message}
                {...register('description')}
              />
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant">
            <h2 className="text-sm font-semibold text-primary">Brand Images</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              These images appear on your public storefront. JPEG, PNG, WEBP — max 5 MB.
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              value={logoPreview}
              onChange={(file) => { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)) }}
              onRemove={() => { setLogoFile(null); setLogoPreview(null) }}
              label="Business Logo"
            />
            <ImageUpload
              value={coverPreview}
              onChange={(file) => { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)) }}
              onRemove={() => { setCoverFile(null); setCoverPreview(null) }}
              label="Cover Image"
            />
          </div>
        </section>

        {/* Opening hours */}
        <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant">
            <h2 className="text-sm font-semibold text-primary">Opening Hours</h2>
          </div>
          <div className="p-4 sm:p-6 space-y-3">
            {hours.map((h, i) => (
              <div key={h.day} className="flex flex-col sm:grid sm:grid-cols-[100px_1fr_1fr_80px] sm:items-center gap-2 sm:gap-3 pb-3 sm:pb-0 border-b sm:border-0 border-outline-variant last:border-0">
                <div className="flex items-center justify-between sm:contents">
                  <span className="text-sm font-medium text-on-surface">{h.day}</span>
                  <label className="flex items-center gap-2 cursor-pointer sm:hidden">
                    <input
                      type="checkbox"
                      checked={h.closed}
                      onChange={(e) => handleHourChange(i, 'closed', e.target.checked)}
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
                    onChange={(e) => handleHourChange(i, 'open', e.target.value)}
                    className="flex-1 sm:flex-none border border-outline-variant rounded-lg px-3 py-1.5 text-sm outline-none focus:border-secondary disabled:opacity-40"
                  />
                  <input
                    type="time"
                    value={h.close}
                    disabled={h.closed}
                    onChange={(e) => handleHourChange(i, 'close', e.target.value)}
                    className="flex-1 sm:flex-none border border-outline-variant rounded-lg px-3 py-1.5 text-sm outline-none focus:border-secondary disabled:opacity-40"
                  />
                </div>
                <label className="hidden sm:flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={h.closed}
                    onChange={(e) => handleHourChange(i, 'closed', e.target.checked)}
                    className="rounded border-outline-variant accent-secondary"
                  />
                  <span className="text-xs text-on-surface-variant">Closed</span>
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* Save footer for mobile */}
        <div className="flex justify-end sm:hidden">
          <Button type="submit" loading={isLoading} className="w-full">
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  )
}
