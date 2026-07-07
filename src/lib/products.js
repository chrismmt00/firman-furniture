import { cache } from 'react'
import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import seedProducts from '../../data/products.json'
import { formatCents, titleizeSlug } from './format'

const { products, productImages, categories } = schema

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=900&q=85'

/* ── Material / colour family derivation ──────────────────────────
   Products carry free-text material/colour strings; the shop filters
   work off a small set of families derived from those strings. */
const MATERIAL_FAMILIES = [
  { label: 'Upholstery', match: /fabric|chenille|boucl|corduroy|linen|down|foam/i },
  { label: 'Leather', match: /leather/i },
  { label: 'Wood', match: /wood|oak|mahogany|veneer|hardwood|eucalyptus|ash|larch/i },
  { label: 'Stone', match: /stone|marble|travertine|sintered|glass/i },
  { label: 'Metal', match: /metal|brass|steel|iron/i },
]

const COLOR_FAMILIES = [
  { label: 'Neutral', swatch: '#D9D2C5', match: /ivory|cream|white|beige|natural|sand|oat|linen|alabaster/i },
  { label: 'Brown', swatch: '#7A5C3E', match: /brown|walnut|chestnut|tan|cognac|amber|mahogany|coffee|mocha|mango|cocoa|oak|cappuccino/i },
  { label: 'Grey', swatch: '#8A8A86', match: /grey|gray|charcoal|slate|ash|pewter|graphite|anthracite/i },
  { label: 'Black', swatch: '#1C1B1A', match: /black|ebony|onyx/i },
  { label: 'Green', swatch: '#5A6B53', match: /green|sage|olive|forest|moss/i },
  { label: 'Blue', swatch: '#4A5A6E', match: /blue|navy|teal|indigo/i },
  { label: 'Orange', swatch: '#C08043', match: /orange|rust|terracotta|burnt/i },
]

const COLOR_SWATCH_OVERRIDES = [
  { swatch: '#846F60', match: /rocky road/i },
  { swatch: '#8E5368', match: /berry/i },
]

function primaryColor(color = '') {
  return color.split('/')[0].trim()
}

export function materialFamily(material = '') {
  return MATERIAL_FAMILIES.find((m) => m.match.test(material))?.label || 'Wood'
}

export function colorFamily(color = '') {
  return COLOR_FAMILIES.find((c) => c.match.test(primaryColor(color)))?.label || 'Neutral'
}

export function colorSwatch(color = '') {
  const primary = primaryColor(color)
  return (
    COLOR_SWATCH_OVERRIDES.find((entry) => entry.match.test(primary))?.swatch ||
    COLOR_FAMILIES.find((entry) => entry.match.test(primary))?.swatch ||
    '#D9D2C5'
  )
}

function colorVariantGroup(tags = []) {
  const prefix = 'color-variant-group:'
  const tag = tags.find((value) => value.startsWith(prefix))
  return tag ? tag.slice(prefix.length) : null
}

function slugify(value = '') {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function badgeFor(p) {
  if (p.compareAtPriceCents && p.compareAtPriceCents > p.priceCents) return 'Sale'
  if (p.isFeatured) return 'Featured'
  if (p.stockQuantity > 0) return 'In Stock'
  return 'Made to Order'
}

/* Map a product row (+ its images) into the card/detail view model the UI consumes. */
function mapProduct(p, images = []) {
  const sorted = [...images].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1
    if (b.isPrimary && !a.isPrimary) return 1
    return (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  })
  const imageUrls = sorted.map((i) => i.url)
  const onSale = Boolean(p.compareAtPriceCents && p.compareAtPriceCents > p.priceCents)
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    category: p.categoryName || 'Furniture',
    categorySlug: p.categorySlug || '',
    price: p.priceCents,
    priceFmt: formatCents(p.priceCents),
    compareAtPrice: p.compareAtPriceCents,
    compareFmt: p.compareAtPriceCents ? formatCents(p.compareAtPriceCents) : '',
    onSale,
    badge: badgeFor(p),
    description: p.description || p.shortDescription || '',
    shortDescription: p.shortDescription || '',
    material: p.material || '',
    materialFamily: materialFamily(p.material),
    color: p.color || '',
    colorFamily: colorFamily(p.color),
    colorSwatch: colorSwatch(p.color),
    colorVariantGroup: colorVariantGroup(p.tags),
    stock: p.stockQuantity ?? 0,
    inStock: (p.stockQuantity ?? 0) > 0,
    isFeatured: p.isFeatured,
    status: p.status,
    image: imageUrls[0] || PLACEHOLDER_IMAGE,
    images: imageUrls.length ? imageUrls : [PLACEHOLDER_IMAGE],
    tags: p.tags || [],
  }
}

