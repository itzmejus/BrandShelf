import { Search } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string
}

export function SearchBar({ containerClassName = '', className = '', ...props }: SearchBarProps) {
  return (
    <div className={`relative ${containerClassName}`}>
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
      <input
        type="text"
        className={`w-full bg-surface-container-low border border-outline-variant rounded-lg pl-9 pr-4 py-2 text-sm text-on-surface placeholder:text-outline outline-none transition-all
          focus:border-secondary focus:ring-2 focus:ring-secondary/20 ${className}`}
        {...props}
      />
    </div>
  )
}
