import Link from 'next/link'
import AccountTabs from '@/components/account/AccountTabs'
import WishlistCount from '@/components/account/WishlistCount'
import { addresses } from '@/lib/demo-data'
import { requireUser } from '@/lib/auth'
import { getOrdersForUser } from '@/lib/orders'

export const metadata = { title: 'My Account' }

export default async function AccountPage() {
  const user = await requireUser()
  const orders = await getOrdersForUser(user.id)
  const greetingName = user.firstName || 'there'
  const memberSince = user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()

  return (
    <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,4rem)] pt-10 pb-24">
      <span className="block text-[var(--color-champagne-dark)] text-[0.66rem] tracking-[0.26em] uppercase mb-3">My Account</span>
      <h1 className="text-[clamp(2.2rem,4.5vw,3.4rem)]" style={{ animation: 'fade-up 0.7s var(--ease-luxury) both' }}>Welcome back, {greetingName}.</h1>

      <AccountTabs active="/account" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Link href="/account/orders" className="text-left bg-[var(--color-white)] border border-[var(--color-stone)] p-6 hover:border-[var(--color-champagne)] transition-colors">
          <p className="text-[0.62rem] tracking-[0.18em] uppercase text-[var(--color-warm-gray)]">Orders</p>
          <p className="font-serif text-[2.6rem] mt-1">{orders.length}</p>
        </Link>
        <Link href="/account/wishlist" className="text-left bg-[var(--color-white)] border border-[var(--color-stone)] p-6 hover:border-[var(--color-champagne)] transition-colors">
          <p className="text-[0.62rem] tracking-[0.18em] uppercase text-[var(--color-warm-gray)]">Saved</p>
          <p className="font-serif text-[2.6rem] mt-1"><WishlistCount /></p>
        </Link>
        <Link href="/account/addresses" className="text-left bg-[var(--color-white)] border border-[var(--color-stone)] p-6 hover:border-[var(--color-champagne)] transition-colors">
          <p className="text-[0.62rem] tracking-[0.18em] uppercase text-[var(--color-warm-gray)]">Addresses</p>
          <p className="font-serif text-[2.6rem] mt-1">{addresses.length}</p>
        </Link>
        <div className="bg-[var(--color-champagne-pale)] p-6">
          <p className="text-[0.62rem] tracking-[0.18em] uppercase text-[var(--color-champagne-dark)]">Member since</p>
          <p className="font-serif text-[2.6rem] mt-1">{memberSince}</p>
        </div>
      </div>

      <h2 className="text-2xl mt-12 mb-5">Recent orders</h2>
      {orders.length === 0 ? (
        <div className="text-center border border-[var(--color-stone)] bg-[var(--color-white)] py-12 px-6">
          <p className="font-serif text-xl text-[var(--color-charcoal)]">No orders yet.</p>
          <Link href="/shop" className="inline-block mt-5 px-8 py-3.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.2em] uppercase hover:bg-[var(--color-champagne-dark)] transition-colors">Shop now</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {orders.slice(0, 4).map((o) => (
            <Link key={o.number} href={`/account/orders/${o.number}`} className="grid grid-cols-[1fr_auto_auto_auto] gap-6 items-center bg-[var(--color-white)] border border-[var(--color-stone)] px-6 py-4 hover:border-[var(--color-champagne)] transition-colors">
              <div>
                <p className="text-sm font-medium text-[var(--color-black)]">{o.number}</p>
                <p className="text-[0.74rem] text-[var(--color-warm-gray)] mt-0.5">{o.date} · {o.itemCount} items</p>
              </div>
              <span className="text-[0.6rem] tracking-[0.14em] uppercase px-2.5 py-1.5" style={{ color: o.statusColor, background: o.statusBg }}>{o.statusLabel}</span>
              <span className="text-[0.95rem]">{o.totalFmt}</span>
              <span className="text-[var(--color-champagne-dark)]">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
