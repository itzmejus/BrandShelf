import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Edit, Trash2, Tag, GripVertical } from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../store/slices/categorySlice'
import { addToast } from '../store/slices/uiSlice'
import type { Category } from '../types'
import {
  Button,
  Input,
  Modal,
  EmptyState,
  ConfirmDialog,
  PageHeader,
  CategoryRowSkeleton,
} from '../components'

const schema = z.object({
  name: z.string().min(1, 'Category name is required'),
  sort_order: z.number().min(0),
})

type FormValues = z.infer<typeof schema>

export function CategoriesPage() {
  const dispatch = useAppDispatch()
  const business = useAppSelector((s) => s.business.business)
  const { categories, loading, saving } = useAppSelector((s) => s.categories)

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', sort_order: 0 },
  })

  useEffect(() => {
    if (business) dispatch(fetchCategories(business.id))
  }, [business, dispatch])

  const openAdd = () => {
    setEditTarget(null)
    reset({ name: '', sort_order: categories.length })
    setModalOpen(true)
  }

  const openEdit = (cat: Category) => {
    setEditTarget(cat)
    reset({ name: cat.name, sort_order: cat.sort_order })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditTarget(null)
  }

  const onSubmit = async (values: FormValues) => {
    if (!business) return

    if (editTarget) {
      const result = await dispatch(updateCategory({ categoryId: editTarget.id, formData: values }))
      if (updateCategory.fulfilled.match(result)) {
        dispatch(addToast({ message: 'Category updated', type: 'success' }))
        closeModal()
      } else {
        dispatch(addToast({ message: 'Failed to update category', type: 'error' }))
      }
    } else {
      const result = await dispatch(createCategory({ businessId: business.id, formData: values }))
      if (createCategory.fulfilled.match(result)) {
        dispatch(addToast({ message: 'Category created', type: 'success' }))
        closeModal()
      } else {
        dispatch(addToast({ message: 'Failed to create category', type: 'error' }))
      }
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    const result = await dispatch(deleteCategory(deleteTarget.id))
    setDeleteLoading(false)
    if (deleteCategory.fulfilled.match(result)) {
      dispatch(addToast({ message: 'Category deleted', type: 'success' }))
    } else {
      dispatch(addToast({ message: 'Failed to delete category', type: 'error' }))
    }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Categories"
        subtitle={
          categories.length === 0
            ? 'Organise your catalogue into sections for easier browsing.'
            : `${categories.length} categor${categories.length !== 1 ? 'ies' : 'y'} organising your catalogue`
        }
        action={
          <Button onClick={openAdd}>
            <Plus size={16} aria-hidden="true" />
            Add Category
          </Button>
        }
      />

      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[1fr_80px] sm:grid-cols-[40px_1fr_100px_120px] items-center px-4 sm:px-6 py-3 bg-surface-container-low border-b border-outline-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
          <div className="hidden sm:block" />
          <div>Name</div>
          <div className="hidden sm:block">Sort Order</div>
          <div className="text-right">Actions</div>
        </div>

        {loading ? (
          <div>
            {Array.from({ length: 4 }).map((_, i) => (
              <CategoryRowSkeleton key={i} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <EmptyState
            icon={Tag}
            title="No categories yet"
            description="Add categories to organise your catalogue into sections, making it easier for customers to browse."
            action={{ label: 'Add Your First Category', onClick: openAdd }}
          />
        ) : (
          <div className="divide-y divide-outline-variant">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="grid grid-cols-[1fr_80px] sm:grid-cols-[40px_1fr_100px_120px] items-center px-4 sm:px-6 py-4 hover:bg-surface-container-low/50 transition-colors"
              >
                <GripVertical size={16} className="hidden sm:block text-outline cursor-grab" />
                <div>
                  <p className="text-sm font-semibold text-on-surface">{cat.name}</p>
                  <p className="text-[11px] text-on-surface-variant">
                    <span className="hidden sm:inline">ID: <span className="font-mono">{cat.id.slice(0, 8)}…</span></span>
                    <span className="sm:hidden text-on-surface-variant">Order: {cat.sort_order}</span>
                  </p>
                </div>
                <div className="hidden sm:block text-sm text-on-surface-variant">{cat.sort_order}</div>
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-primary rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(cat)}
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

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editTarget ? 'Edit Category' : 'Add Category'}
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
            <Input
              label="Category Name *"
              placeholder="e.g. Pastries"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Sort Order"
              type="number"
              min={0}
              placeholder="0"
              error={errors.sort_order?.message}
              {...register('sort_order', { valueAsNumber: true })}
            />
          </div>
          <div className="px-6 py-4 border-t border-outline-variant flex justify-end gap-3 bg-surface-container-low rounded-b-xl">
            <Button type="button" variant="secondary" onClick={closeModal} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editTarget ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Items in this category will become uncategorised. This cannot be undone.`}
        loading={deleteLoading}
      />
    </div>
  )
}
