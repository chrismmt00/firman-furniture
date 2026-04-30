'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

/* ── Icons ─────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.25" />
    <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
  </svg>
)
const AccountIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.25" />
    <path d="M2.5 16C2.5 13 5.5 11 9 11C12.5 11 15.5 13 15.5 16" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
  </svg>
)
const WishlistIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M9 14.5C9 14.5 2 10 2 6C2 4.5 3.5 3 5 3C6.5 3 7.5 4 9 5.5C10.5 4 11.5 3 13 3C14.5 3 16 4.5 16 6C16 10 9 14.5 9 14.5Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
  </svg>
)
const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M1.5 1.5H3.5L5.5 11.5H13.5L15.5 5H5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="14.5" r="1" fill="currentColor" />
    <circle cx="12.5" cy="14.5" r="1" fill="currentColor" />
  </svg>
)
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path d="M3 6H19M3 11H19M3 16H19" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
  </svg>
)
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
  </svg>
)
const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ── Logo ──────────────────────────────────────────────── */
const Logo = ({ className = '' }) => (
  <Link
    href="/"
    className={`flex flex-col items-center select-none group ${className}`}
    aria-label="Firman Furniture — Home"
  >
    <span
      className="font-serif font-light tracking-[0.4em] text-[var(--color-black)] group-hover:text-[var(--color-charcoal)] transition-colors duration-[var(--duration-base)]"
      style={{ fontSize: '1.3rem', letterSpacing: '0.42em' }}
    >
      FIRMAN
    </span>
    <span className="flex items-center gap-2 mt-0.5">
      <span className="block h-px w-5 bg-[var(--color-champagne)]" />
      <span
        className="font-sans font-light tracking-[0.45em] text-[var(--color-champagne)] uppercase"
        style={{ fontSize: '0.45rem' }}
      >
        Furniture
      </span>
      <span className="block h-px w-5 bg-[var(--color-champagne)]" />
    </span>
  </Link>
)

/* ── Nav Data ──────────────────────────────────────────── */
const NAV = [
  {
    label: 'Shop',
    href: '/shop',
    mega: {
      columns: [
        {
          title: 'Living Room',
          links: [
            { label: 'Sofas & Sectionals', href: '/shop/living-room/sofas' },
            { label: 'Armchairs', href: '/shop/living-room/chairs' },
            { label: 'Coffee Tables', href: '/shop/living-room/coffee-tables' },
            { label: 'Side & Console Tables', href: '/shop/living-room/side-tables' },
            { label: 'Sideboards', href: '/shop/living-room/sideboards' },
          ],
        },
        {
          title: 'Bedroom',
          links: [
            { label: 'Beds & Headboards', href: '/shop/bedroom/beds' },
            { label: 'Dressers & Wardrobes', href: '/shop/bedroom/dressers' },
            { label: 'Nightstands', href: '/shop/bedroom/nightstands' },
            { label: 'Benches & Ottomans', href: '/shop/bedroom/benches' },
          ],
        },
        {
          title: 'Dining',
          links: [
            { label: 'Dining Tables', href: '/shop/dining/tables' },
            { label: 'Dining Chairs', href: '/shop/dining/chairs' },
            { label: 'Bar & Counter Stools', href: '/shop/dining/stools' },
            { label: 'Buffets', href: '/shop/dining/buffets' },
          ],
        },
        {
          title: 'Office & Outdoor',
          links: [
            { label: 'Desks', href: '/shop/office/desks' },
            { label: 'Office Chairs', href: '/shop/office/chairs' },
            { label: 'Outdoor Seating', href: '/shop/outdoor/seating' },
            { label: 'Outdoor Tables', href: '/shop/outdoor/tables' },
          ],
        },
      ],
    },
  },
  { label: 'Collections', href: '/collections' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'Trade', href: '/trade-program' },
  { label: 'About', href: '/about' },
]

