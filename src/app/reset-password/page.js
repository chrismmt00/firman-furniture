import Link from 'next/link'
import AuthShell from '@/components/auth/AuthShell'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

export const metadata = { title: 'Set New Password' }

export default async function ResetPasswordPage({ searchParams }) {
  const sp = (await searchParams) || {}
  const token = typeof sp.token === 'string' ? sp.token : ''

  if (!token) {
    return (
      <AuthShell title="Invalid reset link" subtitle="This link is missing or malformed">
        <p className="text-center text-[0.85rem] text-[var(--color-mid-gray)]">
          Please{' '}
          <Link href="/forgot-password" className="underline hover:text-[var(--color-charcoal)]">
            request a new reset link
          </Link>
          .
        </p>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Set a new password" subtitle="Choose a new password for your account">
      <ResetPasswordForm token={token} />
    </AuthShell>
  )
}
