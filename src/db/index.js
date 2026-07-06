import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

let queryClient = null
let drizzleClient = null

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to initialize the database client.')
  }

  if (!queryClient) {
    queryClient = postgres(process.env.DATABASE_URL, {
      max: 1,
      prepare: false,
    })
  }

  if (!drizzleClient) {
    drizzleClient = drizzle(queryClient, { schema })
  }

  return drizzleClient
}

export { schema }
