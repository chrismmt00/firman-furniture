const BASE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://firmanfurniture.com').replace(/\/$/, '')

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/account', '/checkout', '/api/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
