'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useStore } from '@/components/providers/StoreProvider'
import { formatCents } from '@/lib/format'

export default function SuccessView({ number, total, firstName, paid }) {
  const { clearCart } = useStore()

  // Clear the local cart only once payment is confirmed by Stripe (server-verified).
  useEffect(() => {
    if (paid) clearCart()
  }, [paid, clearCart])

  return (
    <div className="max-w-[640px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-20 pb-28 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--color-champagne-pale)] text-[var(--color-champagne-dark)] flex items-center justify-center text-2xl mx-auto" style={{ animation: 'scale-in 0.5s var(--ease-luxury) both' }}>✓</div>
      <span className="block text-[var(--color-champagne-dark)] text-[0.66rem] tracking-[0.26em] uppercase mt-6">
        {paid ? 'Order confirmed' : 'Payment processing'}
      </span>
      <h1 className="text-[clamp(2.2rem,5vw,3.4rem)] mt-2" style={{ animation: 'fade-up 0.7s var(--ease-luxury) both' }}>
        Thank you{firstName ? `, ${firstName}` : ''}.
      </h1>
      <p className="text-[var(--color-mid-gray)] mt-4 font-light">
        {paid ? (
          <>Your order <strong className="text-[var(--color-charcoal)]">{number}</strong> is confirmed. A receipt is on its way to your inbox, and our delivery team will be in touch to schedule delivery.</>
        ) : (
          <>Your payment for order <strong className="text-[var(--color-charcoal)]">{number}</strong> is being processed. We’ll email your confirmation as soon as it completes.</>
        )}
      </p>
      <div className="bg-[var(--color-white)] border border-[var(--color-stone)] p-6 mt-8 flex justify-between text-sm">
        <span className="text-[var(--color-mid-gray)]">Order total</span>
        <span className="font-medium">{formatCents(total)}</span>
      </div>
      <div className="flex gap-2.5 justify-center mt-7 flex-wrap">
        <Link href="/account/orders" className="px-8 py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.2em] uppercase hover:bg-[var(--color-champagne-dark)] transition-colors">View order</Link>
        <Link href="/shop" className="px-8 py-4 border border-[var(--color-charcoal)] text-[0.66rem] tracking-[0.2em] uppercase">Continue shopping</Link>
      </div>
    </div>
  )
}
