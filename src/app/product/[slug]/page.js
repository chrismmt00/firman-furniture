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
  return {
    title: product.name,
    description: product.shortDescription || product.description?.slice(0, 160),
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
    <ProductDetail
      key={product.id}
      product={product}
      colorVariants={colorVariants}
      related={related}
      reviews={productReviews}
      rating={rating}
    />
  )
}
