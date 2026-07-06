'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'

// Context to share scroll progress with children
const ScrollProgressContext = createContext(0)

export function useScrollProgress() {
  return useContext(ScrollProgressContext)
}

export default function StickyScrollSection({
  children,
  height = '180vh',
  className = '',
  bgColor = 'transparent',
  showProgress = true,
  disabled = false,
}) {
  const wrapperRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || disabled) {
      const timeoutId = window.setTimeout(() => setScrollProgress(1), 0)
      return () => window.clearTimeout(timeoutId)
    }

    const wrapper = wrapperRef.current
    if (!wrapper) return

    const handleScroll = () => {
      const rect = wrapper.getBoundingClientRect()
      const wrapperHeight = wrapper.offsetHeight
      const viewportHeight = window.innerHeight
      const scrollableDistance = wrapperHeight - viewportHeight
      const scrolled = -rect.top

      let progress = scrolled / scrollableDistance
      progress = Math.max(0, Math.min(1, progress))

      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [disabled])

  if (disabled) {
    return (
      <ScrollProgressContext.Provider value={1}>
        <div className={className}>{children}</div>
      </ScrollProgressContext.Provider>
    )
  }

  return (
    <ScrollProgressContext.Provider value={scrollProgress}>
      <div
        ref={wrapperRef}
        className={`sticky-scroll-wrapper ${className}`}
        style={{ height, backgroundColor: bgColor }}
      >
        <div className="sticky-scroll-content">
          {children}

          {showProgress ? (
            <div className="sticky-scroll-progress">
              <div
                className="sticky-scroll-progress__bar"
                style={{ transform: `scaleX(${scrollProgress})` }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </ScrollProgressContext.Provider>
  )
}

// Helper for animated content
export function FadeIn({ children, delay = 0, direction = 'up', className = '' }) {
  const progress = useScrollProgress()

  const startPoint = delay
  const localProgress = Math.max(0, Math.min(1, (progress - startPoint) * 3))

  const transforms = {
    up: `translateY(${60 - localProgress * 60}px)`,
    down: `translateY(${-60 + localProgress * 60}px)`,
    left: `translateX(${60 - localProgress * 60}px)`,
    right: `translateX(${-60 + localProgress * 60}px)`,
    none: 'none',
  }

  return (
    <div
      className={`sticky-scroll-fade ${className}`}
      style={{
        opacity: localProgress,
        transform: transforms[direction] || transforms.up,
      }}
    >
      {children}
    </div>
  )
}

// Helper for staggered list items
export function StaggeredItem({ children, index = 0, baseDelay = 0.2, className = '' }) {
  const progress = useScrollProgress()

  const delay = baseDelay + index * 0.1
  const localProgress = Math.max(0, Math.min(1, (progress - delay) * 4))

  return (
    <div
      className={`sticky-scroll-stagger ${className}`}
      style={{
        opacity: localProgress,
        transform: `translateX(${40 - localProgress * 40}px)`,
      }}
    >
      {children}
    </div>
  )
}
