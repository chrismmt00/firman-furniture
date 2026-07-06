// Demo data for areas backed by tables that ship empty (orders, customers,
// reviews, addresses, discounts, trade applications, blog, store settings).
// Shared by the account dashboard and the admin portal so both tell a
// consistent story. Pure data — safe to import on server or client.

import { formatCents, formatDate, initials, stars } from './format'

const IMG = (id, w = 600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`

/* ── Order status → swatch ───────────────────────────────────────── */
export const ORDER_STATUS = {
  pending: { label: 'Pending', color: '#8a6d3b', bg: '#F5EDD9' },
  confirmed: { label: 'Confirmed', color: '#3A5A7A', bg: '#E8EEF5' },
  processing: { label: 'Processing', color: '#3A5A7A', bg: '#E8EEF5' },
  shipped: { label: 'Shipped', color: '#8F7840', bg: '#F5EDD9' },
  delivered: { label: 'Delivered', color: '#3A7A5A', bg: '#E8F5EE' },
  cancelled: { label: 'Cancelled', color: '#9B3A3A', bg: '#F5E8E8' },
  refunded: { label: 'Refunded', color: '#9B3A3A', bg: '#F5E8E8' },
}

export function statusMeta(status) {
  return ORDER_STATUS[status] || ORDER_STATUS.pending
}

/* ── Customers ───────────────────────────────────────────────────── */
export const customers = [
  { email: 'eleanor@example.com', name: 'Eleanor Whitfield', location: 'New York, NY', orders: 4, spent: 2148000, trade: false, since: '2023' },
  { email: 'james.harlow@studio.com', name: 'James Harlow', location: 'Brooklyn, NY', orders: 7, spent: 5320000, trade: true, since: '2022' },
  { email: 'sofia.reyes@example.com', name: 'Sofia Reyes', location: 'Austin, TX', orders: 2, spent: 689000, trade: false, since: '2024' },
  { email: 'marcus.lin@atelier.co', name: 'Marcus Lin', location: 'San Francisco, CA', orders: 5, spent: 4115000, trade: true, since: '2023' },
  { email: 'priya.nair@example.com', name: 'Priya Nair', location: 'Chicago, IL', orders: 1, spent: 299900, trade: false, since: '2025' },
  { email: 'thomas.beck@example.com', name: 'Thomas Beck', location: 'Seattle, WA', orders: 3, spent: 1574000, trade: false, since: '2024' },
]

/* ── Orders ──────────────────────────────────────────────────────── */
const ORDER_IMG_A = IMG('1555041469-a586c61ea9bc')
const ORDER_IMG_B = IMG('1616486338812-3dadae4b4ace')
const ORDER_IMG_C = IMG('1567538096630-e0c55bd6374c')
const ORDER_IMG_D = IMG('1594026112284-02bb6f3352fe')

export const orders = [
  {
    number: 'FRM-24819', email: 'eleanor@example.com', customer: 'Eleanor Whitfield',
    location: 'New York, NY 10012', date: '2026-06-18', status: 'processing', method: 'White-Glove Delivery',
    tracking: 'Pending pickup', total: 1284000,
    items: [
      { name: 'Octavia Amber Sectional', qty: 1, price: 249900, image: ORDER_IMG_A },
      { name: 'Como Travertine Table', qty: 1, price: 425000, image: ORDER_IMG_B },
    ],
  },
  {
    number: 'FRM-24788', email: 'eleanor@example.com', customer: 'Eleanor Whitfield',
    location: 'New York, NY 10012', date: '2026-05-30', status: 'delivered', method: 'White-Glove Delivery',
    tracking: 'Delivered · signed E. Whitfield', total: 290000,
    items: [{ name: 'Aurelia Lounge Chair', qty: 1, price: 290000, image: ORDER_IMG_C }],
  },
  {
    number: 'FRM-24640', email: 'james.harlow@studio.com', customer: 'James Harlow',
    location: 'Brooklyn, NY 11201', date: '2026-05-12', status: 'shipped', method: 'Standard Freight',
    tracking: 'FedEx · 7741 2298 0041', total: 868000,
    items: [
      { name: 'Vesper Oak Cabinet', qty: 1, price: 560000, image: ORDER_IMG_D },
      { name: 'Aurelia Lounge Chair', qty: 1, price: 290000, image: ORDER_IMG_C },
    ],
  },
  {
    number: 'FRM-24559', email: 'sofia.reyes@example.com', customer: 'Sofia Reyes',
    location: 'Austin, TX 78701', date: '2026-04-28', status: 'delivered', method: 'White-Glove Delivery',
    tracking: 'Delivered', total: 389000,
    items: [{ name: 'Como Travertine Table', qty: 1, price: 389000, image: ORDER_IMG_B }],
  },
  {
    number: 'FRM-24501', email: 'marcus.lin@atelier.co', customer: 'Marcus Lin',
    location: 'San Francisco, CA 94110', date: '2026-04-15', status: 'pending', method: 'White-Glove Delivery',
    tracking: 'Awaiting confirmation', total: 1599000,
    items: [
      { name: 'Octavia Orange Sectional', qty: 1, price: 249900, image: ORDER_IMG_A },
      { name: 'Vesper Oak Cabinet', qty: 2, price: 560000, image: ORDER_IMG_D },
    ],
  },
  {
    number: 'FRM-24470', email: 'thomas.beck@example.com', customer: 'Thomas Beck',
    location: 'Seattle, WA 98101', date: '2026-03-22', status: 'cancelled', method: 'Standard Freight',
    tracking: 'Cancelled by customer', total: 290000,
    items: [{ name: 'Aurelia Lounge Chair', qty: 1, price: 290000, image: ORDER_IMG_C }],
  },
]

export function decorateOrder(o) {
  const meta = statusMeta(o.status)
  return {
    ...o,
    itemCount: o.items.reduce((n, i) => n + i.qty, 0),
    date: formatDate(o.date),
    statusLabel: meta.label,
    statusColor: meta.color,
    statusBg: meta.bg,
    totalFmt: formatCents(o.total),
    firstImage: o.items[0]?.image,
    items: o.items.map((it) => ({
      ...it,
      priceFmt: formatCents(it.price),
      lineFmt: formatCents(it.price * it.qty),
    })),
  }
}

export function getOrders(email) {
  const list = email ? orders.filter((o) => o.email === email) : orders
  return list.map(decorateOrder)
}

export function getOrder(number) {
  const found = orders.find((o) => o.number === number)
  return found ? decorateOrder(found) : null
}

/* ── Account (signed-in demo user) ───────────────────────────────── */
export const account = {
  firstName: 'Eleanor',
  lastName: 'Whitfield',
  name: 'Eleanor Whitfield',
  email: 'eleanor@example.com',
  since: '2023',
}

export const addresses = [
  { label: 'Home', name: 'Eleanor Whitfield', line1: '412 Greene Street, Apt 6B', city: 'New York', state: 'NY', zip: '10012', country: 'United States', def: true },
  { label: 'Studio', name: 'Eleanor Whitfield', line1: '88 Wythe Avenue', city: 'Brooklyn', state: 'NY', zip: '11249', country: 'United States', def: false },
]

/* ── Reviews ─────────────────────────────────────────────────────── */
export const reviews = [
  { id: 'r1', rating: 5, title: 'Anchors the whole room', body: 'The proportions are exactly right and the upholstery is even softer than expected. Two months in and it already feels like it has always been here.', author: 'Eleanor W.', product: 'Octavia Amber Sectional', date: '2026-05-20', status: 'approved' },
  { id: 'r2', rating: 4, title: 'Beautiful, worth the wait', body: 'Lead time was real — eight weeks — but the white-glove team placed and assembled everything perfectly.', author: 'James H.', product: 'Vesper Oak Cabinet', date: '2026-05-02', status: 'approved' },
  { id: 'r3', rating: 5, title: 'Stone top is stunning', body: 'Every slab is different and ours has gorgeous veining. Heavier than I imagined, in the best way.', author: 'Sofia R.', product: 'Como Travertine Table', date: '2026-04-30', status: 'pending' },
  { id: 'r4', rating: 3, title: 'Lovely but firm', body: 'Gorgeous chair, though the seat is firmer than I expected. Settling in over time.', author: 'Priya N.', product: 'Aurelia Lounge Chair', date: '2026-04-11', status: 'pending' },
  { id: 'r5', rating: 2, title: 'Colour was a touch off', body: 'The amber read more orange in person than online. Support was helpful about it.', author: 'Thomas B.', product: 'Octavia Orange Sectional', date: '2026-03-18', status: 'rejected' },
]

export function decorateReview(r) {
  return {
    ...r,
    stars: stars(r.rating),
    date: formatDate(r.date),
    isPending: r.status === 'pending',
    isApproved: r.status === 'approved',
    isRejected: r.status === 'rejected',
  }
}

/* Product-page reviews (a small, consistent set used on every PDP). */
export const productReviews = [
  { id: 'pr1', rating: 5, title: 'Exactly as described', body: 'Quietly luxurious. The kind of piece guests notice without quite knowing why.', author: 'Eleanor W.', date: '2026-05-20' },
  { id: 'pr2', rating: 5, title: 'Built to last', body: 'You can feel the quality the moment it arrives. Solid, considered, beautifully finished.', author: 'Marcus L.', date: '2026-04-09' },
  { id: 'pr3', rating: 4, title: 'Worth every penny', body: 'A real investment piece. The made-to-order wait was worth it for the finish we chose.', author: 'Sofia R.', date: '2026-03-27' },
]

/* ── Discounts ───────────────────────────────────────────────────── */
export const discounts = [
  { id: 'd1', code: 'SPRING10', type: 'Percentage', value: '10%', min: '$1,000', used: 142, max: 500, expires: 'Jun 30, 2026', status: 'active' },
  { id: 'd2', code: 'TRADE15', type: 'Percentage', value: '15%', min: 'None', used: 38, max: '∞', expires: 'Ongoing', status: 'active' },
  { id: 'd3', code: 'WELCOME10', type: 'Fixed amount', value: '$100', min: '$500', used: 211, max: 1000, expires: 'Ongoing', status: 'active' },
  { id: 'd4', code: 'FREESHIP', type: 'Free Shipping', value: 'Shipping', min: '$2,500', used: 87, max: '∞', expires: 'Dec 31, 2026', status: 'paused' },
]

export function discountStatusMeta(status) {
  return status === 'active'
    ? { label: 'Active', color: '#3A7A5A', bg: '#E8F5EE' }
    : { label: 'Paused', color: '#8a6d3b', bg: '#F5EDD9' }
}

/* ── Trade applications ──────────────────────────────────────────── */
export const tradeApplications = [
  { id: 't1', business: 'Harlow Interiors', contact: 'James Harlow', type: 'Interior Design', email: 'james.harlow@studio.com', status: 'pending' },
  { id: 't2', business: 'Atelier Lin', contact: 'Marcus Lin', type: 'Architecture', email: 'marcus.lin@atelier.co', status: 'approved' },
  { id: 't3', business: 'Beck & Co.', contact: 'Thomas Beck', type: 'Staging', email: 'thomas.beck@example.com', status: 'pending' },
]

export function tradeStatusMeta(status) {
  if (status === 'approved') return { label: 'Approved', color: '#3A7A5A', bg: '#E8F5EE' }
  if (status === 'rejected') return { label: 'Rejected', color: '#9B3A3A', bg: '#F5E8E8' }
  return { label: 'Pending', color: '#8a6d3b', bg: '#F5EDD9' }
}

/* ── Marketing / subscribers ─────────────────────────────────────── */
export const subscribers = [
  { email: 'eleanor@example.com', source: 'Homepage', date: 'Jun 1, 2026' },
  { email: 'newcollector@example.com', source: 'Popup', date: 'May 28, 2026' },
  { email: 'designlover@example.com', source: 'Footer', date: 'May 14, 2026' },
  { email: 'studio@harlow.com', source: 'Trade form', date: 'Apr 30, 2026' },
]

/* ── Staff / settings ────────────────────────────────────────────── */
export const staff = [
  { name: 'Eleanor Whitfield', email: 'eleanor@firman.com', access: 'Full access', role: 'Owner' },
  { name: 'Daniel Cross', email: 'daniel@firman.com', access: 'Orders, products', role: 'Staff' },
  { name: 'Mira Osei', email: 'mira@firman.com', access: 'Content, marketing', role: 'Staff' },
]

export const shippingRates = [
  { zone: 'Continental US', name: 'White-Glove Delivery', price: 'Complimentary', eta: '3–5 weeks' },
  { zone: 'Continental US', name: 'Standard Freight', price: '$250', eta: '1–2 weeks' },
  { zone: 'West Coast', name: 'White-Glove Delivery', price: 'Complimentary', eta: '2–4 weeks' },
  { zone: 'International', name: 'Freight (quoted)', price: 'From $850', eta: '4–8 weeks' },
]

export const taxRates = [
  { region: 'New York', rate: '8.875%', type: 'State + local' },
  { region: 'California', rate: '7.25%', type: 'State' },
  { region: 'Texas', rate: '6.25%', type: 'State' },
  { region: 'Illinois', rate: '6.25%', type: 'State' },
]

export const pages = [
  { title: 'About', slug: 'about', updated: 'Jun 10, 2026', status: 'published', statusLabel: 'Published' },
  { title: 'Trade Program', slug: 'trade-program', updated: 'Jun 2, 2026', status: 'published', statusLabel: 'Published' },
  { title: 'Contact', slug: 'contact', updated: 'May 20, 2026', status: 'published', statusLabel: 'Published' },
  { title: 'Shipping & Returns', slug: 'shipping-returns', updated: 'May 5, 2026', status: 'draft', statusLabel: 'Draft' },
]

export const blogPosts = [
  { id: 'b1', title: 'How to choose a sectional that lasts a generation', author: 'Eleanor Whitfield', date: 'Jun 12, 2026', status: 'published', statusLabel: 'Published', image: IMG('1618220252344-8ec99ec624b1') },
  { id: 'b2', title: 'The quiet luxury of honest materials', author: 'Mira Osei', date: 'May 30, 2026', status: 'published', statusLabel: 'Published', image: IMG('1616137466211-f939a420be84') },
  { id: 'b3', title: 'Styling stone surfaces for everyday living', author: 'Daniel Cross', date: 'May 18, 2026', status: 'draft', statusLabel: 'Draft', image: IMG('1567538096630-e0c55bd6374c') },
]

/* ── Collections (storefront editorial groupings) ────────────────── */
export const editorialCollections = [
  { name: 'Quiet Luxury', slug: 'living-room', count: 20, desc: 'Soft palettes and generous proportions for living spaces.', image: IMG('1600210492486-724fe5c67fb0', 1200) },
  { name: 'The Dining Room', slug: 'dining-room', count: 20, desc: 'Tables, seating, and storage with a composed point of view.', image: IMG('1617104551722-3b2d51366400', 1200) },
  { name: 'Made to Rest', slug: 'bedroom', count: 20, desc: 'Layered textures and quiet silhouettes for the bedroom.', image: IMG('1618220179428-22790b461013', 1200) },
  { name: 'Finishing Accents', slug: 'accents', count: 11, desc: 'The considered details that complete a room.', image: IMG('1616486338812-3dadae4b4ace', 1200) },
]

/* ── Lookbook editorial grid ─────────────────────────────────────── */
export const lookbookImages = [
  { label: 'Soft Minimalism', cat: 'living-room', image: IMG('1600566753190-17f0baa2a6c3', 900) },
  { label: 'Collected Warmth', cat: 'living-room', image: IMG('1600607687939-ce8a6c25118c', 900) },
  { label: 'Gallery Dining', cat: 'dining-room', image: IMG('1600607687920-4e2a09cf159d', 900) },
  { label: 'Made to Rest', cat: 'bedroom', image: IMG('1618220179428-22790b461013', 900) },
  { label: 'Considered Storage', cat: 'accents', image: IMG('1594026112284-02bb6f3352fe', 900) },
  { label: 'Stone & Light', cat: 'dining-room', image: IMG('1616486338812-3dadae4b4ace', 900) },
  { label: 'Lounge Hours', cat: 'living-room', image: IMG('1567538096630-e0c55bd6374c', 900) },
  { label: 'Quiet Bedroom', cat: 'bedroom', image: IMG('1505693416388-ac5ce068fe85', 900) },
  { label: 'Evening Edit', cat: 'living-room', image: IMG('1618221195710-dd6b41faaea6', 900) },
]

/* ── Admin dashboard analytics ───────────────────────────────────── */
export const revenueChart = [42, 55, 48, 63, 58, 71, 66, 78, 72, 85, 80, 92, 88, 96]

export const adminStats = {
  revenue: '$284,120',
  orderCount: orders.length,
  aov: '$8,840',
  customerCount: customers.length,
  subscriberCount: subscribers.length,
}
