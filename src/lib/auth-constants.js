// Shared, dependency-free auth constants. Kept separate from src/lib/auth.js so the
// edge-runtime proxy can import the cookie name without pulling in bcrypt/Prisma.
export const SESSION_COOKIE = 'firman_session'
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30 // 30 days
