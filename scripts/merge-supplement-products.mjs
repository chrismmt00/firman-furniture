import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { execFileSync } from 'node:child_process'

const root = process.cwd()
const inputPath = resolve(root, 'data/source/2026-Supplement.txt')
const productsPath = resolve(root, 'data/products.json')
const shouldWrite = process.argv.includes('--write')
const newOnly = process.argv.includes('--new-only')
const fromHead = process.argv.includes('--from-head')

const SKU_PATTERN = String.raw`\d{5,6}[A-Z0-9]*(?:-[A-Z0-9]+)?`
const SKU_RE = new RegExp(`^(${SKU_PATTERN})$`)
const PRODUCT_ROW_RE = new RegExp(
  `^(?:(?:[A-Z]|I|[Α-Ω])\\s+){0,3}(NEW\\s+)?(.+?)\\s+(${SKU_PATTERN})\\s*$`
)

const GENERIC_COLLECTION_WORDS = new Set([
  'ACCENTS',
  'ACCENT CABINETS',
  'ACCENT CHAIRS',
  'ACCENT SEATING + SIDE TABLES',
  'BEDROOM',
  'BEDROOM COLLECTION',
  'BEDROOM SUPPLEMENT',
  'CATALOG',
  'CATALOG SUPPLEMENT',
  'COASTER SLEEP',
  'COLLECTION',
  'COLLECTIONS',
  'DINING',
  'DINETTES',
  'DINING COLLECTION',
  'DINING ROOM',
  'DINING ROOM COLLECTION',
  'DINING ROOM SUPPLEMENT',
  'ENTERTAINMENT CENTERS',
  'EXCLUSIVE COLLECTIONS',
  'FOUNDATIONS',
  'LEATHER COLLECTIONS',
  'LEATHER',
  'LIFT TOP OCCASIONAL TABLES',
  'LIVING',
  'LIVING ROOM',
  'LIVING ROOM COLLECTION',
  'LIVING ROOM SUPPLEMENT',
  'MATTRESSES',
  'METAL BUNK BEDS',
  'MOTION COLLECTIONS',
  'MOTION',
  'MOTION RECLINERS',
  'MOTION SECTIONALS',
  'OCCASIONAL TABLES',
  'POWER COLLECTIONS',
  'POWER',
  'POWER LIFT RECLINERS',
  'POWER RECLINERS',
  'PRIMARY',
  'PRIMARY BEDROOM',
  'PRIMARY COLLECTIONS',
  'SECTIONALS',
  'STATIONARY SOFAS',
  'STATIONARY SOFAS + CHAISE',
  'STATIONARY',
  'SWIVEL ACCENT CHAIRS',
  'TV CONSOLES',
  'UPHOLSTERED BEDS',
  'UPHOLSTERED COLLECTIONS',
  'UPHOLSTERED LEATHER BEDS',
  'UPHOLSTERED STORAGE BEDS',
  'UPHOLSTERED TV BEDS',
  'UPHOLSTERED',
  'WORKSTATION',
])

const COLOR_WORDS =
  /\b(anthracite|antique|ash|beige|berry|black|blonde|blue|boucle|bouclé|bronze|brown|camel|cappuccino|charcoal|chestnut|cream|dark|fabric|faux|fog|gold|gray|grey|green|honey|ivory|latte|light|mango|marble|merlot|metal|natural|navy|oak|orange|pearl|red|rocky|sand|silver|sintered|stone|teak|velvet|walnut|weathered|white)\b/i

const BEDROOM_ITEMS =
  /\b(bed|bunk|chest|dresser|floor mirror|foundation|mattress|mirror|nightstand|vanity)\b/i
const DINING_ITEMS =
  /\b(arm chair|bench|counter height|counter stool|dinette|dining|side chair|sideboard|stool)\b/i
const LIVING_ITEMS =
  /\b(chair|chaise|coffee table|console table|corner|end table|entertainment|glider|laf|lift|loveseat|media tower|ottoman|raf|recliner|sectional|sofa|tv stand)\b/i
