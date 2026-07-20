import { redirect } from 'next/navigation'
import AuthShell from '@/components/auth/AuthShell'
import LoginForm from '@/components/auth/LoginForm'
import { getCurrentUser } from '@/lib/auth'

export const metadata = { title: 'Sign In' }

export default async function LoginPage({ searchParams }) {
  const sp = (await searchParams) || {}
  const next = typeof sp.next === 'string' && sp.next.startsWith('/') ? sp.next : undefined

  if (await getCurrentUser()) redirect(next || '/account')

  return (
    <AuthShell
      title="Welcome back"
      subtitle={sp.reset ? 'Your password was reset — please sign in.' : 'Sign in to your account'}
    >
      <LoginForm next={next} />
    </AuthShell>
  )
}
