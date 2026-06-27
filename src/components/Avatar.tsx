interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-lg' }

  const initials = name
    ?.split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() ?? '?'

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? 'Avatar'}
        className={`rounded-full object-cover border border-outline-variant ${sizes[size]} ${className}`}
      />
    )
  }

  return (
    <div
      className={`rounded-full bg-primary-fixed-dim flex items-center justify-center font-semibold text-on-primary-fixed ${sizes[size]} ${className}`}
    >
      {initials}
    </div>
  )
}
