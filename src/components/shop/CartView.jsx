'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/components/providers/StoreProvider'
import { formatCents } from '@/lib/format'
import { cartTotals } from '@/lib/cart-totals'

export default function CartView() {
  const { cart, hydrated, cartInc, cartDec, cartRemove } = useStore()
  const router = useRouter()
  const totals = cartTotals(cart)

  if (!hydrated) {
    return <div className="max-w-screen-xl mx-auto px-[clamp(1.5rem,5vw,4rem)] pt-10 pb-24"><div className="h-10 w-48 shimmer" /></div>
  }

  return (
    <div className="max-w-screen-xl mx-auto px-[clamp(1.5rem,5vw,4rem)] pt-10 pb-24">
      <h1 className="text-[clamp(2.2rem,4.5vw,3.4rem)]" style={{ animation: 'fade-up 0.7s var(--ease-luxury) both' }}>Your bag</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-serif text-2xl text-[var(--color-charcoal)]">Your bag is empty.</p>
          <Link href="/shop" className="inline-block mt-5 px-8 py-3.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.2em] uppercase hover:bg-[var(--color-champagne-dark)] transition-colors">Shop now</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(300px,360px)] gap-12 mt-8 items-start">
          <div className="border-t border-[var(--color-charcoal)]">
            {cart.map((c, idx) => (
              <div key={`${c.id}-${c.variant}`} className="grid grid-cols-[100px_1fr_auto] gap-5 py-6 border-b border-[var(--color-stone)]">
                <div className="aspect-[4/5] overflow-hidden bg-[var(--color-stone)]">
                  <img loading="lazy" src={c.image} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">{c.category}</p>
                  <h4 className="font-serif text-2xl mt-1">{c.name}</h4>
                  <p className="text-[0.78rem] text-[var(--color-mid-gray)] mt-0.5">Finish · {c.variant}</p>
                  <div className="inline-flex items-center border border-[var(--color-stone)] mt-3.5">
                    <button onClick={() => cartDec(idx)} className="w-8 h-8 text-[var(--color-mid-gray)] hover:text-[var(--color-black)]" aria-label="Decrease">−</button>
                    <span className="w-[34px] text-center text-sm">{c.qty}</span>
                    <button onClick={() => cartInc(idx)} className="w-8 h-8 text-[var(--color-mid-gray)] hover:text-[var(--color-black)]" aria-label="Increase">+</button>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between">
                  <span className="text-lg">{formatCents(c.price * c.qty)}</span>
                  <button onClick={() => cartRemove(idx)} className="text-[0.62rem] tracking-[0.14em] uppercase text-[var(--color-warm-gray)] hover:text-[var(--color-error)]">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[var(--color-white)] border border-[var(--color-stone)] p-7 lg:sticky lg:top-24">
            <h3 className="text-2xl">Summary</h3>
            <div className="mt-5 flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between"><span className="text-[var(--color-mid-gray)]">Subtotal</span><span>{formatCents(totals.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-mid-gray)]">Shipping</span><span>{totals.shipping === 0 ? 'Complimentary' : formatCents(totals.shipping)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-mid-gray)]">Estimated tax</span><span>{formatCents(totals.tax)}</span></div>
              <div className="flex justify-between border-t border-[var(--color-charcoal)] pt-3.5 mt-1 text-lg font-medium"><span>Total</span><span>{formatCents(totals.total)}</span></div>
            </div>
            <input placeholder="Promo code" className="w-full mt-5 p-3.5 bg-[var(--color-ivory)] border border-[var(--color-stone)] outline-none text-[0.82rem] font-light" />
            <button onClick={() => router.push('/checkout')} className="w-full mt-4 py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[var(--color-champagne-dark)] transition-colors">Checkout</button>
            <Link href="/shop" className="block text-center w-full mt-2.5 py-2.5 text-[0.64rem] tracking-[0.16em] uppercase text-[var(--color-mid-gray)] hover:text-[var(--color-black)]">Continue shopping</Link>
          </div>
        </div>
      )}
    </div>
  )
}
