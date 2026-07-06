import Link from 'next/link'

const TABS = [
  { href: '/account', label: 'Overview' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/wishlist', label: 'Wishlist' },
  { href: '/account/addresses', label: 'Addresses' },
  { href: '/account/settings', label: 'Settings' },
]

export default function AccountTabs({ active }) {
  return (
    <div className="flex gap-7 flex-wrap border-b border-[var(--color-stone)] my-8">
      {TABS.map((t) => {
        const isActive = t.href === active
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`text-[0.66rem] tracking-[0.16em] uppercase pb-3.5 ${
              isActive
                ? 'text-[var(--color-black)] font-medium border-b-2 border-[var(--color-champagne)]'
                : 'text-[var(--color-mid-gray)] hover:text-[var(--color-black)]'
            }`}
          >
            {t.label}
          </Link>
        )
      })}
    </div>
  )
}
