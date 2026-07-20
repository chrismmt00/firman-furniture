'use server'

import { redirect } from 'next/navigation'
import { randomBytes } from 'node:crypto'
import { getPrisma } from '@/lib/prisma'
import {
  hashPassword,
  verifyPassword,
  hashToken,
  createSession,
  setSessionCookie,
  destroySession,
} from '@/lib/auth'
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/lib/validation'
import { sendPasswordResetEmail } from '@/lib/email'
import { rateLimitGuard } from '@/lib/rate-limit'

// Only allow in-app relative redirects (block open-redirect via ?next=).
function safeNext(next) {
  return typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')
    ? next
    : '/account'
}

export async function register(prevState, formData) {
  const limited = await rateLimitGuard('register', { max: 5, windowMs: 60_000 })
  if (limited) return limited

  const parsed = registerSchema.safeParse({
    firstName: formData.get('firstName') || undefined,
    lastName: formData.get('lastName') || undefined,
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Please check your details.' }
  }

  const email = parsed.data.email.toLowerCase()
  const prisma = getPrisma()
  const existing = await prisma.users.findUnique({ where: { email } })
  if (existing) return { error: 'An account with that email already exists.' }

  const password_hash = await hashPassword(parsed.data.password)
  const user = await prisma.users.create({
    data: {
      email,
      password_hash,
      first_name: parsed.data.firstName ?? null,
      last_name: parsed.data.lastName ?? null,
      role: 'customer',
    },
  })

  await setSessionCookie(await createSession(user.id))
  redirect(safeNext(formData.get('next')))
}

export async function login(prevState, formData) {
  const limited = await rateLimitGuard('login', { max: 10, windowMs: 60_000 })
  if (limited) return limited

  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  // Uniform error + a hash even on unknown email would be ideal against timing; keep
  // the message generic so we never reveal whether an email is registered.
  if (!parsed.success) return { error: 'Invalid email or password.' }

  const prisma = getPrisma()
  const user = await prisma.users.findUnique({ where: { email: parsed.data.email.toLowerCase() } })
  if (!user || !user.password_hash) return { error: 'Invalid email or password.' }

  const ok = await verifyPassword(parsed.data.password, user.password_hash)
  if (!ok) return { error: 'Invalid email or password.' }

  await setSessionCookie(await createSession(user.id))
  redirect(safeNext(formData.get('next')))
}

export async function logout() {
  await destroySession()
  redirect('/')
}

export async function requestPasswordReset(prevState, formData) {
  const limited = await rateLimitGuard('forgot-password', { max: 5, windowMs: 60_000 })
  if (limited) return limited

  const parsed = forgotPasswordSchema.safeParse({ email: formData.get('email') })
  if (!parsed.success) return { error: 'Enter a valid email address.' }

  const email = parsed.data.email.toLowerCase()
  const prisma = getPrisma()
  const user = await prisma.users.findUnique({ where: { email } })

  if (user) {
    const token = randomBytes(32).toString('base64url')
    await prisma.password_reset_tokens.create({
      data: {
        user_id: user.id,
        token: hashToken(token),
        expires_at: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
      },
    })
    const base = process.env.AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || ''
    await sendPasswordResetEmail(email, `${base}/reset-password?token=${token}`)
  }

  // Always report success — do not disclose whether the email is registered.
  return { ok: true }
}

export async function resetPassword(prevState, formData) {
  const limited = await rateLimitGuard('reset-password', { max: 5, windowMs: 60_000 })
  if (limited) return limited

  const parsed = resetPasswordSchema.safeParse({
    token: formData.get('token'),
    password: formData.get('password'),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Password must be at least 8 characters.' }
  }

  const prisma = getPrisma()
  const row = await prisma.password_reset_tokens.findUnique({
    where: { token: hashToken(parsed.data.token) },
  })
  if (!row || row.used || row.expires_at.getTime() < Date.now()) {
    return { error: 'This reset link is invalid or has expired.' }
  }

  const password_hash = await hashPassword(parsed.data.password)
  // Atomically: set new password, consume the token, and revoke all existing sessions.
  await prisma.$transaction([
    prisma.users.update({ where: { id: row.user_id }, data: { password_hash } }),
    prisma.password_reset_tokens.update({ where: { id: row.id }, data: { used: true } }),
    prisma.sessions.deleteMany({ where: { user_id: row.user_id } }),
  ])

  redirect('/login?reset=1')
}
