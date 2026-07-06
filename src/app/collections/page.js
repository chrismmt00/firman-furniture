import Link from 'next/link'
import { getCategories } from '@/lib/products'
import { editorialCollections } from '@/lib/demo-data'

export const metadata = {
  title: 'Collections',
  description: 'Edits assembled around material, mood, and the way a room is meant to feel.',
}

export default async function CollectionsPage() {
  const categories = await getCategories()
  const countFor = (slug) => categories.find((c) => c.slug === slug)?.count

  return (
    <div>
      <section className="bg-[var(--color-black)] text-[var(--color-ivory)] px-[clamp(1.5rem,5vw,4rem)] py-[clamp(4rem,8vw,7rem)] text-center">
        <span className="block text-[var(--color-champagne-light)] text-[0.66rem] tracking-[0.28em] uppercase mb-5" style={{ animation: 'fade-up 0.8s var(--ease-luxury) both' }}>Collections</span>
        <h1 className="text-[var(--color-white)] text-[clamp(2.6rem,6vw,5rem)]" style={{ animation: 'fade-up 0.9s var(--ease-luxury) 0.06s both' }}>Curated by point of view.</h1>
        <p className="text-[var(--color-white)]/80 max-w-[520px] mx-auto mt-5 font-light" style={{ animation: 'fade-up 0.9s var(--ease-luxury) 0.12s both' }}>
          Edits assembled around material, mood, and the way a room is meant to feel.
        </p>
      </section>

      <div className="max-w-screen-xl mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(3rem,6vw,5rem)] grid grid-cols-1 md:grid-cols-2 gap-[clamp(1.5rem,3vw,2.5rem)]">
        {editorialCollections.map((c) => (
          <Link key={c.slug} href={`/shop/${c.slug}`} className="group relative block aspect-[3/2] overflow-hidden bg-[var(--color-stone)]">
            <img loading="lazy" src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxury)] group-hover:scale-105" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,12,11,0.05),rgba(13,12,11,0.72))]" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-[var(--color-ivory)]">
              <span className="text-[0.6rem] tracking-[0.2em] uppercase text-[var(--color-champagne-light)]">{countFor(c.slug) ?? c.count} pieces</span>
              <h2 className="text-[var(--color-white)] text-3xl mt-1.5">{c.name}</h2>
              <p className="text-[var(--color-white)]/85 text-sm mt-1.5 font-light">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
