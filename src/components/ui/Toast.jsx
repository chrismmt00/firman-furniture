'use client'

import { useEffect, useState } from 'react'

const VARIANT = {
  default: {
    bar: 'bg-[var(--color-champagne)]',
    icon: null,
  },
  success: {
    bar: 'bg-[var(--color-success)]',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  error: {
    bar: 'bg-[var(--color-error)]',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  info: {
    bar: 'bg-[var(--color-info)]',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 6.5V10M7 4.5V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
}

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M1.5 1.5L10.5 10.5M10.5 1.5L1.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export default function Toast({ id, message, type = 'default', duration = 4000, onDismiss }) {
  const [exiting, setExiting] = useState(false)
  const { bar, icon } = VARIANT[type] || VARIANT.default

  const dismiss = () => {
    setExiting(true)
    setTimeout(() => onDismiss(id), 280)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(() => onDismiss(id), 280)
    }, duration)
    return () => clearTimeout(timer)
  }, [id, duration, onDismiss])

  return (
    <div
      className="pointer-events-auto flex items-stretch bg-[var(--color-ivory)] border border-[var(--color-stone)] shadow-[var(--shadow-lg)] overflow-hidden min-w-[280px] max-w-[360px]"
      style={{
        animation: exiting
          ? 'toast-out 0.28s var(--ease-in) forwards'
          : 'toast-in 0.35s var(--ease-out) forwards',
      }}
      role="status"
      aria-live="polite"
    >
      {/* Accent bar */}
      <div className={`w-0.5 shrink-0 ${bar}`} aria-hidden="true" />

      {/* Content */}
      <div className="flex items-center gap-3 px-4 py-3.5 flex-1 min-w-0">
        {icon && (
          <span className="shrink-0 text-[var(--color-charcoal)]">{icon}</span>
        )}
        <p className="text-sm font-sans font-light text-[var(--color-charcoal)] leading-snug flex-1">
          {message}
        </p>
      </div>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        className="shrink-0 px-3 text-[var(--color-warm-gray)] hover:text-[var(--color-black)] transition-colors duration-[var(--duration-fast)] border-l border-[var(--color-stone)]"
        aria-label="Dismiss notification"
      >
        <CloseIcon />
      </button>
    </div>
  )
}
