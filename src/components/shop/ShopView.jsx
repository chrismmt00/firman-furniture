'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import ProductCard from './ProductCard'

const PER_PAGE = 12

function CheckBox({ active }) {
  return (
    <span className={`w-4 h-4 border flex items-center justify-center text-[0.6rem] ${active ? 'bg-[var(--color-champagne-dark)] border-[var(--color-champagne-dark)] text-white' : 'border-[var(--color-warm-gray)]'}`}>
      {active ? '✓' : ''}
    </span>
  )
}

const PRICE_TESTS = {
  all: () => true,
  '0-1000': (p) => p.price < 100000,
  '1000-2500': (p) => p.price >= 100000 && p.price < 250000,
  '2500-5000': (p) => p.price >= 250000 && p.price < 500000,
  '5000+': (p) => p.price >= 500000,
}

export default function ShopView({ products, facets, title, initialCategory = 'all' }) {
  const [category, setCategory] = useState(initialCategory)
  const [price, setPrice] = useState('all')
  const [materials, setMaterials] = useState([])
  const [colors, setColors] = useState([])
  const [readyOnly, setReadyOnly] = useState(false)
  const [sort, setSort] = useState('featured')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)

  const toggle = (setter, list, val) =>
    setter(list.includes(val) ? list.filter((x) => x !== val) : [...list, val])

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (category !== 'all' && p.categorySlug !== category) return false
      if (!PRICE_TESTS[price](p)) return false
      if (materials.length && !materials.includes(p.materialFamily)) return false
      if (colors.length && !colors.includes(p.colorFamily)) return false
      if (readyOnly && !p.inStock) return false
      return true
    })
    switch (sort) {
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break
      case 'newest': list = [...list].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured)); break
      default: break
    }
    return list
  }, [products, category, price, materials, colors, readyOnly, sort])

  // Reset to the first page whenever the result set changes.
  const filterKey = `${category}|${price}|${materials.join(',')}|${colors.join(',')}|${readyOnly}|${sort}`
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1)
  }, [filterKey])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pageCount)
  const pageItems = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)
  const rangeStart = filtered.length === 0 ? 0 : (current - 1) * PER_PAGE + 1
  const rangeEnd = Math.min(current * PER_PAGE, filtered.length)

  const goToPage = (n) => {
    setPage(n)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const chips = [
    ...(category !== 'all' ? [{ type: 'category', val: category, label: facets.categories.find((c) => c.cat === category)?.label || category }] : []),
    ...(price !== 'all' ? [{ type: 'price', val: price, label: facets.prices.find((p) => p.val === price)?.label || price }] : []),
    ...materials.map((m) => ({ type: 'material', val: m, label: m })),
    ...colors.map((c) => ({ type: 'color', val: c, label: c })),
    ...(readyOnly ? [{ type: 'ready', val: 'ready', label: 'Ready to ship' }] : []),
  ]

  const removeChip = (chip) => {
    if (chip.type === 'category') setCategory('all')
    else if (chip.type === 'price') setPrice('all')
    else if (chip.type === 'material') toggle(setMaterials, materials, chip.val)
    else if (chip.type === 'color') toggle(setColors, colors, chip.val)
    else if (chip.type === 'ready') setReadyOnly(false)
  }

  const clearAll = () => { setCategory('all'); setPrice('all'); setMaterials([]); setColors([]); setReadyOnly(false) }
  const hasFilters = chips.length > 0

  const sidebar = (
    <aside className="flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--color-charcoal)] mb-5">
        <span className="text-[0.66rem] tracking-[0.2em] uppercase text-[var(--color-black)] font-medium">Filters</span>
        {hasFilters && (
          <button onClick={clearAll} className="text-[0.6rem] tracking-[0.12em] uppercase text-[var(--color-champagne-dark)] hover:text-[var(--color-black)]">
            Clear all ({chips.length})
          </button>
        )}
      </div>

      {/* Category */}
      <div className="pb-5 mb-5 border-b border-[var(--color-stone)]">
        <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] mb-2">Category</p>
        {facets.categories.map((c) => (
          <button
            key={c.cat}
            onClick={() => setCategory(c.cat)}
            className={`flex items-center justify-between w-full text-left py-1 text-sm hover:text-[var(--color-black)] ${category === c.cat ? 'text-[var(--color-black)] font-medium' : 'text-[var(--color-mid-gray)]'}`}
          >
            <span>{c.label}</span>
            <span className="text-[0.68rem] text-[var(--color-warm-gray)] font-light">{c.count}</span>
          </button>
        ))}
      </div>

      {/* Price */}
      <div className="pb-5 mb-5 border-b border-[var(--color-stone)]">
        <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] mb-2.5">Price</p>
        {facets.prices.map((o) => (
          <button key={o.val} onClick={() => setPrice(o.val)} className="flex items-center gap-2.5 w-full text-left py-1">
            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${price === o.val ? 'border-[var(--color-champagne-dark)]' : 'border-[var(--color-warm-gray)]'}`}>
              {price === o.val && <span className="w-[7px] h-[7px] rounded-full bg-[var(--color-champagne-dark)]" />}
            </span>
            <span className={`text-sm ${price === o.val ? 'text-[var(--color-black)]' : 'text-[var(--color-mid-gray)]'}`}>{o.label}</span>
          </button>
        ))}
      </div>

      {/* Material */}
      <div className="pb-5 mb-5 border-b border-[var(--color-stone)]">
        <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] mb-2.5">Material</p>
        {facets.materials.map((o) => {
          const active = materials.includes(o.val)
          return (
            <button key={o.val} onClick={() => toggle(setMaterials, materials, o.val)} className="flex items-center gap-2.5 w-full text-left py-1">
              <CheckBox active={active} />
              <span className={`text-sm flex-1 ${active ? 'text-[var(--color-black)]' : 'text-[var(--color-mid-gray)]'}`}>{o.label}</span>
              <span className="text-[0.68rem] text-[var(--color-warm-gray)]">{o.count}</span>
            </button>
          )
        })}
      </div>

      {/* Colour */}
      <div className="pb-5 mb-5 border-b border-[var(--color-stone)]">
        <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] mb-3">Colour</p>
        {facets.colors.map((o) => {
          const active = colors.includes(o.val)
          return (
            <button key={o.val} onClick={() => toggle(setColors, colors, o.val)} className="flex items-center gap-3 w-full text-left py-1.5">
              <span className="w-4 h-4 rounded-full border border-[var(--color-stone)]" style={{ background: o.swatch, outline: active ? '2px solid var(--color-champagne-dark)' : 'none', outlineOffset: '2px' }} />
              <span className={`text-sm flex-1 ${active ? 'text-[var(--color-black)]' : 'text-[var(--color-mid-gray)]'}`}>{o.label}</span>
              <span className="text-[0.68rem] text-[var(--color-warm-gray)]">{o.count}</span>
            </button>
          )
        })}
      </div>

      {/* Availability */}
      <div>
        <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] mb-2.5">Availability</p>
        <button onClick={() => setReadyOnly((v) => !v)} className="flex items-center gap-2.5 w-full text-left py-1">
          <CheckBox active={readyOnly} />
          <span className="text-sm text-[var(--color-mid-gray)]">Ready to ship</span>
        </button>
      </div>
    </aside>
  )

  return (
    <div className="max-w-screen-xl mx-auto px-[clamp(1.5rem,5vw,4rem)] pt-10 pb-24">
      <div className="text-[0.66rem] tracking-[0.16em] uppercase text-[var(--color-warm-gray)] mb-6">
        <Link href="/" className="hover:text-[var(--color-charcoal)]">Home</Link> / <span className="text-[var(--color-charcoal)]">{title}</span>
      </div>
      <div className="mb-10" style={{ animation: 'fade-up 0.8s var(--ease-luxury) both' }}>
        <h1 className="text-[clamp(2.4rem,5vw,4rem)]">{title}</h1>
        <p className="text-[var(--color-mid-gray)] mt-2.5 font-light">{filtered.length} pieces, each made to be lived with.</p>
      </div>

      {/* Mobile filter toggle */}
      <button
        onClick={() => setMobileFiltersOpen((v) => !v)}
        className="lg:hidden w-full py-3.5 border border-[var(--color-charcoal)] text-[0.66rem] tracking-[0.18em] uppercase mb-5"
      >
        Filters &amp; Sort ({chips.length})
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-[clamp(1.6rem,3vw,3rem)] items-start">
        <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>{sidebar}</div>

        <div>
          <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-[var(--color-stone)] mb-6">
            <span className="text-[0.78rem] text-[var(--color-mid-gray)]">
              {filtered.length > 0
                ? <>Showing <strong className="text-[var(--color-black)] font-medium">{rangeStart}–{rangeEnd}</strong> of {filtered.length}</>
                : <><strong className="text-[var(--color-black)] font-medium">0</strong> results</>}
            </span>
            <div className="flex items-center gap-2.5">
              <span className="text-[0.6rem] tracking-[0.16em] uppercase text-[var(--color-warm-gray)]">Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="py-2 px-3.5 text-[0.66rem] tracking-[0.1em] uppercase border border-[var(--color-stone)] bg-[var(--color-white)] outline-none text-[var(--color-charcoal)]">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {hasFilters && (
            <div className="flex gap-2 flex-wrap mb-6">
              {chips.map((ch) => (
                <button key={`${ch.type}-${ch.val}`} onClick={() => removeChip(ch)} className="inline-flex items-center gap-2 py-1.5 px-3 bg-[var(--color-champagne-pale)] text-[var(--color-champagne-dark)] text-[0.64rem] tracking-[0.08em] hover:bg-[var(--color-champagne-light)]">
                  {ch.label} <span className="text-base leading-none">×</span>
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-[var(--color-charcoal)]">No pieces match these filters.</p>
              <p className="text-[var(--color-mid-gray)] mt-2.5">Try removing a filter to see more.</p>
              <button onClick={clearAll} className="mt-5 px-7 py-3 border border-[var(--color-charcoal)] text-[0.64rem] tracking-[0.16em] uppercase">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-[clamp(1.2rem,2.5vw,1.8rem)]">
                {pageItems.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>

              {pageCount > 1 && (
                <nav className="flex items-center justify-center gap-1.5 mt-14" aria-label="Pagination">
                  <button
                    onClick={() => goToPage(current - 1)}
                    disabled={current === 1}
                    className="px-4 h-9 text-[0.62rem] tracking-[0.18em] uppercase text-[var(--color-charcoal)] hover:text-[var(--color-champagne-dark)] disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Prev
                  </button>
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => goToPage(n)}
                      aria-current={n === current ? 'page' : undefined}
                      className={`w-9 h-9 text-[0.78rem] flex items-center justify-center transition-colors ${
                        n === current
                          ? 'border border-[var(--color-champagne)] text-[var(--color-black)]'
                          : 'text-[var(--color-mid-gray)] hover:text-[var(--color-black)]'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={() => goToPage(current + 1)}
                    disabled={current === pageCount}
                    className="px-4 h-9 text-[0.62rem] tracking-[0.18em] uppercase text-[var(--color-charcoal)] hover:text-[var(--color-champagne-dark)] disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
