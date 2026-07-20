'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

// Root-layout error boundary (rare: errors in the root layout itself).
// Must render its own <html>/<body>.
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) Sentry.captureException(error)
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ fontFamily: 'Georgia, serif', textAlign: 'center', padding: '6rem 1.5rem', background: '#f8f6f2', color: '#2b2b28' }}>
        <p style={{ fontSize: '1.8rem' }}>Something went wrong.</p>
        <p style={{ color: '#8a8478', marginTop: '0.75rem', fontSize: '0.9rem' }}>We’ve been notified.</p>
        <button
          onClick={reset}
          style={{ marginTop: '2rem', padding: '0.9rem 2rem', background: '#1c1b1a', color: '#f8f6f2', border: 0, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.66rem', cursor: 'pointer' }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
