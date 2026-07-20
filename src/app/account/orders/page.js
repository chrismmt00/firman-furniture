import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { getOrdersForUser } from '@/lib/orders'

export const metadata = { title: 'Order History' }

export default async function OrdersPage() {
  const user = await requireUser()
  // Ownership enforced in the query — only this user's orders are ever fetched.
  const orders = await getOrdersForUser(user.id)

  return (
    <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,4rem)] pt-10 pb-24">
      <div className="text-[0.66rem] tracking-[0.16em] uppercase text-[var(--color-warm-gray)] mb-5">
        <Link href="/account" className="hover:text-[var(--color-charcoal)]">Account</Link> / <span className="text-[var(--color-charcoal)]">Orders</span>
      </div>
      <h1 className="text-[clamp(2.2rem,4.5vw,3.2rem)]" style={{ animation: 'fade-up 0.7s var(--ease-luxury) both' }}>Order history</h1>

      {orders.length === 0 ? (
        <div className="mt-12 text-center border border-[var(--color-stone)] bg-[var(--color-white)] py-16 px-6">
          <p className="font-serif text-2xl text-[var(--color-charcoal)]">No orders yet.</p>
          <p className="text-[0.85rem] text-[var(--color-mid-gray)] mt-2">When you place an order, it will appear here.</p>
          <Link href="/shop" className="inline-block mt-6 px-8 py-3.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.2em] uppercase hover:bg-[var(--color-champagne-dark)] transition-colors">Shop now</Link>
        </div>
      ) : (
        <div className="mt-9 border-t border-[var(--color-stone)]">
          {orders.map((o) => (
            <Link key={o.number} href={`/account/orders/${o.number}`} className="grid grid-cols-[120px_1fr_auto_auto_auto] gap-5 items-center px-1 py-5 border-b border-[var(--color-stone)] hover:bg-[var(--color-white)]">
              <img loading="lazy" src={o.firstImage} alt="" className="w-[54px] h-16 object-cover bg-[var(--color-stone)]" />
              <div>
                <p className="text-sm font-medium text-[var(--color-black)]">{o.number}</p>
                <p className="text-[0.76rem] text-[var(--color-warm-gray)] mt-0.5">{o.date} · {o.itemCount} items · {o.method}</p>
              </div>
              <span className="text-[0.6rem] tracking-[0.14em] uppercase px-2.5 py-1.5 justify-self-start" style={{ color: o.statusColor, background: o.statusBg }}>{o.statusLabel}</span>
              <span className="text-[0.95rem]">{o.totalFmt}</span>
              <span className="text-[var(--color-champagne-dark)] text-[0.66rem] tracking-[0.14em] uppercase">View →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
