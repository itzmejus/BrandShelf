import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-on-surface-variant">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={`w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface placeholder:text-outline outline-none transition-all resize-none
            focus:border-secondary focus:ring-2 focus:ring-secondary/20
            disabled:bg-surface-container-low disabled:opacity-60
            ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}
            ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
