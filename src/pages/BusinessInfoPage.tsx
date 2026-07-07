import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Copy, ExternalLink, X, Plus } from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { saveBusiness } from '../store/slices/businessSlice'
import { addToast } from '../store/slices/uiSlice'
import { businessService } from '../services/business.service'
import { BUSINESS_TYPES, STORAGE_BUCKETS } from '../utils/constants'
import { getDefaultTrustBadges } from '../utils/businessType'
import { Button, Input, Textarea, Select, ImageUpload, PageHeader, SettingsSkeleton } from '../components'

const schema = z.object({
  name: z.string().min(1, 'Business name is required').max(100, 'Business name is too long'),
  type: z.string().min(1, 'Business type is required'),
  tagline: z.string().max(150, 'Tagline is too long').optional(),
  description: z.string().max(1000, 'Description must be under 1000 characters').optional(),
  logo_url: z.string().optional().nullable(),
  cover_url: z.string().optional().nullable(),
})

type FormValues = z.infer<typeof schema>

export function BusinessInfoPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const { business, saving, loading: businessLoading } = useAppSelector((s) => s.business)

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [trustBadges, setTrustBadges] = useState<string[]>([])
  const [newBadge, setNewBadge] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      type: '',
      tagline: '',
      description: '',
      logo_url: null,
      cover_url: null,
    },
  })

  const typeValue = watch('type')

  useEffect(() => {
    if (business) {
      reset({
        name: business.name,
        type: business.type,
        tagline: business.tagline ?? '',
        description: business.description ?? '',
        logo_url: business.logo_url,
        cover_url: business.cover_url,
      })
      setLogoPreview(business.logo_url)
      setCoverPreview(business.cover_url)
      setTrustBadges(business.trust_badges ?? getDefaultTrustBadges(business.type))
    }
  }, [business, reset])

  const addBadge = () => {
    const value = newBadge.trim()
    if (!value || trustBadges.includes(value)) return
    setTrustBadges((prev) => [...prev, value])
    setNewBadge('')
  }

  const removeBadge = (badge: string) => {
    setTrustBadges((prev) => prev.filter((b) => b !== badge))
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
      slug: business?.slug ?? '',
      name: values.name,
      type: values.type,
      tagline: values.tagline || null,
      description: values.description || null,
      logo_url: logoUrl,
      cover_url: coverUrl,
      trust_badges: trustBadges,
      phone: business?.phone ?? null,
      whatsapp: business?.whatsapp ?? null,
      email: business?.email ?? null,
      address: business?.address ?? null,
      opening_hours: business?.opening_hours ?? null,
      published: business?.published ?? true,
    }

    const result = await dispatch(
      saveBusiness({ businessId: business?.id ?? null, userId: user.id, formData }),
    )

    if (saveBusiness.fulfilled.match(result)) {
      dispatch(addToast({ message: 'Business info saved successfully', type: 'success' }))
    } else {
      dispatch(addToast({ message: 'Failed to save business info', type: 'error' }))
    }
  }

  const businessTypeOptions = BUSINESS_TYPES.map((t) => ({ value: t, label: t }))
  const isLoading = saving || uploadingImages

  if (businessLoading) {
    return (
      <div className="space-y-6 pb-8">
        <PageHeader title="Business Info" subtitle="Preparing your business profile…" />
        <SettingsSkeleton />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6 pb-8">
        <PageHeader
          title="Business Info"
          subtitle="Your business identity — this becomes your public website instantly."
          action={
            <Button type="submit" loading={isLoading}>
              Save Changes
            </Button>
          }
        />

        {/* Public URL banner — the storefront preview link */}
        {business?.slug && (
          <section className="bg-primary rounded-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/20 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative z-10 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-on-primary-container uppercase tracking-widest mb-1">
                  Your BrandShelf Website
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
                  Preview Website
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Basic info */}
        <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant">
            <h2 className="text-sm font-semibold text-primary">Business Identity</h2>
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
            <div className="md:col-span-2">
              <Input
                label="Tagline"
                placeholder="e.g. Fresh bread, baked daily since 2015"
                error={errors.tagline?.message}
                {...register('tagline')}
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                label="Short Description"
                placeholder="A short blurb used for search engines and as a fallback on your website…"
                rows={3}
                error={errors.description?.message}
                {...register('description')}
              />
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant">
            <h2 className="text-sm font-semibold text-primary">Trust Badges</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Short badges shown under your hero banner{typeValue ? ` — we suggested a few defaults for ${typeValue}` : ''}.
            </p>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex flex-wrap gap-2">
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold px-3 py-1.5 rounded-full"
                >
                  {badge}
                  <button type="button" onClick={() => removeBadge(badge)} aria-label={`Remove ${badge}`}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              {trustBadges.length === 0 && (
                <p className="text-xs text-on-surface-variant">No trust badges yet.</p>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Licensed, Same Day Service…"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addBadge()
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={addBadge}>
                <Plus size={14} />
                Add
              </Button>
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant">
            <h2 className="text-sm font-semibold text-primary">Brand Images</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              These images appear on your public website. JPEG, PNG, WEBP — max 5 MB.
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