/* ── Announcement Bar ───────────────────────────────────── */
function AnnouncementBar({ onDismiss }) {
  return (
    <div className="bg-[var(--color-champagne-pale)] border-b border-[var(--color-champagne-light)]/40 relative">
      <div className="max-w-screen-xl mx-auto px-6 py-2.5 flex items-center justify-center text-center">
        <p className="text-[0.6875rem] font-sans font-light tracking-[0.12em] text-[var(--color-champagne-dark)]">
          Complimentary white-glove delivery on orders over{' '}
          <Link href="/shipping-returns" className="font-medium underline underline-offset-2 hover:no-underline">
            $5,000
          </Link>
        </p>
        <button
          onClick={onDismiss}
          className="absolute right-4 text-[var(--color-champagne-dark)]/60 hover:text-[var(--color-champagne-dark)] transition-colors"
          aria-label="Dismiss announcement"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

/* ── Mega Menu ──────────────────────────────────────────── */
function MegaMenu({ item, onClose }) {
  if (!item?.mega) return null
  return (
    <div
      className="absolute top-full left-0 right-0 z-[200] bg-[var(--color-white)] border-t border-b border-[var(--color-stone)] shadow-[var(--shadow-lg)]"
      style={{ animation: 'slide-down 0.25s var(--ease-out) forwards' }}
      onMouseLeave={onClose}
    >
      <div className="max-w-screen-xl mx-auto px-8 py-10">
        <div className="grid gap-10" style={{ gridTemplateColumns: `repeat(${item.mega.columns.length}, 1fr) 240px` }}>
          {item.mega.columns.map((col) => (
            <div key={col.title}>
              <p className="label text-[var(--color-champagne)] mb-4">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-sans font-light text-[var(--color-charcoal)] hover:text-[var(--color-black)] transition-colors duration-[var(--duration-fast)] leading-snug"
                      onClick={onClose}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Featured panel */}
          <div className="bg-[var(--color-champagne-pale)] p-6 flex flex-col justify-between">
            <div>
              <p className="label text-[var(--color-champagne-dark)] mb-2">New Arrivals</p>
              <p className="font-serif text-xl font-light text-[var(--color-black)] leading-snug">
                The Spring Collection
              </p>
            </div>
            <Link
              href="/collections/new-arrivals"
              className="btn-ghost mt-4 text-[var(--color-champagne-dark)]"
              onClick={onClose}
            >
              Explore
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--color-stone)] flex gap-8">
          <Link href="/shop" className="btn-ghost" onClick={onClose}>View all products</Link>
          <Link href="/collections" className="btn-ghost" onClick={onClose}>All collections</Link>
        </div>
      </div>
    </div>
  )
}

/* ── Mobile Nav ─────────────────────────────────────────── */
function MobileNav({ isOpen, onClose }) {
  const [expanded, setExpanded] = useState(null)

  const handleClose = () => {
    setExpanded(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[300] bg-[var(--color-ivory)] flex flex-col"
      style={{ animation: 'fade-in 0.2s var(--ease-out) forwards' }}
    >
      {/* Mobile header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-stone)]">
        <Logo />
        <button
          onClick={handleClose}
          className="text-[var(--color-charcoal)] hover:text-[var(--color-black)] transition-colors"
          aria-label="Close menu"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-6 py-8" aria-label="Mobile navigation">
        <ul className="space-y-0 divide-y divide-[var(--color-stone)]">
          {NAV.map((item) => (
            <li key={item.label}>
              {item.mega ? (
                <div>
                  <button
                    className="flex items-center justify-between w-full py-5 text-left"
                    onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                    aria-expanded={expanded === item.label}
                  >
                    <span className="label text-[var(--color-charcoal)]">{item.label}</span>
                    <span
                      className="text-[var(--color-warm-gray)] transition-transform duration-[var(--duration-base)]"
                      style={{ transform: expanded === item.label ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      <ChevronDown />
                    </span>
                  </button>
                  {expanded === item.label && (
                    <div className="pb-4 pl-4 space-y-5">
                      {item.mega.columns.map((col) => (
                        <div key={col.title}>
                          <p className="text-[0.6rem] font-medium tracking-[0.2em] uppercase text-[var(--color-champagne)] mb-2">
                            {col.title}
                          </p>
                          <ul className="space-y-2">
                            {col.links.map((link) => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  className="text-sm font-sans font-light text-[var(--color-charcoal)] hover:text-[var(--color-black)]"
                                  onClick={handleClose}
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center py-5 label text-[var(--color-charcoal)] hover:text-[var(--color-black)] transition-colors"
                  onClick={handleClose}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom CTA */}
      <div className="px-6 py-6 border-t border-[var(--color-stone)] space-y-3">
        <Link
          href="/account"
          className="flex items-center gap-3 label text-[var(--color-charcoal)]"
          onClick={handleClose}
        >
          <AccountIcon /> My Account
        </Link>
        <Link
          href="/account/wishlist"
          className="flex items-center gap-3 label text-[var(--color-charcoal)]"
          onClick={handleClose}
        >
          <WishlistIcon /> Wishlist
        </Link>
      </div>
    </div>
  )
}

/* ── Header ─────────────────────────────────────────────── */
export default function Header({ cartCount = 0 }) {
  const [scrolled, setScrolled] = useState(false)
  const [announcement, setAnnouncement] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('overflow-locked')
    } else {
      document.body.classList.remove('overflow-locked')
    }
    return () => document.body.classList.remove('overflow-locked')
  }, [mobileOpen])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  return (
    <>
      <header
        className={[
          'sticky top-0 z-[200] bg-[var(--color-ivory)] transition-all duration-[var(--duration-slow)]',
          scrolled ? 'shadow-[var(--shadow-sm)]' : '',
        ].join(' ')}
      >
        {/* Announcement Bar */}
        {announcement && !scrolled && (
          <AnnouncementBar onDismiss={() => setAnnouncement(false)} />
        )}

        {/* Main header */}
        <div className="max-w-screen-xl mx-auto px-6">
          {/* Desktop top row: logo centered, utils right */}
          <div className="hidden lg:flex items-center justify-between py-6 relative">
            {/* Left: Nav */}
            <nav className="flex items-center gap-8" aria-label="Primary navigation">
              {NAV.slice(0, Math.ceil(NAV.length / 2)).map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.mega && setActiveMenu(item.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    href={item.href}
                    className="nav-link"
                    data-active={activeMenu === item.label ? 'true' : 'false'}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Center: Logo */}
            <Logo className="absolute left-1/2 -translate-x-1/2" />

            {/* Right: secondary nav + icons */}
            <div className="flex items-center gap-8">
              <nav className="flex items-center gap-8" aria-label="Secondary navigation">
                {NAV.slice(Math.ceil(NAV.length / 2)).map((item) => (
                  <Link key={item.label} href={item.href} className="nav-link">
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-4 ml-2">
                <button
                  onClick={() => setSearchOpen((v) => !v)}
                  className="text-[var(--color-charcoal)] hover:text-[var(--color-black)] transition-colors duration-[var(--duration-fast)]"
                  aria-label="Search"
                  aria-expanded={searchOpen}
                >
                  <SearchIcon />
                </button>
                <Link
                  href="/account"
                  className="text-[var(--color-charcoal)] hover:text-[var(--color-black)] transition-colors duration-[var(--duration-fast)]"
                  aria-label="My account"
                >
                  <AccountIcon />
                </Link>
                <Link
                  href="/account/wishlist"
                  className="text-[var(--color-charcoal)] hover:text-[var(--color-black)] transition-colors duration-[var(--duration-fast)]"
                  aria-label="Wishlist"
                >
                  <WishlistIcon />
                </Link>
                <Link
                  href="/cart"
                  className="relative text-[var(--color-charcoal)] hover:text-[var(--color-black)] transition-colors duration-[var(--duration-fast)]"
                  aria-label={`Cart (${cartCount} items)`}
                >
                  <CartIcon />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 flex items-center justify-center bg-[var(--color-champagne)] text-white text-[0.5rem] font-medium rounded-full">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile row */}
          <div className="flex lg:hidden items-center justify-between py-5">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-[var(--color-charcoal)] hover:text-[var(--color-black)] transition-colors"
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
            <Logo />
            <Link href="/cart" className="relative text-[var(--color-charcoal)]" aria-label={`Cart (${cartCount})`}>
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 flex items-center justify-center bg-[var(--color-champagne)] text-white text-[0.5rem] font-medium rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Desktop bottom border */}
        <div className="hidden lg:block border-b border-[var(--color-stone)]" />

        {/* Search bar */}
        {searchOpen && (
          <div
            className="border-b border-[var(--color-stone)] bg-[var(--color-white)]"
            style={{ animation: 'slide-down 0.2s var(--ease-out) forwards' }}
          >
            <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center gap-4">
              <SearchIcon />
              <input
                ref={searchRef}
                type="search"
                placeholder="Search for furniture, collections, materials…"
                className="flex-1 bg-transparent border-none outline-none font-sans font-light text-sm text-[var(--color-charcoal)] placeholder:text-[var(--color-warm-gray)]"
                onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-[0.6875rem] font-sans tracking-[0.15em] uppercase text-[var(--color-warm-gray)] hover:text-[var(--color-black)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Mega Menu */}
        {activeMenu && (
          <div
            className="relative hidden lg:block"
            onMouseEnter={() => setActiveMenu(activeMenu)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <MegaMenu
              item={NAV.find((n) => n.label === activeMenu)}
              onClose={() => setActiveMenu(null)}
            />
          </div>
        )}
      </header>

      {/* Mobile Nav Overlay */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
