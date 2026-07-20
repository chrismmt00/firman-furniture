import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { getOrderForUser } from '@/lib/orders'

export async function generateMetadata({ params }) {
  const { number } = await params
  return { title: `Order ${number}` }
}

export default async function OrderDetailPage({ params }) {
  const { number } = await params
  const user = await requireUser()
  // Ownership enforced: the query is scoped to this user, so swapping the order
  // number in the URL can never expose someone else's order (404 instead).
  const order = await getOrderForUser(user.id, number)
  if (!order) notFound()

  return (
    <div className="max-w-[1000px] mx-auto px-[clamp(1.5rem,5vw,4rem)] pt-10 pb-24">
      <div className="text-[0.66rem] tracking-[0.16em] uppercase text-[var(--color-warm-gray)] mb-5">
        <Link href="/account/orders" className="hover:text-[var(--color-charcoal)]">Orders</Link> / <span className="text-[var(--color-charcoal)]">{order.number}</span>
      </div>

      <div className="flex justify-between items-end gap-6 flex-wrap" style={{ animation: 'fade-up 0.7s var(--ease-luxury) both' }}>
        <div>
          <h1 className="text-[clamp(2rem,4vw,3rem)]">{order.number}</h1>
          <p className="text-[var(--color-mid-gray)] mt-1">Placed {order.date} · {order.method}</p>
        </div>
        <span className="text-[0.66rem] tracking-[0.16em] uppercase px-4 py-2" style={{ color: order.statusColor, background: order.statusBg }}>{order.statusLabel}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
        <div className="bg-[var(--color-white)] border border-[var(--color-stone)] p-6">
          <p className="text-[0.62rem] tracking-[0.18em] uppercase text-[var(--color-warm-gray)] mb-2.5">Shipping to</p>
          <p className="text-sm leading-relaxed">{order.customer}<br />{order.location || '—'}</p>
        </div>
        <div className="bg-[var(--color-white)] border border-[var(--color-stone)] p-6">
          <p className="text-[0.62rem] tracking-[0.18em] uppercase text-[var(--color-warm-gray)] mb-2.5">Tracking</p>
          <p className="text-sm leading-relaxed">{order.tracking}</p>
        </div>
      </div>

      <h2 className="text-2xl mt-10 mb-4">Items</h2>
      <div className="border-t border-[var(--color-stone)]">
        {order.items.map((it, i) => (
          <div key={i} className="grid grid-cols-[72px_1fr_auto] gap-5 items-center py-4 border-b border-[var(--color-stone)]">
            <img loading="lazy" src={it.image} alt={it.name} className="w-[72px] h-[84px] object-cover bg-[var(--color-stone)]" />
            <div>
              <h4 className="font-serif text-xl">{it.name}</h4>
              <p className="text-[0.78rem] text-[var(--color-warm-gray)] mt-0.5">Qty {it.qty} · {it.priceFmt}</p>
            </div>
            <span className="text-[0.95rem]">{it.lineFmt}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <div className="w-[280px]">
          <div className="flex justify-between pt-3.5 border-t border-[var(--color-charcoal)] text-[0.95rem] font-medium">
            <span>Total</span><span>{order.totalFmt}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2.5 mt-7 flex-wrap">
        <Link href="/contact" className="px-7 py-3.5 border border-[var(--color-charcoal)] text-[0.66rem] tracking-[0.16em] uppercase">Need help?</Link>
        <Link href="/shop" className="px-7 py-3.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.16em] uppercase hover:bg-[var(--color-champagne-dark)] transition-colors">Buy again</Link>
      </div>
    </div>
  )
}
