import { useEffect, useState, useMemo } from 'react'
import { Plus, Edit, Trash2, Package, Star, Loader2 } from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import {
  fetchItems,
  deleteItem,
  updateItem,
  setSearchQuery,
  setSelectedCategory,
} from '../store/slices/catalogueSlice'
import { fetchCategories } from '../store/slices/categorySlice'
import { addToast } from '../store/slices/uiSlice'
import type { CatalogueItem } from '../types'
import {
  Button,
  SearchBar,
  EmptyState,
  ConfirmDialog,
  Badge,
  Switch,
  PageHeader,
  TableRowSkeleton,
} from '../components'
import { ItemFormModal } from '../features/catalogue/components/ItemFormModal'

export function CataloguePage() {
  const dispatch = useAppDispatch()
  const business = useAppSelector((s) => s.business.business)
  const { items, loading, searchQuery, selectedCategoryId } = useAppSelector((s) => s.catalogue)
  const categories = useAppSelector((s) => s.categories.categories)

  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<CatalogueItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CatalogueItem | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  // Track which item IDs are currently being toggled (available or featured)
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (business) {
      dispatch(fetchItems(business.id))
      dispatch(fetchCategories(business.id))
    }
  }, [business, dispatch])

  const filtered = useMemo(() => {
    let result = items
    if (selectedCategoryId) {
      result = result.filter((i) => i.category_id === selectedCategoryId)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          (i.description ?? '').toLowerCase().includes(q),
      )
    }
    return result
  }, [items, searchQuery, selectedCategoryId])

  const handleOpenAdd = () => { setEditItem(null); setModalOpen(true) }
  const handleOpenEdit = (item: CatalogueItem) => { setEditItem(item); setModalOpen(true) }
  const handleCloseModal = () => { setModalOpen(false); setEditItem(null) }

  const withToggle = async (itemId: string, action: () => Promise<void>) => {
    setTogglingIds((prev) => new Set(prev).add(itemId))
    try {
      await action()
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }

  const handleToggleAvailable = (item: CatalogueItem) =>
    withToggle(item.id, async () => {
      const result = await dispatch(
        updateItem({ itemId: item.id, formData: { available: !item.available } }),
      )
      if (updateItem.rejected.match(result)) {
        dispatch(addToast({ message: 'Failed to update availability', type: 'error' }))
      }
    })

  const handleToggleFeatured = (item: CatalogueItem) =>
    withToggle(item.id, async () => {
      const result = await dispatch(
        updateItem({ itemId: item.id, formData: { featured: !item.featured } }),
      )
      if (updateItem.rejected.match(result)) {
        dispatch(addToast({ message: 'Failed to update featured status', type: 'error' }))
      }
    })

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    const result = await dispatch(deleteItem(deleteTarget.id))
    setDeleteLoading(false)
    if (deleteItem.fulfilled.match(result)) {
      dispatch(addToast({ message: 'Item deleted', type: 'success' }))
    } else {
      dispatch(addToast({ message: 'Failed to delete item', type: 'error' }))
    }
    setDeleteTarget(null)
  }

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ]

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Catalogue"
        subtitle={
          items.length === 0
            ? 'Add your products and services to build your storefront.'
            : `${items.length} item${items.length !== 1 ? 's' : ''} in your catalogue`
        }
        action={
          <Button onClick={handleOpenAdd}>
            <Plus size={16} aria-hidden="true" />
            Add Item
          </Button>
        }
      />

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <SearchBar
          placeholder="Search items…"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          containerClassName="flex-1 max-w-sm"
        />
        <select
          value={selectedCategoryId}
          onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
          className="bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface-variant outline-none focus:border-secondary"
        >
          {categoryOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {/* Table header (desktop) */}
        <div className="hidden lg:grid grid-cols-[72px_1fr_160px_120px_120px_100px_120px] items-center px-6 py-3 bg-surface-container-low border-b border-outline-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
          <div>Image</div>
          <div>Item</div>
          <div>Category</div>
          <div>Price</div>
          <div>Available</div>
          <div className="text-center">Featured</div>
          <div className="text-right">Actions</div>
        </div>

        {loading ? (
          /* Skeleton rows while loading */
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} cols={7} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title={searchQuery ? 'No results found' : 'No catalogue items yet'}
            description={
              searchQuery
                ? 'Try a different search term or remove the filter.'
                : 'Start by adding your first product or service.'
            }
            action={
              !searchQuery
                ? { label: 'Add Your First Item', onClick: handleOpenAdd }
                : undefined
            }
          />
        ) : (
          <div className="divide-y divide-outline-variant">
            {filtered.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                toggling={togglingIds.has(item.id)}
                onEdit={() => handleOpenEdit(item)}
                onDelete={() => setDeleteTarget(item)}
                onToggleAvailable={() => handleToggleAvailable(item)}
                onToggleFeatured={() => handleToggleFeatured(item)}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-outline-variant bg-surface-container-low">
            <span className="text-xs text-on-surface-variant">
              {filtered.length} of {items.length} item{items.length !== 1 ? 's' : ''} shown
            </span>
          </div>
        )}
      </div>

      {/* Summary stats */}
      {items.length > 0 && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-outline-variant shadow-sm">
            <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider mb-1">
              Total Items
            </p>
            <p className="text-2xl font-bold text-primary">{items.length}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Products &amp; services</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-outline-variant shadow-sm">
            <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider mb-1">
              Featured
            </p>
            <p className="text-2xl font-bold text-primary">
              {items.filter((i) => i.featured).length}
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">Highlighted on storefront</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-outline-variant shadow-sm">
            <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider mb-1">
              Unavailable
            </p>
            <p className="text-2xl font-bold text-error">
              {items.filter((i) => !i.available).length}
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">Hidden from customers</p>
          </div>
        </div>
      )}

      <ItemFormModal open={modalOpen} onClose={handleCloseModal} item={editItem} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Item"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Item"
        loading={deleteLoading}
      />
    </div>
  )
}

