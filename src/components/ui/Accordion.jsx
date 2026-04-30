'use client'

import { useState, useRef, useEffect, useId } from 'react'

function AccordionItem({ title, children, defaultOpen = false, border = true }) {
  const [open, setOpen] = useState(defaultOpen)
  const [height, setHeight] = useState(defaultOpen ? 'auto' : '0px')
  const bodyRef = useRef(null)
  const id = useId()

  useEffect(() => {
    if (!bodyRef.current) return
    if (open) {
      setHeight(`${bodyRef.current.scrollHeight}px`)
      const t = setTimeout(() => setHeight('auto'), 300)
      return () => clearTimeout(t)
    } else {
      setHeight(`${bodyRef.current.scrollHeight}px`)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeight('0px'))
      })
    }
  }, [open])

  return (
    <div className={border ? 'border-b border-[var(--color-stone)]' : ''}>
      <button
        id={`${id}-btn`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full py-5 text-left group"
      >
        <span className="font-sans font-light text-sm tracking-[0.08em] uppercase text-[var(--color-charcoal)] group-hover:text-[var(--color-black)] transition-colors duration-[var(--duration-fast)]">
          {title}
        </span>
        <span
          className="shrink-0 ml-4 text-[var(--color-warm-gray)] group-hover:text-[var(--color-champagne)] transition-all duration-[var(--duration-base)]"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        ref={bodyRef}
        className="accordion-content"
        style={{ height, transition: 'height 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)' }}
        aria-hidden={!open}
      >
        <div className="pb-5 font-sans font-light text-sm leading-relaxed text-[var(--color-mid-gray)]">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Accordion({ items, className = '' }) {
  return (
    <div className={className}>
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          title={item.title}
          defaultOpen={item.defaultOpen}
          border={i < items.length - 1}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  )
}

export { AccordionItem }
