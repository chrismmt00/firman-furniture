'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'

const SIZE = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
}

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  hideClose = false,
  className = '',
}) {
  const [mounted, setMounted] = useState(false)
  const overlayRef = useRef(null)
  const contentRef = useRef(null)

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
    contentRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.classList.remove('overflow-locked')
    }
  }, [isOpen, handleEscape])

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  if (!mounted || !isOpen) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 flex items-center justify-center p-4 z-[400]"
      style={{ animation: 'fade-in 0.25s var(--ease-out) forwards' }}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--color-black)]/60 backdrop-blur-[2px]"
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={contentRef}
        tabIndex={-1}
        className={[
          'relative w-full bg-[var(--color-ivory)] outline-none',
          SIZE[size],
          className,
        ].join(' ')}
        style={{ animation: 'scale-in 0.3s var(--ease-out) forwards' }}
      >
        {/* Header */}
        {(title || !hideClose) && (
          <div className="flex items-start justify-between px-8 pt-8 pb-6">
            {title && (
              <div>
                <div className="rule-champagne w-8 mb-3" />
                <h2
                  id="modal-title"
                  className="font-serif text-2xl font-light tracking-tight text-[var(--color-black)]"
                >
                  {title}
                </h2>
              </div>
            )}
            {!hideClose && (
              <button
                onClick={onClose}
                className="ml-auto text-[var(--color-warm-gray)] hover:text-[var(--color-black)] transition-colors duration-[var(--duration-fast)] p-1 -mr-1"
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={title || !hideClose ? 'px-8 pb-8' : 'p-8'}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
