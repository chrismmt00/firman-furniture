import Link from 'next/link'
import SuccessView from '@/components/shop/SuccessView'
import { getPrisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'

export const metadata = { title: 'Order Confirmed' }

// Display-only: this page NEVER mutates order status — the webhook does that.
// It verifies the session with Stripe server-side and shows the matching order.
export default async function SuccessPage({ searchParams }) {
  const sp = (await searchParams) || {}
  const sessionId = typeof sp.session_id === 'string' ? sp.session_id : null

  let order = null
  let paid = false
  if (sessionId) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId)
      paid = session.payment_status === 'paid'
      const orderId = session.metadata?.order_id
      if (orderId) {
        const row = await getPrisma().orders.findUnique({
          where: { id: orderId },
          select: {
            order_number: true,
            total_cents: true,
            shipping_first_name: true,
            email: true,
            stripe_checkout_session_id: true,
          },
        })
        // Only show the order that actually belongs to this Stripe session.
        if (row && row.stripe_checkout_session_id === sessionId) order = row
      }
    } catch {
      // Stripe unreachable or bad session id — fall through to the generic view.
    }
  }

  if (!order) {
    return (
      <div className="max-w-[640px] mx-auto px-6 py-24 text-center">
        <p className="font-serif text-2xl text-[var(--color-charcoal)]">We couldn’t find that order.</p>
        <p className="text-[0.9rem] text-[var(--color-mid-gray)] mt-3">
          If you just paid, your confirmation email is on its way. You can also check your order history.
        </p>
        <div className="flex gap-2.5 justify-center mt-7">
          <Link href="/account/orders" className="px-8 py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.2em] uppercase">Order history</Link>
          <Link href="/shop" className="px-8 py-4 border border-[var(--color-charcoal)] text-[0.66rem] tracking-[0.2em] uppercase">Continue shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <SuccessView
      number={order.order_number}
      total={order.total_cents}
      firstName={order.shipping_first_name}
      paid={paid}
    />
  )
}
