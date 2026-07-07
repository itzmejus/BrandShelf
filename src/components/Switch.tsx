interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <label className="relative inline-flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div
        className="w-11 h-6 bg-surface-container-highest rounded-full peer
          peer-checked:bg-secondary
          after:content-[''] after:absolute after:top-0.5 after:start-0.5
          after:bg-white after:border after:border-outline-variant after:rounded-full
          after:h-5 after:w-5 after:transition-all
          peer-checked:after:translate-x-full peer-checked:after:border-white
          peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
      />
      {label && <span className="text-sm text-on-surface">{label}</span>}
    </label>
  )
}
