import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Quote, Star } from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { fetchTestimonials, deleteTestimonial } from '../store/slices/testimonialSlice'
import { addToast } from '../store/slices/uiSlice'
import type { Testimonial } from '../types'
import { Button, Avatar, Badge, EmptyState, ConfirmDialog, PageHeader, TableRowSkeleton } from '../components'
import { TestimonialFormModal } from '../features/testimonials/components/TestimonialFormModal'

export function TestimonialsPage() {
  const dispatch = useAppDispatch()
  const business = useAppSelector((s) => s.business.business)
  const { testimonials, loading } = useAppSelector((s) => s.testimonials)

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Testimonial | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (business) dispatch(fetchTestimonials(business.id))
  }, [business, dispatch])

  const openAdd = () => {
    setEditTarget(null)
    setModalOpen(true)
  }

  const openEdit = (testimonial: Testimonial) => {
    setEditTarget(testimonial)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditTarget(null)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    const result = await dispatch(deleteTestimonial(deleteTarget.id))
    setDeleteLoading(false)
    if (deleteTestimonial.fulfilled.match(result)) {
      dispatch(addToast({ message: 'Testimonial deleted', type: 'success' }))
    } else {
      dispatch(addToast({ message: 'Failed to delete testimonial', type: 'error' }))
    }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Testimonials"
        subtitle={
          testimonials.length === 0
            ? 'Share customer reviews on your public storefront.'
            : `${testimonials.length} testimonial${testimonials.length !== 1 ? 's' : ''}`
        }
        action={
          <Button onClick={openAdd}>
            <Plus size={16} aria-hidden="true" />
            Add Testimonial
          </Button>
        }
      />

      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {loading ? (
          <div>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <EmptyState
            icon={Quote}
            title="No testimonials yet"
            description="Add customer reviews to build trust with visitors on your public storefront."
            action={{ label: 'Add Your First Testimonial', onClick: openAdd }}
          />
        ) : (
          <div className="divide-y divide-outline-variant">
            {testimonials.map((t) => (
              <div key={t.id} className="flex items-start gap-4 px-4 sm:px-6 py-4 hover:bg-surface-container-low/50 transition-colors">
                <Avatar name={t.author_name} src={t.avatar_url} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-on-surface">{t.author_name}</p>
                    {t.author_role && (
                      <span className="text-xs text-on-surface-variant">{t.author_role}</span>
                    )}
                    <Badge variant={t.published ? 'success' : 'default'}>
                      {t.published ? 'Published' : 'Hidden'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={i < t.rating ? 'fill-secondary text-secondary' : 'text-outline-variant'}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-on-surface-variant mt-2 line-clamp-2">{t.quote}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(t)}
                    className="p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-primary rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(t)}
                    className="p-2 text-on-surface-variant hover:bg-error-container hover:text-error rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TestimonialFormModal open={modalOpen} onClose={closeModal} testimonial={editTarget} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        message={`Are you sure you want to delete this testimonial from "${deleteTarget?.author_name}"? This cannot be undone.`}
        loading={deleteLoading}
      />
    </div>
  )
}
