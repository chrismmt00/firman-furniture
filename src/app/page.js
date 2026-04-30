import Image from 'next/image'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import StickyScrollSection, { FadeIn, StaggeredItem } from '@/components/ui/StickyScrollSection'

const collections = [
  {
    title: 'Living Room',
    href: '/shop/living-room',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
    description: 'Sofas, lounge chairs, consoles, and tables shaped for slow evenings.',
  },
  {
    title: 'Dining',
    href: '/shop/dining',
    image:
      'https://images.unsplash.com/photo-1617104551722-3b2d51366400?auto=format&fit=crop&w=1200&q=85',
    description: 'Tables, seating, and storage with a composed entertaining point of view.',
  },
  {
    title: 'Bedroom',
    href: '/shop/bedroom',
    image:
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85',
    description: 'Quiet silhouettes, layered textures, and made-to-rest proportions.',
  },
]

const products = [
  {
    name: 'Milano Sectional Sofa',
    category: 'Living Room',
    price: '$9,800',
    href: '/product/milano-sectional-sofa',
    badge: 'New',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Como Travertine Table',
    category: 'Dining',
    price: '$4,250',
    href: '/product/como-travertine-table',
    badge: 'Featured',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Aurelia Lounge Chair',
    category: 'Seating',
    price: '$2,900',
    href: '/product/aurelia-lounge-chair',
    badge: 'In Stock',
    image:
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Vesper Oak Cabinet',
    category: 'Storage',
    price: '$5,600',
    href: '/product/vesper-oak-cabinet',
    badge: 'Limited',
    image:
      'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=900&q=85',
  },
]

const lookbook = [
  {
    label: 'Soft Minimalism',
    image:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85',
  },
  {
    label: 'Collected Warmth',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85',
  },
  {
    label: 'Gallery Dining',
    image:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85',
  },
]

const services = [
  ['White-glove delivery', 'Placement, assembly, and packaging removal for qualifying orders.'],
  ['Made-to-order options', 'Select finishes, fabrics, dimensions, and trade specifications.'],
  ['Design support', 'Private consultations for rooms, residences, and hospitality spaces.'],
]

function SectionHeader({ kicker, title, copy, align = 'left', titleClass = '' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <span className="label text-[var(--color-champagne)] block mb-4">{kicker}</span>
      <h2 className={`text-[var(--color-black)] ${titleClass}`}>{title}</h2>
      {copy && (
        <p className="mt-5 text-sm sm:text-base font-sans font-light text-[var(--color-mid-gray)]">
          {copy}
        </p>
      )}
    </div>
  )
}

