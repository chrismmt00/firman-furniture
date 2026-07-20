'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/components/providers/StoreProvider'
import { formatCents } from '@/lib/format'
import { cartTotals, STANDARD_SHIPPING } from '@/lib/cart-totals'
import { beginCheckout } from '@/lib/checkout-actions'

const input =
  'p-4 bg-[var(--color-white)] border border-[var(--color-stone)] outline-none text-sm font-light focus:border-[var(--color-charcoal)]'

export default function CheckoutView() {
  const { cart, hydrated } = useStore()
  const [step, setStep] = useState(1)
  const [shipMethod, setShipMethod] = useState('white-glove')
  const [contact, setContact] = useState({
    email: '', firstName: '', lastName: '', address1: '', address2: '',
    city: '', state: '', postalCode: '', phone: '',
  })
  const [contactError, setContactError] = useState('')
  const [payState, payAction, payPending] = useActionState(beginCheckout, {})

  if (hydrated && cart.length === 0) {
    return (
      <div className="max-w-[680px] mx-auto px-6 py-24 text-center">
        <p className="font-serif text-2xl text-[var(--color-charcoal)]">Your bag is empty.</p>
        <Link href="/shop" className="inline-block mt-5 px-8 py-3.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.2em] uppercase">Shop now</Link>
      </div>
    )
  }

  const shippingOverride = shipMethod === 'standard' ? STANDARD_SHIPPING : 0
  // Display-only estimate; the authoritative totals are recomputed server-side.
  const totals = cartTotals(cart, { shippingOverride })

  const setField = (k) => (e) => setContact((c) => ({ ...c, [k]: e.target.value }))

  const continueToDelivery = () => {
    const required = ['email', 'firstName', 'lastName', 'address1', 'city', 'state', 'postalCode']
    if (required.some((k) => !contact[k].trim())) {
      setContactError('Please fill in all required fields.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
      setContactError('Enter a valid email address.')
      return
    }
    setContactError('')
    setStep(2)
  }

  // Server payload: contact/shipping + cart lines (ids + quantities only — never prices).
  const payload = JSON.stringify({
    ...contact,
    shippingMethod: shipMethod,
    items: cart.map((c) => ({ id: c.id, qty: c.qty, variant: c.variant || null })),
  })

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
        <span className={stepStyle(2)}>2 · Delivery &amp; Review</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(300px,380px)] gap-12 items-start">
        <div>
          {step === 1 && (
            <>
              <h2 className="text-2xl">Contact &amp; shipping</h2>
              <div className="grid grid-cols-2 gap-3 mt-5">
                <input value={contact.email} onChange={setField('email')} type="email" required placeholder="Email *" autoComplete="email" className={`${input} col-span-2`} />
                <input value={contact.firstName} onChange={setField('firstName')} required placeholder="First name *" autoComplete="given-name" className={input} />
                <input value={contact.lastName} onChange={setField('lastName')} required placeholder="Last name *" autoComplete="family-name" className={input} />
                <input value={contact.address1} onChange={setField('address1')} required placeholder="Address *" autoComplete="address-line1" className={`${input} col-span-2`} />
                <input value={contact.address2} onChange={setField('address2')} placeholder="Apt, suite (optional)" autoComplete="address-line2" className={`${input} col-span-2`} />
                <input value={contact.city} onChange={setField('city')} required placeholder="City *" autoComplete="address-level2" className={input} />
                <input value={contact.state} onChange={setField('state')} required placeholder="State *" autoComplete="address-level1" className={input} />
                <input value={contact.postalCode} onChange={setField('postalCode')} required placeholder="ZIP *" autoComplete="postal-code" className={input} />
                <input value={contact.phone} onChange={setField('phone')} placeholder="Phone (optional)" autoComplete="tel" className={input} />
              </div>
              {contactError ? <p className="text-[0.8rem] text-red-700 mt-3">{contactError}</p> : null}
              <button onClick={continueToDelivery} className="mt-6 w-full py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[var(--color-champagne-dark)] transition-colors">Continue to delivery</button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl">Delivery method</h2>
              <label className={`flex items-center gap-4 border mt-4 cursor-pointer ${shipMethod === 'white-glove' ? 'border-[var(--color-champagne)] bg-[var(--color-champagne-pale)]' : 'border-[var(--color-stone)]'}`} style={{ padding: '1.1rem' }}>
                <input type="radio" name="ship" checked={shipMethod === 'white-glove'} onChange={() => setShipMethod('white-glove')} className="accent-[var(--color-champagne-dark)]" />
                <div className="flex-1"><p className="text-sm font-medium">White-Glove Delivery</p><p className="text-[0.76rem] text-[var(--color-mid-gray)]">Placement &amp; assembly · 3–5 weeks</p></div>
                <span className="text-sm">Complimentary</span>
              </label>
              <label className={`flex items-center gap-4 border mt-3 cursor-pointer ${shipMethod === 'standard' ? 'border-[var(--color-champagne)] bg-[var(--color-champagne-pale)]' : 'border-[var(--color-stone)]'}`} style={{ padding: '1.1rem' }}>
                <input type="radio" name="ship" checked={shipMethod === 'standard'} onChange={() => setShipMethod('standard')} className="accent-[var(--color-champagne-dark)]" />
                <div className="flex-1"><p className="text-sm font-medium">Standard Freight</p><p className="text-[0.76rem] text-[var(--color-mid-gray)]">Curbside · 1–2 weeks</p></div>
                <span className="text-sm">$250</span>
              </label>

              <h2 className="text-2xl mt-8">Review your order</h2>
              <div className="border-t border-[var(--color-stone)] mt-4">
                {cart.map((c) => (
                  <div key={`${c.id}-${c.variant}`} className="grid grid-cols-[56px_1fr_auto] gap-4 items-center py-3.5 border-b border-[var(--color-stone)]">
                    <img loading="lazy" src={c.image} alt="" className="w-14 h-[66px] object-cover bg-[var(--color-stone)]" />
                    <div><p className="text-sm">{c.name}</p><p className="text-[0.74rem] text-[var(--color-warm-gray)]">Qty {c.qty} · {c.variant}</p></div>
                    <span className="text-sm">{formatCents(c.price * c.qty)}</span>
                  </div>
                ))}
              </div>

              <p className="text-[0.8rem] text-[var(--color-mid-gray)] mt-5">
                Payment is completed securely on Stripe — cards, Apple Pay and Google Pay. You’ll be
                returned here once your payment is confirmed.
              </p>

              {payState?.error ? <p className="text-[0.8rem] text-red-700 mt-3">{payState.error}</p> : null}

              <form action={payAction} className="flex gap-2.5 mt-6">
                <input type="hidden" name="payload" value={payload} />
                <button type="button" onClick={() => setStep(1)} disabled={payPending} className="px-6 py-4 border border-[var(--color-charcoal)] text-[0.66rem] tracking-[0.16em] uppercase disabled:opacity-60">Back</button>
                <button
                  type="submit"
                  disabled={payPending}
                  className="flex-1 py-4 bg-[var(--color-champagne)] text-[var(--color-black)] text-[0.68rem] tracking-[0.22em] uppercase font-semibold hover:bg-[var(--color-champagne-light)] transition-colors disabled:opacity-60 disabled:pointer-events-none"
                >
                  {payPending ? 'Preparing secure payment…' : `Pay securely · ${formatCents(totals.total)}`}
                </button>
              </form>
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