function normalizeSeedProduct(product, index) {
  const categoryName = product.category || 'Furniture'
  const categorySlug = slugify(categoryName)

  return {
    id: product.id || product.slug || `seed-${index + 1}`,
    name: product.name,
    slug: product.slug || slugify(product.name),
    sku: product.sku || '',
    description: product.description || '',
    shortDescription: product.shortDescription || '',
    priceCents: Number.isInteger(product.priceCents) ? product.priceCents : 0,
    compareAtPriceCents: Number.isInteger(product.compareAtPriceCents)
      ? product.compareAtPriceCents
      : null,
    material: product.material || '',
    color: product.color || '',
    stockQuantity: Number.isInteger(product.stockQuantity) ? product.stockQuantity : 0,
    isFeatured: Boolean(product.isFeatured),
    status: product.status || 'published',
    tags: Array.isArray(product.tags) ? product.tags : [],
    categoryName,
    categorySlug,
    images: Array.isArray(product.images)
      ? product.images
          .filter((image) => image?.url)
          .map((image, imageIndex) => ({
            productId: product.slug || `seed-${index + 1}`,
            url: image.url,
            altText: image.altText || product.name,
            isPrimary: imageIndex === 0,
            sortOrder: imageIndex,
          }))
      : [],
  }
}

const seedRows = seedProducts.map(normalizeSeedProduct)

function getSeedProductRows() {
  return seedRows.filter((product) => product.status === 'published')
}

function getSeedProducts() {
  return getSeedProductRows().map((product) => mapProduct(product, product.images))
}

function getSeedCategories() {
  const categoriesBySlug = new Map()

  for (const product of getSeedProductRows()) {
    const current = categoriesBySlug.get(product.categorySlug) || {
      id: product.categorySlug,
      name: product.categoryName,
      slug: product.categorySlug,
      count: 0,
    }

    current.count += 1
    categoriesBySlug.set(product.categorySlug, current)
  }

  return [...categoriesBySlug.values()].sort((a, b) => a.name.localeCompare(b.name))
}

const baseSelect = {
  id: products.id,
  name: products.name,
  slug: products.slug,
  sku: products.sku,
  description: products.description,
  shortDescription: products.shortDescription,
  priceCents: products.priceCents,
  compareAtPriceCents: products.compareAtPriceCents,
  material: products.material,
  color: products.color,
  stockQuantity: products.stockQuantity,
  isFeatured: products.isFeatured,
  status: products.status,
  tags: products.tags,
  categoryId: products.categoryId,
  categoryName: categories.name,
  categorySlug: categories.slug,
}

/* Fetch primary (or first) image url per product id, in one query. */
async function imagesByProduct(db, productIds) {
  if (productIds.length === 0) return new Map()
  const rows = await db
    .select({
      productId: productImages.productId,
      url: productImages.url,
      altText: productImages.altText,
      isPrimary: productImages.isPrimary,
      sortOrder: productImages.sortOrder,
    })
    .from(productImages)
    .where(inArray(productImages.productId, productIds))
  const map = new Map()
  for (const r of rows) {
    if (!map.has(r.productId)) map.set(r.productId, [])
    map.get(r.productId).push(r)
  }
  return map
}