function ImagePanel({ src, alt, className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-[var(--color-stone)] ${className}`}>
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      {/* ── 1. Hero — visible on load, no FadeIn ─────────────── */}
      <StickyScrollSection bgColor="#0D0C0B" height="140vh" showProgress={false}>
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=2200&q=90"
            alt="Elegant living room furnished with a low sofa, lounge chairs, and warm natural light"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,12,11,0.88)_0%,rgba(13,12,11,0.55)_55%,rgba(13,12,11,0.20)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-screen-xl items-center min-h-[80vh] px-6 py-24 lg:min-h-0 lg:py-0">
          <div className="max-w-2xl">
            <span className="label text-[var(--color-champagne-light)] block mb-6">
              Spring Collection 2026
            </span>
            <h1
              className="text-white"
              style={{ fontSize: 'clamp(2.75rem, 8vw, 8.5rem)', lineHeight: 0.95 }}
            >
              Firman
              <br />
              <em>Furniture</em>
            </h1>
            <p className="mt-7 max-w-xl text-base sm:text-lg font-sans font-light leading-relaxed text-white/95">
              Luxury furniture for rooms that feel composed, generous, and quietly unmistakable.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/shop" variant="white" size="lg">
                Shop Collection
              </Button>
              <Button href="/lookbook" variant="outline_champagne" size="lg">
                View Lookbook
              </Button>
            </div>
          </div>
        </div>
      </StickyScrollSection>

      {/* ── 2. Curated Rooms ─────────────────────────────────── */}
      <StickyScrollSection bgColor="#F8F6F2" height="200vh">
        <div className="mx-auto grid w-full max-w-screen-xl gap-10 px-6 py-20 lg:py-0 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <FadeIn delay={0}>
            <SectionHeader
              kicker="Curated Rooms"
              title="Start with the room you are shaping."
              copy="Explore considered edits for living, dining, and bedroom spaces, each assembled around proportion, texture, and daily ritual."
            />
          </FadeIn>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {collections.map((collection, i) => (
              <StaggeredItem key={collection.title} index={i} baseDelay={0.15}>
                <Link href={collection.href} className="group block">
                  <ImagePanel
                    src={collection.image}
                    alt={`${collection.title} furniture collection`}
                    className="aspect-[4/5]"
                  />
                  <div className="pt-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-2xl">{collection.title}</h3>
                      <span
                        className="text-[var(--color-champagne)] transition-transform duration-[var(--duration-base)] group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-sans font-light text-[var(--color-mid-gray)]">
                      {collection.description}
                    </p>
                  </div>
                </Link>
              </StaggeredItem>
            ))}
          </div>
        </div>
      </StickyScrollSection>

      {/* ── 3. New Arrivals ──────────────────────────────────── */}
      <StickyScrollSection bgColor="#FFFFFF" height="220vh">
        <div className="mx-auto w-full max-w-screen-xl px-6 py-20 lg:py-0">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <FadeIn delay={0}>
              <SectionHeader
                kicker="New Arrivals"
                title="Pieces with presence, ready for the next chapter."
                copy="A first edit of statement seating, stone surfaces, and storage with a refined material language."
              />
            </FadeIn>
            <FadeIn delay={0.1}>
              <Button href="/collections/new-arrivals" variant="secondary">
                View All
              </Button>
            </FadeIn>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, i) => (
              <StaggeredItem key={product.name} index={i} baseDelay={0.15}>
                <Link href={product.href} className="group block">
                  <div className="relative">
                    <ImagePanel src={product.image} alt={product.name} className="aspect-[4/5]" />
                    <Badge variant="champagne" className="absolute left-4 top-4">
                      {product.badge}
                    </Badge>
                  </div>
                  <div className="pt-5">
                    <p className="label text-[var(--color-warm-gray)]">{product.category}</p>
                    <h3 className="mt-2 text-2xl transition-colors duration-[var(--duration-fast)] group-hover:text-[var(--color-champagne-dark)]">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm font-sans font-light text-[var(--color-charcoal)]">
                      {product.price}
                    </p>
                  </div>
                </Link>
              </StaggeredItem>
            ))}
          </div>
        </div>
      </StickyScrollSection>

      {/* ── 4. Firman Standard ───────────────────────────────── */}
      <StickyScrollSection bgColor="#0D0C0B" height="200vh">
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 lg:grid-cols-2">
          <FadeIn direction="left" delay={0}>
            <ImagePanel
              src="https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?auto=format&fit=crop&w=1400&q=85"
              alt="Close view of a refined interior with sculptural seating and layered materials"
              className="min-h-[360px] sm:min-h-[420px] lg:min-h-[640px]"
            />
          </FadeIn>
          <div className="flex items-center px-6 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-12">
            <div className="max-w-xl">
              <FadeIn delay={0.1}>
                <span className="label text-[var(--color-champagne)] block mb-5">The Firman Standard</span>
              </FadeIn>
              <FadeIn delay={0.15}>
                <h2 className="text-white">Furniture selected for scale, texture, and longevity.</h2>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="mt-6 font-sans font-light leading-relaxed text-white/90">
                  Every piece is chosen to hold a room without overwhelming it. Rich woods, tactile upholstery,
                  stone, metal, and softened silhouettes create interiors that feel established from the first day.
                </p>
              </FadeIn>
              <div className="mt-9 grid gap-5 sm:grid-cols-3">
                {['Premium materials', 'Trade pricing', 'White-glove care'].map((item, i) => (
                  <StaggeredItem key={item} index={i} baseDelay={0.3}>
                    <div className="border-t border-[var(--color-warm-gray)]/30 pt-4">
                      <p className="label text-[var(--color-champagne-light)]">{item}</p>
                    </div>
                  </StaggeredItem>
                ))}
              </div>
              <FadeIn delay={0.5}>
                <Button href="/about" variant="champagne" className="mt-10">
                  Our Story
                </Button>
              </FadeIn>
            </div>
          </div>
        </div>
      </StickyScrollSection>

      {/* ── 5. Lookbook ──────────────────────────────────────── */}
      <StickyScrollSection bgColor="#F8F6F2" height="200vh">
        <div className="mx-auto w-full max-w-screen-xl px-6 py-20 lg:py-0">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <FadeIn delay={0}>
              <SectionHeader
                kicker="Lookbook"
                title="Rooms with a complete point of view."
                copy="Use the lookbook to study scale, palette, and placement before building your own collection."
              />
            </FadeIn>
            <FadeIn delay={0.1}>
              <Button href="/lookbook" variant="secondary">
                Explore Rooms
              </Button>
            </FadeIn>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {lookbook.map((item, i) => (
              <StaggeredItem key={item.label} index={i} baseDelay={0.15}>
                <Link
                  href="/lookbook"
                  className={i === 1 ? 'group md:mt-12 block' : 'group block'}
                >
                  <ImagePanel src={item.image} alt={`${item.label} room inspiration`} className="aspect-[3/4]" />
                  <p className="label mt-4 text-[var(--color-charcoal)]">{item.label}</p>
                </Link>
              </StaggeredItem>
            ))}
          </div>
        </div>
      </StickyScrollSection>

      {/* ── 6. Client Services ───────────────────────────────── */}
      <StickyScrollSection bgColor="#FFFFFF" height="180vh">
        <div className="mx-auto grid w-full max-w-screen-xl gap-10 px-6 py-20 lg:py-0 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <FadeIn delay={0}>
            <SectionHeader
              kicker="Client Services"
              title="A calmer way to furnish a considered home."
              copy="From samples and custom specifications to delivery coordination, the experience is designed to feel as polished as the pieces themselves."
            />
          </FadeIn>
          <div className="grid gap-6 md:grid-cols-3">
            {services.map(([title, copy], i) => (
              <StaggeredItem key={title} index={i} baseDelay={0.2}>
                <div className="border-t border-[var(--color-stone)] pt-6">
                  <h3 className="text-2xl">{title}</h3>
                  <p className="mt-3 text-sm font-sans font-light text-[var(--color-mid-gray)]">{copy}</p>
                </div>
              </StaggeredItem>
            ))}
          </div>
        </div>
      </StickyScrollSection>

      {/* ── 7. Trade Program ─────────────────────────────────── */}
      <StickyScrollSection bgColor="#0D0C0B" height="160vh" showProgress={false}>
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1800&q=85"
            alt="Warm contemporary interior prepared for design consultation"
            fill
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-[rgba(13,12,11,0.78)]" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center min-h-[60vh] px-6 py-20 text-center lg:min-h-0 lg:py-0">
          <FadeIn delay={0}>
            <span className="label text-[var(--color-champagne-light)] block mb-5">Trade Program</span>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="text-white">Designed for interior designers, architects, and studios.</h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mx-auto mt-6 max-w-2xl font-sans font-light leading-relaxed text-white/95">
              Apply for trade access to preferred pricing, project support, custom requests, and early collection previews.
            </p>
          </FadeIn>
          <FadeIn delay={0.25}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/trade-program" variant="champagne" size="lg">
                Apply Now
              </Button>
              <Button href="/contact" variant="white" size="lg">
                Book Consultation
              </Button>
            </div>
          </FadeIn>
        </div>
      </StickyScrollSection>
    </>
  )
}
