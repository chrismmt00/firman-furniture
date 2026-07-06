import ShopView from '@/components/shop/ShopView'
import { getAllProducts, getCategories, buildShopFacets } from '@/lib/products'

export const metadata = {
  title: 'Shop',
  description: 'Browse the full Firman collection — sofas, dining, bedroom, and accent pieces made to be lived with.',
}

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()])
  const facets = buildShopFacets(products, categories)
  return <ShopView products={products} facets={facets} title="All Furniture" />
}
