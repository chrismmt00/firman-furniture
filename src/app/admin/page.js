import AdminApp from '@/components/admin/AdminApp'
import { getAllProducts, getCategories } from '@/lib/products'
import { requireAdmin } from '@/lib/auth'

export const metadata = { title: 'Store Admin' }

export default async function AdminPage() {
  // Server-side role gate — 404s for non-admins (and redirects anonymous users to login).
  await requireAdmin()

  let products = []
  let categories = []
  try {
    ;[products, categories] = await Promise.all([getAllProducts(), getCategories()])
  } catch {
    // DB unavailable — admin still renders with demo data only.
  }

  // Trim to the fields the admin client needs (avoid shipping descriptions etc.).
  const adminProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku || '—',
    category: p.category,
    categorySlug: p.categorySlug,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    stock: p.stock,
    status: p.status,
    badge: p.badge,
    image: p.image,
    images: p.images,
    material: p.material,
    color: p.color,
    description: p.description,
  }))

  const adminCategories = categories.map((c) => ({ label: c.name, cat: c.slug, count: c.count }))

  return <AdminApp initialProducts={adminProducts} categories={adminCategories} />
}
