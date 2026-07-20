'use client'

import { useActionState } from 'react'
import { resetPassword } from '@/lib/auth-actions'

const input =
  'w-full p-4 bg-[var(--color-white)] border border-[var(--color-stone)] outline-none text-sm font-light focus:border-[var(--color-charcoal)]'
const button =
  'mt-2 w-full py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[var(--color-champagne-dark)] transition-colors disabled:opacity-60 disabled:pointer-events-none'

export default function ResetPasswordForm({ token }) {
  const [state, action, pending] = useActionState(resetPassword, {})

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="token" value={token} />
      <input name="password" type="password" required minLength={8} placeholder="New password (min 8 characters)" autoComplete="new-password" className={input} />
      {state?.error ? <p className="text-[0.8rem] text-red-700">{state.error}</p> : null}
      <button type="submit" disabled={pending} className={button}>
        {pending ? 'Updating…' : 'Update password'}
      </button>
    </form>
  )
}
