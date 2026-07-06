'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/components/providers/StoreProvider'
import { useToast } from '@/components/ui/ToastProvider'
import { formatCents, initials } from '@/lib/format'
import {
  customers as demoCustomers,
  orders as demoOrders,
  reviews as demoReviews,
  decorateReview,
  discounts as demoDiscounts,
  discountStatusMeta,
  tradeApplications as demoTrade,
  tradeStatusMeta,
  subscribers as demoSubs,
  staff,
  shippingRates,
  taxRates,
  pages,
  blogPosts as demoBlog,
  editorialCollections,
  revenueChart,
  adminStats,
  statusMeta,
} from '@/lib/demo-data'

/* ── Shared little bits ───────────────────────────────────────────── */
const card = 'bg-[var(--color-white)] border border-[var(--color-stone)]'
const field =
  'w-full p-3 bg-[var(--color-ivory)] border border-[var(--color-stone)] outline-none text-[0.86rem] font-light focus:border-[var(--color-charcoal)]'
const lbl = 'block text-[0.7rem] text-[var(--color-mid-gray)] mb-1.5'
const sectionLabel = 'text-[0.6rem] tracking-[0.16em] uppercase text-[var(--color-warm-gray)]'

function StatusPill({ status }) {
  const m = statusMeta(status)
  return <span className="text-[0.58rem] tracking-[0.12em] uppercase px-2.5 py-1.5 justify-self-start" style={{ color: m.color, background: m.bg }}>{m.label}</span>
}

function Th({ children, className = '' }) {
  return <span className={`text-[0.58rem] tracking-[0.16em] uppercase text-[var(--color-warm-gray)] ${className}`}>{children}</span>
}

const NAV = [
  ['dashboard', 'Dashboard'], ['products', 'Products'], ['orders', 'Orders'], ['customers', 'Customers'],
  ['inventory', 'Inventory'], ['collections', 'Collections'], ['categories', 'Categories'], ['discounts', 'Discounts'],
  ['reviews', 'Reviews'], ['marketing', 'Marketing'], ['content', 'Content'], ['analytics', 'Analytics'], ['settings', 'Settings'],
]

const BLANK_PRODUCT = {
  id: null, name: '', slug: '', sku: '', description: '', price: '', compare: '', stock: '0',
  material: '', color: '', mat: 'Upholstery', colorFamily: 'Neutral', dimensions: '', leadTime: '6–8 weeks',
  category: 'Living Room', badge: '', status: 'published', images: [],
}

