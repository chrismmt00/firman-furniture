'use client'

import { useEffect, useRef } from 'react'

/* The design's signature champagne cursor: a small dot that tracks the
   pointer 1:1 and a ring that eases behind it, growing over interactive
   elements. Disabled on touch / coarse pointers and for reduced motion. */
export default function CursorFX() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer:fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let raf

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      dot.style.opacity = '1'
      ring.style.opacity = '1'
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
    }

    const onOver = (e) => {
      const interactive = e.target.closest('a, button, input, select, textarea, label, [role="button"]')
      if (interactive) {
        ring.style.width = '52px'
        ring.style.height = '52px'
        ring.style.background = 'rgba(196,169,108,0.12)'
      } else {
        ring.style.width = '34px'
        ring.style.height = '34px'
        ring.style.background = 'transparent'
      }
    }

    const onLeave = () => { dot.style.opacity = '0'; ring.style.opacity = '0' }

    const loop = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    document.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="hidden lg:block fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[var(--color-champagne)] pointer-events-none z-[9999] opacity-0"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="hidden lg:block fixed top-0 left-0 w-[34px] h-[34px] rounded-full border border-[var(--color-champagne)] pointer-events-none z-[9999] opacity-0"
        style={{ transition: 'width 0.3s var(--ease-luxury), height 0.3s var(--ease-luxury), background 0.3s var(--ease-luxury)' }}
      />
    </>
  )
}
