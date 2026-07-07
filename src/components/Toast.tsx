import { useEffect } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { removeToast } from '../store/slices/uiSlice'

export function ToastContainer() {
  const toasts = useAppSelector((s) => s.ui.toasts)
  const dispatch = useAppDispatch()

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onRemove={() => dispatch(removeToast(toast.id))} />
      ))}
    </div>
  )
}

interface ToastItemProps {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  onRemove: () => void
}

function ToastItem({ message, type, onRemove }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(onRemove, 4000)
    return () => clearTimeout(timer)
  }, [onRemove])

  const icons = {
    success: <CheckCircle size={16} className="text-emerald-600" />,
    error: <XCircle size={16} className="text-error" />,
    info: <Info size={16} className="text-secondary" />,
  }

  const borders = {
    success: 'border-l-emerald-500',
    error: 'border-l-error',
    info: 'border-l-secondary',
  }

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 bg-white border border-outline-variant border-l-4 ${borders[type]} rounded-lg px-4 py-3 shadow-lg min-w-[280px] max-w-sm`}
    >
      {icons[type]}
      <p className="flex-1 text-sm text-on-surface">{message}</p>
      <button onClick={onRemove} className="text-outline hover:text-on-surface transition-colors">
        <X size={14} />
      </button>
    </div>
  )
}
