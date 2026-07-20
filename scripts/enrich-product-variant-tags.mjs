import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const productsPath = resolve(process.cwd(), 'data/products.json')
const variantPrefix = 'color-variant-group:'
const metaTags = new Set([
  'coaster-2026-supplement',
  'new',
  'placeholder-price',
  'bedroom',
  'dining-room',
  'living-room',
  'accents',
])
const categoryTags = new Set(['bedroom', 'dining-room', 'living-room', 'accents'])

function slugify(value = '') {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const raw = await readFile(productsPath, 'utf8')
const products = JSON.parse(raw)
const candidates = new Map()

for (const product of products) {
  const tags = product.tags || []
  if (tags.some((tag) => tag.startsWith(variantPrefix))) continue

  const collection = tags.find((tag) => !metaTags.has(tag) && !categoryTags.has(tag))
  if (!collection) continue

  const item = [...tags]
    .reverse()
    .find((tag) => !metaTags.has(tag) && !categoryTags.has(tag) && tag !== collection)
  const key = [product.category, collection, item || slugify(product.name), slugify(product.name)].join('|')

  if (!candidates.has(key)) candidates.set(key, [])
  candidates.get(key).push(product)
}

let createdGroups = 0
let addedTags = 0

for (const [key, groupProducts] of candidates.entries()) {
  const colors = new Set(
    groupProducts
      .map((product) => String(product.color || '').toLowerCase())
      .filter((color) => color && color !== 'as shown')
  )

  if (groupProducts.length < 2 || colors.size !== groupProducts.length) continue

  const [, collection, item, name] = key.split('|')
  const group = `${collection}-${item || name}-${name}`
  createdGroups += 1

  for (const product of groupProducts) {
    product.tags = [...(product.tags || []), `${variantPrefix}${group}`]
    addedTags += 1
  }
}

const totalVariantGroups = new Set(
  products.flatMap((product) =>
    (product.tags || [])
      .filter((tag) => tag.startsWith(variantPrefix))
      .map((tag) => tag.slice(variantPrefix.length))
  )
)

await writeFile(productsPath, `${JSON.stringify(products, null, 2)}\n`)

console.log(`Created inferred variant groups: ${createdGroups}`)
console.log(`Added variant tags: ${addedTags}`)
console.log(`Total variant groups in products JSON: ${totalVariantGroups.size}`)
