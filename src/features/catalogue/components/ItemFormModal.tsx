import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CloudUpload } from 'lucide-react'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { createItem, updateItem } from '../../../store/slices/catalogueSlice'
import { addToast } from '../../../store/slices/uiSlice'
import { catalogueService } from '../../../services/catalogue.service'
import type { CatalogueItem } from '../../../types'
import { Modal, Input, Textarea, Select, Switch, Button, ImageUpload } from '../../../components'

const schema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be under 200 characters')
    .trim(),
  description: z
    .string()
    .max(2000, 'Description must be under 2000 characters')
    .optional(),
  price: z
    .string()
    .refine(
      (v) => !v || (!isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 99_999.99),
      { message: 'Price must be between 0 and 99,999.99' },
    )
    .optional(),
  category_id: z.string().optional(),
  available: z.boolean(),
  featured: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface ItemFormModalProps {
  open: boolean
  onClose: () => void
  item?: CatalogueItem | null
}

export function ItemFormModal({ open, onClose, item }: ItemFormModalProps) {
  const dispatch = useAppDispatch()
  const business = useAppSelector((s) => s.business.business)
  const categories = useAppSelector((s) => s.categories.categories)
  const saving = useAppSelector((s) => s.catalogue.saving)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Track blob URLs so we can revoke them and avoid memory leaks
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
      title: '',
      description: '',
      price: '',
      category_id: '',
      available: true,
      featured: false,
    },
  })

  useEffect(() => {
    // Revoke any outstanding blob URL from a previous open
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }

    if (item) {
      reset({
        title: item.title,
        description: item.description ?? '',
        price: item.price != null ? String(item.price) : '',
        category_id: item.category_id ?? '',
        available: item.available,
        featured: item.featured,
      })
      setImagePreview(item.image_url ?? null)
    } else {
      reset({
        title: '',
        description: '',
        price: '',
        category_id: '',
        available: true,
        featured: false,
      })
      setImagePreview(null)
    }
    setImageFile(null)

    // Cleanup on unmount / next open
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
    }
  }, [item, reset, open])

  const handleImageChange = (file: File) => {
    // Revoke previous blob URL before creating a new one
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
    }
    const url = URL.createObjectURL(file)
    blobUrlRef.current = url
    setImageFile(file)
    setImagePreview(url)
  }

  const handleRemoveImage = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    setImagePreview(null)
    setImageFile(null)
  }

  const onSubmit = async (values: FormValues) => {
    if (!business) {
      dispatch(addToast({
        message: 'No business profile found. Please complete your settings first.',
        type: 'error',
      }))
      return
    }

    let imageUrl = item?.image_url ?? null

    if (imageFile) {
      setUploadingImage(true)
      try {
        imageUrl = await catalogueService.uploadImage(imageFile, business.id)
      } catch (err: unknown) {
        dispatch(addToast({
          message: (err as Error).message || 'Image upload failed',
          type: 'error',
        }))
        setUploadingImage(false)
        return
      }
      setUploadingImage(false)
    }

    const formData = {
      ...values,
      description: values.description ?? '',
      price: values.price ?? '',
      category_id: values.category_id ?? '',
      image_url: imageUrl ?? undefined,
    }

    if (item) {
      const result = await dispatch(updateItem({ itemId: item.id, formData }))
      if (updateItem.fulfilled.match(result)) {
        dispatch(addToast({ message: 'Item updated successfully', type: 'success' }))
        onClose()
      } else {
        dispatch(addToast({ message: 'Failed to update item. Please try again.', type: 'error' }))
      }
    } else {
      const result = await dispatch(createItem({ businessId: business.id, formData }))
      if (createItem.fulfilled.match(result)) {
        dispatch(addToast({ message: 'Item created successfully', type: 'success' }))
        onClose()
      } else {
        dispatch(addToast({ message: 'Failed to create item. Please try again.', type: 'error' }))
      }
    }
  }

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }))
  const isLoading = saving || uploadingImage

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item ? 'Edit Item' : 'Add New Item'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Upload progress banner */}
        {uploadingImage && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-3 px-6 py-3 bg-secondary/5 border-b border-secondary/20"
          >
            <CloudUpload size={16} className="text-secondary animate-pulse" aria-hidden="true" />
            <p className="text-sm text-secondary font-medium">Uploading image to storage…</p>
          </div>
        )}

        {saving && !uploadingImage && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-3 px-6 py-3 bg-surface-container border-b border-outline-variant"
          >
            <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            <p className="text-sm text-on-surface-variant font-medium">Saving item…</p>
          </div>
        )}

        <div className="p-6 space-y-5">
          <ImageUpload
            value={imagePreview}
            onChange={handleImageChange}
            onRemove={handleRemoveImage}
            label="Item Image"
            uploading={uploadingImage}
          />

          <Input
            label="Title *"
            placeholder="e.g. Sourdough Brioche"
            error={errors.title?.message}
            disabled={isLoading}
            autoComplete="off"
            {...register('title')}
          />

          <Textarea
            label="Description"
            placeholder="Describe this item…"
            error={errors.description?.message}
            disabled={isLoading}
            {...register('description')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              step="0.01"
              min="0"
              max="99999.99"
              placeholder="0.00"
              error={errors.price?.message}
              disabled={isLoading}
              {...register('price')}
            />
            <Select
              label="Category"
              options={categoryOptions}
              placeholder="No category"
              error={errors.category_id?.message}
              disabled={isLoading}
              {...register('category_id')}
            />
          </div>

          <div className="flex items-center gap-8">
            <Controller
              control={control}
              name="available"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  label="Available"
                  disabled={isLoading}
                />
              )}
            />
            <Controller
              control={control}
              name="featured"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  label="Featured"
                  disabled={isLoading}
                />
              )}
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-outline-variant flex justify-end gap-3 bg-surface-container-low rounded-b-xl">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            {uploadingImage
              ? 'Uploading image…'
              : saving
              ? 'Saving…'
              : item
              ? 'Save Changes'
              : 'Create Item'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