export default function AdminApp({ initialProducts, categories }) {
  const { askConfirm } = useStore()
  const toast = useToast()

  const [section, setSection] = useState('dashboard')
  const [products, setProducts] = useState(initialProducts)
  const [ordersState, setOrdersState] = useState(demoOrders.map((o) => ({ ...o, notes: '' })))
  const [reviews, setReviews] = useState(demoReviews)
  const [discounts, setDiscounts] = useState(demoDiscounts)
  const [collections, setCollections] = useState(editorialCollections.map((c, i) => ({ id: `c${i}`, ...c })))
  const [blog, setBlog] = useState(demoBlog)
  const [trade, setTrade] = useState(demoTrade)
  const [subs, setSubs] = useState(demoSubs)

  const [edit, setEdit] = useState(null) // product draft
  const [openOrderNum, setOpenOrderNum] = useState(null)
  const [openCustomerEmail, setOpenCustomerEmail] = useState(null)
  const [settingsTab, setSettingsTab] = useState('general')
  const [discountModal, setDiscountModal] = useState(null)
  const [collectionModal, setCollectionModal] = useState(null)
  const [blogModal, setBlogModal] = useState(null)

  const go = (sec) => { setOpenOrderNum(null); setOpenCustomerEmail(null); setSection(sec) }

  /* ── Product actions ───────────────────────────────────────────── */
  const startEdit = (p) => {
    setEdit(p
      ? {
          id: p.id, name: p.name, slug: p.slug, sku: p.sku, description: p.description || '',
          price: String(Math.round(p.price / 100)), compare: p.compareAtPrice ? String(Math.round(p.compareAtPrice / 100)) : '',
          stock: String(p.stock), material: p.material || '', color: p.color || '', mat: 'Upholstery', colorFamily: 'Neutral',
          dimensions: '', leadTime: '6–8 weeks', category: p.category, badge: p.badge || '', status: p.status, images: [...(p.images || [])], _newImg: '',
        }
      : { ...BLANK_PRODUCT, _newImg: '' })
    setSection('product-edit')
  }

  const saveProduct = () => {
    if (!edit.name) { toast.error('Product name is required'); return }
    const priceCents = Math.round(Number(edit.price || 0) * 100)
    const compareCents = edit.compare ? Math.round(Number(edit.compare) * 100) : null
    const slug = edit.slug || edit.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (edit.id) {
      setProducts((prev) => prev.map((p) => p.id === edit.id ? {
        ...p, name: edit.name, slug, sku: edit.sku, description: edit.description, price: priceCents,
        compareAtPrice: compareCents, stock: Number(edit.stock || 0), material: edit.material, color: edit.color,
        category: edit.category, badge: edit.badge, status: edit.status,
        image: edit.images[0] || p.image, images: edit.images.length ? edit.images : p.images,
      } : p))
    } else {
      setProducts((prev) => [{
        id: `new-${Date.now()}`, name: edit.name, slug, sku: edit.sku || '—', category: edit.category,
        categorySlug: '', price: priceCents, compareAtPrice: compareCents, stock: Number(edit.stock || 0),
        status: edit.status, badge: edit.badge || 'New', material: edit.material, color: edit.color,
        description: edit.description, image: edit.images[0] || '', images: edit.images,
      }, ...prev])
    }
    toast.success('Product saved')
    setSection('products')
  }

  const togglePublish = (id) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } : p))
  }

  const deleteProduct = async (id) => {
    const ok = await askConfirm({ title: 'Delete product?', message: 'This product will be removed from the store.', cta: 'Delete' })
    if (!ok) return
    setProducts((prev) => prev.filter((p) => p.id !== id))
    toast.show('Product deleted')
  }

  const adjustStock = (id, delta) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
  }

  /* ── Derived ───────────────────────────────────────────────────── */
  const publishedCount = products.filter((p) => p.status === 'published').length
  const lowStock = products.filter((p) => p.stock <= 5).slice(0, 4)
  const recentOrders = ordersState.slice(0, 5)
  const invUnits = products.reduce((n, p) => n + p.stock, 0)
  const invValue = products.reduce((n, p) => n + p.stock * p.price, 0)
  const openOrder = ordersState.find((o) => o.number === openOrderNum)
  const openCustomer = demoCustomers.find((c) => c.email === openCustomerEmail)

  return (
    <div className="flex min-h-screen bg-[var(--color-white)]">
      {/* Sidebar */}
      <aside className="sticky top-0 self-start h-screen w-[236px] shrink-0 bg-[var(--color-black)] text-[var(--color-ivory)] hidden md:flex flex-col py-6">
        <div className="px-6 pb-5 border-b border-[var(--color-white)]/10">
          <div className="font-serif text-2xl tracking-[0.04em] text-[var(--color-white)]">FIRMAN</div>
          <div className="text-[0.56rem] tracking-[0.28em] uppercase text-[var(--color-champagne-light)] mt-0.5">Store Admin</div>
        </div>
        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-5 flex flex-col gap-0.5">
          {NAV.map(([sec, label]) => {
            const active = section === sec || (sec === 'orders' && section === 'order-admin') || (sec === 'customers' && section === 'customer-detail') || (sec === 'products' && section === 'product-edit')
            return (
              <button key={sec} onClick={() => go(sec)} className={`text-left px-3.5 py-2.5 text-[0.72rem] tracking-[0.04em] ${active ? 'bg-[var(--color-white)]/10 text-[var(--color-white)]' : 'text-[var(--color-ivory)]/65 hover:text-[var(--color-white)]'}`}>{label}</button>
            )
          })}
        </nav>
        <div className="px-3">
          <Link href="/" className="block px-3.5 py-2.5 text-[0.66rem] tracking-[0.12em] uppercase text-[var(--color-champagne-light)] hover:text-[var(--color-white)]">← Back to store</Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-[var(--color-stone)] flex items-center justify-between px-[clamp(1.2rem,3vw,2.4rem)] sticky top-0 bg-[var(--color-white)]/90 backdrop-blur z-50">
          <input placeholder="Search orders, products, customers…" className="w-[min(340px,40vw)] py-2.5 px-3.5 bg-[var(--color-ivory)] border border-[var(--color-stone)] outline-none text-[0.8rem] font-light" />
          <div className="flex items-center gap-4">
            <span className="text-[0.7rem] text-[var(--color-mid-gray)] hidden sm:block">Eleanor · Owner</span>
            <div className="w-[34px] h-[34px] rounded-full bg-[var(--color-champagne-pale)] text-[var(--color-champagne-dark)] flex items-center justify-center text-[0.7rem] font-semibold">EW</div>
          </div>
        </header>

        <div className="flex-1 p-[clamp(1.6rem,3vw,2.6rem)] bg-[var(--color-ivory)]">
          {/* Mobile section switcher */}
          <select value={section} onChange={(e) => go(e.target.value)} className="md:hidden w-full mb-5 p-3 bg-[var(--color-white)] border border-[var(--color-stone)] outline-none text-sm">
            {NAV.map(([sec, label]) => <option key={sec} value={sec}>{label}</option>)}
          </select>

          {/* DASHBOARD */}
          {section === 'dashboard' && (
            <div>
              <h1 className="text-3xl">Good morning, Eleanor.</h1>
              <p className="text-[var(--color-mid-gray)] mt-1 font-light">Here&apos;s how Firman is performing today.</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-7">
                {[['Revenue (30d)', adminStats.revenue, '▲ 12.4%'], ['Orders', ordersState.length, '▲ 4 today'], ['Avg. order', adminStats.aov, '—'], ['Customers', adminStats.customerCount, '▲ 2 new']].map(([t, v, d]) => (
                  <div key={t} className={`${card} p-5`}><p className={sectionLabel}>{t}</p><p className="font-serif text-[2.2rem] mt-1">{v}</p><p className="text-[0.72rem] text-[var(--color-success)] mt-0.5">{d}</p></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3.5">
                <div className={`${card} p-5`}>
                  <div className="flex justify-between items-center"><h3 className="text-xl">Revenue</h3><span className="text-[0.62rem] tracking-[0.14em] uppercase text-[var(--color-warm-gray)]">Last 14 days</span></div>
                  <div className="flex items-end gap-1 h-[140px] mt-5">
                    {revenueChart.map((h, i) => <div key={i} className="flex-1 bg-[var(--color-champagne-pale)] rounded-[1px] hover:bg-[var(--color-champagne)] transition-colors" style={{ height: `${h}%` }} />)}
                  </div>
                </div>
                <div className={`${card} p-5`}>
                  <h3 className="text-xl">Low stock</h3>
                  <div className="mt-4 flex flex-col gap-2.5">
                    {lowStock.map((p) => (
                      <div key={p.id} className="flex items-center gap-3.5"><img loading="lazy" src={p.image} alt="" className="w-[38px] h-11 object-cover bg-[var(--color-stone)]" /><div className="flex-1"><p className="text-[0.84rem]">{p.name}</p><p className="text-[0.7rem] text-[var(--color-warm-gray)]">{p.sku}</p></div><span className="text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-error)] bg-[var(--color-error-light)] px-2 py-1">{p.stock} left</span></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`${card} p-5 mt-3.5`}>
                <div className="flex justify-between items-center mb-4"><h3 className="text-xl">Recent orders</h3><button onClick={() => go('orders')} className="text-[0.64rem] tracking-[0.14em] uppercase text-[var(--color-champagne-dark)]">View all →</button></div>
                {recentOrders.map((o) => (
                  <div key={o.number} className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 items-center py-3 border-t border-[var(--color-stone)]"><span className="text-[0.84rem] font-medium">{o.number}</span><span className="text-[0.8rem] text-[var(--color-mid-gray)]">{o.customer}</span><StatusPill status={o.status} /><span className="text-[0.86rem]">{formatCents(o.total)}</span></div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {section === 'products' && (
            <div>
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div><h1 className="text-3xl">Products</h1><p className="text-[var(--color-mid-gray)] font-light mt-0.5">{products.length} products · {publishedCount} published</p></div>
                <button onClick={() => startEdit(null)} className="px-7 py-3.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.18em] uppercase hover:bg-[var(--color-champagne-dark)]">+ New product</button>
              </div>
              <div className={`${card} mt-5 overflow-x-auto`}>
                <div className="grid grid-cols-[2.4fr_1fr_.8fr_.8fr_1fr_.8fr] gap-4 px-5 py-3.5 border-b border-[var(--color-stone)] min-w-[720px]">
                  <Th>Product</Th><Th>Category</Th><Th>Price</Th><Th>Stock</Th><Th>Status</Th><Th className="text-right">Actions</Th>
                </div>
                {products.map((p) => (
                  <div key={p.id} className="grid grid-cols-[2.4fr_1fr_.8fr_.8fr_1fr_.8fr] gap-4 px-5 py-3.5 border-b border-[var(--color-stone)] items-center min-w-[720px] hover:bg-[var(--color-ivory)]">
                    <div className="flex items-center gap-3.5"><img loading="lazy" src={p.image} alt="" className="w-[42px] h-[50px] object-cover bg-[var(--color-stone)]" /><div><p className="text-[0.86rem] font-medium">{p.name}</p><p className="text-[0.68rem] text-[var(--color-warm-gray)]">{p.sku}</p></div></div>
                    <span className="text-[0.8rem] text-[var(--color-mid-gray)]">{p.category}</span>
                    <span className="text-[0.84rem]">{formatCents(p.price)}</span>
                    <span className="text-[0.84rem]" style={{ color: p.stock <= 5 ? 'var(--color-error)' : 'inherit' }}>{p.stock}</span>
                    <button onClick={() => togglePublish(p.id)} className="text-[0.58rem] tracking-[0.12em] uppercase px-2.5 py-1.5 justify-self-start border border-[var(--color-stone)] text-[var(--color-mid-gray)] hover:border-[var(--color-champagne)]">{p.status === 'published' ? 'Published' : 'Draft'}</button>
                    <div className="flex gap-3.5 justify-end"><button onClick={() => startEdit(p)} className="text-[0.62rem] tracking-[0.1em] uppercase text-[var(--color-champagne-dark)] hover:text-[var(--color-black)]">Edit</button><button onClick={() => deleteProduct(p.id)} className="text-[0.62rem] tracking-[0.1em] uppercase text-[var(--color-warm-gray)] hover:text-[var(--color-error)]">Delete</button></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCT EDIT */}
          {section === 'product-edit' && edit && (
            <div className="max-w-[920px]">
              <div className="text-[0.64rem] tracking-[0.14em] uppercase text-[var(--color-warm-gray)] mb-4"><button onClick={() => setSection('products')} className="hover:text-[var(--color-charcoal)]">Products</button> / {edit.id ? edit.name : 'New product'}</div>
              <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-3xl">{edit.id ? edit.name : 'New product'}</h1>
                <div className="flex gap-2.5"><button onClick={() => setSection('products')} className="px-6 py-3 border border-[var(--color-stone)] text-[0.64rem] tracking-[0.14em] uppercase hover:border-[var(--color-charcoal)]">Cancel</button><button onClick={saveProduct} className="px-7 py-3 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.64rem] tracking-[0.14em] uppercase hover:bg-[var(--color-champagne-dark)]">Save product</button></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-5 mt-6">
                <div className="flex flex-col gap-5">
                  <div className={`${card} p-5`}>
                    <p className={`${sectionLabel} mb-3.5`}>Details</p>
                    <label className={lbl}>Product name</label>
                    <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} placeholder="e.g. Milano Sectional Sofa" className={field} />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div><label className={lbl}>URL slug</label><input value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} placeholder="auto-generated" className={field} /></div>
                      <div><label className={lbl}>SKU</label><input value={edit.sku} onChange={(e) => setEdit({ ...edit, sku: e.target.value })} className={field} /></div>
                    </div>
                    <label className={`${lbl} mt-4`}>Description</label>
                    <textarea value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} placeholder="Describe the piece…" className={`${field} min-h-[96px] resize-y leading-relaxed`} />
                  </div>

                  <div className={`${card} p-5`}>
                    <div className="flex items-center justify-between mb-3.5"><p className={sectionLabel}>Media gallery</p><span className="text-[0.66rem] text-[var(--color-warm-gray)]">{edit.images.length} image(s) · first is primary</span></div>
                    {edit.images.length === 0 && <div className="border border-dashed border-[var(--color-stone)] p-8 text-center text-[var(--color-warm-gray)] text-[0.82rem] mb-4">No images yet — add one below.</div>}
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2.5">
                      {edit.images.map((src, i) => (
                        <div key={i} className="relative aspect-[4/5] overflow-hidden bg-[var(--color-stone)] border border-[var(--color-stone)]">
                          <img loading="lazy" src={src} alt="" className="w-full h-full object-cover" />
                          {i === 0 && <span className="absolute top-1 left-1 bg-[var(--color-champagne-dark)] text-white text-[0.5rem] tracking-[0.1em] uppercase px-1.5 py-0.5">Primary</span>}
                          <div className="absolute inset-x-0 bottom-0 flex bg-[var(--color-black)]/70">
                            <button onClick={() => setEdit({ ...edit, images: [src, ...edit.images.filter((_, x) => x !== i)] })} className="flex-1 py-1 text-[var(--color-champagne-light)] text-[0.56rem] tracking-[0.06em] uppercase">Primary</button>
                            <button onClick={() => setEdit({ ...edit, images: edit.images.filter((_, x) => x !== i) })} className="px-2 py-1 text-[#E2A0A0] border-l border-white/20">✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <input value={edit._newImg} onChange={(e) => setEdit({ ...edit, _newImg: e.target.value })} placeholder="Paste image URL…" className={`${field} flex-1`} />
                      <button onClick={() => { if (edit._newImg) { setEdit({ ...edit, images: [...edit.images, edit._newImg], _newImg: '' }) } }} className="px-5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.62rem] tracking-[0.12em] uppercase hover:bg-[var(--color-champagne-dark)]">Add URL</button>
                    </div>
                  </div>

                  <div className={`${card} p-5`}>
                    <p className={`${sectionLabel} mb-3.5`}>Pricing &amp; inventory</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div><label className={lbl}>Price ($)</label><input type="number" value={edit.price} onChange={(e) => setEdit({ ...edit, price: e.target.value })} className={field} /></div>
                      <div><label className={lbl}>Compare-at ($)</label><input type="number" value={edit.compare} onChange={(e) => setEdit({ ...edit, compare: e.target.value })} placeholder="optional" className={field} /></div>
                      <div><label className={lbl}>Stock</label><input type="number" value={edit.stock} onChange={(e) => setEdit({ ...edit, stock: e.target.value })} className={field} /></div>
                    </div>
                  </div>

                  <div className={`${card} p-5`}>
                    <p className={`${sectionLabel} mb-3.5`}>Specifications</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={lbl}>Materials (shown on page)</label><input value={edit.material} onChange={(e) => setEdit({ ...edit, material: e.target.value })} placeholder="e.g. Italian bouclé, oak" className={field} /></div>
                      <div><label className={lbl}>Finish name</label><input value={edit.color} onChange={(e) => setEdit({ ...edit, color: e.target.value })} placeholder="e.g. Alabaster" className={field} /></div>
                      <div><label className={lbl}>Dimensions</label><input value={edit.dimensions} onChange={(e) => setEdit({ ...edit, dimensions: e.target.value })} placeholder={'94" W × 38" D × 29" H'} className={field} /></div>
                      <div><label className={lbl}>Lead time</label><input value={edit.leadTime} onChange={(e) => setEdit({ ...edit, leadTime: e.target.value })} className={field} /></div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className={`${card} p-5`}>
                    <p className={`${sectionLabel} mb-3.5`}>Organisation</p>
                    <label className={lbl}>Category</label>
                    <select value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })} className={field}>
                      {['Living Room', 'Dining Room', 'Bedroom', 'Accents', 'Seating', 'Storage'].map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <label className={`${lbl} mt-4`}>Badge</label>
                    <input value={edit.badge} onChange={(e) => setEdit({ ...edit, badge: e.target.value })} placeholder="New / Featured / Limited" className={field} />
                    <label className={`${lbl} mt-4`}>Status</label>
                    <select value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })} className={field}><option value="published">Published</option><option value="draft">Draft</option></select>
                    <p className="text-[0.68rem] text-[var(--color-warm-gray)] mt-2.5 leading-snug">Published items appear on the storefront immediately.</p>
                  </div>
                  <div className={`${card} p-5`}>
                    <p className={`${sectionLabel} mb-3.5`}>Storefront preview</p>
                    <div className="aspect-[4/5] overflow-hidden bg-[var(--color-stone)]">{edit.images[0] && <img loading="lazy" src={edit.images[0]} alt="" className="w-full h-full object-cover" />}</div>
                    <h3 className="font-serif text-xl mt-2.5">{edit.name || 'Product name'}</h3>
                    <p className="text-[0.8rem] text-[var(--color-mid-gray)] mt-0.5">{edit.category}</p>
                  </div>
                  {edit.id && (
                    <button onClick={() => deleteProduct(edit.id)} className="py-3.5 border border-[#E2C4C4] text-[var(--color-error)] text-[0.64rem] tracking-[0.14em] uppercase bg-[#F9EFEF] hover:bg-[var(--color-error-light)]">Delete product</button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {section === 'orders' && !openOrder && (
            <div>
              <h1 className="text-3xl">Orders</h1>
              <p className="text-[var(--color-mid-gray)] font-light mt-0.5">{ordersState.length} orders</p>
              <div className="flex gap-2 mt-5 flex-wrap">
                {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((f, i) => (
                  <span key={f} className={`text-[0.62rem] tracking-[0.12em] uppercase px-3.5 py-1.5 ${i === 0 ? 'bg-[var(--color-black)] text-[var(--color-ivory)]' : 'border border-[var(--color-stone)] text-[var(--color-mid-gray)]'}`}>{f}</span>
                ))}
              </div>
              <div className={`${card} mt-5 overflow-x-auto`}>
                <div className="grid grid-cols-[1.2fr_1.4fr_1fr_1fr_1fr] gap-4 px-5 py-3.5 border-b border-[var(--color-stone)] min-w-[680px]"><Th>Order</Th><Th>Customer</Th><Th>Date</Th><Th>Status</Th><Th className="text-right">Total</Th></div>
                {ordersState.map((o) => (
                  <button key={o.number} onClick={() => { setOpenOrderNum(o.number); setSection('order-admin') }} className="grid grid-cols-[1.2fr_1.4fr_1fr_1fr_1fr] gap-4 px-5 py-3.5 border-b border-[var(--color-stone)] items-center text-left w-full min-w-[680px] hover:bg-[var(--color-ivory)]">
                    <span className="text-[0.84rem] font-medium">{o.number}</span>
                    <div><p className="text-[0.82rem]">{o.customer}</p><p className="text-[0.68rem] text-[var(--color-warm-gray)]">{o.location}</p></div>
                    <span className="text-[0.8rem] text-[var(--color-mid-gray)]">{o.date}</span>
                    <StatusPill status={o.status} />
                    <span className="text-[0.86rem] text-right">{formatCents(o.total)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ORDER ADMIN DETAIL */}
          {section === 'order-admin' && openOrder && (
            <div className="max-w-[980px]">
              <div className="text-[0.64rem] tracking-[0.14em] uppercase text-[var(--color-warm-gray)] mb-4"><button onClick={() => go('orders')} className="hover:text-[var(--color-charcoal)]">Orders</button> / {openOrder.number}</div>
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div><h1 className="text-2xl">{openOrder.number}</h1><p className="text-[var(--color-mid-gray)] text-[0.84rem] mt-1">{openOrder.date} · {openOrder.customer} · {openOrder.method}</p></div>
                <div className="flex gap-2.5 items-center flex-wrap">
                  <select value={openOrder.status} onChange={(e) => setOrdersState((prev) => prev.map((o) => o.number === openOrder.number ? { ...o, status: e.target.value } : o))} className="py-2.5 px-3.5 bg-[var(--color-white)] border border-[var(--color-stone)] outline-none text-[0.72rem] tracking-[0.08em] uppercase">
                    {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => { setOrdersState((prev) => prev.map((o) => o.number === openOrder.number ? { ...o, status: 'shipped' } : o)); toast.success('Order marked as fulfilled') }} className="py-2.5 px-5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.62rem] tracking-[0.12em] uppercase hover:bg-[var(--color-champagne-dark)]">Fulfill</button>
                  <button onClick={() => { setOrdersState((prev) => prev.map((o) => o.number === openOrder.number ? { ...o, status: 'refunded' } : o)); toast.show('Order refunded') }} className="py-2.5 px-5 border border-[#E2C4C4] text-[var(--color-error)] bg-[#F9EFEF] text-[0.62rem] tracking-[0.12em] uppercase">Refund</button>
                </div>
              </div>
              <div className={`${card} px-5 py-4 mt-5 flex gap-6 flex-wrap`}>
                {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((s) => {
                  const order = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
                  const reached = order.indexOf(openOrder.status) >= order.indexOf(s)
                  return <div key={s} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: reached ? 'var(--color-champagne-dark)' : 'var(--color-stone)' }} /><span className="text-[0.7rem] tracking-[0.08em] uppercase text-[var(--color-mid-gray)]">{s}</span></div>
                })}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-3.5 mt-3.5">
                <div className="flex flex-col gap-3.5">
                  <div className={`${card} p-5`}>
                    <p className={`${sectionLabel} mb-3.5`}>Items</p>
                    {openOrder.items.map((it, i) => (
                      <div key={i} className="grid grid-cols-[48px_1fr_auto] gap-3.5 items-center py-2.5 border-b border-[var(--color-stone)]"><img loading="lazy" src={it.image} alt="" className="w-12 h-14 object-cover bg-[var(--color-stone)]" /><div><p className="text-[0.86rem]">{it.name}</p><p className="text-[0.72rem] text-[var(--color-warm-gray)]">Qty {it.qty} · {formatCents(it.price)}</p></div><span className="text-[0.86rem]">{formatCents(it.price * it.qty)}</span></div>
                    ))}
                    <div className="flex justify-between pt-3.5 text-[0.95rem] font-medium"><span>Total</span><span>{formatCents(openOrder.total)}</span></div>
                  </div>
                  <div className={`${card} p-5`}>
                    <p className={`${sectionLabel} mb-2.5`}>Tracking number</p>
                    <input defaultValue={openOrder.tracking} onChange={(e) => setOrdersState((prev) => prev.map((o) => o.number === openOrder.number ? { ...o, tracking: e.target.value } : o))} placeholder="Add tracking…" className={field} />
                    <p className={`${sectionLabel} mt-4 mb-2.5`}>Internal notes</p>
                    <textarea defaultValue={openOrder.notes} onChange={(e) => setOrdersState((prev) => prev.map((o) => o.number === openOrder.number ? { ...o, notes: e.target.value } : o))} placeholder="Add a private note for the team…" className={`${field} min-h-[80px] resize-y`} />
                  </div>
                </div>
                <div className="flex flex-col gap-3.5">
                  <div className={`${card} p-5`}><p className={`${sectionLabel} mb-2.5`}>Customer</p><p className="text-[0.9rem] font-medium">{openOrder.customer}</p><p className="text-[0.8rem] text-[var(--color-mid-gray)]">{openOrder.email}</p></div>
                  <div className={`${card} p-5`}><p className={`${sectionLabel} mb-2.5`}>Ship to</p><p className="text-[0.86rem] leading-relaxed">{openOrder.customer}<br />{openOrder.location}</p></div>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMERS */}
          {section === 'customers' && !openCustomer && (
            <div>
              <h1 className="text-3xl">Customers</h1>
              <p className="text-[var(--color-mid-gray)] font-light mt-0.5">{demoCustomers.length} customers</p>
              <div className={`${card} mt-5 overflow-x-auto`}>
                <div className="grid grid-cols-[2fr_1fr_.8fr_1fr_.8fr] gap-4 px-5 py-3.5 border-b border-[var(--color-stone)] min-w-[680px]"><Th>Customer</Th><Th>Location</Th><Th>Orders</Th><Th>Lifetime</Th><Th>Type</Th></div>
                {demoCustomers.map((c) => (
                  <button key={c.email} onClick={() => { setOpenCustomerEmail(c.email); setSection('customer-detail') }} className="grid grid-cols-[2fr_1fr_.8fr_1fr_.8fr] gap-4 px-5 py-3.5 border-b border-[var(--color-stone)] items-center min-w-[680px] text-left w-full hover:bg-[var(--color-ivory)]">
                    <div className="flex items-center gap-3"><div className="w-[34px] h-[34px] rounded-full bg-[var(--color-champagne-pale)] text-[var(--color-champagne-dark)] flex items-center justify-center text-[0.66rem] font-semibold">{initials(c.name)}</div><div><p className="text-[0.84rem] font-medium">{c.name}</p><p className="text-[0.68rem] text-[var(--color-warm-gray)]">{c.email}</p></div></div>
                    <span className="text-[0.8rem] text-[var(--color-mid-gray)]">{c.location}</span>
                    <span className="text-[0.84rem]">{c.orders}</span>
                    <span className="text-[0.84rem]">{formatCents(c.spent)}</span>
                    {c.trade ? <span className="text-[0.56rem] tracking-[0.12em] uppercase text-[var(--color-champagne-dark)] bg-[var(--color-champagne-pale)] px-2 py-1 justify-self-start">Trade</span> : <span className="text-[0.7rem] text-[var(--color-warm-gray)]">Retail</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CUSTOMER DETAIL */}
          {section === 'customer-detail' && openCustomer && (
            <div className="max-w-[980px]">
              <div className="text-[0.64rem] tracking-[0.14em] uppercase text-[var(--color-warm-gray)] mb-4"><button onClick={() => go('customers')} className="hover:text-[var(--color-charcoal)]">Customers</button> / {openCustomer.name}</div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="w-[54px] h-[54px] rounded-full bg-[var(--color-champagne-pale)] text-[var(--color-champagne-dark)] flex items-center justify-center text-base font-semibold">{initials(openCustomer.name)}</div>
                <div className="flex-1"><h1 className="text-2xl">{openCustomer.name}</h1><p className="text-[var(--color-mid-gray)] text-[0.84rem]">{openCustomer.email} · {openCustomer.location}</p></div>
                {openCustomer.trade && <span className="text-[0.58rem] tracking-[0.12em] uppercase text-[var(--color-champagne-dark)] bg-[var(--color-champagne-pale)] px-3 py-2">Trade account</span>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                {[['Orders', openCustomer.orders], ['Lifetime spend', formatCents(openCustomer.spent)], ['Customer since', openCustomer.since]].map(([t, v]) => (
                  <div key={t} className={`${card} p-5`}><p className={sectionLabel}>{t}</p><p className="font-serif text-3xl mt-1">{v}</p></div>
                ))}
              </div>
              <h2 className="text-xl mt-7 mb-3.5">Order history</h2>
              <div className={card}>
                {ordersState.filter((o) => o.email === openCustomer.email).map((o) => (
                  <button key={o.number} onClick={() => { setOpenOrderNum(o.number); setSection('order-admin') }} className="w-full grid grid-cols-[1fr_1fr_auto_auto] gap-4 items-center text-left px-5 py-3.5 border-b border-[var(--color-stone)] hover:bg-[var(--color-ivory)]"><span className="text-[0.84rem] font-medium">{o.number}</span><span className="text-[0.8rem] text-[var(--color-mid-gray)]">{o.date}</span><StatusPill status={o.status} /><span className="text-[0.86rem]">{formatCents(o.total)}</span></button>
                ))}
                {ordersState.filter((o) => o.email === openCustomer.email).length === 0 && <p className="px-5 py-6 text-[0.84rem] text-[var(--color-mid-gray)]">No orders yet.</p>}
              </div>
            </div>
          )}

          {/* INVENTORY */}
          {section === 'inventory' && (
            <div>
              <h1 className="text-3xl">Inventory</h1>
              <p className="text-[var(--color-mid-gray)] font-light mt-0.5">{invUnits} units on hand · {formatCents(invValue)} retail value</p>
              <div className={`${card} mt-5 overflow-x-auto`}>
                <div className="grid grid-cols-[2.2fr_1fr_1.2fr_1fr] gap-4 px-5 py-3.5 border-b border-[var(--color-stone)] min-w-[640px]"><Th>Product</Th><Th>SKU</Th><Th>On hand</Th><Th className="text-right">Value</Th></div>
                {products.map((p) => (
                  <div key={p.id} className="grid grid-cols-[2.2fr_1fr_1.2fr_1fr] gap-4 px-5 py-3 border-b border-[var(--color-stone)] items-center min-w-[640px] hover:bg-[var(--color-ivory)]">
                    <div className="flex items-center gap-3"><img loading="lazy" src={p.image} alt="" className="w-[38px] h-11 object-cover bg-[var(--color-stone)]" /><span className="text-[0.84rem] font-medium">{p.name}</span></div>
                    <span className="text-[0.76rem] text-[var(--color-warm-gray)]">{p.sku}</span>
                    <div className="flex items-center gap-2.5"><button onClick={() => adjustStock(p.id, -1)} className="w-[26px] h-[26px] border border-[var(--color-stone)] text-[var(--color-mid-gray)] hover:border-[var(--color-charcoal)]">−</button><span className="min-w-[28px] text-center text-[0.86rem]" style={{ color: p.stock <= 5 ? 'var(--color-error)' : 'inherit' }}>{p.stock}</span><button onClick={() => adjustStock(p.id, 1)} className="w-[26px] h-[26px] border border-[var(--color-stone)] text-[var(--color-mid-gray)] hover:border-[var(--color-charcoal)]">+</button></div>
                    <span className="text-[0.84rem] text-right">{formatCents(p.stock * p.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COLLECTIONS */}
          {section === 'collections' && (
            <div>
              <div className="flex justify-between items-center flex-wrap gap-4"><h1 className="text-3xl">Collections</h1><button onClick={() => setCollectionModal({ id: null, name: '', slug: '', desc: '', image: '' })} className="px-7 py-3.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.18em] uppercase hover:bg-[var(--color-champagne-dark)]">+ New collection</button></div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 mt-5">
                {collections.map((c) => (
                  <div key={c.id} className={card}><div className="aspect-[3/2] overflow-hidden bg-[var(--color-stone)]">{c.image && <img loading="lazy" src={c.image} alt="" className="w-full h-full object-cover" />}</div><div className="p-4"><p className="font-serif text-xl">{c.name}</p><p className="text-[0.74rem] text-[var(--color-warm-gray)] mt-0.5">{c.count} products</p><div className="flex gap-4 mt-3"><button onClick={() => setCollectionModal(c)} className="text-[0.62rem] tracking-[0.1em] uppercase text-[var(--color-champagne-dark)]">Edit</button><button onClick={async () => { if (await askConfirm({ title: 'Delete collection?', cta: 'Delete' })) { setCollections((p) => p.filter((x) => x.id !== c.id)); toast.show('Collection deleted') } }} className="text-[0.62rem] tracking-[0.1em] uppercase text-[var(--color-warm-gray)] hover:text-[var(--color-error)]">Delete</button></div></div></div>
                ))}
              </div>
            </div>
          )}

          {/* CATEGORIES */}
          {section === 'categories' && (
            <div>
              <div className="flex justify-between items-center flex-wrap gap-4"><h1 className="text-3xl">Categories</h1><button onClick={() => toast.success('Category created')} className="px-7 py-3.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.18em] uppercase hover:bg-[var(--color-champagne-dark)]">+ New category</button></div>
              <div className={`${card} mt-5`}>
                {categories.map((c) => (
                  <div key={c.cat} className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[var(--color-stone)] hover:bg-[var(--color-ivory)]"><div><p className="text-[0.92rem] font-medium">{c.label}</p><p className="text-[0.72rem] text-[var(--color-warm-gray)]">/shop/{c.cat} · {c.count} products</p></div><div className="flex gap-4"><button onClick={() => toast.show('Edit category')} className="text-[0.62rem] tracking-[0.1em] uppercase text-[var(--color-champagne-dark)]">Edit</button><button onClick={() => toast.show('Delete category')} className="text-[0.62rem] tracking-[0.1em] uppercase text-[var(--color-warm-gray)] hover:text-[var(--color-error)]">Delete</button></div></div>
                ))}
              </div>
            </div>
          )}

          {/* DISCOUNTS */}
          {section === 'discounts' && (
            <div>
              <div className="flex justify-between items-center flex-wrap gap-4"><h1 className="text-3xl">Discounts</h1><button onClick={() => setDiscountModal({ id: null, code: '', type: 'Percentage', value: '', min: '', max: '', expires: '', status: 'active', used: 0 })} className="px-7 py-3.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.18em] uppercase hover:bg-[var(--color-champagne-dark)]">+ New code</button></div>
              <div className={`${card} mt-5 overflow-x-auto`}>
                <div className="grid grid-cols-[1.1fr_.9fr_.6fr_.9fr_1fr_.7fr_1fr] gap-4 px-5 py-3.5 border-b border-[var(--color-stone)] min-w-[800px]"><Th>Code</Th><Th>Type</Th><Th>Value</Th><Th>Used</Th><Th>Expires</Th><Th>Status</Th><Th className="text-right">Actions</Th></div>
                {discounts.map((d) => {
                  const m = discountStatusMeta(d.status)
                  return (
                    <div key={d.id} className="grid grid-cols-[1.1fr_.9fr_.6fr_.9fr_1fr_.7fr_1fr] gap-4 px-5 py-3.5 border-b border-[var(--color-stone)] items-center min-w-[800px] hover:bg-[var(--color-ivory)]">
                      <span className="text-[0.84rem] font-medium tracking-[0.04em]">{d.code}</span><span className="text-[0.8rem] text-[var(--color-mid-gray)]">{d.type}</span><span className="text-[0.84rem]">{d.value}</span><span className="text-[0.8rem] text-[var(--color-mid-gray)]">{d.used} / {d.max}</span><span className="text-[0.8rem] text-[var(--color-mid-gray)]">{d.expires}</span>
                      <span className="text-[0.56rem] tracking-[0.12em] uppercase px-2 py-1 justify-self-start" style={{ color: m.color, background: m.bg }}>{m.label}</span>
                      <div className="flex gap-3 justify-end"><button onClick={() => setDiscountModal(d)} className="text-[0.6rem] tracking-[0.1em] uppercase text-[var(--color-champagne-dark)]">Edit</button><button onClick={() => setDiscounts((p) => p.map((x) => x.id === d.id ? { ...x, status: x.status === 'active' ? 'paused' : 'active' } : x))} className="text-[0.6rem] tracking-[0.1em] uppercase text-[var(--color-mid-gray)] hover:text-[var(--color-black)]">Toggle</button><button onClick={async () => { if (await askConfirm({ title: 'Delete discount?', cta: 'Delete' })) { setDiscounts((p) => p.filter((x) => x.id !== d.id)); toast.show('Discount deleted') } }} className="text-[0.6rem] tracking-[0.1em] uppercase text-[var(--color-warm-gray)] hover:text-[var(--color-error)]">Delete</button></div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* REVIEWS */}
          {section === 'reviews' && (
            <div>
              <h1 className="text-3xl">Reviews</h1>
              <p className="text-[var(--color-mid-gray)] font-light mt-0.5">{reviews.filter((r) => r.status === 'pending').length} awaiting moderation</p>
              <div className="flex flex-col gap-4 mt-5">
                {reviews.map((raw) => {
                  const r = decorateReview(raw)
                  return (
                    <div key={r.id} className={`${card} p-5`}>
                      <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div><p className="text-[var(--color-champagne)] text-[0.9rem] tracking-[0.1em]">{r.stars}</p><h3 className="font-serif text-xl mt-1">{r.title}</h3><p className="text-[0.74rem] text-[var(--color-warm-gray)] mt-0.5">{r.author} on {r.product} · {r.date}</p></div>
                        {r.isPending && <span className="text-[0.56rem] tracking-[0.12em] uppercase text-[#8a6d3b] bg-[#F5EDD9] px-2.5 py-1.5">Pending</span>}
                        {r.isApproved && <span className="text-[0.56rem] tracking-[0.12em] uppercase text-[var(--color-success)] bg-[var(--color-success-light)] px-2.5 py-1.5">Approved</span>}
                        {r.isRejected && <span className="text-[0.56rem] tracking-[0.12em] uppercase text-[var(--color-error)] bg-[var(--color-error-light)] px-2.5 py-1.5">Rejected</span>}
                      </div>
                      <p className="text-[var(--color-mid-gray)] text-sm mt-3 leading-relaxed">{r.body}</p>
                      <div className="flex gap-2.5 mt-4"><button onClick={() => { setReviews((p) => p.map((x) => x.id === r.id ? { ...x, status: 'approved' } : x)); toast.success('Review approved') }} className="px-5 py-2.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.62rem] tracking-[0.12em] uppercase hover:bg-[var(--color-champagne-dark)]">Approve</button><button onClick={() => { setReviews((p) => p.map((x) => x.id === r.id ? { ...x, status: 'rejected' } : x)); toast.show('Review rejected') }} className="px-5 py-2.5 border border-[var(--color-stone)] text-[0.62rem] tracking-[0.12em] uppercase text-[var(--color-mid-gray)] hover:border-[var(--color-error)] hover:text-[var(--color-error)]">Reject</button></div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* MARKETING */}
          {section === 'marketing' && (
            <div>
              <h1 className="text-3xl">Marketing</h1>
              <p className="text-[var(--color-mid-gray)] font-light mt-0.5">{subs.length} subscribers · {trade.filter((t) => t.status === 'pending').length} trade applications pending</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mt-5 items-start">
                <div className={card}>
                  <p className={`${sectionLabel} px-5 pt-4.5 pb-2.5`} style={{ paddingTop: '1.1rem' }}>Email subscribers</p>
                  {subs.map((x) => (
                    <div key={x.email} className="flex items-center justify-between gap-4 px-5 py-3 border-t border-[var(--color-stone)]"><div><p className="text-[0.82rem]">{x.email}</p><p className="text-[0.68rem] text-[var(--color-warm-gray)]">{x.source} · {x.date}</p></div><button onClick={() => { setSubs((p) => p.filter((s) => s.email !== x.email)); toast.show('Subscriber removed') }} className="text-[0.6rem] tracking-[0.1em] uppercase text-[var(--color-warm-gray)] hover:text-[var(--color-error)]">Remove</button></div>
                  ))}
                </div>
                <div className={card}>
                  <p className={`${sectionLabel} px-5 pb-2.5`} style={{ paddingTop: '1.1rem' }}>Trade applications</p>
                  {trade.map((t) => {
                    const m = tradeStatusMeta(t.status)
                    return (
                      <div key={t.id} className="px-5 py-3.5 border-t border-[var(--color-stone)]">
                        <div className="flex items-start justify-between gap-4"><div><p className="text-[0.88rem] font-medium">{t.business}</p><p className="text-[0.72rem] text-[var(--color-warm-gray)]">{t.contact} · {t.type} · {t.email}</p></div><span className="text-[0.54rem] tracking-[0.12em] uppercase px-2 py-1" style={{ color: m.color, background: m.bg }}>{m.label}</span></div>
                        {t.status === 'pending' && <div className="flex gap-2 mt-2.5"><button onClick={() => { setTrade((p) => p.map((x) => x.id === t.id ? { ...x, status: 'approved' } : x)); toast.success('Application approved') }} className="px-4 py-2 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.58rem] tracking-[0.1em] uppercase hover:bg-[var(--color-champagne-dark)]">Approve</button><button onClick={() => { setTrade((p) => p.map((x) => x.id === t.id ? { ...x, status: 'rejected' } : x)); toast.show('Application rejected') }} className="px-4 py-2 border border-[var(--color-stone)] text-[0.58rem] tracking-[0.1em] uppercase text-[var(--color-mid-gray)] hover:text-[var(--color-error)]">Reject</button></div>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* CONTENT */}
          {section === 'content' && (
            <div>
              <h1 className="text-3xl">Content</h1>
              <p className="text-[var(--color-mid-gray)] font-light mt-0.5">Pages and journal posts</p>
              <h2 className="text-xl mt-6 mb-3">Pages</h2>
              <div className={card}>
                {pages.map((pg) => (
                  <div key={pg.slug} className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[var(--color-stone)] hover:bg-[var(--color-ivory)]"><div><p className="text-[0.88rem] font-medium">{pg.title}</p><p className="text-[0.7rem] text-[var(--color-warm-gray)]">/{pg.slug} · updated {pg.updated}</p></div><div className="flex items-center gap-4"><span className="text-[0.56rem] tracking-[0.1em] uppercase text-[var(--color-mid-gray)]">{pg.statusLabel}</span><button onClick={() => toast.show('Edit page')} className="text-[0.6rem] tracking-[0.1em] uppercase text-[var(--color-champagne-dark)]">Edit</button></div></div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-7 mb-3"><h2 className="text-xl">Journal</h2><button onClick={() => setBlogModal({ id: null, title: '', author: 'Eleanor Whitfield', status: 'draft', image: '' })} className="px-5 py-2.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.62rem] tracking-[0.14em] uppercase hover:bg-[var(--color-champagne-dark)]">+ New post</button></div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
                {blog.map((b) => (
                  <div key={b.id} className={card}><div className="aspect-[16/10] overflow-hidden bg-[var(--color-stone)]">{b.image && <img loading="lazy" src={b.image} alt="" className="w-full h-full object-cover" />}</div><div className="p-4"><span className="text-[0.54rem] tracking-[0.12em] uppercase text-[var(--color-warm-gray)]">{b.statusLabel} · {b.date}</span><p className="font-serif text-lg mt-1 leading-tight">{b.title}</p><p className="text-[0.72rem] text-[var(--color-warm-gray)] mt-1">{b.author}</p><div className="flex gap-4 mt-2.5"><button onClick={() => setBlogModal(b)} className="text-[0.6rem] tracking-[0.1em] uppercase text-[var(--color-champagne-dark)]">Edit</button><button onClick={async () => { if (await askConfirm({ title: 'Delete post?', cta: 'Delete' })) { setBlog((p) => p.filter((x) => x.id !== b.id)); toast.show('Post deleted') } }} className="text-[0.6rem] tracking-[0.1em] uppercase text-[var(--color-warm-gray)] hover:text-[var(--color-error)]">Delete</button></div></div></div>
                ))}
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {section === 'analytics' && (
            <div>
              <h1 className="text-3xl">Analytics</h1>
              <p className="text-[var(--color-mid-gray)] font-light mt-0.5">Performance over the last 30 days</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
                {[['Revenue', adminStats.revenue, '▲ 12.4%'], ['Conversion', '3.1%', '▲ 0.4 pts'], ['Avg. order', adminStats.aov, ''], ['Sessions', '18.4k', '▲ 8.0%']].map(([t, v, d]) => (
                  <div key={t} className={`${card} p-5`}><p className={sectionLabel}>{t}</p><p className="font-serif text-[1.9rem] mt-1">{v}</p>{d && <p className="text-[0.72rem] text-[var(--color-success)] mt-0.5">{d}</p>}</div>
                ))}
              </div>
              <div className={`${card} p-5 mt-3`}>
                <div className="flex justify-between items-center"><h3 className="text-xl">Revenue trend</h3><span className="text-[0.62rem] tracking-[0.14em] uppercase text-[var(--color-warm-gray)]">Last 14 days</span></div>
                <div className="flex items-end gap-[5px] h-[150px] mt-5">{revenueChart.map((h, i) => <div key={i} className="flex-1 bg-[var(--color-champagne-pale)] rounded-[1px] hover:bg-[var(--color-champagne)]" style={{ height: `${h}%` }} />)}</div>
              </div>
              <div className={`${card} p-5 mt-3`}>
                <h3 className="text-xl mb-4">Best sellers</h3>
                {products.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center gap-3.5 py-2 border-t border-[var(--color-stone)]"><img loading="lazy" src={p.image} alt="" className="w-[38px] h-11 object-cover bg-[var(--color-stone)]" /><span className="flex-1 text-[0.84rem]">{p.name}</span><span className="text-[0.84rem] text-[var(--color-mid-gray)]">{formatCents(p.price)}</span></div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {section === 'settings' && (
            <div className="max-w-[820px]">
              <h1 className="text-3xl">Settings</h1>
              <div className="flex gap-1 flex-wrap border-b border-[var(--color-stone)] my-5">
                {[['general', 'General'], ['shipping', 'Shipping'], ['taxes', 'Taxes'], ['payments', 'Payments'], ['notif', 'Notifications'], ['staff', 'Staff']].map(([t, label]) => (
                  <button key={t} onClick={() => setSettingsTab(t)} className={`px-3.5 py-2.5 text-[0.64rem] tracking-[0.12em] uppercase ${settingsTab === t ? 'text-[var(--color-black)] border-b-2 border-[var(--color-champagne)]' : 'text-[var(--color-mid-gray)] hover:text-[var(--color-black)]'}`}>{label}</button>
                ))}
              </div>

              {settingsTab === 'general' && (
                <>
                  <div className={`${card} p-5`}>
                    <p className={`${sectionLabel} mb-4`}>Store details</p>
                    <label className={lbl}>Store name</label><input defaultValue="Firman Furniture" className={field} />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div><label className={lbl}>Support email</label><input defaultValue="hello@firman.com" className={field} /></div>
                      <div><label className={lbl}>Phone</label><input defaultValue="+1 (212) 555-0142" className={field} /></div>
                      <div><label className={lbl}>Currency</label><select className={field}><option>USD $</option><option>EUR €</option><option>GBP £</option></select></div>
                      <div><label className={lbl}>Free shipping over</label><input defaultValue="$2,500" className={field} /></div>
                    </div>
                  </div>
                  <button onClick={() => toast.success('Settings saved')} className="mt-5 px-8 py-3.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.18em] uppercase hover:bg-[var(--color-champagne-dark)]">Save settings</button>
                </>
              )}

              {settingsTab === 'shipping' && (
                <>
                  <div className={`${card} overflow-x-auto`}>
                    <div className="grid grid-cols-[1.4fr_1.2fr_1fr_1fr] gap-4 px-5 py-3.5 border-b border-[var(--color-stone)] min-w-[620px]"><Th>Zone</Th><Th>Method</Th><Th>Rate</Th><Th>Delivery</Th></div>
                    {shippingRates.map((r, i) => <div key={i} className="grid grid-cols-[1.4fr_1.2fr_1fr_1fr] gap-4 px-5 py-3.5 border-b border-[var(--color-stone)] items-center min-w-[620px] text-[0.82rem]"><span className="text-[var(--color-mid-gray)]">{r.zone}</span><span className="font-medium">{r.name}</span><span>{r.price}</span><span className="text-[var(--color-mid-gray)]">{r.eta}</span></div>)}
                  </div>
                  <button onClick={() => toast.show('Add shipping rate')} className="mt-5 px-7 py-3 border border-[var(--color-charcoal)] text-[0.64rem] tracking-[0.14em] uppercase">+ Add shipping rate</button>
                </>
              )}

              {settingsTab === 'taxes' && (
                <>
                  <div className={`${card} overflow-x-auto`}>
                    <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 px-5 py-3.5 border-b border-[var(--color-stone)] min-w-[480px]"><Th>Region</Th><Th>Rate</Th><Th>Type</Th></div>
                    {taxRates.map((t, i) => <div key={i} className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 px-5 py-3.5 border-b border-[var(--color-stone)] items-center min-w-[480px] text-[0.82rem]"><span className="font-medium">{t.region}</span><span>{t.rate}</span><span className="text-[var(--color-mid-gray)]">{t.type}</span></div>)}
                  </div>
                  <button onClick={() => toast.show('Add tax rate')} className="mt-5 px-7 py-3 border border-[var(--color-charcoal)] text-[0.64rem] tracking-[0.14em] uppercase">+ Add tax rate</button>
                </>
              )}

              {settingsTab === 'payments' && (
                <div className="flex flex-col gap-3">
                  {[['Stripe', 'Cards, Apple Pay & Google Pay', true], ['PayPal', 'Express checkout', false], ['Affirm', 'Buy now, pay later', false]].map(([name, desc, connected]) => (
                    <div key={name} className={`${card} p-5 flex items-center justify-between gap-4 flex-wrap`}><div><p className="text-lg font-medium">{name}</p><p className="text-[0.78rem] text-[var(--color-mid-gray)] mt-0.5">{desc}</p></div>{connected ? <span className="text-[0.58rem] tracking-[0.12em] uppercase text-[var(--color-success)] bg-[var(--color-success-light)] px-3 py-2">Connected</span> : <button onClick={() => toast.success(`${name} connected`)} className="text-[0.6rem] tracking-[0.12em] uppercase text-[var(--color-champagne-dark)] border border-[var(--color-champagne)] px-4 py-2">Connect</button>}</div>
                  ))}
                </div>
              )}

              {settingsTab === 'notif' && (
                <>
                  <div className={`${card} p-5`}>
                    <p className={`${sectionLabel} mb-4`}>Customer emails (Brevo)</p>
                    {['Order confirmation', 'Shipping & delivery updates', 'Abandoned cart reminders', 'Review request (7 days after delivery)', 'Back-in-stock alerts'].map((label, i) => (
                      <label key={label} className="flex items-center gap-3 py-2 text-[0.88rem] text-[var(--color-charcoal)]"><input type="checkbox" defaultChecked={i !== 3} className="accent-[var(--color-champagne-dark)] w-4 h-4" />{label}</label>
                    ))}
                  </div>
                  <button onClick={() => toast.success('Notifications saved')} className="mt-5 px-8 py-3.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.18em] uppercase hover:bg-[var(--color-champagne-dark)]">Save notifications</button>
                </>
              )}

              {settingsTab === 'staff' && (
                <>
                  <div className={card}>
                    {staff.map((m) => (
                      <div key={m.email} className="flex items-center gap-4 px-5 py-4 border-b border-[var(--color-stone)]"><div className="w-9 h-9 rounded-full bg-[var(--color-champagne-pale)] text-[var(--color-champagne-dark)] flex items-center justify-center text-[0.7rem] font-semibold">{initials(m.name)}</div><div className="flex-1"><p className="text-[0.88rem] font-medium">{m.name}</p><p className="text-[0.72rem] text-[var(--color-warm-gray)]">{m.email} · {m.access}</p></div><span className="text-[0.58rem] tracking-[0.12em] uppercase text-[var(--color-champagne-dark)] bg-[var(--color-champagne-pale)] px-3 py-2">{m.role}</span></div>
                    ))}
                  </div>
                  <button onClick={() => toast.show('Invite staff')} className="mt-5 px-7 py-3 border border-[var(--color-charcoal)] text-[0.64rem] tracking-[0.14em] uppercase">+ Invite staff</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Editor modals ───────────────────────────────────────────── */}
      {discountModal && (
        <EditorModal title={discountModal.id ? 'Edit discount' : 'New discount'} onCancel={() => setDiscountModal(null)} onSave={() => {
          if (!discountModal.code) { toast.error('Code is required'); return }
          setDiscounts((p) => discountModal.id ? p.map((x) => x.id === discountModal.id ? discountModal : x) : [...p, { ...discountModal, id: `d${Date.now()}` }])
          setDiscountModal(null); toast.success('Discount saved')
        }} saveLabel="Save discount">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className={lbl}>Code</label><input value={discountModal.code} onChange={(e) => setDiscountModal({ ...discountModal, code: e.target.value.toUpperCase() })} placeholder="SPRING10" className={`${field} bg-[var(--color-white)] uppercase tracking-[0.04em]`} /></div>
            <div><label className={lbl}>Type</label><select value={discountModal.type} onChange={(e) => setDiscountModal({ ...discountModal, type: e.target.value })} className={`${field} bg-[var(--color-white)]`}><option>Percentage</option><option>Fixed amount</option><option>Free Shipping</option></select></div>
            <div><label className={lbl}>Value</label><input value={discountModal.value} onChange={(e) => setDiscountModal({ ...discountModal, value: e.target.value })} placeholder="10%" className={`${field} bg-[var(--color-white)]`} /></div>
            <div><label className={lbl}>Minimum order</label><input value={discountModal.min} onChange={(e) => setDiscountModal({ ...discountModal, min: e.target.value })} placeholder="None" className={`${field} bg-[var(--color-white)]`} /></div>
            <div><label className={lbl}>Usage limit</label><input value={discountModal.max} onChange={(e) => setDiscountModal({ ...discountModal, max: e.target.value })} placeholder="∞" className={`${field} bg-[var(--color-white)]`} /></div>
            <div><label className={lbl}>Expires</label><input value={discountModal.expires} onChange={(e) => setDiscountModal({ ...discountModal, expires: e.target.value })} placeholder="Ongoing" className={`${field} bg-[var(--color-white)]`} /></div>
            <div><label className={lbl}>Status</label><select value={discountModal.status} onChange={(e) => setDiscountModal({ ...discountModal, status: e.target.value })} className={`${field} bg-[var(--color-white)]`}><option value="active">Active</option><option value="paused">Paused</option></select></div>
          </div>
        </EditorModal>
      )}

      {collectionModal && (
        <EditorModal title={collectionModal.id ? 'Edit collection' : 'New collection'} onCancel={() => setCollectionModal(null)} onSave={() => {
          if (!collectionModal.name) { toast.error('Name is required'); return }
          setCollections((p) => collectionModal.id ? p.map((x) => x.id === collectionModal.id ? collectionModal : x) : [...p, { ...collectionModal, id: `c${Date.now()}`, count: 0 }])
          setCollectionModal(null); toast.success('Collection saved')
        }} saveLabel="Save collection">
          <div className="flex flex-col gap-3">
            <div><label className={lbl}>Name</label><input value={collectionModal.name} onChange={(e) => setCollectionModal({ ...collectionModal, name: e.target.value })} placeholder="e.g. Quiet Luxury" className={`${field} bg-[var(--color-white)]`} /></div>
            <div><label className={lbl}>URL slug</label><input value={collectionModal.slug} onChange={(e) => setCollectionModal({ ...collectionModal, slug: e.target.value })} className={`${field} bg-[var(--color-white)]`} /></div>
            <div><label className={lbl}>Description</label><input value={collectionModal.desc} onChange={(e) => setCollectionModal({ ...collectionModal, desc: e.target.value })} className={`${field} bg-[var(--color-white)]`} /></div>
            <div><label className={lbl}>Cover image URL</label><input value={collectionModal.image} onChange={(e) => setCollectionModal({ ...collectionModal, image: e.target.value })} className={`${field} bg-[var(--color-white)]`} /></div>
          </div>
        </EditorModal>
      )}

      {blogModal && (
        <EditorModal title={blogModal.id ? 'Edit post' : 'New post'} onCancel={() => setBlogModal(null)} onSave={() => {
          if (!blogModal.title) { toast.error('Title is required'); return }
          const statusLabel = blogModal.status === 'published' ? 'Published' : 'Draft'
          setBlog((p) => blogModal.id ? p.map((x) => x.id === blogModal.id ? { ...blogModal, statusLabel } : x) : [{ ...blogModal, id: `b${Date.now()}`, date: 'Just now', statusLabel }, ...p])
          setBlogModal(null); toast.success('Post saved')
        }} saveLabel="Save post">
          <div className="flex flex-col gap-3">
            <div><label className={lbl}>Title</label><input value={blogModal.title} onChange={(e) => setBlogModal({ ...blogModal, title: e.target.value })} placeholder="Post title" className={`${field} bg-[var(--color-white)]`} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Author</label><input value={blogModal.author} onChange={(e) => setBlogModal({ ...blogModal, author: e.target.value })} className={`${field} bg-[var(--color-white)]`} /></div>
              <div><label className={lbl}>Status</label><select value={blogModal.status} onChange={(e) => setBlogModal({ ...blogModal, status: e.target.value })} className={`${field} bg-[var(--color-white)]`}><option value="published">Published</option><option value="draft">Draft</option></select></div>
            </div>
            <div><label className={lbl}>Cover image URL</label><input value={blogModal.image} onChange={(e) => setBlogModal({ ...blogModal, image: e.target.value })} className={`${field} bg-[var(--color-white)]`} /></div>
          </div>
        </EditorModal>
      )}
    </div>
  )
}

/* Shared editor modal shell for discount / collection / blog editors. */
function EditorModal({ title, children, onCancel, onSave, saveLabel }) {
  return (
    <div className="fixed inset-0 z-[650] flex items-center justify-center p-6">
      <div onClick={onCancel} className="absolute inset-0 bg-[var(--color-black)]/55" style={{ animation: 'fade-in 0.35s var(--ease-out) both' }} />
      <div className="relative w-[min(520px,100%)] bg-[var(--color-ivory)] shadow-[0_30px_90px_rgba(13,12,11,0.3)] p-[clamp(1.8rem,4vw,2.4rem)] max-h-[92vh] overflow-y-auto" style={{ animation: 'scale-in 0.4s var(--ease-out) both' }}>
        <h2 className="text-2xl">{title}</h2>
        <div className="mt-5">{children}</div>
        <div className="flex gap-2.5 mt-6">
          <button onClick={onCancel} className="flex-1 py-3.5 border border-[var(--color-stone)] text-[0.66rem] tracking-[0.16em] uppercase text-[var(--color-charcoal)] hover:border-[var(--color-charcoal)]">Cancel</button>
          <button onClick={onSave} className="flex-1 py-3.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.16em] uppercase hover:bg-[var(--color-champagne-dark)]">{saveLabel}</button>
        </div>
      </div>
    </div>
  )
}
