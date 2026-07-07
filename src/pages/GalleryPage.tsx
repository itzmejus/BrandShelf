import { useEffect, useRef, useState } from 'react'
import { Images, Trash2, ChevronUp, ChevronDown, Upload, Loader2 } from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import {
  fetchGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from '../store/slices/gallerySlice'
import { addToast } from '../store/slices/uiSlice'
import { galleryImageService } from '../services/galleryImage.service'
import type { GalleryImage } from '../types'
import { Button, EmptyState, ConfirmDialog, PageHeader } from '../components'

export function GalleryPage() {
  const dispatch = useAppDispatch()
  const business = useAppSelector((s) => s.business.business)
  const { images, loading } = useAppSelector((s) => s.gallery)

  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (business) dispatch(fetchGalleryImages(business.id))
  }, [business, dispatch])

  const handleUpload = async (file: File) => {
    if (!business) return
    setUploading(true)
    try {
      const imageUrl = await galleryImageService.uploadImage(business.id, file)
      const result = await dispatch(
        createGalleryImage({
          businessId: business.id,
          formData: { image_url: imageUrl, caption: '', sort_order: images.length },
        }),
      )
      if (createGalleryImage.fulfilled.match(result)) {
        dispatch(addToast({ message: 'Image added to gallery', type: 'success' }))
      } else {
        dispatch(addToast({ message: 'Failed to save image', type: 'error' }))
      }
    } catch (err: unknown) {
      dispatch(addToast({ message: (err as Error).message || 'Image upload failed', type: 'error' }))
    } finally {
      setUploading(false)
    }
  }

  const handleCaptionBlur = (image: GalleryImage, caption: string) => {
    if (caption === (image.caption ?? '')) return
    dispatch(updateGalleryImage({ imageId: image.id, formData: { caption } }))
  }

  const moveImage = async (index: number, direction: -1 | 1) => {
    if (!business) return
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= images.length) return
    const current = images[index]
    const target = images[targetIndex]
    await Promise.all([
      dispatch(updateGalleryImage({ imageId: current.id, formData: { sort_order: target.sort_order } })),
      dispatch(updateGalleryImage({ imageId: target.id, formData: { sort_order: current.sort_order } })),
    ])
    dispatch(fetchGalleryImages(business.id))
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    const result = await dispatch(deleteGalleryImage(deleteTarget.id))
    setDeleteLoading(false)
    if (deleteGalleryImage.fulfilled.match(result)) {
      dispatch(addToast({ message: 'Image removed', type: 'success' }))
    } else {
      dispatch(addToast({ message: 'Failed to remove image', type: 'error' }))
    }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Gallery"
        subtitle={
          images.length === 0
            ? 'Showcase photos of your work, space, or products on your storefront.'
            : `${images.length} image${images.length !== 1 ? 's' : ''} in your gallery`
        }
        action={
          <Button onClick={() => inputRef.current?.click()} loading={uploading}>
            <Upload size={16} aria-hidden="true" />
            Add Image
          </Button>
        }
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
          e.target.value = ''
        }}
      />

      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-surface-container-high animate-pulse" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <EmptyState
            icon={Images}
            title="No images yet"
            description="Upload photos to build a gallery your customers can browse on your storefront."
            action={{ label: 'Add Your First Image', onClick: () => inputRef.current?.click() }}
          />
        ) : (
          <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, i) => (
              <div key={image.id} className="group relative rounded-lg overflow-hidden border border-outline-variant bg-surface-container-low">
                <div className="aspect-square">
                  <img src={image.image_url} alt={image.caption ?? 'Gallery image'} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-x-0 top-0 flex justify-between p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveImage(i, -1)}
                      disabled={i === 0}
                      className="p-1.5 bg-white/90 rounded-md shadow-sm text-on-surface-variant hover:text-primary disabled:opacity-40"
                      title="Move earlier"
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      onClick={() => moveImage(i, 1)}
                      disabled={i === images.length - 1}
                      className="p-1.5 bg-white/90 rounded-md shadow-sm text-on-surface-variant hover:text-primary disabled:opacity-40"
                      title="Move later"
                    >
                      <ChevronDown size={13} />
                    </button>
                  </div>
                  <button
                    onClick={() => setDeleteTarget(image)}
                    className="p-1.5 bg-white/90 rounded-md shadow-sm text-error hover:bg-error-container"
                    title="Remove"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <input
                  defaultValue={image.caption ?? ''}
                  placeholder="Add a caption…"
                  onBlur={(e) => handleCaptionBlur(image, e.target.value)}
                  className="w-full bg-white px-2 py-1.5 text-xs text-on-surface outline-none border-t border-outline-variant"
                />
              </div>
            ))}
            {uploading && (
              <div className="aspect-square rounded-lg border-2 border-dashed border-secondary/50 bg-secondary/5 flex items-center justify-center">
                <Loader2 size={22} className="text-secondary animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Image"
        message="Are you sure you want to remove this image from your gallery? This cannot be undone."
        loading={deleteLoading}
      />
    </div>
  )
}
