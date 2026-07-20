import { getAllProducts } from '@/lib/products'

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://firmanfurniture.com').replace(/\/$/, '')

export default async function sitemap() {
  const staticPages = [
    { url: `${BASE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/collections`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/lookbook`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/trade-program`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/shipping-returns`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  let productPages = []
  try {
    const products = await getAllProducts()
    productPages = products.map((p) => ({
      url: `${BASE}/product/${p.slug}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch {
    // DB unavailable at build time — static pages still ship.
  }

  return [...staticPages, ...productPages]
}
