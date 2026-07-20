import { getStripe } from '@/lib/stripe'
import { processStripeEvent, DuplicateEventError } from '@/lib/stripe-webhook'

// Stripe webhook endpoint.
// - Node runtime (explicit): Stripe SDK signature verification needs Node crypto.
// - Raw body via await req.text() BEFORE any parsing — constructEvent must see the
//   exact bytes Stripe signed.
// - Idempotent: processed event ids are recorded; duplicates return 200 untouched.
// - Non-2xx responses make Stripe retry, so transient failures self-heal.
export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET is not configured')
    return new Response('Webhook not configured', { status: 500 })
  }

  const payload = await req.text()
  const signature = req.headers.get('stripe-signature')

  let event
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret)
  } catch (err) {
    console.error('[webhook] signature verification failed:', err.message)
    return new Response('Invalid signature', { status: 400 })
  }

  try {
    const outcome = await processStripeEvent(event)
    return Response.json({ received: true, outcome })
  } catch (err) {
    if (err instanceof DuplicateEventError) {
      return Response.json({ received: true, outcome: 'duplicate-skipped' })
    }
    console.error(`[webhook] ${event.type} (${event.id}) failed:`, err.message)
    return new Response('Webhook handler error', { status: 500 }) // Stripe will retry
  }
}
