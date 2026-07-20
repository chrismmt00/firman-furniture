import { defineConfig } from 'prisma/config'

// Prisma 7 config. CLI-only (migrations / introspection / generate); the runtime
// PrismaClient connects via a driver adapter, not this file — see src/lib/prisma.js.
//
// `datasource.url` is the DIRECT (unpooled) connection so `prisma migrate` does not run
// through a transaction pooler. It is included only when DIRECT_URL is set, so
// `prisma generate` (which needs no database) still works in any environment.
// On Vercel/Neon set DIRECT_URL to the unpooled endpoint; locally it mirrors
// DATABASE_URL. Load it for local CLI runs with: `dotenv -e .env.local -- prisma ...`.
const directUrl = process.env.DIRECT_URL

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  ...(directUrl ? { datasource: { url: directUrl } } : {}),
})