const ACCENT_ITEMS =
  /\b(accent bench|accent cabinet|side table|storage ottoman|tall accent cabinet)\b/i

function clean(value = '') {
  return value
    .replace(/\u00a0/g, ' ')
    .replace(/â€“|–/g, '-')
    .replace(/â€”|—/g, '-')
    .replace(/Â·|•/g, ' ')
    .replace(/Î™|Ι/g, 'I')
    .replace(/\s+/g, ' ')
    .trim()
}

function limitText(value = '', max = 255) {
  const text = clean(value)
  if (text.length <= max) return text

  return text.slice(0, max - 1).replace(/[\s,;/.-]+$/g, '')
}

function slugify(value = '') {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function titleize(value = '') {
  const keepUpper = new Set(['TV', 'USB', 'LAF', 'RAF', 'LED'])

  return clean(value)
    .toLowerCase()
    .replace(/\b\w+/g, (word) => {
      const upper = word.toUpperCase()
      if (keepUpper.has(upper)) return upper
      if (/^\d/.test(word)) return word
      return word[0].toUpperCase() + word.slice(1)
    })
    .replace(/\bPc\b/g, 'pc')
}

function hasDimension(value = '') {
  return /[0-9][0-9./-]*(?:\s*-\s*[0-9.]+)?"(?:w|d|h|dia)|Seat\s+[0-9]/i.test(value)
}

function isFooterOrNoise(value = '') {
  return (
    !value ||
    /^(©|The product images|coasterfurniture\.com|===|CONTENTS|Index|Warranty|Locations|Showrooms)/i.test(
      value
    ) ||
    /^2026\b/i.test(value) ||
    /^\d{1,3}\s*(The product images|$)/i.test(value)
  )
}

function isProbablyProductLine(value = '') {
  if (isFooterOrNoise(value)) return false
  if (/^(FEATURES|MATERIALS)\s*:/i.test(value)) return false
  return true
}

function dimensionsAfter(lines, index, offset) {
  const first = clean(lines[index + offset] || '')
  const second = clean(lines[index + offset + 1] || '')
  if (hasDimension(first)) return first
  if (hasDimension(second)) return second
  return ''
}

function parseProductRows(lines) {
  const rows = []
  let pdfPage = 0

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index]
    const pageMatch = rawLine.match(/^=== PDF PAGE (\d+) ===/)
    if (pageMatch) {
      pdfPage = Number(pageMatch[1])
      continue
    }

    const line = clean(rawLine)
    if (!isProbablyProductLine(line)) continue

    let match = line.match(PRODUCT_ROW_RE)
    let splitSku = false
    let isNew = Boolean(match?.[1])

    if (!match && /\bNEW\b/i.test(line)) {
      const nextLine = clean(lines[index + 1] || '')
      const splitMatch = nextLine.match(SKU_RE)

      if (splitMatch) {
        const name = line
          .replace(/^(?:(?:[A-Z]|I|[Α-Ω])\s+){0,3}NEW\s+/i, '')
          .trim()

        match = [line, 'NEW ', name, splitMatch[1]]
        splitSku = true
        isNew = true
      }
    }

    if (!match) continue
    if (newOnly && !isNew) continue

    const dimensions = dimensionsAfter(lines, index, splitSku ? 2 : 1)
    if (!dimensions) continue

    const itemName = clean(match[2].replace(/\bNEW\b/gi, ''))
    const sku = match[3]

    if (!itemName || /^\d+$/.test(itemName)) continue

    rows.push({
      index,
      line: index + 1,
      pdfPage,
      sku,
      isNew,
      itemName: titleize(itemName),
      dimensions,
    })
  }

  return rows
}

