// Server-side error tracking (Sentry). Entirely gated on SENTRY_DSN — without it,
// nothing initializes and there is zero overhead, so local dev needs no setup.

export async function register() {
  if (process.env.SENTRY_DSN) {
    const Sentry = await import('@sentry/nextjs')
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
      tracesSampleRate: 0.1,
    })
  }
}

// Reports uncaught errors from Server Components, Route Handlers and Server Actions.
export async function onRequestError(...args) {
  if (process.env.SENTRY_DSN) {
    const Sentry = await import('@sentry/nextjs')
    Sentry.captureRequestError(...args)
  }
}
