'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatCents } from '@/lib/format'

export default function SuccessView() {
  const [order, setOrder] = useState({ number: 'FRM-00000', total: 0 })

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('firman.lastOrder')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setOrder(JSON.parse(raw))
    } catch { /* ignore */ }
  }, [])

  return (
    <div className="max-w-[640px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-20 pb-28 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--color-champagne-pale)] text-[var(--color-champagne-dark)] flex items-center justify-center text-2xl mx-auto" style={{ animation: 'scale-in 0.5s var(--ease-luxury) both' }}>✓</div>
      <span className="block text-[var(--color-champagne-dark)] text-[0.66rem] tracking-[0.26em] uppercase mt-6">Order confirmed</span>
      <h1 className="text-[clamp(2.2rem,5vw,3.4rem)] mt-2" style={{ animation: 'fade-up 0.7s var(--ease-luxury) both' }}>Thank you, Eleanor.</h1>
      <p className="text-[var(--color-mid-gray)] mt-4 font-light">
        Your order <strong className="text-[var(--color-charcoal)]">{order.number}</strong> is confirmed. A receipt is on its way to your inbox, and our delivery team will be in touch to schedule white-glove placement.
      </p>
      <div className="bg-[var(--color-white)] border border-[var(--color-stone)] p-6 mt-8 flex justify-between text-sm">
        <span className="text-[var(--color-mid-gray)]">Order total</span>
        <span className="font-medium">{formatCents(order.total)}</span>
      </div>
      <div className="flex gap-2.5 justify-center mt-7 flex-wrap">
        <Link href="/account/orders" className="px-8 py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.2em] uppercase hover:bg-[var(--color-champagne-dark)] transition-colors">View order</Link>
        <Link href="/shop" className="px-8 py-4 border border-[var(--color-charcoal)] text-[0.66rem] tracking-[0.2em] uppercase">Continue shopping</Link>
      </div>
    </div>
  )
}
