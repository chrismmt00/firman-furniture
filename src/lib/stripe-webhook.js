import { getPrisma } from '@/lib/prisma'
import { transitionOrder } from '@/lib/orders'
import { sendOrderConfirmationEmail } from '@/lib/email'

// Webhook event processing, separated from the route for testability.
// Every event runs inside one prisma.$transaction that FIRST inserts the Stripe event id
// into processed_stripe_events (primary key). A duplicate delivery violates the PK, the
// transaction rolls back, and the caller returns 200 without reprocessing — idempotent.

export class DuplicateEventError extends Error {}

function isUniqueViolation(err) {
  return err?.code === 'P2002'
}

/**
 * Mark an order paid (pending → confirmed) and decrement stock atomically.
 * - Strict-inventory items use a guarded UPDATE (stock >= qty evaluated atomically in
 *   the database), so concurrent payments cannot oversell.
 * - Backorder / untracked items skip the guard (made-to-order; stock may go negative
 *   to represent units owed to production).
 * - The pending→confirmed optimistic lock in transitionOrder makes double-processing
 *   (e.g. checkout.session.completed + payment_intent.succeeded) a no-op.
 */
async function markOrderPaid(tx, orderId, { paymentIntentId = null, chargeId = null } = {}) {
  await transitionOrder(orderId, 'confirmed', {
    note: 'Payment succeeded (Stripe webhook)',
    tx,
    extraData: {
      ...(paymentIntentId ? { stripe_payment_intent_id: paymentIntentId } : {}),
      ...(chargeId ? { stripe_charge_id: chargeId } : {}),
    },
  })

  const items = await tx.order_items.findMany({
    where: { order_id: orderId, product_id: { not: null } },
    select: { product_id: true, quantity: true, product_name: true },
  })

  for (const item of items) {
    const product = await tx.products.findUnique({
      where: { id: item.product_id },
      select: { track_inventory: true, allow_backorder: true },
    })
    if (!product || !product.track_inventory) continue

    const { count } = await tx.products.updateMany({
      where: {
        id: item.product_id,
        // Strict items: the stock floor is enforced inside the UPDATE itself.
        ...(product.allow_backorder ? {} : { stock_quantity: { gte: item.quantity } }),
      },
      data: { stock_quantity: { decrement: item.quantity } },
    })

    if (count === 0) {
      // Payment already succeeded, so don't fail the order — flag for operations.
      await tx.orders.update({
        where: { id: orderId },
        data: { notes: `⚠ OVERSOLD: "${item.product_name}" x${item.quantity} exceeded stock at payment time.` },
      })
      console.error(`[webhook] Oversell flagged on order ${orderId}: ${item.product_name}`)
    }
  }
}

async function findOrderIdByPaymentIntent(tx, paymentIntentId) {
  if (!paymentIntentId) return null
  const order = await tx.orders.findFirst({
    where: { stripe_payment_intent_id: paymentIntentId },
    select: { id: true },
  })
  return order?.id ?? null
}

/** Process one verified Stripe event. Returns a short outcome string for logging. */
export async function processStripeEvent(event) {
  const prisma = getPrisma()

  let confirmationEmail = null // sent after commit; email must never fail the webhook

  const outcome = await prisma
    .$transaction(async (tx) => {
      // Idempotency gate — PK violation here means we already processed this event.
      await tx.processed_stripe_events.create({ data: { id: event.id, type: event.type } })

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object
          if (session.payment_status !== 'paid') return 'session-not-paid-yet'
          const orderId = session.metadata?.order_id
          if (!orderId) return 'no-order-metadata'
          try {
            await markOrderPaid(tx, orderId, {
              paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
            })
          } catch (err) {
            if (/Illegal order transition/.test(err.message)) return 'already-paid'
            throw err
          }
          const order = await tx.orders.findUnique({
            where: { id: orderId },
            select: { email: true, order_number: true, total_cents: true },
          })
          if (order) confirmationEmail = order
          return 'order-confirmed'
        }

        case 'payment_intent.succeeded': {
          // Belt-and-braces: normally checkout.session.completed confirms first, and
          // this becomes 'already-paid' via the state machine.
          const intent = event.data.object
          const orderId = intent.metadata?.order_id || (await findOrderIdByPaymentIntent(tx, intent.id))
          if (!orderId) return 'no-order-metadata'
          try {
            await markOrderPaid(tx, orderId, {
              paymentIntentId: intent.id,
              chargeId: typeof intent.latest_charge === 'string' ? intent.latest_charge : null,
            })
            return 'order-confirmed'
          } catch (err) {
            if (/Illegal order transition/.test(err.message)) return 'already-paid'
            throw err
          }
        }

        case 'payment_intent.payment_failed': {
          const intent = event.data.object
          const orderId = intent.metadata?.order_id || (await findOrderIdByPaymentIntent(tx, intent.id))
          if (!orderId) return 'no-order-metadata'
          // Order stays pending (customer may retry); record the failure for ops.
          await tx.orders.update({
            where: { id: orderId },
            data: { notes: `Payment failed: ${intent.last_payment_error?.message || 'unknown reason'}` },
          })
          return 'payment-failure-recorded'
        }

        case 'charge.refunded': {
          const charge = event.data.object
          const orderId =
            charge.metadata?.order_id ||
            (await findOrderIdByPaymentIntent(
              tx,
              typeof charge.payment_intent === 'string' ? charge.payment_intent : null
            ))
          if (!orderId) return 'no-order-metadata'
          try {
            await transitionOrder(orderId, 'refunded', {
              note: `Refunded via Stripe (charge ${charge.id})`,
              tx,
              extraData: { stripe_charge_id: charge.id },
            })
            return 'order-refunded'
          } catch (err) {
            if (/Illegal order transition/.test(err.message)) return 'already-refunded'
            throw err
          }
        }

        case 'charge.dispute.created': {
          const dispute = event.data.object
          const orderId = await findOrderIdByPaymentIntent(
            tx,
            typeof dispute.payment_intent === 'string' ? dispute.payment_intent : null
          )
          if (!orderId) return 'no-order-metadata'
          // No 'disputed' state in the enum — keep status, flag loudly for operations.
          await tx.orders.update({
            where: { id: orderId },
            data: { notes: `⚠ DISPUTE OPENED: ${dispute.id} (${dispute.reason}) — respond in the Stripe dashboard.` },
          })
          console.error(`[webhook] Dispute ${dispute.id} on order ${orderId}`)
          return 'dispute-recorded'
        }

        default:
          return 'ignored'
      }
    })
    .catch((err) => {
      if (isUniqueViolation(err)) throw new DuplicateEventError(event.id)
      throw err
    })

  if (confirmationEmail) {
    sendOrderConfirmationEmail(confirmationEmail.email, {
      orderNumber: confirmationEmail.order_number,
      totalCents: confirmationEmail.total_cents,
    }).catch((err) => console.error('[webhook] confirmation email failed:', err.message))
  }

  return outcome
}
