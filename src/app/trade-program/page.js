import DemoForm from '@/components/shop/DemoForm'

export const metadata = {
  title: 'Trade Program',
  description: 'Preferred pricing and project support for interior designers, architects, and studios.',
}

const input =
  'p-4 bg-[var(--color-white)] border border-[var(--color-stone)] outline-none text-sm font-light focus:border-[var(--color-charcoal)]'

export default function TradePage() {
  return (
    <div className="max-w-[1080px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(3rem,6vw,5rem)] pb-24">
      <span className="block text-[var(--color-champagne-dark)] text-[0.66rem] tracking-[0.28em] uppercase mb-4" style={{ animation: 'fade-up 0.8s var(--ease-luxury) both' }}>Trade Program</span>
      <h1 className="text-[clamp(2.4rem,5vw,4rem)] max-w-[680px]" style={{ animation: 'fade-up 0.9s var(--ease-luxury) 0.05s both' }}>Preferred pricing and project support for the trade.</h1>
      <p className="text-[var(--color-mid-gray)] max-w-[560px] mt-5 font-light">
        Interior designers, architects, and studios receive dedicated service, trade pricing, and early access. Tell us about your practice.
      </p>

      <DemoForm message="Application received — our trade team will follow up within two business days." className="mt-10 max-w-[680px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input required placeholder="Business name" className={input} />
          <input required placeholder="Your name" className={input} />
          <input required type="email" placeholder="Email" className={input} />
          <input placeholder="Website / portfolio" className={input} />
          <textarea placeholder="Tell us about your practice" className={`${input} sm:col-span-2 min-h-[120px] resize-y`} />
        </div>
        <button type="submit" className="mt-6 px-10 py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[var(--color-champagne-dark)] transition-colors">
          Submit Application
        </button>
      </DemoForm>
    </div>
  )
}
