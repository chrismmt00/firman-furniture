import { redirect } from 'next/navigation'
import AuthShell from '@/components/auth/AuthShell'
import RegisterForm from '@/components/auth/RegisterForm'
import { getCurrentUser } from '@/lib/auth'

export const metadata = { title: 'Create Account' }

export default async function RegisterPage({ searchParams }) {
  const sp = (await searchParams) || {}
  const next = typeof sp.next === 'string' && sp.next.startsWith('/') ? sp.next : undefined

  if (await getCurrentUser()) redirect(next || '/account')

  return (
    <AuthShell title="Create your account" subtitle="Join Firman for a faster checkout and order history">
      <RegisterForm next={next} />
    </AuthShell>
  )
}
