import DemoForm from '@/components/shop/DemoForm'

export const metadata = {
  title: 'Contact',
  description: "We'd love to help — reach the Firman team or visit our New York showroom.",
}

const input =
  'p-4 bg-[var(--color-white)] border border-[var(--color-stone)] outline-none text-sm font-light focus:border-[var(--color-charcoal)]'

export default function ContactPage() {
  return (
    <div className="max-w-[1080px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(3rem,6vw,5rem)] pb-24">
      <span className="block text-[var(--color-champagne-dark)] text-[0.66rem] tracking-[0.28em] uppercase mb-4">Contact</span>
      <h1 className="text-[clamp(2.4rem,5vw,4rem)]">We&apos;d love to help.</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
        <DemoForm message="Message sent — we'll reply within one business day." className="grid grid-cols-1 gap-4">
          <input required placeholder="Name" className={input} />
          <input required type="email" placeholder="Email" className={input} />
          <textarea required placeholder="How can we help?" className={`${input} min-h-[140px] resize-y`} />
          <button type="submit" className="justify-self-start px-10 py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[var(--color-champagne-dark)] transition-colors">
            Send Message
          </button>
        </DemoForm>

        <div>
          <p className="text-[0.62rem] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">Showroom</p>
          <p className="font-serif text-2xl mt-2">412 Greene Street<br />New York, NY 10012</p>
          <p className="text-[var(--color-mid-gray)] mt-5 text-sm">Mon–Sat · 10am–6pm<br />By appointment Sunday</p>
          <p className="text-[var(--color-mid-gray)] mt-5 text-sm">hello@firman.com<br />+1 (212) 555-0142</p>
        </div>
      </div>
    </div>
  )
}
