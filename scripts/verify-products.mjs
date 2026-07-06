import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import nextEnv from '@next/env'
import postgres from 'postgres'

const { loadEnvConfig } = nextEnv

loadEnvConfig(process.cwd())

function parseArgs() {
  const args = process.argv.slice(2)
  const requireImages = args.includes('--require-images')
  const requirePrices = args.includes('--require-prices')
  const minImagesArg = args.find((arg) => arg.startsWith('--min-images='))
  const minPriceCentsArg = args.find((arg) => arg.startsWith('--min-price-cents='))
  const minImages = minImagesArg ? Number(minImagesArg.split('=')[1]) : requireImages ? 1 : 0
  const minPriceCents = minPriceCentsArg
    ? Number(minPriceCentsArg.split('=')[1])
    : requirePrices
      ? 1
      : 0
  const inputArg = args.find((arg) => !arg.startsWith('--'))

  if (!Number.isInteger(minImages) || minImages < 0) {
    throw new Error('Expected --min-images to be a non-negative integer.')
  }

  if (!Number.isInteger(minPriceCents) || minPriceCents < 0) {
    throw new Error('Expected --min-price-cents to be a non-negative integer.')
  }

  return {
    minImages,
    minPriceCents,
    inputPath: resolve(process.cwd(), inputArg || 'data/products.json'),
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function loadExpectedProducts(inputPath) {
  const raw = await readFile(inputPath, 'utf8')
  const parsed = JSON.parse(raw)

  if (!Array.isArray(parsed)) {
    throw new Error('Product verification file must be a JSON array.')
  }

  if (parsed.length < 25) {
    throw new Error(`Expected at least 25 products, found ${parsed.length}.`)
  }

  return parsed.map((product) => ({
    name: product.name,
    slug: product.slug ? slugify(product.slug) : slugify(product.name),
  }))
}

async function main() {
  const { minImages, minPriceCents, inputPath } = parseArgs()

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required. Add your Neon connection string to .env.local first.')
  }

  const expectedProducts = await loadExpectedProducts(inputPath)
  const sql = postgres(process.env.DATABASE_URL, {
    max: 1,
    prepare: false,
  })
  const missingProducts = []
  const productsMissingImages = []
  const productsBelowMinPrice = []
  let expectedProductImageCount = 0
  let lowestPriceCents = null
  let highestPriceCents = null

  try {
    for (const expectedProduct of expectedProducts) {
      const rows = await sql`
        SELECT
          p.slug,
          p.name,
          p.price_cents,
          p.status,
          COUNT(pi.id)::int AS image_count
        FROM products p
        LEFT JOIN product_images pi ON pi.product_id = p.id
        WHERE p.slug = ${expectedProduct.slug}
        GROUP BY p.id
        LIMIT 1
      `

      if (rows.length === 0) {
        missingProducts.push(expectedProduct)
      } else {
        const imageCount = Number(rows[0].image_count)
        const priceCents = Number(rows[0].price_cents)
        expectedProductImageCount += imageCount
        lowestPriceCents = lowestPriceCents === null ? priceCents : Math.min(lowestPriceCents, priceCents)
        highestPriceCents = highestPriceCents === null ? priceCents : Math.max(highestPriceCents, priceCents)

        if (imageCount < minImages) {
          productsMissingImages.push(expectedProduct)
        }

        if (priceCents < minPriceCents) {
          productsBelowMinPrice.push({ ...expectedProduct, priceCents })
        }
      }
    }

    if (missingProducts.length > 0) {
      const missing = missingProducts.map((product) => `- ${product.name} (${product.slug})`).join('\n')
      throw new Error(`Missing ${missingProducts.length} expected products:\n${missing}`)
    }

    if (productsMissingImages.length > 0) {
      const missing = productsMissingImages.map((product) => `- ${product.name} (${product.slug})`).join('\n')
      throw new Error(`Expected at least ${minImages} images for each product. Failed ${productsMissingImages.length} products:\n${missing}`)
    }

    if (productsBelowMinPrice.length > 0) {
      const belowMin = productsBelowMinPrice
        .map((product) => `- ${product.name} (${product.slug}): ${product.priceCents}`)
        .join('\n')
      throw new Error(`Expected each product to be at least ${minPriceCents} cents. Failed ${productsBelowMinPrice.length} products:\n${belowMin}`)
    }

    const totalRows = await sql`SELECT COUNT(*)::int AS count FROM products`
    console.log(`Verified ${expectedProducts.length} expected products from ${inputPath}`)
    console.log(`Expected product images total: ${expectedProductImageCount}`)
    console.log(`Expected product price range: ${lowestPriceCents}-${highestPriceCents} cents`)
    console.log(`Database products total: ${totalRows[0].count}`)
  } finally {
    await sql.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
