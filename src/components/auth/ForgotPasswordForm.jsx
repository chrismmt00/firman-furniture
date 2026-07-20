'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '@/lib/auth-actions'

const input =
  'w-full p-4 bg-[var(--color-white)] border border-[var(--color-stone)] outline-none text-sm font-light focus:border-[var(--color-charcoal)]'
const button =
  'mt-2 w-full py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[var(--color-champagne-dark)] transition-colors disabled:opacity-60 disabled:pointer-events-none'

export default function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, {})

  if (state?.ok) {
    return (
      <div className="text-center">
        <p className="text-[0.9rem] text-[var(--color-charcoal)]">
          If an account exists for that email, we’ve sent a reset link. Please check your inbox.
        </p>
        <Link href="/login" className="inline-block mt-6 text-[0.78rem] text-[var(--color-mid-gray)] hover:text-[var(--color-charcoal)]">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <input name="email" type="email" required placeholder="Email" autoComplete="email" className={input} />
      {state?.error ? <p className="text-[0.8rem] text-red-700">{state.error}</p> : null}
      <button type="submit" disabled={pending} className={button}>
        {pending ? 'Sending…' : 'Send reset link'}
      </button>
      <p className="text-center text-[0.78rem] text-[var(--color-mid-gray)] mt-1">
        <Link href="/login" className="hover:text-[var(--color-charcoal)]">Back to sign in</Link>
      </p>
    </form>
  )
}
