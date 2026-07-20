'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { register } from '@/lib/auth-actions'

const input =
  'w-full p-4 bg-[var(--color-white)] border border-[var(--color-stone)] outline-none text-sm font-light focus:border-[var(--color-charcoal)]'
const button =
  'mt-2 w-full py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[var(--color-champagne-dark)] transition-colors disabled:opacity-60 disabled:pointer-events-none'

export default function RegisterForm({ next }) {
  const [state, action, pending] = useActionState(register, {})

  return (
    <form action={action} className="flex flex-col gap-3">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <div className="grid grid-cols-2 gap-3">
        <input name="firstName" placeholder="First name" autoComplete="given-name" className={input} />
        <input name="lastName" placeholder="Last name" autoComplete="family-name" className={input} />
      </div>
      <input name="email" type="email" required placeholder="Email" autoComplete="email" className={input} />
      <input name="password" type="password" required minLength={8} placeholder="Password (min 8 characters)" autoComplete="new-password" className={input} />
      {state?.error ? <p className="text-[0.8rem] text-red-700">{state.error}</p> : null}
      <button type="submit" disabled={pending} className={button}>
        {pending ? 'Creating account…' : 'Create account'}
      </button>
      <p className="text-center text-[0.78rem] text-[var(--color-mid-gray)] mt-1">
        Already have an account?{' '}
        <Link href="/login" className="underline hover:text-[var(--color-charcoal)]">Sign in</Link>
      </p>
    </form>
  )
}