function candidateCollectionFromLine(value) {
  const line = clean(value).replace(/\s{2,}/g, ' ')
  if (!line || isFooterOrNoise(line)) return null
  if (/^(FEATURES|MATERIALS)\s*:/i.test(line)) return null
  if (/^[A-Z]$/.test(line)) return null
  if (hasDimension(line)) return null

  const collectionPrefix = line.match(/^COLLECTION\s*([A-Z][A-Z0-9& +'/-]{2,})$/)
  if (collectionPrefix) return collectionPrefix[1]

  const collectionSuffix = line.match(/^([A-Z][A-Z0-9& +'/-]{2,})\s+COLLECTIONS?$/)
  if (collectionSuffix) return collectionSuffix[1]

  if (/^[A-Z][A-Z0-9& +'/-]{2,}$/.test(line) && !COLOR_WORDS.test(line)) return line

  return null
}

function cleanCollectionName(value = '') {
  let name = clean(value)
    .replace(/\b(COLLECTIONS?|SUPPLEMENT|2026|COASTER|CATALOG)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!name || GENERIC_COLLECTION_WORDS.has(name.toUpperCase())) return ''
  if (name.length > 36) return ''
  if (/^\d/.test(name)) return ''

  return titleize(name)
}

function collectionForRow(lines, row) {
  const candidates = []

  for (let index = Math.max(0, row.index - 70); index <= Math.min(lines.length - 1, row.index + 40); index += 1) {
    const current = clean(lines[index])
    const previous = clean(lines[index - 1] || '')
    const next = clean(lines[index + 1] || '')

    if (/^COLLECTION$/i.test(current)) {
      const nextName = cleanCollectionName(candidateCollectionFromLine(next) || next)
      if (nextName) candidates.push({ name: nextName, distance: Math.abs(index - row.index) })
    }

    const direct = cleanCollectionName(candidateCollectionFromLine(current) || '')
    if (direct) {
      const hasCollectionNeighbor =
        /\bCOLLECTIONS?\b/i.test(current) ||
        /^COLLECTION$/i.test(previous) ||
        /^COLLECTION$/i.test(next) ||
        /\bCOLLECTIONS?\b/i.test(previous) ||
        /\bCOLLECTIONS?\b/i.test(next)

      if (hasCollectionNeighbor) {
        candidates.push({ name: direct, distance: Math.abs(index - row.index) })
      }
    }
  }

  candidates.sort((a, b) => a.distance - b.distance)
  return candidates[0]?.name || ''
}

function categoryForRow(row) {
  if (row.pdfPage >= 213) return 'Accents'
  if (row.pdfPage >= 121 && row.pdfPage <= 212) return 'Living Room'
  if (row.pdfPage >= 105 && row.pdfPage <= 117) return 'Dining Room'
  if (row.pdfPage >= 45 && row.pdfPage <= 101) return 'Bedroom'

  if (ACCENT_ITEMS.test(row.itemName)) return 'Accents'
  if (BEDROOM_ITEMS.test(row.itemName)) return 'Bedroom'
  if (DINING_ITEMS.test(row.itemName)) return 'Dining Room'
  if (LIVING_ITEMS.test(row.itemName)) return 'Living Room'

  return 'Accents'
}

function materialsForRow(lines, row) {
  const blocks = []

  for (let index = Math.max(0, row.index - 30); index <= Math.min(lines.length - 1, row.index + 30); index += 1) {
    const current = clean(lines[index])
    if (!/^MATERIALS\s*:/i.test(current)) continue

    const parts = [current.replace(/^MATERIALS\s*:\s*/i, '')]

    for (let nextIndex = index + 1; nextIndex <= Math.min(lines.length - 1, index + 4); nextIndex += 1) {
      const next = clean(lines[nextIndex])
      if (
        !next ||
        /^(FEATURES|MATERIALS)\s*:/i.test(next) ||
        PRODUCT_ROW_RE.test(next) ||
        hasDimension(next) ||
        isFooterOrNoise(next) ||
        isLikelyColorLabel(next) ||
        candidateCollectionFromLine(next) ||
        /^COLLECTION$/i.test(next)
      ) {
        break
      }
      parts.push(next)
    }

    blocks.push({ value: clean(parts.join(' ')), distance: Math.abs(index - row.index) })
  }

  blocks.sort((a, b) => a.distance - b.distance)
  return clean(blocks[0]?.value || fallbackMaterial(row.itemName, categoryForRow(row)))
}

function fallbackMaterial(itemName, category) {
  if (/mattress/i.test(itemName)) return 'Foam, fabric, and pocket coil springs'
  if (/foundation/i.test(itemName)) return 'Wood, fabric, and foundation support materials'
  if (/bed|chair|sofa|sectional|ottoman|bench|recliner/i.test(itemName)) {
    return 'Engineered wood, foam, and fabric'
  }
  if (/table|stand|tower|cabinet|dresser|chest|nightstand|sideboard|mirror/i.test(itemName)) {
    return 'Engineered wood and veneer'
  }
  return category === 'Dining Room' ? 'Wood and engineered wood' : 'Mixed furniture materials'
}

function colorForRow(lines, row) {
  const candidates = []

  for (let index = Math.max(0, row.index - 12); index <= Math.min(lines.length - 1, row.index + 18); index += 1) {
    const current = clean(lines[index])
    if (
      !current ||
      current.length > 80 ||
      /^(FEATURES|MATERIALS)\s*:/i.test(current) ||
      PRODUCT_ROW_RE.test(current) ||
      hasDimension(current) ||
      isFooterOrNoise(current) ||
      isMaterialContinuation(current) ||
      isSentenceFragment(current) ||
      /[.:]/.test(current) ||
      /^[A-Z]$/.test(current) ||
      /^COLLECTION$/i.test(current)
    ) {
      continue
    }

    if (COLOR_WORDS.test(current)) {
      candidates.push({ value: titleize(current), distance: Math.abs(index - row.index) })
    }
  }

  candidates.sort((a, b) => a.distance - b.distance)
  return candidates[0]?.value || 'As shown'
}

function isMaterialContinuation(value = '') {
  const line = clean(value)
  if (!line) return false

  return (
    /\b(and foam|engineered wood|hardwood|laminate|larch|lvl|mdf|melamine|metal extension|pine|plywood|polyester|polyethylene|rattan|seagrass|solid asian|tempered glass|veneer)\b/i.test(
      line
    ) ||
    (/,/.test(line) && /\b(fabric|foam|glass|metal|paper|wood)\b/i.test(line) && /\band\b/i.test(line))
  )
}

function isLikelyColorLabel(value = '') {
  const line = clean(value)
  return COLOR_WORDS.test(line) && !isMaterialContinuation(line) && !/[.:]/.test(line)
}

function isSentenceFragment(value = '') {
  return /\b(360-degree|cushions?|feature|features?|inviting|swivel|upholstered|with)\b/i.test(
    clean(value)
  )
}

function formatDimensions(value = '') {
  return clean(value)
    .replace(/"w/gi, ' in W')
    .replace(/"d/gi, ' in D')
    .replace(/"h/gi, ' in H')
    .replace(/"dia/gi, ' in diameter')
}

function baseItemType(itemName = '') {
  return itemName
    .replace(/\b(eastern|california|queen|king|full|twin|twin xl|3 pc|2 pc|5 pc|4 pc|6 pc|7 pc|60\"|70\"|71\"|79\")\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function priceFor(row) {
  const name = row.itemName.toLowerCase()
  if (name.includes('mattress')) return 79900
  if (name.includes('foundation')) return 19900
  if (name.includes('entertainment center')) return 129900
  if (name.includes('sectional')) return name.includes('set') || name.includes('pc') ? 249900 : 189900
  if (name.includes('sofa')) return 129900
  if (name.includes('loveseat')) return 109900
  if (name.includes('recliner')) return 89900
  if (name.includes('chair')) return name.includes('dining') || name.includes('side') || name.includes('arm') ? 24900 : 69900
  if (name.includes('ottoman') || name.includes('bench')) return 29900
  if (name.includes('tv stand')) return 69900
  if (name.includes('media tower')) return 44900
  if (name.includes('sideboard') || name.includes('server')) return 89900
  if (name.includes('dining table')) return 89900
  if (name.includes('coffee table')) return 39900
  if (name.includes('console table')) return 49900
  if (name.includes('end table') || name.includes('side table')) return 24900
  if (name.includes('accent cabinet') || name.includes('cabinet')) return 49900
  if (name.includes('dresser mirror') || name === 'mirror') return 19900
  if (name.includes('floor mirror')) return 29900
  if (name.includes('dresser')) return 89900
  if (name.includes('chest')) return 79900
  if (name.includes('nightstand')) return 39900
  if (name.includes('vanity')) return 79900
  if (name.includes('bed')) return name.includes('king') ? 149900 : 129900
  return 49900
}

function imagesForSku(sku, name) {
  return Array.from({ length: 12 }, (_, index) => {
    const padded = String(index + 1).padStart(2, '0')
    return {
      url: `https://pictures.coastercenter.com/items/${sku}/${sku}_${padded}xHD.jpg`,
      altText: `${name} view ${index + 1}`,
    }
  })
}

function productFromRow(lines, row) {
  const category = categoryForRow(row)
  const collection = collectionForRow(lines, row)
  const alreadyHasCollection =
    collection && row.itemName.toLowerCase().startsWith(collection.toLowerCase())
  const name = collection && !alreadyHasCollection ? `${collection} ${row.itemName}` : row.itemName
  const itemType = baseItemType(row.itemName)
  const color = colorForRow(lines, row)
  const dimensions = formatDimensions(row.dimensions)

  const shortDescription =
    color && color !== 'As shown'
      ? `${color} ${itemType.toLowerCase()} from the 2026 Coaster Supplement.`
      : `New ${itemType.toLowerCase()} from the 2026 Coaster Supplement.`

  const descriptionParts = [
    `From the 2026 Coaster Supplement${collection ? ` ${collection} collection` : ''}.`,
    row.itemName,
    dimensions ? `Dimensions: ${dimensions}.` : '',
  ].filter(Boolean)

  const tagParts = [
    'coaster-2026-supplement',
    collection ? slugify(collection) : '',
    slugify(category),
    slugify(itemType || row.itemName),
    row.isNew ? 'new' : '',
    'placeholder-price',
  ].filter(Boolean)

  return {
    name,
    slug: slugify(`${name}-${row.sku}`),
    category,
    shortDescription,
    description: descriptionParts.join(' '),
    priceCents: priceFor(row),
    sku: row.sku,
    material: limitText(materialsForRow(lines, row), 255),
    color: limitText(color, 100),
    stockQuantity: 0,
    status: 'published',
    isFeatured: false,
    tags: [...new Set(tagParts)],
    images: imagesForSku(row.sku, name),
  }
}

async function main() {
  const sourceText = await readFile(inputPath, 'utf8')
  const existingText = fromHead
    ? execFileSync('git', ['show', 'HEAD:data/products.json'], {
        cwd: root,
        encoding: 'utf8',
      })
    : await readFile(productsPath, 'utf8')

  const lines = sourceText.split(/\r?\n/)
  const existingProducts = JSON.parse(existingText)
  const existingSkus = new Set(existingProducts.map((product) => product.sku).filter(Boolean))
  const extractedRows = parseProductRows(lines)

  const uniqueRows = []
  const seenExtracted = new Set()
  for (const row of extractedRows) {
    if (seenExtracted.has(row.sku)) continue
    seenExtracted.add(row.sku)
    uniqueRows.push(row)
  }

  const additions = uniqueRows
    .filter((row) => !existingSkus.has(row.sku))
    .map((row) => productFromRow(lines, row))

  const merged = [...existingProducts, ...additions]
  const mergedSkuCount = new Set(merged.map((product) => product.sku)).size

  console.log(`Existing products: ${existingProducts.length}`)
  console.log(`Extracted product rows: ${extractedRows.length}`)
  console.log(`Unique extracted SKUs: ${uniqueRows.length}`)
  console.log(`New products to add: ${additions.length}`)
  console.log(`Merged products: ${merged.length}`)

  if (mergedSkuCount !== merged.length) {
    throw new Error(`Duplicate SKUs would remain after merge (${merged.length - mergedSkuCount}).`)
  }

  if (shouldWrite) {
    await writeFile(productsPath, `${JSON.stringify(merged, null, 2)}\n`)
    console.log(`Wrote ${productsPath}`)
  } else {
    console.log('Dry run only. Re-run with --write to update data/products.json.')
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
