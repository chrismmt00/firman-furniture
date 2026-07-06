import Link from 'next/link'

const SHOP = [
  { label: 'Living Room', href: '/shop/living-room' },
  { label: 'Dining Room', href: '/shop/dining-room' },
  { label: 'Bedroom', href: '/shop/bedroom' },
  { label: 'Accents', href: '/shop/accents' },
]

export default function Footer() {
  return (
    <footer className="bg-[var(--color-black)] text-[var(--color-ivory)]">
      <div className="max-w-[1380px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(3.5rem,7vw,6rem)]">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 min-w-[200px]">
            <div className="font-serif text-3xl tracking-[0.04em]">FIRMAN</div>
            <p className="text-[var(--color-white)]/60 text-sm mt-4 max-w-[240px] font-light">
              Luxury furniture, made to be lived with for generations.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="text-[var(--color-champagne-light)] text-[0.62rem] tracking-[0.24em] uppercase mb-[1.1rem]">Shop</p>
            {SHOP.map((s) => (
              <Link key={s.href} href={s.href} className="block text-[var(--color-white)]/70 text-[0.82rem] font-light mb-2.5 hover:text-[var(--color-champagne-light)] transition-colors">{s.label}</Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <p className="text-[var(--color-champagne-light)] text-[0.62rem] tracking-[0.24em] uppercase mb-[1.1rem]">Company</p>
            <Link href="/about" className="block text-[var(--color-white)]/70 text-[0.82rem] font-light mb-2.5 hover:text-[var(--color-champagne-light)] transition-colors">About</Link>
            <Link href="/trade-program" className="block text-[var(--color-white)]/70 text-[0.82rem] font-light mb-2.5 hover:text-[var(--color-champagne-light)] transition-colors">Trade Program</Link>
            <Link href="/contact" className="block text-[var(--color-white)]/70 text-[0.82rem] font-light mb-2.5 hover:text-[var(--color-champagne-light)] transition-colors">Contact</Link>
            <Link href="/admin" className="block text-[var(--color-white)]/40 text-[0.82rem] font-light mb-2.5 hover:text-[var(--color-champagne-light)] transition-colors">Admin Portal</Link>
          </div>

          {/* Care */}
          <div>
            <p className="text-[var(--color-champagne-light)] text-[0.62rem] tracking-[0.24em] uppercase mb-[1.1rem]">Care</p>
            <Link href="/account" className="block text-[var(--color-white)]/70 text-[0.82rem] font-light mb-2.5 hover:text-[var(--color-champagne-light)] transition-colors">My Account</Link>
            <Link href="/contact" className="block text-[var(--color-white)]/70 text-[0.82rem] font-light mb-2.5 hover:text-[var(--color-champagne-light)] transition-colors">Shipping &amp; Returns</Link>
            <Link href="/contact" className="block text-[var(--color-white)]/70 text-[0.82rem] font-light mb-2.5 hover:text-[var(--color-champagne-light)] transition-colors">FAQ</Link>
          </div>
        </div>

        <div className="border-t border-[var(--color-white)]/15 mt-12 pt-6 flex justify-between flex-wrap gap-4 text-[var(--color-white)]/45 text-[0.72rem] font-light">
          <span>© {new Date().getFullYear()} Firman Furniture. All rights reserved.</span>
          <span>Privacy · Terms · Accessibility</span>
        </div>
      </div>
    </footer>
  )
}
