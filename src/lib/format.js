// Shared formatting helpers used across the storefront, account, and admin.

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const USD_CENTS = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Format an integer number of cents as a whole-dollar price, e.g. 129900 → "$1,299". */
export function formatCents(cents) {
  if (cents == null) return ''
  return USD.format(cents / 100)
}

/** Format cents with decimals, e.g. 129900 → "$1,299.00". */
export function formatCentsExact(cents) {
  if (cents == null) return ''
  return USD_CENTS.format(cents / 100)
}

/** Format a plain dollar amount, e.g. 250 → "$250". */
export function formatDollars(dollars) {
  if (dollars == null) return ''
  return USD.format(dollars)
}

/** Title-case a category slug, e.g. "living-room" → "Living Room". */
export function titleizeSlug(slug = '') {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** Two-letter initials from a name, e.g. "Eleanor Whitfield" → "EW". */
export function initials(name = '') {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Render a 0–5 rating as star glyphs, e.g. 4 → "★★★★☆". */
export function stars(rating = 0) {
  const full = Math.round(rating)
  return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full)
}

/** Format an ISO date or Date as e.g. "Mar 14, 2026". */
export function formatDate(value) {
  if (!value) return ''
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
