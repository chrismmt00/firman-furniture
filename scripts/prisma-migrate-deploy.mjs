import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import pg from 'pg'

const { Client } = pg

const localPrismaCli = path.join(process.cwd(), 'node_modules', 'prisma', 'build', 'index.js')
const hasLocalPrismaCli = existsSync(localPrismaCli)
const prismaCommand = hasLocalPrismaCli ? process.execPath : 'prisma'
const prismaBaseArgs = hasLocalPrismaCli ? [localPrismaCli] : []

function writeResultOutput(result) {
  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)
  if (result.error) console.error(result.error.message)
}

function runPrisma(args, { print = true } = {}) {
  const result = spawnSync(prismaCommand, [...prismaBaseArgs, ...args], {
    encoding: 'utf8',
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  if (print) writeResultOutput(result)

  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    error: result.error,
    output: `${result.stdout ?? ''}\n${result.stderr ?? ''}`,
  }
}

function getConnectionString() {
  if (process.env.DIRECT_URL) return process.env.DIRECT_URL
  if (!process.env.DATABASE_URL) return undefined

  const url = new URL(process.env.DATABASE_URL)

  if (url.hostname.includes('-pooler.')) {
    url.hostname = url.hostname.replace('-pooler.', '.')
    url.searchParams.delete('pgbouncer')
    url.searchParams.delete('pool_timeout')
    url.searchParams.delete('connection_limit')
  }

  return url.toString()
}

async function getExistingSchemaState() {
  const connectionString = getConnectionString()

  if (!connectionString) {
    throw new Error('DATABASE_URL or DIRECT_URL is required to inspect the database.')
  }

  const client = new Client({ connectionString })

  try {
    await client.connect()

    const ordersStripeColumn = await client.query(`
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'orders'
        and column_name = 'stripe_checkout_session_id'
      limit 1
    `)
    const processedStripeEvents = await client.query(`
      select to_regclass('public.processed_stripe_events') as table_name
    `)

    return {
      hasStripeCheckoutMigration:
        ordersStripeColumn.rowCount > 0 && Boolean(processedStripeEvents.rows[0]?.table_name),
    }
  } finally {
    await client.end().catch(() => {})
  }
}

function markApplied(migrationName) {
  const result = runPrisma(['migrate', 'resolve', '--applied', migrationName])

  if (result.status === 0 || result.output.includes('P3008')) {
    return
  }

  process.exit(result.status)
}

const deploy = runPrisma(['migrate', 'deploy'], { print: false })

if (deploy.status === 0) {
  writeResultOutput(deploy)
  process.exit(0)
}

if (!deploy.output.includes('P3005')) {
  writeResultOutput(deploy)
  process.exit(deploy.status)
}

console.log('Detected a non-empty database without Prisma migration history; baselining existing schema.')

const existingSchemaState = await getExistingSchemaState()

markApplied('0_init')

if (existingSchemaState.hasStripeCheckoutMigration) {
  markApplied('20260713224252_stripe_checkout')
}

const retry = runPrisma(['migrate', 'deploy'])
process.exit(retry.status)
