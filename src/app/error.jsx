'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'

// Segment error boundary: shows a generic message — stack traces and internal error
// details are never rendered to the client — and reports to Sentry when configured.
export default function Error({ error, reset }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) Sentry.captureException(error)
    console.error(error)
  }, [error])

  return (
    <div className="max-w-[640px] mx-auto px-6 py-24 text-center">
      <p className="font-serif text-3xl text-[var(--color-charcoal)]">Something went wrong.</p>
      <p className="text-[0.9rem] text-[var(--color-mid-gray)] mt-3">
        We’ve been notified. Please try again, or return to the home page.
      </p>
      <div className="flex gap-2.5 justify-center mt-8">
        <button onClick={reset} className="px-8 py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.2em] uppercase hover:bg-[var(--color-champagne-dark)] transition-colors">Try again</button>
        <Link href="/" className="px-8 py-4 border border-[var(--color-charcoal)] text-[0.66rem] tracking-[0.2em] uppercase">Home</Link>
      </div>
    </div>
  )
}
