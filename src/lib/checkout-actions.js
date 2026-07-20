'use server'

import { redirect } from 'next/navigation'
import { getPrisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'
import { getCurrentUser } from '@/lib/auth'
import { createPendingOrder } from '@/lib/orders'
import { checkoutSchema } from '@/lib/validation'
import { rateLimitGuard } from '@/lib/rate-limit'

function siteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || process.env.AUTH_URL
  if (!url) throw new Error('NEXT_PUBLIC_SITE_URL must be set for checkout redirects.')
  return url.replace(/\/$/, '')
}

/**
 * The single entry point for payment. The client submits contact/shipping details and
 * cart lines (ids + quantities only). Server-side we:
 *   1. validate input (Zod),
 *   2. create a `pending` order priced entirely from the database,
 *   3. create a Stripe Checkout Session whose line items come from OUR order rows
 *      (never client amounts), keyed idempotently on the order id,
 *   4. redirect to Stripe's hosted payment page.
 * The webhook (not the success redirect) later marks the order paid.
 */
export async function beginCheckout(prevState, formData) {
  const limited = await rateLimitGuard('checkout', { max: 10, windowMs: 60_000 })
  if (limited) return limited

  let payload
  try {
    payload = JSON.parse(formData.get('payload') || '{}')
  } catch {
    return { error: 'Invalid checkout payload.' }
  }

  const parsed = checkoutSchema.safeParse(payload)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Please check your details.' }
  }
  const data = parsed.data

  const user = await getCurrentUser() // guest checkout allowed; user linked when present

  let order
  try {
    order = await createPendingOrder({
      userId: user?.id ?? null,
      email: data.email.toLowerCase(),
      shipping: {
        firstName: data.firstName,
        lastName: data.lastName,
        address1: data.address1,
        address2: data.address2 || null,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: 'US',
        phone: data.phone || null,
      },
      cartItems: data.items,
      shippingMethod: data.shippingMethod,
    })
  } catch (err) {
    // Only CheckoutError messages are shown verbatim (stock, availability, quantities);
    // database/internal errors must never leak details to the client.
    if (err?.customerSafe) return { error: err.message }
    console.error('Order creation failed:', err)
    return { error: 'We could not start checkout. Please try again.' }
  }

  const stripe = getStripe()
  const base = siteUrl()

  // Line items straight from the order's snapshot rows (DB-priced).
  const lineItems = order.order_items.map((it) => ({
    quantity: it.quantity,
    price_data: {
      currency: 'usd',
      unit_amount: it.unit_price_cents,
      product_data: {
        name: it.product_name + (it.variant_name ? ` — ${it.variant_name}` : ''),
        ...(it.image_url ? { images: [it.image_url] } : {}),
      },
    },
  }))
  if (order.shipping_amount_cents > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: order.shipping_amount_cents,
        product_data: { name: order.shipping_method || 'Shipping' },
      },
    })
  }
  if (order.tax_amount_cents > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: order.tax_amount_cents,
        product_data: { name: 'Sales tax (8.875%)' },
      },
    })
  }

  let session
  try {
    session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        line_items: lineItems,
        customer_email: data.email.toLowerCase(),
        client_reference_id: order.id,
        metadata: { order_id: order.id, order_number: order.order_number },
        payment_intent_data: {
          metadata: { order_id: order.id, order_number: order.order_number },
        },
        success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/checkout`,
      },
      // Idempotency: retrying this action for the same order can't double-create sessions.
      { idempotencyKey: `checkout-session-${order.id}` }
    )
  } catch (err) {
    console.error('Stripe session creation failed:', err.message)
    return { error: 'Payment is temporarily unavailable. Your card was not charged — please try again shortly.' }
  }

  await getPrisma().orders.update({
    where: { id: order.id },
    data: { stripe_checkout_session_id: session.id },
  })

  redirect(session.url)
}
