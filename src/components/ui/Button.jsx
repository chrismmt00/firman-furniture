'use client'

import { forwardRef } from 'react'
import Link from 'next/link'

const SIZE = {
  sm: 'px-5 py-2.5 text-[0.6875rem]',
  md: 'px-8 py-3.5 text-[0.6875rem]',
  lg: 'px-12 py-[1.125rem] text-[0.6875rem]',
}

const BASE =
  'inline-flex items-center justify-center gap-2 font-sans font-medium tracking-[0.25em] uppercase transition-all select-none focus-visible:outline-2 focus-visible:outline-offset-3 disabled:pointer-events-none'

const VARIANT = {
  primary: [
    'bg-[var(--color-black)] text-white',
    'hover:bg-[var(--color-charcoal)]',
    'active:scale-[0.98]',
    'disabled:bg-[var(--color-warm-gray)]',
  ].join(' '),

  secondary: [
    'bg-transparent text-[var(--color-black)] border border-[var(--color-black)]',
    'hover:bg-[var(--color-black)] hover:text-white',
    'active:scale-[0.98]',
    'disabled:border-[var(--color-stone)] disabled:text-[var(--color-warm-gray)]',
  ].join(' '),

  champagne: [
    'bg-[var(--color-champagne)] text-white',
    'hover:bg-[var(--color-champagne-dark)]',
    'active:scale-[0.98]',
    'disabled:bg-[var(--color-champagne-light)]',
  ].join(' '),

  white: [
    'bg-white text-[var(--color-black)] border border-white',
    'hover:bg-transparent hover:text-white',
    'active:scale-[0.98]',
  ].join(' '),

  outline_champagne: [
    'bg-transparent text-[var(--color-champagne)] border border-[var(--color-champagne)]',
    'hover:bg-[var(--color-champagne)] hover:text-white',
    'active:scale-[0.98]',
    'disabled:border-[var(--color-champagne-light)] disabled:text-[var(--color-champagne-light)]',
  ].join(' '),
}

const Spinner = () => (
  <svg
    className="animate-spin"
    style={{ animation: 'spin-slow 0.9s linear infinite', width: '1em', height: '1em' }}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="40" strokeDashoffset="10" />
  </svg>
)

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    full = false,
    loading = false,
    disabled = false,
    href,
    className = '',
    icon,
    iconPosition = 'right',
    ...props
  },
  ref
) {
  const duration = 'duration-[var(--duration-fast)]'
  const cls = [
    BASE,
    SIZE[size],
    VARIANT[variant],
    full ? 'w-full' : '',
    duration,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {loading && <Spinner />}
      {!loading && icon && iconPosition === 'left' && (
        <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </>
  )

  if (href && !disabled) {
    return (
      <Link href={href} ref={ref} className={cls} {...props}>
        {content}
      </Link>
    )
  }

  return (
    <button
      ref={ref}
      className={cls}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {content}
    </button>
  )
})

export default Button
