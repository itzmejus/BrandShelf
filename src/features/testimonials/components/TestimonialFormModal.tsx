import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { createTestimonial, updateTestimonial } from '../../../store/slices/testimonialSlice'
import { addToast } from '../../../store/slices/uiSlice'
import { testimonialService } from '../../../services/testimonial.service'
import type { Testimonial } from '../../../types'
import { Modal, Input, Textarea, Select, Switch, Button, ImageUpload } from '../../../components'

const schema = z.object({
  author_name: z.string().min(1, 'Customer name is required').max(100),
  author_role: z.string().max(100).optional(),
  quote: z.string().min(1, 'Testimonial text is required').max(1000),
  rating: z.number().min(1).max(5),
  published: z.boolean(),
  sort_order: z.number().min(0),
})

type FormValues = z.infer<typeof schema>

interface TestimonialFormModalProps {
  open: boolean
  onClose: () => void
  testimonial?: Testimonial | null
}

const ratingOptions = [5, 4, 3, 2, 1].map((r) => ({ value: String(r), label: `${r} star${r === 1 ? '' : 's'}` }))

export function TestimonialFormModal({ open, onClose, testimonial }: TestimonialFormModalProps) {
  const dispatch = useAppDispatch()
  const business = useAppSelector((s) => s.business.business)
  const saving = useAppSelector((s) => s.testimonials.saving)
  const testimonials = useAppSelector((s) => s.testimonials.testimonials)

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const blobUrlRef = useRef<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      author_name: '',
      author_role: '',
      quote: '',
      rating: 5,
      published: true,
      sort_order: 0,
    },
  })

  useEffect(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }

    if (testimonial) {
      reset({
        author_name: testimonial.author_name,
        author_role: testimonial.author_role ?? '',
        quote: testimonial.quote,
        rating: testimonial.rating,
        published: testimonial.published,
        sort_order: testimonial.sort_order,
      })
      setAvatarPreview(testimonial.avatar_url ?? null)
    } else {
      reset({
        author_name: '',
        author_role: '',
        quote: '',
        rating: 5,
        published: true,
        sort_order: testimonials.length,
      })
      setAvatarPreview(null)
    }
    setAvatarFile(null)
  }, [testimonial, reset, open, testimonials.length])

  const handleAvatarChange = (file: File) => {
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
    const url = URL.createObjectURL(file)
    blobUrlRef.current = url
    setAvatarFile(file)
    setAvatarPreview(url)
  }

  const handleRemoveAvatar = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    setAvatarPreview(null)
    setAvatarFile(null)
  }

  const onSubmit = async (values: FormValues) => {
    if (!business) return

    let avatarUrl = testimonial?.avatar_url ?? null

    if (avatarFile) {
      setUploadingAvatar(true)
      try {
        avatarUrl = await testimonialService.uploadImage(business.id, avatarFile)
      } catch (err: unknown) {
        dispatch(addToast({ message: (err as Error).message || 'Image upload failed', type: 'error' }))
        setUploadingAvatar(false)
        return
      }
      setUploadingAvatar(false)
    }

    const formData = { ...values, author_role: values.author_role ?? '', avatar_url: avatarUrl }

    if (testimonial) {
      const result = await dispatch(updateTestimonial({ testimonialId: testimonial.id, formData }))
      if (updateTestimonial.fulfilled.match(result)) {
        dispatch(addToast({ message: 'Testimonial updated', type: 'success' }))
        onClose()
      } else {
        dispatch(addToast({ message: 'Failed to update testimonial', type: 'error' }))
      }
    } else {
      const result = await dispatch(createTestimonial({ businessId: business.id, formData }))
      if (createTestimonial.fulfilled.match(result)) {
        dispatch(addToast({ message: 'Testimonial added', type: 'success' }))
        onClose()
      } else {
        dispatch(addToast({ message: 'Failed to add testimonial', type: 'error' }))
      }
    }
  }

  const isLoading = saving || uploadingAvatar

  return (
    <Modal open={open} onClose={onClose} title={testimonial ? 'Edit Testimonial' : 'Add Testimonial'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="p-6 space-y-5">
          <ImageUpload
            value={avatarPreview}
            onChange={handleAvatarChange}
            onRemove={handleRemoveAvatar}
            label="Customer Photo"
            uploading={uploadingAvatar}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Customer Name *"
              placeholder="e.g. Sarah Ahmed"
              error={errors.author_name?.message}
              disabled={isLoading}
              {...register('author_name')}
            />
            <Input
              label="Role / Company"
              placeholder="e.g. Regular Customer"
              error={errors.author_role?.message}
              disabled={isLoading}
              {...register('author_role')}
            />
          </div>

          <Textarea
            label="Testimonial *"
            placeholder="What did the customer say about your business?"
            error={errors.quote?.message}
            disabled={isLoading}
            {...register('quote')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={control}
              name="rating"
              render={({ field }) => (
                <Select
                  label="Rating"
                  options={ratingOptions}
                  value={String(field.value)}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  disabled={isLoading}
                />
              )}
            />
            <Input
              label="Sort Order"
              type="number"
              min={0}
              disabled={isLoading}
              {...register('sort_order', { valueAsNumber: true })}
            />
          </div>

          <Controller
            control={control}
            name="published"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onChange={field.onChange}
                label="Published (visible on storefront)"
                disabled={isLoading}
              />
            )}
          />
        </div>

        <div className="px-6 py-4 border-t border-outline-variant flex justify-end gap-3 bg-surface-container-low rounded-b-xl">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            {testimonial ? 'Save Changes' : 'Add Testimonial'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
