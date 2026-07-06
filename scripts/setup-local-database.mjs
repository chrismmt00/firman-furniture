import nextEnv from '@next/env'
import postgres from 'postgres'

const { loadEnvConfig } = nextEnv

loadEnvConfig(process.cwd())

const databaseName = process.env.LOCAL_DATABASE_NAME || 'firman_furniture'
const adminUrl = process.env.LOCAL_DATABASE_ADMIN_URL

if (!adminUrl) {
  console.error('LOCAL_DATABASE_ADMIN_URL is required in .env.local.')
  process.exit(1)
}

if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(databaseName)) {
  console.error(`Invalid LOCAL_DATABASE_NAME: ${databaseName}`)
  process.exit(1)
}

const sql = postgres(adminUrl, {
  max: 1,
  prepare: false,
})

try {
  const existing = await sql`
    SELECT 1
    FROM pg_database
    WHERE datname = ${databaseName}
    LIMIT 1
  `

  if (existing.length > 0) {
    console.log(`Local database "${databaseName}" already exists.`)
  } else {
    await sql.unsafe(`CREATE DATABASE "${databaseName}"`)
    console.log(`Created local database "${databaseName}".`)
  }
} finally {
  await sql.end()
}
