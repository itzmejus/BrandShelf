import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Plus } from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { fetchAbout, saveAbout } from '../store/slices/aboutSlice'
import { addToast } from '../store/slices/uiSlice'
import { aboutContentService } from '../services/aboutContent.service'
import { Button, Input, Textarea, ImageUpload, PageHeader } from '../components'

const schema = z.object({
  heading: z.string().max(150, 'Heading is too long').optional(),
  body: z.string().max(3000, 'Story must be under 3000 characters').optional(),
  image_url: z.string().optional().nullable(),
})

type FormValues = z.infer<typeof schema>

export function AboutUsPage() {
  const dispatch = useAppDispatch()
  const business = useAppSelector((s) => s.business.business)
  const { about, saving, loading } = useAppSelector((s) => s.about)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [highlights, setHighlights] = useState<string[]>([])
  const [newHighlight, setNewHighlight] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { heading: '', body: '', image_url: null },
  })

  useEffect(() => {
    if (business) dispatch(fetchAbout(business.id))
  }, [business, dispatch])

  useEffect(() => {
    reset({
      heading: about?.heading ?? '',
      body: about?.body ?? '',
      image_url: about?.image_url ?? null,
    })
    setImagePreview(about?.image_url ?? null)
    setHighlights(about?.highlights ?? [])
  }, [about, reset])

  const addHighlight = () => {
    const value = newHighlight.trim()
    if (!value || highlights.length >= 4 || highlights.includes(value)) return
    setHighlights((prev) => [...prev, value])
    setNewHighlight('')
  }

  const removeHighlight = (highlight: string) => {
    setHighlights((prev) => prev.filter((h) => h !== highlight))
  }

  const onSubmit = async (values: FormValues) => {
    if (!business) return

    let imageUrl = values.image_url ?? null

    if (imageFile) {
      setUploadingImage(true)
      try {
        imageUrl = await aboutContentService.uploadImage(business.id, imageFile)
      } catch (err: unknown) {
        dispatch(addToast({ message: (err as Error).message || 'Image upload failed', type: 'error' }))
        setUploadingImage(false)
        return
      }
      setUploadingImage(false)
    }

    const result = await dispatch(
      saveAbout({
        businessId: business.id,
        formData: { heading: values.heading ?? '', body: values.body ?? '', image_url: imageUrl, highlights },
      }),
    )

    if (saveAbout.fulfilled.match(result)) {
      dispatch(addToast({ message: 'About Us page saved', type: 'success' }))
    } else {
      dispatch(addToast({ message: 'Failed to save About Us page', type: 'error' }))
    }
  }

  const isLoading = saving || uploadingImage

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6 pb-8">
        <PageHeader
          title="About Us"
          subtitle="Tell customers your story. This appears on your public storefront."
          action={
            <Button type="submit" loading={isLoading} disabled={loading}>
              Save Changes
            </Button>
          }
        />

        <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant">
            <h2 className="text-sm font-semibold text-primary">Our Story</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Shown in the About Us section of your storefront. Leave blank to fall back to your business description.
            </p>
          </div>
          <div className="p-6 space-y-5">
            <Input
              label="Heading"
              placeholder="e.g. Crafted with Care Since 2015"
              error={errors.heading?.message}
              {...register('heading')}
            />
            <Textarea
              label="Our Story"
              placeholder="Keep it to 1–2 short paragraphs sharing your journey and what makes your business special…"
              rows={6}
              error={errors.body?.message}
              {...register('body')}
            />
            <ImageUpload
              value={imagePreview}
              onChange={(file) => { setImageFile(file); setImagePreview(URL.createObjectURL(file)) }}
              onRemove={() => { setImageFile(null); setImagePreview(null) }}
              label="About Image"
              uploading={uploadingImage}
            />
          </div>
        </section>

        <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant">
            <h2 className="text-sm font-semibold text-primary">Highlights</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              3–4 short checkpoints shown under your story (e.g. "Family Owned", "Same Day Service").
            </p>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex flex-wrap gap-2">
              {highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="inline-flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold px-3 py-1.5 rounded-full"
                >
                  {highlight}
                  <button type="button" onClick={() => removeHighlight(highlight)} aria-label={`Remove ${highlight}`}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              {highlights.length === 0 && (
                <p className="text-xs text-on-surface-variant">No highlights yet.</p>
              )}
            </div>
            {highlights.length < 4 && (
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Family Owned Since 2010…"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addHighlight()
                    }
                  }}
                />
                <Button type="button" variant="secondary" onClick={addHighlight}>
                  <Plus size={14} />
                  Add
                </Button>
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-end sm:hidden">
          <Button type="submit" loading={isLoading} className="w-full">
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  )
}
