import { cache } from 'react'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { randomBytes, createHash } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { getPrisma } from '@/lib/prisma'
import { SESSION_COOKIE, SESSION_TTL_MS } from '@/lib/auth-constants'

// Server-only auth core: password hashing (bcrypt) + database-backed opaque sessions.
// The raw session token lives in an httpOnly cookie; only its SHA-256 hash is stored in
// the `sessions` table, so a database leak can't be replayed as a live session.

const BCRYPT_ROUNDS = 12

export function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex')
}

export async function createSession(userId) {
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
  await getPrisma().sessions.create({
    data: { user_id: userId, session_token: hashToken(token), expires_at: expiresAt },
  })
  return { token, expiresAt }
}

// Must be called from a Server Action or Route Handler (cookie writes).
export async function setSessionCookie({ token, expiresAt }) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) {
    await getPrisma().sessions.deleteMany({ where: { session_token: hashToken(token) } })
  }
  cookieStore.delete(SESSION_COOKIE)
}

function toPublicUser(u) {
  return {
    id: u.id,
    email: u.email,
    firstName: u.first_name,
    lastName: u.last_name,
    role: u.role,
    isTrade: u.is_trade,
    phone: u.phone,
    avatarUrl: u.avatar_url,
    createdAt: u.created_at,
  }
}

// Cached per request so a layout + page + action resolve the session with one DB hit.
export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = await getPrisma().sessions.findUnique({
    where: { session_token: hashToken(token) },
    include: { users: true },
  })
  if (!session || !session.users) return null
  if (session.expires_at.getTime() < Date.now()) return null

  return toPublicUser(session.users)
})

// Authoritative guards for server components / actions (proxy is only optimistic).
export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user) redirect('/login?next=/admin')
  // 404 rather than 403 so the admin surface isn't disclosed to non-admins.
  if (user.role !== 'admin') notFound()
  return user
}
