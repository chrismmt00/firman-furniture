'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'

const WIDTH = {
  sm: 'w-[360px]',
  md: 'w-[480px]',
  lg: 'w-[600px]',
  full: 'w-full',
}

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  size = 'md',
  footer,
  className = '',
}) {
  const [mounted, setMounted] = useState(false)
  const overlayRef = useRef(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  const handleEscape = useCallback(
    (e) => { if (e.key === 'Escape') onClose() },
    [onClose]
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleEscape)
    document.body.classList.add('overflow-locked')
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.classList.remove('overflow-locked')
    }
  }, [isOpen, handleEscape])

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  const slideIn = side === 'right' ? 'slide-in-right' : 'slide-in-left'
  const position = side === 'right' ? 'right-0' : 'left-0'

  if (!mounted || !isOpen) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[400] flex"
      style={{ animation: 'fade-in 0.2s var(--ease-out) forwards' }}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'drawer-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--color-black)]/50 backdrop-blur-[2px]"
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={[
          'absolute inset-y-0 bg-[var(--color-ivory)] flex flex-col max-w-full',
          position,
          WIDTH[size],
          className,
        ].join(' ')}
        style={{ animation: `${slideIn} 0.35s var(--ease-out) forwards` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-stone)] shrink-0">
          {title && (
            <h2
              id="drawer-title"
              className="font-serif text-2xl font-light tracking-tight text-[var(--color-black)]"
            >
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto text-[var(--color-warm-gray)] hover:text-[var(--color-black)] transition-colors duration-[var(--duration-fast)] p-1"
            aria-label="Close drawer"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>

        {/* Optional footer */}
        {footer && (
          <div className="shrink-0 border-t border-[var(--color-stone)] px-6 py-5">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
