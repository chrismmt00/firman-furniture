'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/components/providers/StoreProvider'

const NAV = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'Trade', href: '/trade-program' },
]

const ANNOUNCEMENTS = [
  'Complimentary white-glove delivery over $2,500',
  'Trade program now open',
  'Made-to-order in 6–8 weeks',
]

const navBtn =
  'text-[0.68rem] tracking-[0.2em] uppercase text-[var(--color-charcoal)] hover:text-[var(--color-champagne-dark)] transition-colors'

export default function Header() {
  const { cartCount, wishlist, openCart, openSearch } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const wishlistCount = wishlist.length

  return (
    <>
      {/* Announcement marquee */}
      <div className="bg-[var(--color-black)] text-[var(--color-champagne-light)] overflow-hidden h-[38px] flex items-center">
        <div
          className="flex gap-20 whitespace-nowrap font-sans text-[0.64rem] tracking-[0.26em] uppercase pl-20"
          style={{ animation: 'marquee 32s linear infinite' }}
        >
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((a, i) => (
            <span key={i} className="flex items-center gap-20"><span>{a}</span><span>·</span></span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-[200] bg-[rgba(248,246,242,0.86)] backdrop-blur-[14px] border-b border-[var(--color-stone)]">
        <div className="max-w-[1380px] mx-auto px-[clamp(1.25rem,4vw,3rem)] h-[74px] grid grid-cols-[1fr_auto_1fr] items-center">
          {/* Left */}
          <nav className="hidden lg:flex gap-[2.2rem] items-center">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={navBtn}>{n.label}</Link>
            ))}
          </nav>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Menu"
            className="lg:hidden flex flex-col gap-[5px] w-[30px] justify-self-start"
          >
            <span className="h-[1.5px] w-6 bg-[var(--color-charcoal)] block" />
            <span className="h-[1.5px] w-6 bg-[var(--color-charcoal)] block" />
            <span className="h-[1.5px] w-4 bg-[var(--color-charcoal)] block" />
          </button>

          {/* Center wordmark */}
          <Link href="/" className="text-center font-serif text-[1.7rem] tracking-[0.04em] text-[var(--color-black)] leading-none">
            FIRMAN
          </Link>

          {/* Right */}
          <div className="hidden lg:flex gap-[1.4rem] items-center justify-end">
            <button onClick={openSearch} aria-label="Search" className={navBtn}>Search</button>
            <Link href="/account" className={navBtn}>Account</Link>
            <Link href="/account/wishlist" className={`${navBtn} flex items-center gap-1.5`}>
              Saved<span className="text-[var(--color-champagne-dark)]">({wishlistCount})</span>
            </Link>
            <button onClick={openCart} className="flex items-center gap-1.5 text-[0.68rem] tracking-[0.2em] uppercase text-[var(--color-black)] font-medium">
              Bag
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-[5px] bg-[var(--color-black)] text-[var(--color-ivory)] rounded-[11px] text-[0.6rem] tracking-normal">{cartCount}</span>
            </button>
          </div>
          <div className="flex lg:hidden gap-[1.1rem] items-center justify-end">
            <button onClick={openSearch} aria-label="Search" className="text-[1.05rem] text-[var(--color-charcoal)]">⌕</button>
            <button onClick={openCart} aria-label="Bag" className="flex items-center gap-1.5 text-[0.68rem] tracking-[0.16em] uppercase text-[var(--color-black)] font-medium">
              Bag
              <span className="inline-flex items-center justify-center min-w-[19px] h-[19px] px-[5px] bg-[var(--color-black)] text-[var(--color-ivory)] rounded-[11px] text-[0.58rem] tracking-normal">{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[600] lg:hidden">
          <div onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-[var(--color-black)]/45" style={{ animation: 'fade-in 0.35s var(--ease-out) both' }} />
          <aside className="absolute top-0 left-0 h-full w-[min(320px,84%)] bg-[var(--color-ivory)] flex flex-col shadow-[20px_0_60px_rgba(13,12,11,0.18)]" style={{ animation: 'slide-in-left 0.4s var(--ease-out) both' }}>
            <div className="flex items-center justify-between px-6 py-[1.4rem] border-b border-[var(--color-stone)]">
              <span className="font-serif text-2xl tracking-[0.04em]">FIRMAN</span>
              <button onClick={() => setMobileOpen(false)} className="text-xl leading-none text-[var(--color-mid-gray)] hover:text-[var(--color-black)]" aria-label="Close">✕</button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-4 flex flex-col">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)} className="text-left px-4 py-4 font-serif text-2xl text-[var(--color-black)] border-b border-[var(--color-stone)] hover:text-[var(--color-champagne-dark)]">{n.label}</Link>
              ))}
              <div className="flex flex-col gap-1 mt-4 px-4">
                <Link href="/account" onClick={() => setMobileOpen(false)} className="py-2.5 text-[0.7rem] tracking-[0.18em] uppercase text-[var(--color-charcoal)] hover:text-[var(--color-champagne-dark)]">Account</Link>
                <Link href="/account/wishlist" onClick={() => setMobileOpen(false)} className="py-2.5 text-[0.7rem] tracking-[0.18em] uppercase text-[var(--color-charcoal)] hover:text-[var(--color-champagne-dark)]">Saved ({wishlistCount})</Link>
                <Link href="/account/orders" onClick={() => setMobileOpen(false)} className="py-2.5 text-[0.7rem] tracking-[0.18em] uppercase text-[var(--color-charcoal)] hover:text-[var(--color-champagne-dark)]">Orders</Link>
                <Link href="/contact" onClick={() => setMobileOpen(false)} className="py-2.5 text-[0.7rem] tracking-[0.18em] uppercase text-[var(--color-charcoal)] hover:text-[var(--color-champagne-dark)]">Contact</Link>
              </div>
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}
