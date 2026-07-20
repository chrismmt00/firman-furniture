import { headers } from 'next/headers'

// Fixed-window in-memory rate limiter for sensitive endpoints (login, registration,
// password reset, checkout). Per-instance on serverless: each warm lambda keeps its own
// counters, which still blunts brute-force and scripted abuse. For a hard global limit
// across all instances, swap the store for Upstash Redis (@upstash/ratelimit) — the
// call sites won't change.

const buckets = new Map() // key -> { count, resetAt }

function prune(now) {
  if (buckets.size < 10_000) return
  for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k)
}

/** True if the caller is within limits; false when the window is exhausted. */
export function rateLimit(key, { max, windowMs }) {
  const now = Date.now()
  prune(now)
  const entry = buckets.get(key)
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  entry.count += 1
  return entry.count <= max
}

export async function clientIp() {
  const h = await headers()
  return (
    h.get('x-forwarded-for')?.split(',')[0].trim() ||
    h.get('x-real-ip') ||
    'unknown'
  )
}

/**
 * Guard for server actions: returns null when allowed, or a customer-safe error
 * object when the caller should slow down.
 */
export async function rateLimitGuard(bucket, { max = 10, windowMs = 60_000 } = {}) {
  const ip = await clientIp()
  if (rateLimit(`${bucket}:${ip}`, { max, windowMs })) return null
  return { error: 'Too many attempts. Please wait a minute and try again.' }
}
