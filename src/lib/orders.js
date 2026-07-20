import { randomInt } from 'node:crypto'
import { getPrisma } from '@/lib/prisma'
import { STANDARD_SHIPPING, TAX_RATE } from '@/lib/cart-totals'
import { formatCents, formatDate } from '@/lib/format'
import { statusMeta } from '@/lib/demo-data'

// Server-authoritative order layer.
// - Prices/totals are ALWAYS recomputed from the products table; the client only ever
//   submits { productId, qty, variant } — never amounts.
// - Status changes go through transitionOrder()'s state machine and are recorded in
//   order_status_history. Nothing client-facing writes `status` directly.
// - Stock is checked at order creation but only decremented when payment succeeds
//   (webhook, inside the same transaction as the paid transition).

/* ── State machine ────────────────────────────────────────────────
   pending    → confirmed (payment succeeded) | cancelled
   confirmed  → processing | cancelled | refunded
   processing → shipped | cancelled | refunded
   shipped    → delivered | refunded
   delivered  → refunded
   cancelled/refunded are terminal. */
/** Errors safe to show to customers verbatim (stock, availability, input problems).
    Anything else (Prisma/Stripe internals) must be replaced with a generic message. */
export class CheckoutError extends Error {
  customerSafe = true
}

export const ORDER_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled', 'refunded'],
  processing: ['shipped', 'cancelled', 'refunded'],
  shipped: ['delivered', 'refunded'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
}

export function canTransition(from, to) {
  return (ORDER_TRANSITIONS[from] || []).includes(to)
}

const STATUS_TIMESTAMP = {
  shipped: 'shipped_at',
  delivered: 'delivered_at',
  cancelled: 'cancelled_at',
}

/**
 * Move an order to a new status, enforcing the state machine, concurrency-safely
 * (the UPDATE is conditional on the status we read), and writing an audit row.
 * Pass `tx` to run inside an existing prisma.$transaction (e.g. the webhook's
 * paid+stock transaction); otherwise a transaction is created here.
 */
export async function transitionOrder(orderId, toStatus, { changedBy = null, note = null, tx = null, extraData = {} } = {}) {
  const run = async (db) => {
    const order = await db.orders.findUnique({
      where: { id: orderId },
      select: { id: true, status: true },
    })
    if (!order) throw new Error('Order not found.')
    if (!canTransition(order.status, toStatus)) {
      throw new Error(`Illegal order transition: ${order.status} → ${toStatus}`)
    }

    const data = { status: toStatus, updated_at: new Date(), ...extraData }
    const tsField = STATUS_TIMESTAMP[toStatus]
    if (tsField) data[tsField] = new Date()

    // Conditional update = optimistic lock: if a concurrent writer changed the status
    // between our read and write, count is 0 and we refuse rather than clobber.
    const { count } = await db.orders.updateMany({
      where: { id: orderId, status: order.status },
      data,
    })
    if (count !== 1) throw new Error('Order was modified concurrently; transition aborted.')

    await db.order_status_history.create({
      data: {
        order_id: orderId,
        from_status: order.status,
        to_status: toStatus,
        changed_by: changedBy,
        note,
      },
    })

    return { from: order.status, to: toStatus }
  }

  if (tx) return run(tx)
  return getPrisma().$transaction(run)
}

/* ── Server-side pricing ──────────────────────────────────────────── */

/**
 * Re-price client cart lines ({ id, qty, variant }) from the database.
 * Throws if any product is missing/unpublished, qty invalid, or stock insufficient.
 * Returns priced lines with DB prices and snapshot fields for order_items.
 */
export async function priceCartItems(cartItems, db = getPrisma()) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new CheckoutError('Your bag is empty.')
  }

  // Collapse duplicate (product, variant) lines and validate quantities.
  const byKey = new Map()
  for (const line of cartItems) {
    const qty = Number(line?.qty)
    if (!line?.id || !Number.isInteger(qty) || qty < 1 || qty > 50) {
      throw new CheckoutError('Invalid item quantity.')
    }
    const key = `${line.id}::${line.variant || ''}`
    const prev = byKey.get(key)
    byKey.set(key, { id: line.id, variant: line.variant || null, qty: (prev?.qty || 0) + qty })
  }
  const lines = [...byKey.values()]

  const products = await db.products.findMany({
    where: { id: { in: lines.map((l) => l.id) }, status: 'published' },
    include: { product_images: { where: { is_primary: true }, take: 1 } },
  })
  const productById = new Map(products.map((p) => [p.id, p]))

  // Aggregate qty per product (variants share the product's stock pool).
  const qtyByProduct = new Map()
  for (const l of lines) qtyByProduct.set(l.id, (qtyByProduct.get(l.id) || 0) + l.qty)

  return lines.map((l) => {
    const p = productById.get(l.id)
    if (!p) throw new CheckoutError('An item in your bag is no longer available.')
    const wanted = qtyByProduct.get(l.id)
    if (p.track_inventory && !p.allow_backorder && wanted > p.stock_quantity) {
      throw new CheckoutError(`Only ${p.stock_quantity} of “${p.name}” ${p.stock_quantity === 1 ? 'is' : 'are'} in stock.`)
    }
    return {
      productId: p.id,
      name: p.name,
      sku: p.sku,
      variant: l.variant,
      qty: l.qty,
      unitPriceCents: p.price_cents, // authoritative DB price
      totalPriceCents: p.price_cents * l.qty,
      imageUrl: p.product_images[0]?.url || null,
    }
  })
}

