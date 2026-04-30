export default function Divider({
  variant = 'plain',
  orientation = 'horizontal',
  label,
  className = '',
}) {
  if (orientation === 'vertical') {
    return (
      <div
        className={`self-stretch w-px bg-[var(--color-stone)] ${className}`}
        role="separator"
        aria-orientation="vertical"
      />
    )
  }

  if (variant === 'ornamental') {
    return (
      <div
        className={`flex items-center gap-4 ${className}`}
        role="separator"
        aria-orientation="horizontal"
      >
        <div className="flex-1 h-px bg-[var(--color-stone)]" />
        <span className="shrink-0 text-[var(--color-champagne)] text-xl font-serif leading-none select-none">
          ✦
        </span>
        <div className="flex-1 h-px bg-[var(--color-stone)]" />
      </div>
    )
  }

  if (variant === 'champagne') {
    return (
      <div className={`relative ${className}`} role="separator" aria-orientation="horizontal">
        <span className="rule-champagne block" />
      </div>
    )
  }

  if (variant === 'label' && label) {
    return (
      <div
        className={`flex items-center gap-4 ${className}`}
        role="separator"
        aria-orientation="horizontal"
      >
        <div className="flex-1 h-px bg-[var(--color-stone)]" />
        <span className="label shrink-0 text-[var(--color-warm-gray)]">{label}</span>
        <div className="flex-1 h-px bg-[var(--color-stone)]" />
      </div>
    )
  }

  return (
    <hr
      className={`border-none h-px bg-[var(--color-stone)] ${className}`}
      role="separator"
      aria-orientation="horizontal"
    />
  )
}
