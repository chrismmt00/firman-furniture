export const metadata = {
  title: 'Our Story',
  description: 'Furniture made to be inherited — chosen for how it wears and only deepens from there.',
}

export default function AboutPage() {
  return (
    <div>
      <section className="relative min-h-[56vh] flex items-center overflow-hidden bg-[var(--color-black)]">
        <img
          src="https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?auto=format&fit=crop&w=2000&q=88"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 max-w-[1080px] mx-auto px-[clamp(1.5rem,5vw,4rem)] w-full">
          <span className="block text-[var(--color-champagne-light)] text-[0.66rem] tracking-[0.28em] uppercase mb-4">Our Story</span>
          <h1 className="text-[var(--color-white)] text-[clamp(2.6rem,6vw,5rem)] max-w-[680px]">Furniture made to be inherited.</h1>
        </div>
      </section>

      <div className="max-w-[760px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(3rem,6vw,5rem)] pb-24">
        <p className="font-serif text-[clamp(1.4rem,2.5vw,1.9rem)] leading-snug text-[var(--color-charcoal)] font-light">
          Firman began with a simple conviction: that the pieces we live with should age into something more beautiful, not less.
        </p>
        <p className="text-[var(--color-mid-gray)] mt-6 leading-relaxed font-light">
          We work with a small circle of makers across Europe and North America, choosing materials for how they wear — full-grain leathers that patina, solid woods that warm, stone that carries the marks of its quarry. Every piece is selected to hold a room without overwhelming it.
        </p>
        <p className="text-[var(--color-mid-gray)] mt-5 leading-relaxed font-light">
          The result is furniture that feels established from the first day, and only deepens from there.
        </p>
      </div>
    </div>
  )
}