/** Totals from server-priced lines. Mirrors the storefront's advertised rules. */
export function computeTotals(pricedLines, { shippingMethod = 'white-glove' } = {}) {
  const subtotal = pricedLines.reduce((n, l) => n + l.totalPriceCents, 0)
  const shipping = shippingMethod === 'standard' ? STANDARD_SHIPPING : 0
  const tax = Math.round(subtotal * TAX_RATE)
  return { subtotal, shipping, tax, total: subtotal + shipping + tax }
}

const SHIPPING_METHOD_LABEL = {
  'white-glove': 'White-Glove Delivery',
  standard: 'Standard Freight',
}

async function uniqueOrderNumber(db) {
  for (let i = 0; i < 5; i++) {
    const number = `FRM-${randomInt(10000, 100000)}`
    const clash = await db.orders.findUnique({ where: { order_number: number }, select: { id: true } })
    if (!clash) return number
  }
  // Practically unreachable at this catalogue's scale; widen the space as a fallback.
  return `FRM-${randomInt(100000, 1000000)}`
}

/**
 * Create a `pending` order from client cart lines + shipping details.
 * Everything monetary is recomputed server-side inside one transaction; order_items
 * snapshot name/sku/price/image so history survives later catalogue edits.
 */
export async function createPendingOrder({ userId = null, email, shipping = {}, cartItems, shippingMethod = 'white-glove' }) {
  const prisma = getPrisma()

  return prisma.$transaction(async (tx) => {
    const lines = await priceCartItems(cartItems, tx)
    const totals = computeTotals(lines, { shippingMethod })
    const orderNumber = await uniqueOrderNumber(tx)

    const order = await tx.orders.create({
      data: {
        order_number: orderNumber,
        user_id: userId,
        email,
        status: 'pending',
        subtotal_cents: totals.subtotal,
        shipping_amount_cents: totals.shipping,
        tax_amount_cents: totals.tax,
        total_cents: totals.total,
        currency: 'USD',
        shipping_method: SHIPPING_METHOD_LABEL[shippingMethod] || shippingMethod,
        shipping_first_name: shipping.firstName || null,
        shipping_last_name: shipping.lastName || null,
        shipping_address1: shipping.address1 || null,
        shipping_address2: shipping.address2 || null,
        shipping_city: shipping.city || null,
        shipping_state: shipping.state || null,
        shipping_postal_code: shipping.postalCode || null,
        shipping_country: shipping.country || 'US',
        shipping_phone: shipping.phone || null,
        order_items: {
          create: lines.map((l) => ({
            product_id: l.productId,
            product_name: l.name,
            variant_name: l.variant,
            sku: l.sku,
            quantity: l.qty,
            unit_price_cents: l.unitPriceCents,
            total_price_cents: l.totalPriceCents,
            image_url: l.imageUrl,
          })),
        },
        order_status_history: {
          create: { from_status: null, to_status: 'pending', changed_by: userId, note: 'Order created' },
        },
      },
      include: { order_items: true },
    })

    return order
  })
}

/* ── Ownership-enforced reads, decorated for the existing account UI ── */

function trackingText(o) {
  if (o.tracking_number) return `${o.tracking_number}`
  switch (o.status) {
    case 'pending': return 'Awaiting payment'
    case 'confirmed': return 'Payment received'
    case 'processing': return 'Preparing your order'
    case 'shipped': return 'In transit'
    case 'delivered': return 'Delivered'
    case 'cancelled': return 'Cancelled'
    case 'refunded': return 'Refunded'
    default: return '—'
  }
}

function decorateDbOrder(o) {
  const meta = statusMeta(o.status)
  const items = o.order_items.map((it) => ({
    name: it.product_name + (it.variant_name ? ` · ${it.variant_name}` : ''),
    qty: it.quantity,
    price: it.unit_price_cents,
    priceFmt: formatCents(it.unit_price_cents),
    lineFmt: formatCents(it.total_price_cents),
    image: it.image_url,
  }))
  return {
    number: o.order_number,
    status: o.status,
    statusLabel: meta.label,
    statusColor: meta.color,
    statusBg: meta.bg,
    date: formatDate(o.placed_at),
    method: o.shipping_method || '—',
    tracking: trackingText(o),
    customer: [o.shipping_first_name, o.shipping_last_name].filter(Boolean).join(' ') || o.email,
    location: [o.shipping_city, [o.shipping_state, o.shipping_postal_code].filter(Boolean).join(' ')]
      .filter(Boolean)
      .join(', '),
    total: o.total_cents,
    totalFmt: formatCents(o.total_cents),
    itemCount: items.reduce((n, i) => n + i.qty, 0),
    firstImage: items[0]?.image,
    items,
  }
}

/** All orders belonging to a user — ownership enforced in the query itself. */
export async function getOrdersForUser(userId) {
  if (!userId) return []
  const rows = await getPrisma().orders.findMany({
    where: { user_id: userId },
    orderBy: { placed_at: 'desc' },
    include: { order_items: true },
  })
  return rows.map(decorateDbOrder)
}

/** One order by number, only if it belongs to the user (null otherwise). */
export async function getOrderForUser(userId, orderNumber) {
  if (!userId || !orderNumber) return null
  const row = await getPrisma().orders.findFirst({
    where: { order_number: orderNumber, user_id: userId },
    include: { order_items: true },
  })
  return row ? decorateDbOrder(row) : null
}
