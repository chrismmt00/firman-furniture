'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/components/providers/StoreProvider'
import ProductCard from './ProductCard'
import { stars } from '@/lib/format'

export default function ProductDetail({ product, colorVariants, related, reviews, rating }) {
  const { addToCart, toggleWishlist, isWished } = useStore()
  const [imgIndex, setImgIndex] = useState(0)
  const [qty, setQty] = useState(1)
  const [openAcc, setOpenAcc] = useState('details')
  const saved = isWished(product.id)
  const hasColorVariants = colorVariants.length > 1

  const accordions = [
    { key: 'details', label: 'Details & Materials', body: `${product.description}${product.material ? `\n\nMaterials: ${product.material}.` : ''}` },
    { key: 'dimensions', label: 'Dimensions', body: 'Generously scaled for real rooms. Exact dimensions are listed on the specification sheet included with every order; our team can confirm fit before your delivery is scheduled.' },
    { key: 'delivery', label: 'Delivery & Returns', body: 'Complimentary white-glove delivery on qualifying orders includes placement, assembly, and packaging removal. Made-to-order pieces ship in 6–8 weeks. 30-day returns on in-stock items.' },
  ]

  const stockLabel = product.inStock ? `In stock · ${product.stock} ready to ship` : 'Made to order · 6–8 weeks'
  const deliveryEst = product.inStock ? 'Ships within 1–2 weeks' : 'Estimated delivery in 6–8 weeks'

  return (
    <div className="max-w-screen-xl mx-auto px-[clamp(1.5rem,5vw,4rem)] pt-10 pb-24">
      <div className="text-[0.66rem] tracking-[0.16em] uppercase text-[var(--color-warm-gray)] mb-8">
        <Link href="/shop" className="hover:text-[var(--color-charcoal)]">Shop</Link> / <span className="text-[var(--color-charcoal)]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-[clamp(2rem,4vw,4rem)] items-start" style={{ animation: 'fade-up 0.8s var(--ease-luxury) both' }}>
        {/* Gallery */}
        <div className="flex flex-col-reverse lg:flex-row gap-4 items-start lg:sticky lg:top-24">
          {product.images.length > 1 && (
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible shrink-0">
              {product.images.slice(0, 6).map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`shrink-0 w-16 lg:w-[68px] aspect-[4/5] overflow-hidden border ${i === imgIndex ? 'border-[var(--color-champagne)]' : 'border-[var(--color-stone)]'} hover:border-[var(--color-champagne)]`}
                >
                  <img loading="lazy" src={src} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-stone)] flex-1 w-full">
            <img src={product.images[imgIndex]} alt={product.name} className="w-full h-full object-cover" />
            {product.onSale && (
              <span className="absolute left-4 top-4 bg-[var(--color-champagne-dark)] text-[var(--color-white)] text-[0.56rem] tracking-[0.18em] uppercase px-2.5 py-1.5">Sale</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-[0.66rem] tracking-[0.24em] uppercase text-[var(--color-champagne-dark)]">{product.category}</p>
          <h1 className="text-[clamp(2.2rem,4vw,3.4rem)] mt-2.5">{product.name}</h1>
          <a href="#reviews" className="flex items-center gap-2 mt-2.5 hover:text-[var(--color-champagne-dark)]">
            <span className="text-[var(--color-champagne)] tracking-[0.1em] text-base">{stars(rating)}</span>
            <span className="text-[0.78rem] text-[var(--color-mid-gray)]">{rating.toFixed(1)} · {reviews.length} reviews</span>
          </a>

          <div className="flex items-baseline gap-4 mt-4">
            <span className="text-2xl font-light text-[var(--color-charcoal)]">{product.priceFmt}</span>
            {product.onSale && <span className="text-lg text-[var(--color-warm-gray)] line-through">{product.compareFmt}</span>}
          </div>

          <p className="text-[var(--color-mid-gray)] leading-relaxed mt-5 font-light">{product.shortDescription || product.description}</p>
          <p className="mt-5 text-[0.72rem] tracking-[0.1em] uppercase text-[var(--color-champagne-dark)]">● {stockLabel}</p>

          {/* Color */}
          <div className="mt-7">
            <p className="text-[0.62rem] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] mb-3">
              {hasColorVariants ? 'Color' : 'Finish'} · {product.color || 'As shown'}
            </p>
            {hasColorVariants && (
              <div className="flex gap-3 flex-wrap">
                {colorVariants.map((variant) => {
                  const selected = variant.id === product.id

                  return (
                    <Link
                      key={variant.id}
                      href={`/product/${variant.slug}`}
                      onClick={() => setImgIndex(0)}
                      aria-label={`View ${variant.color}`}
                      aria-current={selected ? 'page' : undefined}
                      title={variant.color}
                      className={`block w-9 h-9 rounded-full border ${selected ? 'border-[var(--color-champagne-dark)]' : 'border-[var(--color-stone)]'}`}
                      style={{
                        background: variant.colorSwatch,
                        outline: selected ? '2px solid var(--color-champagne-dark)' : 'none',
                        outlineOffset: '2px',
                      }}
                    />
                  )
                })}
              </div>
            )}
          </div>

          {/* Add to bag */}
          <div className="flex gap-2.5 mt-6 items-stretch flex-wrap">
            <div className="inline-flex items-center border border-[var(--color-charcoal)]">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-[46px] h-[54px] text-[var(--color-mid-gray)] text-lg hover:text-[var(--color-black)]" aria-label="Decrease">−</button>
              <span className="w-11 text-center text-[0.95rem]">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-[46px] h-[54px] text-[var(--color-mid-gray)] text-lg hover:text-[var(--color-black)]" aria-label="Increase">+</button>
            </div>
            <button
              onClick={() => addToCart(product, { variant: product.color || 'As shown', qty })}
              className="flex-1 min-w-[180px] px-8 h-[54px] bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[var(--color-champagne-dark)] transition-colors"
            >
              Add to Bag — {product.priceFmt}
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className="w-[54px] h-[54px] border border-[var(--color-charcoal)] text-lg text-[var(--color-champagne-dark)] hover:bg-[var(--color-champagne-pale)]"
              aria-label="Save"
            >
              {saved ? '♥' : '♡'}
            </button>
          </div>
          <p className="mt-4 text-[0.78rem] text-[var(--color-mid-gray)]">→ {deliveryEst}</p>

          {/* Accordions */}
          <div className="mt-8 border-t border-[var(--color-stone)]">
            {accordions.map((a) => (
              <div key={a.key} className="border-b border-[var(--color-stone)]">
                <button
                  onClick={() => setOpenAcc((cur) => (cur === a.key ? null : a.key))}
                  className="flex items-center justify-between w-full text-left py-4 text-[0.72rem] tracking-[0.14em] uppercase text-[var(--color-charcoal)] hover:text-[var(--color-champagne-dark)]"
                >
                  <span>{a.label}</span>
                  <span className="text-lg text-[var(--color-champagne-dark)]">{openAcc === a.key ? '−' : '+'}</span>
                </button>
                {openAcc === a.key && (
                  <p className="text-[0.88rem] text-[var(--color-mid-gray)] leading-relaxed font-light pb-4 whitespace-pre-line">{a.body}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-6 mt-6 flex-wrap text-[0.74rem] text-[var(--color-mid-gray)]">
            <span>✓ White-glove delivery</span>
            <span>✓ 30-day returns</span>
            <span>✓ 10-year frame warranty</span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div id="reviews" className="mt-20 border-t border-[var(--color-stone)] pt-10 scroll-mt-28">
        <div className="grid grid-cols-1 lg:grid-cols-[0.6fr_1fr] gap-[clamp(2rem,4vw,3.5rem)] items-start">
          <div>
            <span className="block text-[var(--color-champagne-dark)] text-[0.66rem] tracking-[0.26em] uppercase mb-2.5">Reviews</span>
            <h2 className="text-[clamp(1.8rem,3vw,2.6rem)]">{rating.toFixed(1)} out of 5</h2>
            <p className="text-[var(--color-champagne)] tracking-[0.12em] text-lg mt-2">{stars(rating)}</p>
            <p className="text-[var(--color-mid-gray)] text-sm mt-2">Based on {reviews.length} reviews</p>
          </div>
          <div className="flex flex-col gap-6">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-[var(--color-stone)] pb-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <span className="text-[var(--color-champagne)] tracking-[0.1em] text-sm">{stars(r.rating)}</span>
                  <span className="text-[0.72rem] text-[var(--color-warm-gray)]">{r.date}</span>
                </div>
                <h4 className="font-serif text-xl mt-2">{r.title}</h4>
                <p className="text-[var(--color-mid-gray)] text-sm leading-relaxed mt-1 font-light">{r.body}</p>
                <p className="text-[0.72rem] text-[var(--color-warm-gray)] mt-2.5">— {r.author}, verified buyer</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-20">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-[clamp(1.6rem,3vw,2.4rem)]">You may also like</h2>
            <Link href="/shop" className="text-[0.66rem] tracking-[0.2em] uppercase text-[var(--color-black)] border-b border-[var(--color-champagne)] pb-1">View all</Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
