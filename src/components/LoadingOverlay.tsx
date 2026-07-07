import { Spinner } from './Spinner'

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <Spinner size={36} />
    </div>
  )
}