interface ItemRowProps {
  item: CatalogueItem
  toggling: boolean
  onEdit: () => void
  onDelete: () => void
  onToggleAvailable: () => void
  onToggleFeatured: () => void
}

function ItemRow({ item, toggling, onEdit, onDelete, onToggleAvailable, onToggleFeatured }: ItemRowProps) {
  return (
    <div
      className={`lg:grid lg:grid-cols-[72px_1fr_160px_120px_120px_100px_120px] items-center px-6 py-4 transition-colors bg-white
        ${toggling ? 'opacity-60 pointer-events-none' : 'hover:bg-surface-container-low/50'}`}
    >
      {/* Mobile layout */}
      <div className="flex lg:contents items-center gap-4 mb-3 lg:mb-0">
        {/* Image */}
        <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden border border-outline-variant flex-shrink-0">
          {item.image_url ? (
            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={18} className="text-outline" />
            </div>
          )}
        </div>

        {/* Mobile title */}
        <div className="lg:hidden flex-1 min-w-0">
          <p className="text-sm font-semibold text-primary truncate">{item.title}</p>
          <p className="text-xs text-on-surface-variant">
            {item.category?.name ?? 'Uncategorized'} ·{' '}
            {item.price != null ? `$${item.price.toFixed(2)}` : 'No price'}
          </p>
        </div>
      </div>

      {/* Desktop: item name */}
      <div className="hidden lg:block min-w-0">
        <p className="text-sm font-semibold text-primary truncate">{item.title}</p>
        {item.description && (
          <p className="text-[11px] text-on-surface-variant truncate max-w-[200px]">
            {item.description}
          </p>
        )}
      </div>

      {/* Category */}
      <div className="hidden lg:block">
        {item.category ? (
          <Badge variant="secondary">{item.category.name}</Badge>
        ) : (
          <span className="text-xs text-outline">—</span>
        )}
      </div>

      {/* Price */}
      <div className="hidden lg:block text-sm font-semibold text-primary">
        {item.price != null ? (
          `$${item.price.toFixed(2)}`
        ) : (
          <span className="text-outline font-normal">—</span>
        )}
      </div>

      {/* Available toggle */}
      <div className="flex lg:block items-center gap-2 mb-2 lg:mb-0">
        {toggling ? (
          <Loader2 size={18} className="animate-spin text-secondary" />
        ) : (
          <Switch checked={item.available} onChange={onToggleAvailable} />
        )}
        <span className="lg:hidden text-xs text-on-surface-variant">
          {item.available ? 'Available' : 'Out of stock'}
        </span>
      </div>

      {/* Featured star */}
      <div className="hidden lg:flex justify-center">
        {toggling ? (
          <Loader2 size={16} className="animate-spin text-secondary" />
        ) : (
          <button
            onClick={onToggleFeatured}
            className="transition-transform hover:scale-110 p-1 rounded"
            title={item.featured ? 'Remove from featured' : 'Mark as featured'}
          >
            <Star
              size={18}
              className={item.featured ? 'text-secondary fill-secondary' : 'text-outline'}
            />
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex lg:justify-end gap-1 mt-3 lg:mt-0">
        <button
          onClick={onEdit}
          className="p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-primary rounded-lg transition-colors"
          title="Edit"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-on-surface-variant hover:bg-error-container hover:text-error rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
