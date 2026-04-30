'use client'

import { useRef, useEffect, useState } from 'react'

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className = '',
}) {
  const tabRefs = useRef([])
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const activeIndex = tabs.findIndex((t) => t.id === activeTab)
    const el = tabRefs.current[activeIndex]
    if (el) {
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth })
    }
  }, [activeTab, tabs])

  const handleKeyDown = (e, id) => {
    const idx = tabs.findIndex((t) => t.id === id)
    if (e.key === 'ArrowRight' && idx < tabs.length - 1) {
      onChange(tabs[idx + 1].id)
      tabRefs.current[idx + 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && idx > 0) {
      onChange(tabs[idx - 1].id)
      tabRefs.current[idx - 1]?.focus()
    }
  }

  if (variant === 'pill') {
    return (
      <div
        className={`flex gap-1 p-1 bg-[var(--color-stone)] ${className}`}
        role="tablist"
      >
        {tabs.map((tab) => {
          const active = tab.id === activeTab
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              className={[
                'flex-1 px-4 py-2 text-[0.6875rem] font-sans font-medium tracking-[0.12em] uppercase transition-all duration-[var(--duration-fast)]',
                active
                  ? 'bg-[var(--color-ivory)] text-[var(--color-black)] shadow-[var(--shadow-xs)]'
                  : 'text-[var(--color-warm-gray)] hover:text-[var(--color-charcoal)]',
              ].join(' ')}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} role="tablist">
      <div className="flex gap-8 border-b border-[var(--color-stone)]">
        {tabs.map((tab, i) => {
          const active = tab.id === activeTab
          return (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[i] = el)}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              className={[
                'relative pb-3 text-[0.6875rem] font-sans font-medium tracking-[0.15em] uppercase whitespace-nowrap transition-colors duration-[var(--duration-fast)] outline-none',
                active
                  ? 'text-[var(--color-black)]'
                  : 'text-[var(--color-warm-gray)] hover:text-[var(--color-charcoal)]',
              ].join(' ')}
            >
              {tab.label}
              {tab.count != null && (
                <span className="ml-2 text-[0.6rem] tracking-normal normal-case">
                  ({tab.count})
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Sliding indicator */}
      <div
        className="absolute bottom-0 h-0.5 bg-[var(--color-champagne)] transition-all duration-[var(--duration-base)]"
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
          transitionTimingFunction: 'var(--ease-luxury)',
        }}
        aria-hidden="true"
      />
    </div>
  )
}
