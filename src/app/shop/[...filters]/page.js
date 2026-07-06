import ShopView from '@/components/shop/ShopView'
import { getAllProducts, getCategories, buildShopFacets, titleizeSlug } from '@/lib/products'

export async function generateMetadata({ params }) {
  const { filters } = await params
  const name = titleizeSlug(filters?.[0] || 'Shop')
  return { title: name }
}

export default async function ShopCategoryPage({ params }) {
  const { filters } = await params
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()])
  const facets = buildShopFacets(products, categories)

  const requested = filters?.[0] || 'all'
  const known = categories.find((c) => c.slug === requested)
  const initialCategory = known ? requested : 'all'
  // Deeper segments (e.g. /shop/living-room/sofas) map to the top category;
  // their label refines the page title.
  const title = known
    ? known.name
    : filters?.length
      ? titleizeSlug(filters[filters.length - 1])
      : 'All Furniture'

  return (
    <ShopView
      products={products}
      facets={facets}
      title={title}
      initialCategory={initialCategory}
    />
  )
}
