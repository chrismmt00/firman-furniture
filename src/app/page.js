import Link from 'next/link'
import ProductCard from '@/components/shop/ProductCard'
import DemoForm from '@/components/shop/DemoForm'
import { getFeaturedProducts } from '@/lib/products'

/* Scroll-driven reveal that matches the comp (view() timeline where supported,
   plays once on load otherwise). */
const reveal = (range = 'entry 0% cover 28%', dur = '1.2s') => ({
  animation: `reveal-up ${dur} var(--ease-luxury) both`,
  animationTimeline: 'view()',
  animationRange: range,
})

const rooms = [
  { title: 'Living Room', cat: 'living-room', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Dining', cat: 'dining-room', image: 'https://images.unsplash.com/photo-1617104551722-3b2d51366400?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Bedroom', cat: 'bedroom', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85' },
]

const looks = [
  { label: 'Soft Minimalism', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85' },
  { label: 'Collected Warmth', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85' },
  { label: 'Gallery Dining', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85' },
  { label: 'Made to Rest', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1000&q=85' },
]

export default async function HomePage() {
  const arrivals = await getFeaturedProducts(4)

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[var(--color-black)]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=2200&q=90"
            alt="Composed living room"
            className="w-full h-full object-cover"
            style={{ animation: 'kenburns 18s var(--ease-luxury) forwards alternate infinite' }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,12,11,0.9)_0%,rgba(13,12,11,0.5)_55%,rgba(13,12,11,0.15)_100%)]" />
        </div>
        <div className="relative z-[2] max-w-[1380px] mx-auto px-[clamp(1.5rem,5vw,4rem)] w-full">
          <div className="max-w-[620px]">
            <span className="block text-[var(--color-champagne-light)] text-[0.7rem] tracking-[0.34em] uppercase mb-[1.6rem]" style={{ animation: 'fade-up 1s var(--ease-luxury) both' }}>Spring Collection 2026</span>
            <h1 className="text-white" style={{ fontSize: 'clamp(3rem,8.5vw,8rem)', lineHeight: 0.92, animation: 'fade-up 1.1s var(--ease-luxury) 0.08s both' }}>
              Quiet<br /><em className="italic text-[var(--color-champagne-light)]">luxury</em>,<br />at home.
            </h1>
            <p className="text-white/90 font-light text-[1.05rem] max-w-[430px] mt-[1.9rem]" style={{ animation: 'fade-up 1.1s var(--ease-luxury) 0.18s both' }}>
              Furniture for rooms that feel composed, generous, and quietly unmistakable.
            </p>
            <div className="flex gap-4 mt-[2.4rem] flex-wrap" style={{ animation: 'fade-up 1.1s var(--ease-luxury) 0.28s both' }}>
              <Link href="/shop" className="px-[2.4rem] py-[1.05rem] bg-[var(--color-ivory)] text-[var(--color-black)] text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[var(--color-champagne)] transition-colors duration-[450ms]" style={{ transitionTimingFunction: 'var(--ease-luxury)' }}>Shop Collection</Link>
              <Link href="/lookbook" className="px-[2.4rem] py-[1.05rem] bg-transparent text-[var(--color-ivory)] border border-white/45 text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:border-[var(--color-champagne-light)] hover:text-[var(--color-champagne-light)] transition-colors duration-[450ms]">View Lookbook</Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] text-white/60 text-[0.6rem] tracking-[0.3em] uppercase" style={{ animation: 'fade-in 2s 1s both' }}>Scroll</div>
      </section>

      {/* Marquee values */}
      <section className="bg-[var(--color-ivory)] border-b border-[var(--color-stone)] py-[1.6rem] overflow-hidden">
        <div className="flex gap-16 whitespace-nowrap font-serif italic text-2xl text-[var(--color-mid-gray)] pl-16" style={{ animation: 'marquee 40s linear infinite' }}>
          {Array.from({ length: 2 }).flatMap((_, k) => (
            ['Considered proportion', 'Honest materials', 'Made to last generations', 'White-glove care'].map((t, i) => (
              <span key={`${k}-${i}`} className="flex items-center gap-16"><span>{t}</span><span className="text-[var(--color-champagne)]">·</span></span>
            ))
          ))}
        </div>
      </section>

      {/* Curated rooms */}
      <section className="max-w-[1380px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(5rem,9vw,8rem)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_repeat(3,minmax(0,0.85fr))] gap-[clamp(2rem,4vw,3.5rem)] items-end">
          <div style={reveal()}>
            <span className="block text-[var(--color-champagne-dark)] text-[0.68rem] tracking-[0.28em] uppercase mb-[1.1rem]">Curated Rooms</span>
            <h2 className="text-[clamp(2.2rem,4vw,3.6rem)]">Start with the<br />room you&apos;re shaping.</h2>
            <p className="text-[var(--color-mid-gray)] font-light mt-[1.4rem] max-w-[340px]">Considered edits for living, dining, and bedroom — assembled around proportion, texture, and daily ritual.</p>
            <Link href="/shop" className="mt-[1.8rem] inline-flex items-center gap-2.5 text-[0.68rem] tracking-[0.22em] uppercase font-medium text-[var(--color-black)] border-b border-[var(--color-champagne)] pb-1">Shop all rooms →</Link>
          </div>
          {rooms.map((r) => (
            <Link key={r.cat} href={`/shop/${r.cat}`} className="group block text-left" style={reveal('entry 0% cover 32%')}>
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-stone)]">
                <img loading="lazy" src={r.image} alt={r.title} className="w-full h-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-luxury)] group-hover:scale-105" />
              </div>
              <div className="flex items-center justify-between mt-4">
                <h3 className="text-2xl">{r.title}</h3>
                <span className="text-[var(--color-champagne-dark)]">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="bg-[var(--color-white)] py-[clamp(5rem,9vw,8rem)]">
        <div className="max-w-[1380px] mx-auto px-[clamp(1.5rem,5vw,4rem)]">
          <div className="flex items-end justify-between gap-8 flex-wrap mb-12">
            <div style={reveal('entry 0% cover 30%', '1s')}>
              <span className="block text-[var(--color-champagne-dark)] text-[0.68rem] tracking-[0.28em] uppercase mb-[1.1rem]">New Arrivals</span>
              <h2 className="text-[clamp(2rem,3.6vw,3.2rem)]">Pieces with presence.</h2>
            </div>
            <Link href="/shop" className="text-[0.68rem] tracking-[0.22em] uppercase font-medium text-[var(--color-black)] border-b border-[var(--color-champagne)] pb-1">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(1.2rem,2.5vw,2rem)]">
            {arrivals.map((p) => (
              <div key={p.id} style={reveal('entry 0% cover 22%', '1s')}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Firman standard */}
      <section className="bg-[var(--color-black)] text-[var(--color-ivory)]">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[560px] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?auto=format&fit=crop&w=1400&q=85" alt="Refined interior" className="w-full h-full object-cover absolute inset-0" />
          </div>
          <div className="flex items-center px-[clamp(3rem,7vw,6rem)] py-16">
            <div className="max-w-[480px]">
              <span className="block text-[var(--color-champagne-light)] text-[0.68rem] tracking-[0.28em] uppercase mb-[1.4rem]">The Firman Standard</span>
              <h2 className="text-white text-[clamp(2rem,3.4vw,3rem)]">Selected for scale, texture, and longevity.</h2>
              <p className="text-white/85 mt-6 font-light">Every piece is chosen to hold a room without overwhelming it. Rich woods, tactile upholstery, stone, and softened silhouettes create interiors that feel established from the first day.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-[1.4rem] mt-[2.4rem]">
                {['Premium materials', 'Trade pricing', 'White-glove care'].map((t) => (
                  <div key={t} className="border-t border-white/20 pt-[0.9rem] text-[var(--color-champagne-light)] text-[0.66rem] tracking-[0.18em] uppercase">{t}</div>
                ))}
              </div>
              <Link href="/about" className="mt-[2.4rem] inline-block px-[2.2rem] py-4 bg-[var(--color-champagne)] text-[var(--color-black)] text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[var(--color-champagne-light)] transition-colors">Our Story</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lookbook strip */}
      <section className="max-w-[1380px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(5rem,9vw,8rem)]">
        <div className="text-center mb-12" style={reveal('entry 0% cover 30%', '1s')}>
          <span className="block text-[var(--color-champagne-dark)] text-[0.68rem] tracking-[0.28em] uppercase mb-[1.1rem]">Lookbook</span>
          <h2 className="text-[clamp(2rem,3.6vw,3.2rem)]">Rooms with a complete point of view.</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1.4rem]">
          {looks.map((l) => (
            <Link key={l.label} href="/lookbook" className="group block text-left" style={reveal('entry 0% cover 26%', '1.1s')}>
              <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-stone)]">
                <img loading="lazy" src={l.image} alt={l.label} className="w-full h-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-luxury)] group-hover:scale-105" />
              </div>
              <p className="text-[0.66rem] tracking-[0.22em] uppercase text-[var(--color-charcoal)] mt-[0.9rem]">{l.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trade CTA */}
      <section className="relative overflow-hidden bg-[var(--color-black)]">
        <img src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1800&q=85" alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.22]" />
        <div className="relative z-[2] max-w-[760px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(5rem,10vw,8rem)] text-center">
          <span className="block text-[var(--color-champagne-light)] text-[0.68rem] tracking-[0.28em] uppercase mb-[1.4rem]">Trade Program</span>
          <h2 className="text-white text-[clamp(2rem,4vw,3.4rem)]">For designers, architects, and studios.</h2>
          <p className="text-white/85 mt-6 max-w-[520px] mx-auto font-light">Apply for trade access to preferred pricing, project support, custom requests, and early collection previews.</p>
          <div className="flex gap-4 justify-center flex-wrap mt-[2.4rem]">
            <Link href="/trade-program" className="px-[2.4rem] py-[1.05rem] bg-[var(--color-champagne)] text-[var(--color-black)] text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[var(--color-champagne-light)] transition-colors">Apply Now</Link>
            <Link href="/contact" className="px-[2.4rem] py-[1.05rem] bg-transparent border border-white/40 text-[var(--color-ivory)] text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:border-[var(--color-champagne-light)] hover:text-[var(--color-champagne-light)] transition-colors">Book Consultation</Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[var(--color-champagne-pale)] px-[clamp(1.5rem,5vw,4rem)] py-[clamp(4rem,8vw,6rem)]">
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="text-[clamp(1.8rem,3vw,2.6rem)]">Join the Firman list.</h2>
          <p className="text-[var(--color-mid-gray)] mt-4 font-light">Early access to new collections, private sales, and design notes.</p>
          <DemoForm message="You're on the list — welcome to Firman." className="flex gap-2.5 max-w-[440px] mx-auto mt-[1.8rem] flex-wrap">
            <input type="email" required placeholder="Email address" className="flex-1 min-w-[200px] px-[1.1rem] py-4 bg-[var(--color-white)] border border-[var(--color-stone)] text-[0.85rem] font-light outline-none" />
            <button type="submit" className="px-[1.8rem] py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.2em] uppercase font-medium hover:bg-[var(--color-champagne-dark)] transition-colors">Subscribe</button>
          </DemoForm>
        </div>
      </section>
    </div>
  )
}
