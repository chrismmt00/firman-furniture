import { getPrisma } from '@/lib/prisma'

// Liveness/readiness probe. 200 when the database answers; 503 otherwise.
// Also reports which integrations are configured (booleans only — no secrets).
export const runtime = 'nodejs'

export async function GET() {
  const checks = {
    db: false,
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    stripeWebhook: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    email: Boolean(process.env.BREVO_API_KEY),
    sentry: Boolean(process.env.SENTRY_DSN),
  }

  try {
    await getPrisma().$queryRaw`SELECT 1`
    checks.db = true
  } catch {
    // db stays false
  }

  return Response.json(
    { ok: checks.db, checks, time: new Date().toISOString() },
    { status: checks.db ? 200 : 503 }
  )
}
