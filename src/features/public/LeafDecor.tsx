interface LeafProps {
  size?: number
  rotate?: number
  color?: string
  opacity?: number
  className?: string
}

export function Leaf({ size = 48, rotate = 0, color = '#1d5c3a', opacity = 0.18, className = '' }: LeafProps) {
  return (
    <svg
      width={size}
      height={size * 1.6}
      viewBox="0 0 40 64"
      fill="none"
      className={className}
      style={{ transform: `rotate(${rotate}deg)`, opacity, display: 'block' }}
    >
      <path d="M20 2C8 14 4 36 20 62C36 36 32 14 20 2Z" fill={color} />
      <path d="M20 2L20 62" stroke="white" strokeWidth="0.6" strokeOpacity="0.5" />
      <path d="M20 22C13 24 9 32 8 40" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
      <path d="M20 22C27 24 31 32 32 40" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
      <path d="M20 34C15 35 12 40 11 46" stroke="white" strokeWidth="0.4" strokeOpacity="0.2" />
      <path d="M20 34C25 35 28 40 29 46" stroke="white" strokeWidth="0.4" strokeOpacity="0.2" />
    </svg>
  )
}

export function LeafCluster({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <div className="relative">
        <div className="absolute top-0 left-0">
          <Leaf size={52} rotate={-30} color="#1d5c3a" opacity={0.22} />
        </div>
        <div className="absolute top-4 left-10">
          <Leaf size={34} rotate={15} color="#5a8f3c" opacity={0.16} />
        </div>
        <div className="absolute -top-6 left-6">
          <Leaf size={28} rotate={-60} color="#8ab04b" opacity={0.2} />
        </div>
      </div>
    </div>
  )
}
