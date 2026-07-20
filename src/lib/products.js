import { cache } from 'react'
import { getPrisma } from '@/lib/prisma'
import seedProducts from '../../data/products.json'
import { formatCents, titleizeSlug } from './format'

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

/* Prisma rows use snake_case column names; adapt them to the camelCase shape
   mapProduct (and the seed path) expect, so the view model stays identical. */
function productFromDb(p) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    description: p.description,
    shortDescription: p.short_description,
    priceCents: p.price_cents,
    compareAtPriceCents: p.compare_at_price_cents,
    material: p.material,
    color: p.color,
    stockQuantity: p.stock_quantity,
    isFeatured: p.is_featured,
    status: p.status,
    tags: p.tags,
    categoryName: p.categories?.name || null,
    categorySlug: p.categories?.slug || null,
  }
}

function imageFromDb(i) {
  return { url: i.url, altText: i.alt_text, isPrimary: i.is_primary, sortOrder: i.sort_order }
}

const productInclude = {
  categories: { select: { name: true, slug: true } },
  product_images: true,
}

function mapDbProduct(row) {
  return mapProduct(productFromDb(row), (row.product_images || []).map(imageFromDb))
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

export const getCategories = cache(async () => {
  if (!process.env.DATABASE_URL) return getSeedCategories()

  const prisma = getPrisma()
  const [cats, counts] = await Promise.all([
    prisma.categories.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
    // One grouped count of published products per category (no N+1).
    prisma.products.groupBy({
      by: ['category_id'],
      where: { status: 'published' },
      _count: { _all: true },
    }),
  ])
  const countByCategory = new Map(counts.map((c) => [c.category_id, c._count._all]))
  return cats.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    count: countByCategory.get(c.id) ?? 0,
  }))
})

export const getAllProducts = cache(async () => {
  if (!process.env.DATABASE_URL) return getSeedProducts()

  const prisma = getPrisma()
  // include batches the category + images fetches — two queries total, no N+1.
  const rows = await prisma.products.findMany({
    where: { status: 'published' },
    orderBy: [{ is_featured: 'desc' }, { name: 'asc' }],
    include: productInclude,
  })
  return rows.map(mapDbProduct)
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

  const prisma = getPrisma()
  const row = await prisma.products.findUnique({
    where: { slug },
    include: productInclude,
  })
  return row ? mapDbProduct(row) : null
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
