'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/lib/auth-actions'

const input =
  'w-full p-4 bg-[var(--color-white)] border border-[var(--color-stone)] outline-none text-sm font-light focus:border-[var(--color-charcoal)]'
const button =
  'mt-2 w-full py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[var(--color-champagne-dark)] transition-colors disabled:opacity-60 disabled:pointer-events-none'

export default function LoginForm({ next }) {
  const [state, action, pending] = useActionState(login, {})

  return (
    <form action={action} className="flex flex-col gap-3">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <input name="email" type="email" required placeholder="Email" autoComplete="email" className={input} />
      <input name="password" type="password" required placeholder="Password" autoComplete="current-password" className={input} />
      {state?.error ? <p className="text-[0.8rem] text-red-700">{state.error}</p> : null}
      <button type="submit" disabled={pending} className={button}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
      <div className="flex justify-between text-[0.78rem] text-[var(--color-mid-gray)] mt-1">
        <Link href="/forgot-password" className="hover:text-[var(--color-charcoal)]">Forgot password?</Link>
        <Link href="/register" className="hover:text-[var(--color-charcoal)]">Create account</Link>
      </div>
    </form>
  )
}
