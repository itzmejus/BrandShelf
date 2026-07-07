import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-on-surface-variant">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface placeholder:text-outline outline-none transition-all
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

Input.displayName = 'Input'
