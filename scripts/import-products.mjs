import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import nextEnv from '@next/env'
import postgres from 'postgres'

const { loadEnvConfig } = nextEnv

loadEnvConfig(process.cwd())

function parseArgs() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const inputArg = args.find((arg) => arg !== '--dry-run')

  return {
    dryRun,
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

function intOrNull(value) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  if (!Number.isInteger(number)) {
    throw new Error(`Expected integer cents value, received: ${value}`)
  }
  return number
}

function requireText(product, key) {
  const value = product[key]
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Product "${product.name || 'unknown'}" is missing required field "${key}".`)
  }
  return value.trim()
}

function normalizeProduct(product, index) {
  const name = requireText(product, 'name')
  const slug = typeof product.slug === 'string' && product.slug.trim() ? slugify(product.slug) : slugify(name)
  const category = requireText(product, 'category')
  const priceCents = intOrNull(product.priceCents)

  const status = product.status || 'published'

  if (priceCents === null || priceCents < 0) {
    throw new Error(`Product "${name}" needs a non-negative priceCents value.`)
  }

  if (status === 'published' && priceCents < 1) {
    throw new Error(`Product "${name}" needs a positive priceCents value before publishing.`)
  }

  return {
    name,
    slug,
    categoryName: category,
    categorySlug: slugify(category),
    description: product.description || null,
    shortDescription: product.shortDescription || null,
    priceCents,
    compareAtPriceCents: intOrNull(product.compareAtPriceCents),
    costPriceCents: intOrNull(product.costPriceCents),
    tradePriceCents: intOrNull(product.tradePriceCents),
    sku: product.sku || `FF-SEED-${String(index + 1).padStart(3, '0')}`,
    material: product.material || null,
    color: product.color || null,
    status,
    isFeatured: Boolean(product.isFeatured),
    stockQuantity: Number.isInteger(product.stockQuantity) ? product.stockQuantity : 0,
    tags: Array.isArray(product.tags) ? product.tags : [],
    images: Array.isArray(product.images) ? product.images : [],
  }
}

function validateUniqueProducts(products) {
  const seenSlugs = new Set()
  const seenSkus = new Set()

  for (const product of products) {
    if (seenSlugs.has(product.slug)) {
      throw new Error(`Duplicate product slug found: ${product.slug}`)
    }
    seenSlugs.add(product.slug)

    if (product.sku && seenSkus.has(product.sku)) {
      throw new Error(`Duplicate product SKU found: ${product.sku}`)
    }
    if (product.sku) seenSkus.add(product.sku)
  }
}

function validateColorVariantGroups(products) {
  const groups = new Map()
  const prefix = 'color-variant-group:'

  for (const product of products) {
    const groupTags = product.tags.filter((tag) => tag.startsWith(prefix))

    if (groupTags.length > 1) {
      throw new Error(`Product "${product.name}" has more than one color variant group.`)
    }

    if (groupTags.length === 0) continue

    const group = groupTags[0].slice(prefix.length)
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group).push(product)
  }

  for (const [group, variants] of groups) {
    if (variants.length < 2) {
      throw new Error(`Color variant group "${group}" needs at least two products.`)
    }

    const colors = new Set(variants.map((variant) => variant.color?.toLowerCase()))
    if (colors.has(undefined) || colors.has(null) || colors.has('')) {
      throw new Error(`Every product in color variant group "${group}" needs a color.`)
    }

    if (colors.size !== variants.length) {
      throw new Error(`Color variant group "${group}" contains duplicate colors.`)
    }
  }

  return groups
}

function summarizeProducts(products, inputPath) {
  const categories = new Map()
  const imageCount = products.reduce((sum, product) => sum + product.images.length, 0)
  const colorVariantGroups = validateColorVariantGroups(products)

  for (const product of products) {
    categories.set(product.categoryName, (categories.get(product.categoryName) || 0) + 1)
  }

  console.log(`Validated ${products.length} products from ${inputPath}`)
  console.log(`Images: ${imageCount}`)
  console.log(`Color variant groups: ${colorVariantGroups.size}`)
  console.log('Categories:')

  for (const [category, count] of categories.entries()) {
    console.log(`- ${category}: ${count}`)
  }
}

async function loadProducts(inputPath) {
  const raw = await readFile(inputPath, 'utf8')
  const parsed = JSON.parse(raw)

  if (!Array.isArray(parsed)) {
    throw new Error('Product import file must be a JSON array.')
  }

  if (parsed.length < 25) {
    throw new Error(`Expected at least 25 products, found ${parsed.length}.`)
  }

  const products = parsed.map(normalizeProduct)
  validateUniqueProducts(products)
  validateColorVariantGroups(products)

  return products
}

async function main() {
  const { dryRun, inputPath } = parseArgs()
  const products = await loadProducts(inputPath)

  if (dryRun) {
    summarizeProducts(products, inputPath)
    return
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required. Add your Neon connection string to .env.local first.')
  }

  const sql = postgres(process.env.DATABASE_URL, {
    max: 1,
    prepare: false,
  })

  try {
    for (const product of products) {
      const categoryRows = await sql`
        INSERT INTO categories (name, slug, is_visible)
        VALUES (${product.categoryName}, ${product.categorySlug}, true)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          is_visible = true,
          updated_at = NOW()
        RETURNING id
      `
      const categoryId = categoryRows[0].id

      const productRows = await sql`
        INSERT INTO products (
          name,
          slug,
          description,
          short_description,
          price_cents,
          compare_at_price_cents,
          cost_price_cents,
          trade_price_cents,
          sku,
          material,
          color,
          category_id,
          status,
          is_featured,
          published_at,
          stock_quantity,
          tags
        )
        VALUES (
          ${product.name},
          ${product.slug},
          ${product.description},
          ${product.shortDescription},
          ${product.priceCents},
          ${product.compareAtPriceCents},
          ${product.costPriceCents},
          ${product.tradePriceCents},
          ${product.sku},
          ${product.material},
          ${product.color},
          ${categoryId},
          ${product.status},
          ${product.isFeatured},
          ${product.status === 'published' ? new Date() : null},
          ${product.stockQuantity},
          ${product.tags}
        )
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          short_description = EXCLUDED.short_description,
          price_cents = EXCLUDED.price_cents,
          compare_at_price_cents = EXCLUDED.compare_at_price_cents,
          cost_price_cents = EXCLUDED.cost_price_cents,
          trade_price_cents = EXCLUDED.trade_price_cents,
          sku = EXCLUDED.sku,
          material = EXCLUDED.material,
          color = EXCLUDED.color,
          category_id = EXCLUDED.category_id,
          status = EXCLUDED.status,
          is_featured = EXCLUDED.is_featured,
          published_at = COALESCE(products.published_at, EXCLUDED.published_at),
          stock_quantity = EXCLUDED.stock_quantity,
          tags = EXCLUDED.tags,
          updated_at = NOW()
        RETURNING id
      `
      const productId = productRows[0].id

      await sql`DELETE FROM product_images WHERE product_id = ${productId}`

      for (const [imageIndex, image] of product.images.entries()) {
        if (!image?.url) continue

        await sql`
          INSERT INTO product_images (
            product_id,
            cloudflare_image_id,
            url,
            alt_text,
            sort_order,
            is_primary
          )
          VALUES (
            ${productId},
            ${image.cloudflareImageId || `seed:${product.slug}:${imageIndex + 1}`},
            ${image.url},
            ${image.altText || product.name},
            ${imageIndex},
            ${imageIndex === 0}
          )
        `
      }
    }
  } finally {
    await sql.end()
  }

  console.log(`Imported ${products.length} products from ${inputPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
