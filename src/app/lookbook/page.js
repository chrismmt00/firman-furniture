import Link from 'next/link'
import { lookbookImages } from '@/lib/demo-data'

export const metadata = {
  title: 'Lookbook',
  description: 'Rooms that read as composed, not decorated — study scale, palette, and placement.',
}

export default function LookbookPage() {
  return (
    <div>
      <section className="relative min-h-[60vh] flex items-end overflow-hidden bg-[var(--color-black)]">
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=88"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          style={{ animation: 'kenburns 20s var(--ease-luxury) forwards alternate infinite' }}
        />
        <div className="relative z-10 px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,5rem)]">
          <span className="block text-[var(--color-champagne-light)] text-[0.66rem] tracking-[0.28em] uppercase mb-4">Lookbook 2026</span>
          <h1 className="text-[var(--color-white)] text-[clamp(2.6rem,7vw,6rem)] max-w-[760px]">Rooms that read as composed, not decorated.</h1>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(3rem,6vw,5rem)] [column-width:280px] [column-gap:1.4rem]">
        {lookbookImages.map((l, i) => (
          <Link
            key={i}
            href={`/shop/${l.cat}`}
            className="group relative block w-full mb-5 break-inside-avoid overflow-hidden bg-[var(--color-stone)]"
          >
            <img loading="lazy" src={l.image} alt={l.label} className="w-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-luxury)] group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 p-5 bg-[linear-gradient(transparent,rgba(13,12,11,0.6))]">
              <p className="text-[var(--color-ivory)] text-[0.66rem] tracking-[0.2em] uppercase">{l.label} →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
