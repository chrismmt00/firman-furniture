'use client'

import Link from 'next/link'
import { useStore } from '@/components/providers/StoreProvider'

/* Storefront product card with hover quick-view and wishlist toggle.
   `product` is the mapped view model from lib/products. */
export default function ProductCard({ product }) {
  const { isWished, toggleWishlist, openQuick } = useStore()
  const saved = isWished(product.id)

  return (
    <div className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-stone)]">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <img
            loading="lazy"
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-luxury)] group-hover:scale-105"
          />
        </Link>
        <span className="absolute left-3.5 top-3.5 bg-[var(--color-ivory)]/90 text-[var(--color-champagne-dark)] text-[0.56rem] tracking-[0.2em] uppercase px-2.5 py-1.5 font-medium">
          {product.badge}
        </span>
        <button
          onClick={() => toggleWishlist(product)}
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute right-3.5 top-3.5 w-[34px] h-[34px] rounded-full bg-[var(--color-ivory)]/90 flex items-center justify-center text-base hover:bg-[var(--color-white)] transition-colors ${
            saved ? 'text-[var(--color-champagne-dark)]' : 'text-[var(--color-charcoal)]'
          }`}
        >
          {saved ? '♥' : '♡'}
        </button>
        <button
          onClick={() => openQuick(product)}
          className="absolute inset-x-0 bottom-0 bg-[var(--color-black)]/85 text-[var(--color-ivory)] py-3 text-[0.62rem] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          Quick view
        </button>
      </div>
      <Link href={`/product/${product.slug}`} className="block pt-4">
        <p className="text-[0.6rem] tracking-[0.22em] uppercase text-[var(--color-warm-gray)]">{product.category}</p>
        <h3 className="text-xl mt-1.5 transition-colors group-hover:text-[var(--color-champagne-dark)]">{product.name}</h3>
        <p className="text-sm text-[var(--color-charcoal)] mt-1.5 font-light">{product.priceFmt}</p>
      </Link>
    </div>
  )
}
