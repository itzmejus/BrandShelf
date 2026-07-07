import { useRef, useState } from 'react'
import { Upload, X, Loader2, AlertCircle } from 'lucide-react'
import { validateImageFile } from '../utils/upload'

interface ImageUploadProps {
  value?: string | null
  onChange: (file: File) => void
  onRemove?: () => void
  label?: string
  uploading?: boolean
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  label = 'Upload Image',
  uploading = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)

  const handleFile = (file: File) => {
    setFileError(null)
    const error = validateImageFile(file)
    if (error) {
      setFileError(error)
      return
    }
    onChange(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-xs font-medium text-on-surface-variant">{label}</span>
      )}

      {value ? (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-outline-variant">
          <img src={value} alt="Preview" className="w-full h-full object-cover" loading="lazy" />
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
              <Loader2 size={24} className="text-white animate-spin" aria-hidden="true" />
              <p className="text-white text-xs font-medium">Uploading…</p>
            </div>
          )}
          {!uploading && onRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label="Remove image"
              className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            >
              <X size={14} className="text-error" aria-hidden="true" />
            </button>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={uploading ? -1 : 0}
          aria-label={`${label}. Click or drag to upload`}
          className={`w-full h-40 rounded-lg border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-2
            ${uploading ? 'border-secondary/50 bg-secondary/5 cursor-wait' : 'cursor-pointer'}
            ${!uploading && dragOver ? 'border-secondary bg-secondary/5' : ''}
            ${!uploading && !dragOver ? 'border-outline-variant hover:border-secondary hover:bg-surface-container-low' : ''}`}
          onClick={() => !uploading && inputRef.current?.click()}
          onKeyDown={(e) => { if (!uploading && (e.key === 'Enter' || e.key === ' ')) inputRef.current?.click() }}
          onDragOver={(e) => { if (!uploading) { e.preventDefault(); setDragOver(true) } }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => !uploading && handleDrop(e)}
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="text-secondary animate-spin" aria-hidden="true" />
              <p className="text-xs font-medium text-secondary">Uploading image…</p>
            </>
          ) : (
            <>
              <Upload size={24} className="text-outline" aria-hidden="true" />
              <div className="text-center">
                <p className="text-xs font-medium text-on-surface">Click or drag to upload</p>
                <p className="text-[11px] text-outline mt-0.5">JPEG, PNG, WEBP, GIF · max 5 MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {fileError && (
        <p role="alert" className="text-xs text-error flex items-center gap-1 mt-0.5">
          <AlertCircle size={11} aria-hidden="true" />
          {fileError}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        aria-hidden="true"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
