import Stripe from 'stripe'

// Server-only Stripe client singleton. STRIPE_SECRET_KEY must never reach client
// code — this module is only imported from server actions / route handlers.
let stripeClient = null

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is required for payment operations.')
  }
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  return stripeClient
}
