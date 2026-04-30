import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

let dbClient = null

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to initialize the database client.')
  }

  if (!dbClient) {
    dbClient = drizzle(neon(process.env.DATABASE_URL), { schema })
  }

  return dbClient
}

export { schema }
