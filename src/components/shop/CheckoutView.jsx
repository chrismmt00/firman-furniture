'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/components/providers/StoreProvider'
import { formatCents } from '@/lib/format'
import { cartTotals, STANDARD_SHIPPING } from '@/lib/cart-totals'

const input =
  'p-4 bg-[var(--color-white)] border border-[var(--color-stone)] outline-none text-sm font-light focus:border-[var(--color-charcoal)]'

export default function CheckoutView() {
  const { cart, hydrated, clearCart } = useStore()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [shipMethod, setShipMethod] = useState('white-glove')

  if (hydrated && cart.length === 0) {
    return (
      <div className="max-w-[680px] mx-auto px-6 py-24 text-center">
        <p className="font-serif text-2xl text-[var(--color-charcoal)]">Your bag is empty.</p>
        <Link href="/shop" className="inline-block mt-5 px-8 py-3.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.2em] uppercase">Shop now</Link>
      </div>
    )
  }

  const shippingOverride = shipMethod === 'standard' ? STANDARD_SHIPPING : 0
  const totals = cartTotals(cart, { shippingOverride })

  const placeOrder = () => {
    // eslint-disable-next-line react-hooks/purity
    const number = `FRM-${Math.floor(20000 + Math.random() * 9000)}`
    try {
      sessionStorage.setItem('firman.lastOrder', JSON.stringify({ number, total: totals.total }))
    } catch { /* ignore */ }
    clearCart()
    router.push('/checkout/success')
  }

  const stepStyle = (n) =>
    `${n === step ? 'text-[var(--color-black)] font-medium' : n < step ? 'text-[var(--color-champagne-dark)]' : 'text-[var(--color-warm-gray)]'}`

  return (
    <div className="max-w-[1180px] mx-auto px-[clamp(1.5rem,5vw,4rem)] pt-10 pb-24">
      <div className="flex items-center gap-4 mb-1.5">
        <Link href="/" className="font-serif text-2xl">FIRMAN</Link>
        <span className="text-[var(--color-warm-gray)] text-[0.66rem] tracking-[0.18em] uppercase">Secure Checkout</span>
      </div>
      <div className="flex gap-6 my-6 text-[0.64rem] tracking-[0.16em] uppercase">
        <span className={stepStyle(1)}>1 · Information</span>
        <span className={stepStyle(2)}>2 · Delivery &amp; Payment</span>
        <span className={stepStyle(3)}>3 · Review</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(300px,380px)] gap-12 items-start">
        <div>
          {step === 1 && (
            <>
              <h2 className="text-2xl">Contact &amp; shipping</h2>
              <div className="grid grid-cols-2 gap-3 mt-5">
                <input placeholder="Email" className={`${input} col-span-2`} />
                <input placeholder="First name" className={input} />
                <input placeholder="Last name" className={input} />
                <input placeholder="Address" className={`${input} col-span-2`} />
                <input placeholder="City" className={input} />
                <input placeholder="State" className={input} />
                <input placeholder="ZIP" className={input} />
                <input placeholder="Phone" className={input} />
              </div>
              <button onClick={() => setStep(2)} className="mt-6 w-full py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[var(--color-champagne-dark)] transition-colors">Continue to delivery</button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl">Delivery method</h2>
              <label className={`flex items-center gap-4 border p-4.5 mt-4 cursor-pointer ${shipMethod === 'white-glove' ? 'border-[var(--color-champagne)] bg-[var(--color-champagne-pale)]' : 'border-[var(--color-stone)]'}`} style={{ padding: '1.1rem' }}>
                <input type="radio" name="ship" checked={shipMethod === 'white-glove'} onChange={() => setShipMethod('white-glove')} className="accent-[var(--color-champagne-dark)]" />
                <div className="flex-1"><p className="text-sm font-medium">White-Glove Delivery</p><p className="text-[0.76rem] text-[var(--color-mid-gray)]">Placement &amp; assembly · 3–5 weeks</p></div>
                <span className="text-sm">Complimentary</span>
              </label>
              <label className={`flex items-center gap-4 border p-4 mt-3 cursor-pointer ${shipMethod === 'standard' ? 'border-[var(--color-champagne)] bg-[var(--color-champagne-pale)]' : 'border-[var(--color-stone)]'}`} style={{ padding: '1.1rem' }}>
                <input type="radio" name="ship" checked={shipMethod === 'standard'} onChange={() => setShipMethod('standard')} className="accent-[var(--color-champagne-dark)]" />
                <div className="flex-1"><p className="text-sm font-medium">Standard Freight</p><p className="text-[0.76rem] text-[var(--color-mid-gray)]">Curbside · 1–2 weeks</p></div>
                <span className="text-sm">$250</span>
              </label>

              <h2 className="text-2xl mt-8">Payment</h2>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <input placeholder="Card number" className={`${input} col-span-2`} />
                <input placeholder="MM / YY" className={input} />
                <input placeholder="CVC" className={input} />
              </div>
              <div className="flex gap-2.5 mt-6">
                <button onClick={() => setStep(1)} className="px-6 py-4 border border-[var(--color-charcoal)] text-[0.66rem] tracking-[0.16em] uppercase">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[var(--color-champagne-dark)] transition-colors">Review order</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl">Review &amp; place order</h2>
              <div className="border-t border-[var(--color-stone)] mt-4">
                {cart.map((c) => (
                  <div key={`${c.id}-${c.variant}`} className="grid grid-cols-[56px_1fr_auto] gap-4 items-center py-3.5 border-b border-[var(--color-stone)]">
                    <img loading="lazy" src={c.image} alt="" className="w-14 h-[66px] object-cover bg-[var(--color-stone)]" />
                    <div><p className="text-sm">{c.name}</p><p className="text-[0.74rem] text-[var(--color-warm-gray)]">Qty {c.qty} · {c.variant}</p></div>
                    <span className="text-sm">{formatCents(c.price * c.qty)}</span>
                  </div>
                ))}
              </div>
              <label className="flex items-center gap-2.5 mt-5 text-[0.82rem] text-[var(--color-mid-gray)]">
                <input type="checkbox" defaultChecked className="accent-[var(--color-champagne-dark)]" />
                I agree to the terms of service and return policy.
              </label>
              <div className="flex gap-2.5 mt-6">
                <button onClick={() => setStep(2)} className="px-6 py-4 border border-[var(--color-charcoal)] text-[0.66rem] tracking-[0.16em] uppercase">Back</button>
                <button onClick={placeOrder} className="flex-1 py-4 bg-[var(--color-champagne)] text-[var(--color-black)] text-[0.68rem] tracking-[0.22em] uppercase font-semibold hover:bg-[var(--color-champagne-light)] transition-colors">Place order · {formatCents(totals.total)}</button>
              </div>
            </>
          )}
        </div>

        {/* Summary */}
        <div className="bg-[var(--color-white)] border border-[var(--color-stone)] p-7 lg:sticky lg:top-24">
          <div className="flex flex-col gap-4 max-h-[240px] overflow-y-auto">
            {cart.map((c) => (
              <div key={`${c.id}-${c.variant}`} className="grid grid-cols-[52px_1fr_auto] gap-3.5 items-center">
                <div className="relative">
                  <img loading="lazy" src={c.image} alt="" className="w-[52px] h-[60px] object-cover bg-[var(--color-stone)]" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--color-charcoal)] text-[var(--color-ivory)] rounded-full text-[0.6rem] flex items-center justify-center">{c.qty}</span>
                </div>
                <div><p className="text-[0.82rem]">{c.name}</p><p className="text-[0.72rem] text-[var(--color-warm-gray)]">{c.variant}</p></div>
                <span className="text-[0.82rem]">{formatCents(c.price * c.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-[var(--color-stone)] pt-4 flex flex-col gap-2.5 text-[0.86rem]">
            <div className="flex justify-between"><span className="text-[var(--color-mid-gray)]">Subtotal</span><span>{formatCents(totals.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-[var(--color-mid-gray)]">Shipping</span><span>{totals.shipping === 0 ? 'Complimentary' : formatCents(totals.shipping)}</span></div>
            <div className="flex justify-between"><span className="text-[var(--color-mid-gray)]">Tax</span><span>{formatCents(totals.tax)}</span></div>
            <div className="flex justify-between border-t border-[var(--color-charcoal)] pt-3.5 text-lg font-medium"><span>Total</span><span>{formatCents(totals.total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
