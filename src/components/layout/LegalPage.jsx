export default function LegalPage({ title, updated, children }) {
  return (
    <div className="max-w-[760px] mx-auto px-[clamp(1.5rem,5vw,4rem)] pt-12 pb-24">
      <span className="block text-[var(--color-champagne-dark)] text-[0.66rem] tracking-[0.26em] uppercase mb-3">Firman Furniture</span>
      <h1 className="text-[clamp(2rem,4vw,3rem)]" style={{ animation: 'fade-up 0.7s var(--ease-luxury) both' }}>{title}</h1>
      <p className="text-[0.78rem] text-[var(--color-warm-gray)] mt-2">Last updated: {updated}</p>
      <div className="mt-8 flex flex-col gap-5 text-[0.92rem] leading-relaxed text-[var(--color-charcoal)] [&_h2]:font-serif [&_h2]:text-xl [&_h2]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5">
        {children}
      </div>
    </div>
  )
}
