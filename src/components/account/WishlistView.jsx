'use client'

import Link from 'next/link'
import { useStore } from '@/components/providers/StoreProvider'
import AccountTabs from './AccountTabs'

export default function WishlistView() {
  const { wishlist, hydrated, toggleWishlist, addToCart } = useStore()

  return (
    <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,4rem)] pt-10 pb-24">
      <span className="block text-[var(--color-champagne-dark)] text-[0.66rem] tracking-[0.26em] uppercase mb-3">Saved</span>
      <h1 className="text-[clamp(2.2rem,4.5vw,3.2rem)]" style={{ animation: 'fade-up 0.7s var(--ease-luxury) both' }}>Your wishlist</h1>

      <AccountTabs active="/account/wishlist" />

      {hydrated && wishlist.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-serif text-2xl text-[var(--color-charcoal)]">Nothing saved yet.</p>
          <Link href="/shop" className="inline-block mt-5 px-8 py-3.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.2em] uppercase hover:bg-[var(--color-champagne-dark)] transition-colors">Discover pieces</Link>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[clamp(1.2rem,2.5vw,2rem)]">
          {wishlist.map((p) => (
            <div key={p.id}>
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-stone)] group">
                <Link href={`/product/${p.slug}`}>
                  <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-luxury)] group-hover:scale-105" />
                </Link>
                <button onClick={() => toggleWishlist(p)} aria-label="Remove" className="absolute right-3.5 top-3.5 w-[34px] h-[34px] rounded-full bg-[var(--color-ivory)]/90 flex items-center justify-center text-base text-[var(--color-champagne-dark)]">♥</button>
              </div>
              <h3 className="text-xl mt-3.5">{p.name}</h3>
              <p className="text-[0.88rem] text-[var(--color-mid-gray)] mt-1">{p.priceFmt}</p>
              <button onClick={() => { addToCart(p); toggleWishlist(p) }} className="mt-3 w-full py-3.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.64rem] tracking-[0.18em] uppercase hover:bg-[var(--color-champagne-dark)] transition-colors">Move to bag</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
