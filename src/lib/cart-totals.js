// Cart math shared by the cart page and checkout. Free white-glove delivery
// over $2,500; standard freight otherwise; tax estimated at 8.875%.

const FREE_SHIPPING_THRESHOLD = 250000 // $2,500 in cents
const STANDARD_SHIPPING = 25000 // $250 in cents
const TAX_RATE = 0.08875

export function cartTotals(cart, { shippingOverride } = {}) {
  const subtotal = cart.reduce((n, i) => n + i.price * i.qty, 0)
  const shipping =
    shippingOverride != null
      ? shippingOverride
      : subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : STANDARD_SHIPPING
  const tax = Math.round(subtotal * TAX_RATE)
  const total = subtotal + shipping + tax
  return { subtotal, shipping, tax, total }
}

export { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING, TAX_RATE }