export const getCategories = cache(async () => {
  if (!process.env.DATABASE_URL) return getSeedCategories()

  const db = getDb()
  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      count: sql`count(${products.id})`.mapWith(Number),
    })
    .from(categories)
    .leftJoin(
      products,
      and(eq(products.categoryId, categories.id), eq(products.status, 'published'))
    )
    .groupBy(categories.id, categories.name, categories.slug)
    .orderBy(asc(categories.name))
  return rows
})

export const getAllProducts = cache(async () => {
  if (!process.env.DATABASE_URL) return getSeedProducts()

  const db = getDb()
  const rows = await db
    .select(baseSelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.status, 'published'))
    .orderBy(desc(products.isFeatured), asc(products.name))
  const imgs = await imagesByProduct(db, rows.map((r) => r.id))
  return rows.map((r) => mapProduct(r, imgs.get(r.id) || []))
})

export async function getProductsByCategory(categorySlug) {
  const all = await getAllProducts()
  if (!categorySlug || categorySlug === 'all') return all
  return all.filter((p) => p.categorySlug === categorySlug)
}

export const getFeaturedProducts = cache(async (limit = 8) => {
  const all = await getAllProducts()
  const featured = all.filter((p) => p.isFeatured)
  return (featured.length ? featured : all).slice(0, limit)
})

export const getProductBySlug = cache(async (slug) => {
  if (!process.env.DATABASE_URL) {
    return getSeedProducts().find((product) => product.slug === slug) || null
  }

  const db = getDb()
  const [row] = await db
    .select(baseSelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1)
  if (!row) return null
  const imgs = await imagesByProduct(db, [row.id])
  return mapProduct(row, imgs.get(row.id) || [])
})

export async function getProductColorVariants(product) {
  if (!product?.colorVariantGroup) return []

  const all = await getAllProducts()
  return all
    .filter((candidate) => candidate.colorVariantGroup === product.colorVariantGroup)
    .sort((a, b) => a.color.localeCompare(b.color))
}

export async function getRelatedProducts(product, limit = 4) {
  if (!product) return []
  const all = await getAllProducts()
  const sameCat = all.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  )
  const pool = sameCat.length >= limit ? sameCat : all.filter((p) => p.id !== product.id)
  return pool.slice(0, limit)
}

/* Build the option lists (counts) for the shop filter sidebar from a product set. */
export function buildShopFacets(productList, categoryList) {
  const priceBuckets = [
    { val: 'all', label: 'All prices', test: () => true },
    { val: '0-1000', label: 'Under $1,000', test: (p) => p.price < 100000 },
    { val: '1000-2500', label: '$1,000 – $2,500', test: (p) => p.price >= 100000 && p.price < 250000 },
    { val: '2500-5000', label: '$2,500 – $5,000', test: (p) => p.price >= 250000 && p.price < 500000 },
    { val: '5000+', label: '$5,000 +', test: (p) => p.price >= 500000 },
  ]

  const matCounts = {}
  const colorCounts = {}
  for (const p of productList) {
    matCounts[p.materialFamily] = (matCounts[p.materialFamily] || 0) + 1
    colorCounts[p.colorFamily] = (colorCounts[p.colorFamily] || 0) + 1
  }

  return {
    categories: [
      { cat: 'all', label: 'All', count: productList.length },
      ...categoryList.map((c) => ({ cat: c.slug, label: c.name, count: c.count })),
    ],
    prices: priceBuckets.map(({ val, label }) => ({ val, label })),
    materials: Object.entries(matCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ val: label, label, count })),
    colors: Object.entries(colorCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({
        val: label,
        label,
        count,
        swatch: COLOR_FAMILIES.find((c) => c.label === label)?.swatch || '#D9D2C5',
      })),
  }
}

export { titleizeSlug, PLACEHOLDER_IMAGE }
