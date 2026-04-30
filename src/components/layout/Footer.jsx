'use client'

import Link from 'next/link'

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.25" />
    <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.25" />
    <circle cx="13" cy="5" r="0.75" fill="currentColor" />
  </svg>
)
const PinterestIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.25" />
    <path d="M7 15C7.5 13 8 11.5 8 10C8 8.5 7 7.5 7 6.5C7 5 8 4 9.5 4C11 4 11.5 5 11.5 6C11.5 7.5 10.5 9 10.5 10.5C10.5 11.7 11.3 12.5 12.5 12.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
  </svg>
)
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M10.5 3H12V1H10C8.5 1 7.5 2 7.5 3.5V5H6V7H7.5V17H10V7H11.5L12 5H10V3.5C10 3.2 10.2 3 10.5 3Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
  </svg>
)

const SHOP_LINKS = [
  { label: 'Living Room', href: '/shop/living-room' },
  { label: 'Bedroom', href: '/shop/bedroom' },
  { label: 'Dining', href: '/shop/dining' },
  { label: 'Office', href: '/shop/office' },
  { label: 'Outdoor', href: '/shop/outdoor' },
  { label: 'New Arrivals', href: '/collections/new-arrivals' },
  { label: 'Sale', href: '/collections/sale' },
]

const COMPANY_LINKS = [
  { label: 'Our Story', href: '/about' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'Blog', href: '/blog' },
  { label: 'Trade Program', href: '/trade-program' },
  { label: 'Contact Us', href: '/contact' },
]

const SUPPORT_LINKS = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Shipping & Returns', href: '/shipping-returns' },
  { label: 'Care Instructions', href: '/faq#care' },
  { label: 'Warranty', href: '/faq#warranty' },
  { label: 'Order Tracking', href: '/account/orders' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Accessibility', href: '/accessibility' },
]

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="label text-[var(--color-champagne)] mb-6">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm font-sans font-light text-[var(--color-warm-gray)] hover:text-[var(--color-white)] transition-colors duration-[var(--duration-fast)] leading-snug"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[var(--color-black)] text-white mt-auto">
      {/* Top ornament */}
      <div className="max-w-screen-xl mx-auto px-6 pt-16 pb-4">
        <div className="flex items-center gap-6 mb-14">
          <div className="flex-1 h-px bg-[var(--color-charcoal)]" />
          <span className="text-[var(--color-champagne)] text-2xl font-serif" aria-hidden="true">✦</span>
          <div className="flex-1 h-px bg-[var(--color-charcoal)]" />
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-14">
          {/* Brand column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="inline-flex flex-col items-start mb-5 group" aria-label="Firman Furniture">
              <span
                className="font-serif font-light tracking-[0.4em] text-white group-hover:text-[var(--color-champagne-light)] transition-colors duration-[var(--duration-base)]"
                style={{ fontSize: '1.1rem', letterSpacing: '0.42em' }}
              >
                FIRMAN
              </span>
              <span
                className="font-sans font-light tracking-[0.45em] text-[var(--color-champagne)] uppercase mt-0.5"
                style={{ fontSize: '0.42rem' }}
              >
                ── Furniture ──
              </span>
            </Link>
            <p className="text-xs font-sans font-light text-[var(--color-warm-gray)] leading-relaxed mb-6 max-w-[200px]">
              Timeless furniture crafted for the discerning home.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-warm-gray)] hover:text-[var(--color-champagne)] transition-colors duration-[var(--duration-fast)]"
                aria-label="Follow on Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-warm-gray)] hover:text-[var(--color-champagne)] transition-colors duration-[var(--duration-fast)]"
                aria-label="Follow on Pinterest"
              >
                <PinterestIcon />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-warm-gray)] hover:text-[var(--color-champagne)] transition-colors duration-[var(--duration-fast)]"
                aria-label="Follow on Facebook"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Support" links={SUPPORT_LINKS} />

          {/* Newsletter */}
          <div>
            <h3 className="label text-[var(--color-champagne)] mb-6">Stay Inspired</h3>
            <p className="text-xs font-sans font-light text-[var(--color-warm-gray)] leading-relaxed mb-5">
              New collections, interior inspiration, and exclusive access — delivered to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-3"
              aria-label="Newsletter signup"
            >
              <input
                type="email"
                placeholder="Your email address"
                required
                className="w-full bg-transparent border border-[var(--color-charcoal)] px-4 py-3 text-xs font-sans font-light text-white placeholder:text-[var(--color-warm-gray)] focus:border-[var(--color-champagne)] focus:outline-none transition-colors duration-[var(--duration-fast)]"
              />
              <button
                type="submit"
                className="w-full bg-[var(--color-champagne)] text-white py-3 text-[0.6875rem] font-sans font-medium tracking-[0.25em] uppercase hover:bg-[var(--color-champagne-dark)] transition-colors duration-[var(--duration-fast)]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--color-charcoal)] mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8">
          <p className="text-[0.6rem] font-sans font-light text-[var(--color-mid-gray)] tracking-[0.1em]">
            © {new Date().getFullYear()} Firman Furniture. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex items-center gap-6">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.6rem] font-sans font-light tracking-[0.08em] text-[var(--color-mid-gray)] hover:text-[var(--color-warm-gray)] transition-colors duration-[var(--duration-fast)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
