import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const inputPath = resolve(process.cwd(), 'data/products.json')

const COLOR_VARIANT_GROUPS = {
  '509501': 'buxton-sofa',
  '509504': 'buxton-sofa',
  '509502': 'buxton-loveseat',
  '509505': 'buxton-loveseat',
  '509340': 'octavia-sectional',
  '509350': 'octavia-sectional',
  '511061': 'octavia-sectional',
  '509343': 'octavia-accent-chair',
  '509353': 'octavia-accent-chair',
  '511063': 'octavia-accent-chair',
  '509344': 'octavia-ottoman',
  '509354': 'octavia-ottoman',
  '511064': 'octavia-ottoman',
  '902541': 'sorrel-swivel-chair',
  '902542': 'sorrel-swivel-chair',
  '907538': 'westhill-swivel-chair',
  '907539': 'westhill-swivel-chair',
  '903222': 'mossbrook-swivel-chair',
  '903223': 'mossbrook-swivel-chair',
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

function buildImages(name, sku, imageNumbers) {
  return imageNumbers.map((number) => {
    const paddedNumber = String(number).padStart(2, '0')

    return {
      url: `https://pictures.coastercenter.com/items/${sku}/${sku}_${paddedNumber}xHD.jpg`,
      altText: `${name} view ${number}`,
    }
  })
}

function makeProduct(product) {
  const tags = [
    'coaster-2026-supplement',
    slugify(product.collection),
    slugify(product.category),
    slugify(product.type),
    'placeholder-price',
  ]
  const colorVariantGroup = COLOR_VARIANT_GROUPS[product.sku]

  if (colorVariantGroup) {
    tags.push(`color-variant-group:${colorVariantGroup}`)
  }

  return {
    name: product.name,
    slug: product.slug || `${slugify(product.name)}-${product.sku.toLowerCase()}`,
    category: product.category,
    shortDescription: product.shortDescription,
    description: `From the 2026 Coaster Supplement ${product.collection} collection. ${product.description} Dimensions: ${product.dimensions}.`,
    priceCents: product.priceCents,
    sku: product.sku,
    material: product.material,
    color: product.color,
    stockQuantity: 0,
    status: 'published',
    isFeatured: Boolean(product.isFeatured),
    tags,
    images: buildImages(product.name, product.sku, product.imageNumbers),
  }
}

const additions = [
  {
    name: 'Solano Dining Table',
    sku: '115501',
    category: 'Dining Room',
    collection: 'Solano',
    type: 'Dining Table',
    shortDescription: 'Weathered mango dining table with a removable extension leaf.',
    description:
      'Dining table with a 16.25 in removable extension leaf, equalizing cable table glides, and brass plated table lock.',
    dimensions: '74.00-90.25 in W x 40.00 in D x 30.00 in H',
    material: 'Solid Mahogany, mango veneer, engineered wood',
    color: 'Weathered Mango',
    priceCents: 129900,
    isFeatured: true,
    imageNumbers: range(1, 12),
  },
  {
    name: 'Solano Side Chair',
    sku: '115502',
    category: 'Dining Room',
    collection: 'Solano',
    type: 'Side Chair',
    shortDescription: 'Weathered mango side chair with beige fabric upholstery.',
    description:
      'Curved-back upholstered side chair from the Solano dining collection. Seat dimensions: 17.50 in D x 19.50 in H.',
    dimensions: '20.50 in W x 24.00 in D x 35.25 in H',
    material: 'Solid Mahogany, engineered wood, foam, fabric',
    color: 'Weathered Mango / Beige Fabric',
    priceCents: 27900,
    imageNumbers: range(1, 14),
  },
  {
    name: 'Solano Sideboard',
    sku: '115505',
    category: 'Dining Room',
    collection: 'Solano',
    type: 'Sideboard',
    shortDescription: 'Weathered mango sideboard with sliding doors and wire management.',
    description: 'Sideboard with sliding doors, wire management access, and two adjustable shelves.',
    dimensions: '64.00 in W x 18.00 in D x 34.75 in H',
    material: 'Solid Mahogany, mango veneer, engineered wood, tempered glass',
    color: 'Weathered Mango',
    priceCents: 119900,
    isFeatured: true,
    imageNumbers: range(1, 15),
  },
  {
    name: 'Twyla Round Dining Table',
    sku: '109230',
    category: 'Dining Room',
    collection: 'Twyla',
    type: 'Dining Table',
    shortDescription: 'Dark cocoa round dining table with a sculpted pedestal base.',
    description:
      'Round table with a sculpted pedestal base designed for a refined transitional dining room.',
    dimensions: '60.00 in diameter x 30.25 in H',
    material: 'Asian hardwood, veneer, engineered wood, polyresin',
    color: 'Dark Cocoa',
    priceCents: 99900,
    imageNumbers: range(1, 7),
  },
  {
    name: 'Hartville Round Dining Table',
    sku: '109460',
    category: 'Dining Room',
    collection: 'Hartville',
    type: 'Dining Table',
    shortDescription: 'Natural light brown white oak dining table with a pedestal base.',
    description:
      'Round pedestal dining table with white oak veneer, sized to seat up to six.',
    dimensions: '60.00 in diameter x 30.00 in H',
    material: 'Asian hardwood, white oak veneer, engineered wood',
    color: 'Natural Light Brown',
    priceCents: 89900,
    imageNumbers: range(1, 8),
  },
  {
    name: 'Hartville Side Chair',
    sku: '109462',
    category: 'Dining Room',
    collection: 'Hartville',
    type: 'Side Chair',
    shortDescription: 'Slat-back dining chair with a light tan upholstered seat.',
    description:
      'Side chair with a slat back and upholstered seat. Seat dimensions: 17.75 in D x 20.00 in H.',
    dimensions: '20.00 in W x 22.75 in D x 39.00 in H',
    material: 'Asian hardwood, engineered wood, foam, fabric',
    color: 'Natural Light Brown / Light Tan Fabric',
    priceCents: 24900,
    imageNumbers: range(1, 13),
  },
  {
    name: 'Franklin Round Dining Table',
    sku: '193820',
    category: 'Dining Room',
    collection: 'Franklin',
    type: 'Dining Table',
    shortDescription: 'Faux grey marble dining table with a durable SMART TOP surface.',
    description:
      'Round dining table with a textured high-pressure engineered laminate top designed to resist stains, UV light, scratches, and impact.',
    dimensions: '59.00 in diameter x 29.50 in H',
    material: 'Solid Asian hardwood, engineered wood, high pressure engineered laminate, paper veneer',
    color: 'Faux Grey Marble / Dark Brown',
    priceCents: 99900,
    imageNumbers: range(1, 10),
  },
  {
    name: 'Franklin Side Chair',
    sku: '193822',
    category: 'Dining Room',
    collection: 'Franklin',
    type: 'Side Chair',
    shortDescription: 'Dark brown side chair with quilted grey tweed upholstery.',
    description:
      'Dining side chair with quilted grey tweed upholstery. Seat dimensions: 17.75 in D x 18.75 in H.',
    dimensions: '22.25 in W x 22.75 in D x 32.00 in H',
    material: 'Solid Asian hardwood, engineered wood, foam, fabric',
    color: 'Dark Brown / Grey Fabric',
    priceCents: 29900,
    imageNumbers: range(2, 15),
  },
  {
    name: 'Croyden Dining Table',
    sku: '193731',
    category: 'Dining Room',
    collection: 'Croyden',
    type: 'Dining Table',
    shortDescription: 'Mid-century dining table with a recessed sintered stone top.',
    description:
      'Dining table with a recessed sintered stone top framed in solid wood for a mid-century modern look.',
    dimensions: '70.75 in W x 35.25 in D x 29.75 in H',
    material: 'Solid Asian hardwood, engineered hardwood, sintered stone',
    color: 'White Sintered Stone / Weathered Natural',
    priceCents: 129900,
    isFeatured: true,
    imageNumbers: range(1, 16),
  },
  {
    name: 'Croyden Side Chair',
    sku: '193732',
    category: 'Dining Room',
    collection: 'Croyden',
    type: 'Side Chair',
    shortDescription: 'Curved-back grey fabric dining chair.',
    description:
      'Plush upholstered side chair with a curved back. Seat dimensions: 17.25 in D x 19.75 in H.',
    dimensions: '24.00 in W x 24.50 in D x 37.00 in H',
    material: 'Solid Asian hardwood, engineered wood, foam, fabric',
    color: 'Weathered Natural / Grey Fabric',
    priceCents: 34900,
    imageNumbers: range(1, 13),
  },
  {
    name: 'Duncan Dining Table',
    sku: '193651',
    category: 'Dining Room',
    collection: 'Duncan',
    type: 'Dining Table',
    shortDescription: 'Washed oak trestle dining table with stout rounded posts.',
    description:
      'Rustic modern trestle table with a white oak veneered top and solid wood frame.',
    dimensions: '70.75 in W x 39.25 in D x 30.00 in H',
    material: 'Solid Asian hardwood, engineered wood, white oak veneer',
    color: 'Washed Oak',
    priceCents: 109900,
    imageNumbers: range(1, 10),
  },
  {
    name: 'Duncan Side Chair',
    sku: '193652',
    category: 'Dining Room',
    collection: 'Duncan',
    type: 'Side Chair',
    shortDescription: 'Washed oak ladder-back dining chair with grey fabric upholstery.',
    description:
      'Ladder-back side chair with rounded posts and upholstered cushion. Seat dimensions: 18.25 in D x 19.00 in H.',
    dimensions: '20.25 in W x 22.50 in D x 35.75 in H',
    material: 'Solid Asian hardwood, engineered wood, foam, fabric',
    color: 'Washed Oak / Grey Fabric',
    priceCents: 27900,
    imageNumbers: range(1, 13),
  },
  {
    name: 'Cardova Dining Table',
    sku: '192921',
    category: 'Dining Room',
    collection: 'Cardova',
    type: 'Dining Table',
    shortDescription: 'Vineyard oak dining table with two removable extension leaves.',
    description:
      'Farmhouse dining table with breadboard ends and two 11.75 in removable extension leaves.',
    dimensions: '63.00-86.50 in W x 39.25 in D x 30.00 in H',
    material: 'Solid Asian hardwood, engineered wood, veneer with embossed oak grain',
    color: 'Vineyard Oak',
    priceCents: 89900,
    imageNumbers: range(1, 16),
  },
  {
    name: 'Cardova Side Chair',
    sku: '192922',
    category: 'Dining Room',
    collection: 'Cardova',
    type: 'Side Chair',
    shortDescription: 'Vineyard oak ladder-back dining chair.',
    description:
      'Farmhouse ladder-back side chair from the Cardova dining collection. Seat dimensions: 17.25 in D x 18.50 in H.',
    dimensions: '18.50 in W x 21.00 in D x 42.25 in H',
    material: 'Solid Asian hardwood, engineered wood, veneer with embossed oak grain',
    color: 'Vineyard Oak',
    priceCents: 22900,
    imageNumbers: range(1, 12),
  },
  {
    name: 'Cardova Bench',
    sku: '192923',
    category: 'Dining Room',
    collection: 'Cardova',
    type: 'Bench',
    shortDescription: 'Vineyard oak dining bench for farmhouse seating.',
    description:
      'Dining bench from the Cardova farmhouse collection. Seat dimensions: 13.00 in D x 18.75 in H.',
    dimensions: '51.25 in W x 13.00 in D x 18.75 in H',
    material: 'Solid Asian hardwood, engineered wood, veneer with embossed oak grain',
    color: 'Vineyard Oak',
    priceCents: 29900,
    imageNumbers: range(1, 9),
  },
  {
    name: 'Buxton Orange Sofa',
    sku: '509501',
    category: 'Living Room',
    collection: 'Buxton',
    type: 'Sofa',
    shortDescription: 'Low-profile sofa upholstered in orange top grain leather.',
    description:
      'Modern leather sofa with wide track arms, sinuous spring deck, full foam seat construction, and attached seat and back cushions. Seat dimensions: 24.50 in D x 17.50 in H.',
    dimensions: '91.25 in W x 37.50 in D x 29.50 in H',
    material: 'Engineered wood, LVL, plastic legs, foam, leather',
    color: 'Orange Top Grain Leather / Black',
    priceCents: 189900,
    isFeatured: true,
    imageNumbers: range(1, 13),
  },
  {
    name: 'Buxton Orange Loveseat',
    sku: '509502',
    category: 'Living Room',
    collection: 'Buxton',
    type: 'Loveseat',
    shortDescription: 'Low-profile loveseat upholstered in orange top grain leather.',
    description:
      'Modern leather loveseat with wide track arms, sinuous spring deck, full foam seat construction, and attached seat and back cushions. Seat dimensions: 24.50 in D x 17.50 in H.',
    dimensions: '73.50 in W x 37.50 in D x 29.50 in H',
    material: 'Engineered wood, LVL, plastic legs, foam, leather',
    color: 'Orange Top Grain Leather / Black',
    priceCents: 159900,
    imageNumbers: range(1, 13),
  },
  {
    name: 'Buxton Graphite Sofa',
    sku: '509504',
    category: 'Living Room',
    collection: 'Buxton',
    type: 'Sofa',
    shortDescription: 'Low-profile sofa upholstered in graphite top grain leather.',
    description:
      'Modern leather sofa with wide track arms, sinuous spring deck, full foam seat construction, and attached seat and back cushions. Seat dimensions: 24.50 in D x 17.50 in H.',
    dimensions: '91.25 in W x 37.50 in D x 29.50 in H',
    material: 'Engineered wood, LVL, plastic legs, foam, leather',
    color: 'Graphite Top Grain Leather / Black',
    priceCents: 189900,
    imageNumbers: range(1, 13),
  },
  {
    name: 'Buxton Graphite Loveseat',
    sku: '509505',
    category: 'Living Room',
    collection: 'Buxton',
    type: 'Loveseat',
    shortDescription: 'Low-profile loveseat upholstered in graphite top grain leather.',
    description:
      'Modern leather loveseat with wide track arms, sinuous spring deck, full foam seat construction, and attached seat and back cushions. Seat dimensions: 24.50 in D x 17.50 in H.',
    dimensions: '73.50 in W x 37.50 in D x 29.50 in H',
    material: 'Engineered wood, LVL, plastic legs, foam, leather',
    color: 'Graphite Top Grain Leather / Black',
    priceCents: 159900,
    imageNumbers: range(1, 13),
  },
  {
    name: 'Octavia Amber Sectional',
    sku: '509340',
    category: 'Living Room',
    collection: 'Octavia',
    type: 'Sectional',
    shortDescription: 'Amber fabric sectional with rounded arms and grid-tufted seating.',
    description:
      'Mid-century inspired sectional with reversible back cushions, tight seats, and included accent pillows. Seat dimensions: 23.50 in D x 17.50 in H.',
    dimensions: '119.25 in W x 79.50 in D x 35.50 in H',
    material: 'Engineered wood, Asian hardwood feet, fabric, foam',
    color: 'Amber Fabric / Black',
    priceCents: 249900,
    isFeatured: true,
    imageNumbers: range(1, 11),
  },
  {
    name: 'Octavia Amber Accent Chair',
    sku: '509343',
    category: 'Living Room',
    collection: 'Octavia',
    type: 'Accent Chair',
    shortDescription: 'Amber fabric accent chair with rounded arms and plush seating.',
    description:
      'Matching accent chair with reversible back cushion, tight seat, and one included accent pillow. Seat dimensions: 23.50 in D x 17.50 in H.',
    dimensions: '54.75 in W x 41.75 in D x 35.50 in H',
    material: 'Engineered wood, Asian hardwood feet, fabric, foam',
    color: 'Amber Fabric / Black',
    priceCents: 89900,
    imageNumbers: range(1, 8),
  },
  {
    name: 'Octavia Amber Ottoman',
    sku: '509344',
    category: 'Living Room',
    collection: 'Octavia',
    type: 'Ottoman',
    shortDescription: 'Amber fabric ottoman for the Octavia living room collection.',
    description: 'Matching ottoman with plush grid-tufted styling for the Octavia collection.',
    dimensions: '39.00 in W x 30.50 in D x 17.50 in H',
    material: 'Engineered wood, Asian hardwood feet, fabric, foam',
    color: 'Amber Fabric / Black',
    priceCents: 49900,
    imageNumbers: range(1, 8),
  },
  {
    name: 'Octavia Orange Sectional',
    sku: '509350',
    category: 'Living Room',
    collection: 'Octavia',
    type: 'Sectional',
    shortDescription: 'Orange fabric sectional with rounded arms and grid-tufted seating.',
    description:
      'Mid-century inspired sectional with reversible back cushions, tight seats, and included accent pillows. Seat dimensions: 91.75 in W x 23.50 in D x 17.50 in H.',
    dimensions: '119.25 in W x 79.50 in D x 35.50 in H',
    material: 'Engineered wood, Asian hardwood feet, fabric, foam',
    color: 'Orange Fabric / Black',
    priceCents: 249900,
    imageNumbers: range(1, 10),
  },
  {
    name: 'Octavia Orange Accent Chair',
    sku: '509353',
    category: 'Living Room',
    collection: 'Octavia',
    type: 'Accent Chair',
    shortDescription: 'Orange fabric accent chair with rounded arms and plush seating.',
    description:
      'Matching accent chair with reversible back cushion, tight seat, and one included accent pillow. Seat dimensions: 24.50 in W x 23.50 in D x 17.50 in H.',
    dimensions: '54.75 in W x 41.75 in D x 35.50 in H',
    material: 'Engineered wood, Asian hardwood feet, fabric, foam',
    color: 'Orange Fabric / Black',
    priceCents: 89900,
    imageNumbers: range(1, 8),
  },
  {
    name: 'Octavia Orange Ottoman',
    sku: '509354',
    category: 'Living Room',
    collection: 'Octavia',
    type: 'Ottoman',
    shortDescription: 'Orange fabric ottoman for the Octavia living room collection.',
    description: 'Matching ottoman with plush grid-tufted styling for the Octavia collection.',
    dimensions: '39.00 in W x 30.50 in D x 17.50 in H',
    material: 'Engineered wood, Asian hardwood feet, fabric, foam',
    color: 'Orange Fabric / Black',
    priceCents: 49900,
    imageNumbers: range(1, 7),
  },
  {
    name: 'Octavia Black Sofa Chaise Sectional',
    slug: 'octavia-amber-sofa-chaise-sectional-511061',
    sku: '511061',
    category: 'Living Room',
    collection: 'Octavia',
    type: 'Sectional',
    shortDescription: 'Black fabric sofa chaise sectional with reversible cushions.',
    description:
      'Sectional with sinuous spring deck, pocket coil springs, reversible back cushions, tight seats, and included accent pillows. Seat dimensions: 23.50 in D x 17.50 in H.',
    dimensions: '119.25 in W x 79.50 in D x 35.50 in H',
    material: 'Engineered wood, Asian hardwood feet, fabric, foam',
    color: 'Black Fabric / Black',
    priceCents: 249900,
    imageNumbers: range(1, 9),
  },
  {
    name: 'Octavia Black Chair',
    slug: 'octavia-amber-chair-511063',
    sku: '511063',
    category: 'Living Room',
    collection: 'Octavia',
    type: 'Accent Chair',
    shortDescription: 'Black fabric chair with a wide rounded profile.',
    description:
      'Accent chair with sinuous spring deck, pocket coil springs, reversible back cushion, tight seat, and included accent pillow. Seat dimensions: 23.50 in D x 17.50 in H.',
    dimensions: '54.75 in W x 41.75 in D x 35.50 in H',
    material: 'Engineered wood, Asian hardwood feet, fabric, foam',
    color: 'Black Fabric / Black',
    priceCents: 89900,
    imageNumbers: range(1, 9),
  },
  {
    name: 'Octavia Black Ottoman',
    slug: 'octavia-amber-ottoman-511064',
    sku: '511064',
    category: 'Living Room',
    collection: 'Octavia',
    type: 'Ottoman',
    shortDescription: 'Black fabric ottoman for the sofa chaise Octavia collection.',
    description: 'Matching ottoman with plush grid-tufted styling for the Octavia sofa chaise collection.',
    dimensions: '39.00 in W x 30.50 in D x 17.50 in H',
    material: 'Engineered wood, Asian hardwood feet, fabric, foam',
    color: 'Black Fabric / Black',
    priceCents: 49900,
    imageNumbers: range(1, 7),
  },
  {
    name: 'Devonshire Sleeper Sectional',
    sku: '511049',
    category: 'Living Room',
    collection: 'Devonshire',
    type: 'Sleeper Sectional',
    shortDescription: 'Black corduroy sleeper sectional with a pop-up bed and storage chaise.',
    description:
      'Corduroy sleeper sectional with removable back cushions, attached seat cushions, a pop-up sleeper, hidden storage chaise, smooth-rolling casters, and three accent pillows. Seat dimensions: 98.50 in D x 22.00 in H.',
    dimensions: '122.00 in W x 96.75 in D x 39.25 in H',
    material: 'Engineered wood, plastic feet, fabric, foam',
    color: 'Black Corduroy / Black',
    priceCents: 199900,
    isFeatured: true,
    imageNumbers: range(1, 18),
  },
  {
    name: 'Pastrana Sleeper Sectional',
    sku: '500348',
    category: 'Living Room',
    collection: 'Pastrana',
    type: 'Sleeper Sectional',
    shortDescription: 'Camel fabric sleeper sectional with a pull-out bed and storage chaise.',
    description:
      'Modern sleeper sectional with deep seating, a hidden pull-out bed, lift-up chaise storage, vertical tufting, and wide track arms. Seat dimensions: 24.75 in D x 20.25 in H. Sleep surface: 101.50 in W x 49.50 in D.',
    dimensions: '109.50 in W x 64.50 in D x 37.00 in H',
    material: 'Engineered wood, metal, plastic feet, fabric, foam',
    color: 'Camel Fabric / Black',
    priceCents: 169900,
    imageNumbers: range(1, 15),
  },
  {
    name: 'Roanne Sleeper Sectional',
    sku: '500347',
    category: 'Living Room',
    collection: 'Roanne',
    type: 'Sleeper Sectional',
    shortDescription: 'Grey fabric sleeper sectional with nested stools and storage chaise.',
    description:
      'Compact sleeper sectional with a pull-out sleeper, lift-up storage chaise, tufted cushions, and two stools that nest into the armrest. Seat dimensions: 21.25 in D x 16.50 in H. Sleep surface: 71.00 in W x 47.25 in D.',
    dimensions: '97.75 in W x 65.75 in D x 36.50 in H',
    material: 'Asian hardwood, engineered wood, metal, plastic feet, fabric, foam',
    color: 'Grey Fabric / Black',
    priceCents: 149900,
    imageNumbers: range(1, 18),
  },
  {
    name: 'Ashlyn Sofa',
    sku: '552091',
    category: 'Living Room',
    collection: 'Ashlyn',
    type: 'Sofa',
    shortDescription: 'Sand boucle sofa with sculptural curves and cappuccino legs.',
    description:
      'Transitional sofa with sloped track arms, reversible seat and back cushions, premium down-like fill, and included accent pillows. Seat dimensions: 25.00 in D x 21.00 in H.',
    dimensions: '89.50 in W x 40.00 in D x 37.00 in H',
    material: 'Engineered wood, pine, Asian hardwood feet, premium down-like fill, foam, fabric',
    color: 'Sand Boucle / Cappuccino',
    priceCents: 129900,
    imageNumbers: range(1, 12),
  },
  {
    name: 'Ashlyn Loveseat',
    sku: '552092',
    category: 'Living Room',
    collection: 'Ashlyn',
    type: 'Loveseat',
    shortDescription: 'Sand boucle loveseat with sculptural curves and cappuccino legs.',
    description:
      'Transitional loveseat with sloped track arms, reversible seat and back cushions, premium down-like fill, and included accent pillows. Seat dimensions: 25.00 in D x 21.00 in H.',
    dimensions: '65.00 in W x 40.00 in D x 37.00 in H',
    material: 'Engineered wood, pine, Asian hardwood feet, premium down-like fill, foam, fabric',
    color: 'Sand Boucle / Cappuccino',
    priceCents: 99900,
    imageNumbers: range(1, 12),
  },
  {
    name: 'Ashlyn Accent Chair',
    sku: '509893',
    category: 'Living Room',
    collection: 'Ashlyn',
    type: 'Accent Chair',
    shortDescription: 'Sand boucle accent chair with cloud-like support.',
    description:
      'Transitional accent chair with reversible seat and back cushions, premium down-like fill, and one included accent pillow. Seat dimensions: 25.00 in D x 21.00 in H.',
    dimensions: '41.00 in W x 40.00 in D x 37.00 in H',
    material: 'Engineered wood, pine, Asian hardwood feet, premium down-like fill, foam, fabric',
    color: 'Sand Boucle / Cappuccino',
    priceCents: 69900,
    imageNumbers: range(1, 11),
  },
  {
    name: 'Jeanette Sofa',
    sku: '508961',
    category: 'Living Room',
    collection: 'Jeanette',
    type: 'Sofa',
    shortDescription: 'Beige fabric sofa with sculptural upholstery and wood waistband.',
    description:
      'Modern eclectic sofa with attached seat and back cushions, feather blend accent pillows, a solid wood waistband, waterfall bench seat, and pocket coil support. Seat dimensions: 18.50 in D x 18.00 in H.',
    dimensions: '83.50 in W x 37.00 in D x 28.00 in H',
    material: 'Eucalyptus, engineered wood, Asian hardwood feet, premium down-like fill, fabric, foam',
    color: 'Beige Fabric / Black',
    priceCents: 119900,
    imageNumbers: range(1, 13),
  },
  {
    name: 'Sorrel Ivory Swivel Chair',
    sku: '902541',
    category: 'Accents',
    collection: 'Sorrel',
    type: 'Swivel Chair',
    shortDescription: 'Ivory corduroy swivel chair with softly sloped arms.',
    description:
      'Swivel accent chair with softly sloped arms, a tall backrest, smooth upholstery, and a black metal swivel base. Seat dimensions: 22.00 in D x 20.75 in H.',
    dimensions: '38.25 in W x 34.25 in D x 37.00 in H',
    material: 'Engineered wood, metal, fabric, foam',
    color: 'Ivory Corduroy / Black',
    priceCents: 69900,
    isFeatured: true,
    imageNumbers: range(1, 11),
  },
  {
    name: 'Sorrel Black Swivel Chair',
    sku: '902542',
    category: 'Accents',
    collection: 'Sorrel',
    type: 'Swivel Chair',
    shortDescription: 'Black corduroy swivel chair with softly sloped arms.',
    description:
      'Swivel accent chair with softly sloped arms, a tall backrest, smooth upholstery, and a black metal swivel base. Seat dimensions: 22.00 in D x 20.75 in H.',
    dimensions: '38.25 in W x 34.25 in D x 37.00 in H',
    material: 'Engineered wood, metal, fabric, foam',
    color: 'Black Corduroy / Black',
    priceCents: 69900,
    imageNumbers: range(1, 11),
  },
  {
    name: 'Comfy Latte Swivel Glider Chair',
    sku: '903930',
    category: 'Accents',
    collection: 'Comfy',
    type: 'Swivel Glider Chair',
    shortDescription: 'Latte fabric swivel glider chair with reclining comfort.',
    description:
      'Swivel glider chair with trendy fabric, a 360-degree swivel base, gentle gliding, reclining capability, and plush support. Seat dimensions: 22.50 in D x 18.50 in H.',
    dimensions: '30.25 in W x 35.50 in D x 34.00 in H',
    material: 'Engineered wood, metal, fabric, foam',
    color: 'Latte Fabric',
    priceCents: 59900,
    imageNumbers: range(1, 11),
  },
  {
    name: 'Westhill Rocky Road Swivel Chair',
    sku: '907538',
    category: 'Accents',
    collection: 'Westhill',
    type: 'Swivel Chair',
    shortDescription: 'Rocky road boucle swivel chair with a rounded open back.',
    description:
      'Modern swivel accent chair with sculptural curves, tailored seating, warm textured boucle upholstery, and a hidden swivel base. Seat dimensions: 25.00 in D x 19.75 in H.',
    dimensions: '28.25 in W x 25.00 in D x 29.50 in H',
    material: 'Engineered wood, metal, fabric, foam',
    color: 'Rocky Road Boucle',
    priceCents: 54900,
    imageNumbers: range(1, 11),
  },
  {
    name: 'Westhill Berry Swivel Chair',
    sku: '907539',
    category: 'Accents',
    collection: 'Westhill',
    type: 'Swivel Chair',
    shortDescription: 'Berry boucle swivel chair with a rounded open back.',
    description:
      'Modern swivel accent chair with sculptural curves, tailored seating, warm textured boucle upholstery, and a hidden swivel base. Seat dimensions: 25.00 in D x 19.75 in H.',
    dimensions: '28.25 in W x 25.00 in D x 29.50 in H',
    material: 'Engineered wood, metal, fabric, foam',
    color: 'Berry Boucle',
    priceCents: 54900,
    imageNumbers: range(1, 11),
  },
  {
    name: 'Mossbrook Anthracite Swivel Accent Chair',
    sku: '903222',
    category: 'Accents',
    collection: 'Mossbrook',
    type: 'Swivel Accent Chair',
    shortDescription: 'Anthracite swivel accent chair with a rounded barrel back.',
    description:
      'Compact swivel accent chair with seamless upholstery, a sculpted barrel back, foam-padded seat, and a hidden swivel base. Seat dimensions: 21.75 in D x 19.25 in H.',
    dimensions: '29.25 in W x 29.25 in D x 31.50 in H',
    material: 'Engineered wood, metal, fabric, foam',
    color: 'Anthracite Fabric',
    priceCents: 54900,
    imageNumbers: range(1, 11),
  },
  {
    name: 'Mossbrook Green Swivel Accent Chair',
    sku: '903223',
    category: 'Accents',
    collection: 'Mossbrook',
    type: 'Swivel Accent Chair',
    shortDescription: 'Green swivel accent chair with a rounded barrel back.',
    description:
      'Compact swivel accent chair with seamless upholstery, a sculpted barrel back, foam-padded seat, and a hidden swivel base. Seat dimensions: 21.75 in D x 19.25 in H.',
    dimensions: '29.25 in W x 29.25 in D x 31.50 in H',
    material: 'Engineered wood, metal, fabric, foam',
    color: 'Green Fabric',
    priceCents: 54900,
    imageNumbers: range(1, 11),
  },
  {
    name: 'Latte Accent Bench',
    sku: '915160',
    category: 'Accents',
    collection: 'Stylish Accents',
    type: 'Accent Bench',
    shortDescription: 'Latte fabric accent bench with a black base.',
    description: 'Accent bench for adding stylish seating at the end of a bed, entryway, or living space.',
    dimensions: '51.75 in W x 19.00 in D x 18.25 in H',
    material: 'Asian hardwood, larch, fabric, foam',
    color: 'Latte Fabric / Black',
    priceCents: 34900,
    imageNumbers: range(1, 7),
  },
  {
    name: 'Black Side Table',
    sku: '930275',
    category: 'Accents',
    collection: 'Stylish Accents',
    type: 'Side Table',
    shortDescription: 'Compact black side table from the 2026 accent collection.',
    description: 'Compact rectangular side table for accent seating areas and small-space styling.',
    dimensions: '15.75 in W x 11.50 in D x 23.50 in H',
    material: 'Engineered wood, melamine paper',
    color: 'Black',
    priceCents: 19900,
    imageNumbers: range(1, 10),
  },
  {
    name: 'Tall Accent Cabinet',
    sku: '950432',
    category: 'Accents',
    collection: 'Timeless Accent Cabinets',
    type: 'Accent Cabinet',
    shortDescription: 'Tall black and light oak accent cabinet with LED lighting.',
    description:
      'Tall accent cabinet with clear tempered glass, black hardware, LED lighting, soft-closing doors, two adjustable shelves, and three fixed shelves.',
    dimensions: '35.50 in W x 15.50 in D x 70.75 in H',
    material: 'Engineered wood, melamine paper, tempered glass, metal',
    color: 'Black / Light Oak',
    priceCents: 79900,
    isFeatured: true,
    imageNumbers: range(1, 12),
  },
  {
    name: 'Accent Cabinet',
    sku: '950429',
    category: 'Accents',
    collection: 'Timeless Accent Cabinets',
    type: 'Accent Cabinet',
    shortDescription: 'Black and light oak accent cabinet with clear tempered glass.',
    description:
      'Accent cabinet with clear tempered glass, black hardware, soft-closing doors, and two adjustable shelves.',
    dimensions: '35.50 in W x 15.50 in D x 31.75 in H',
    material: 'Engineered wood, melamine paper, tempered glass, metal',
    color: 'Black / Light Oak',
    priceCents: 49900,
    imageNumbers: range(1, 11),
  },
]

const raw = await readFile(inputPath, 'utf8')
const products = JSON.parse(raw)
const seenAdditionSkus = new Set()
const additionsBySku = new Map()

for (const addition of additions.map(makeProduct)) {
  if (seenAdditionSkus.has(addition.sku)) {
    throw new Error(`Duplicate addition SKU: ${addition.sku}`)
  }

  if (addition.images.length < 2) {
    throw new Error(`Expected at least two images for ${addition.sku}`)
  }

  seenAdditionSkus.add(addition.sku)
  additionsBySku.set(addition.sku, addition)
}

const existingSkus = new Set()
const output = products.map((product) => {
  if (existingSkus.has(product.sku)) {
    throw new Error(`Duplicate existing SKU: ${product.sku}`)
  }

  existingSkus.add(product.sku)
  return additionsBySku.get(product.sku) || product
})

const addedProducts = []

for (const addition of additionsBySku.values()) {
  if (!existingSkus.has(addition.sku)) {
    output.push(addition)
    addedProducts.push(addition)
  }
}

await writeFile(inputPath, `${JSON.stringify(output, null, 2)}\n`)

console.log(`Wrote ${output.length} products to ${inputPath}`)
console.log(`Added ${addedProducts.length} products`)

for (const product of addedProducts) {
  console.log(`- ${product.category}: ${product.sku} ${product.name} (${product.images.length} images)`)
}
