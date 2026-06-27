import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-on-surface-variant">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none transition-all
            focus:border-secondary focus:ring-2 focus:ring-secondary/20
            disabled:bg-surface-container-low disabled:opacity-60
            ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}
            ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'
