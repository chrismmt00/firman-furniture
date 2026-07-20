import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Single PrismaClient for the whole process — and reused across HMR reloads in dev —
// so Vercel serverless functions don't exhaust database connections by creating a new
// client per invocation.
//
// Prisma 7 connects through a driver adapter. Here that's a node-postgres pool over the
// *pooled* DATABASE_URL (Neon's pgBouncer endpoint in production; a direct local
// Postgres in dev). Schema migrations use the unpooled DIRECT_URL via prisma.config.ts.
// SSL (sslmode=require) is taken from the connection string, so Neon works with no extra
// config and localhost stays plaintext.
const globalForPrisma = globalThis

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is required to initialize the database client.')
  }
  const adapter = new PrismaPg({ connectionString, max: 5 })
  return new PrismaClient({ adapter })
}

export function getPrisma() {
  if (!globalForPrisma.__prisma) {
    globalForPrisma.__prisma = createPrismaClient()
  }
  return globalForPrisma.__prisma
}
