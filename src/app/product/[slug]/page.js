import { notFound } from 'next/navigation'
import ProductDetail from '@/components/shop/ProductDetail'
import {
  getAllProducts,
  getProductBySlug,
  getProductColorVariants,
  getRelatedProducts,
} from '@/lib/products'
import { productReviews } from '@/lib/demo-data'

export async function generateStaticParams() {
  try {
    const products = await getAllProducts()
    return products.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product not found' }
  const description = product.shortDescription || product.description?.slice(0, 160)
  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      type: 'website',
      images: product.image ? [{ url: product.image }] : [],
    },
  }
}

/* Schema.org Product structured data for rich results. */
function productJsonLd(product) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://firmanfurniture.com').replace(/\/$/, '')
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description?.slice(0, 300) || undefined,
    image: product.images,
    sku: product.sku || undefined,
    brand: { '@type': 'Brand', name: 'Firman Furniture' },
    material: product.material || undefined,
    color: product.color || undefined,
    offers: {
      '@type': 'Offer',
      url: `${base}/product/${product.slug}`,
      priceCurrency: 'USD',
      price: (product.price / 100).toFixed(2),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/MadeToOrder',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product || product.status !== 'published') notFound()

  const [colorVariants, related] = await Promise.all([
    getProductColorVariants(product),
    getRelatedProducts(product, 4),
  ])
  const rating =
    productReviews.reduce((n, r) => n + r.rating, 0) / productReviews.length

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <ProductDetail
        key={product.id}
        product={product}
        colorVariants={colorVariants}
        related={related}
        reviews={productReviews}
        rating={rating}
      />
    </>
  )
}
