import { defineConfig } from 'prisma/config'

// Prisma 7 config. CLI-only (migrations / introspection / generate); the runtime
// PrismaClient connects via a driver adapter, not this file — see src/lib/prisma.js.
//
// `datasource.url` should be the DIRECT (unpooled) connection when possible, so
// `prisma migrate` does not run through a transaction pooler. Prefer DIRECT_URL.
// If Vercel only has a Neon pooled DATABASE_URL, derive the direct Neon host by
// removing `-pooler` before falling back to the raw DATABASE_URL.
// Load env for local CLI runs with: `dotenv -e .env.local -- prisma ...`.
function getDatasourceUrl() {
  if (process.env.DIRECT_URL) return process.env.DIRECT_URL
  if (!process.env.DATABASE_URL) return undefined

  try {
    const url = new URL(process.env.DATABASE_URL)

    if (url.hostname.includes('-pooler.')) {
      url.hostname = url.hostname.replace('-pooler.', '.')
      url.searchParams.delete('pgbouncer')
      url.searchParams.delete('pool_timeout')
      url.searchParams.delete('connection_limit')

      return url.toString()
    }
  } catch {
    // Fall through to the original DATABASE_URL for non-standard connection strings.
  }

  return process.env.DATABASE_URL
}

const datasourceUrl = getDatasourceUrl()

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  ...(datasourceUrl ? { datasource: { url: datasourceUrl } } : {}),
})
