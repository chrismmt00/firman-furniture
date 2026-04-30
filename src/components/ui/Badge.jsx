const VARIANT = {
  default: 'bg-[var(--color-stone)] text-[var(--color-charcoal)]',
  champagne: 'bg-[var(--color-champagne-pale)] text-[var(--color-champagne-dark)]',
  black: 'bg-[var(--color-black)] text-white',
  success: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
  error: 'bg-[var(--color-error-light)] text-[var(--color-error)]',
  info: 'bg-[var(--color-info-light)] text-[var(--color-info)]',
  outline: 'bg-transparent text-[var(--color-charcoal)] border border-[var(--color-stone)]',
  outline_champagne: 'bg-transparent text-[var(--color-champagne-dark)] border border-[var(--color-champagne)]',
}

const SIZE = {
  sm: 'px-2 py-0.5 text-[0.6rem]',
  md: 'px-2.5 py-1 text-[0.6875rem]',
  lg: 'px-3.5 py-1.5 text-xs',
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) {
  const DOT_COLOR = {
    default: 'bg-[var(--color-warm-gray)]',
    champagne: 'bg-[var(--color-champagne)]',
    black: 'bg-white',
    success: 'bg-[var(--color-success)]',
    error: 'bg-[var(--color-error)]',
    info: 'bg-[var(--color-info)]',
    outline: 'bg-[var(--color-warm-gray)]',
    outline_champagne: 'bg-[var(--color-champagne)]',
  }

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 font-sans font-medium tracking-[0.12em] uppercase',
        SIZE[size],
        VARIANT[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT_COLOR[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
