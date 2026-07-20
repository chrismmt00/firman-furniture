import Link from 'next/link'

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="max-w-[440px] mx-auto px-6 pt-16 pb-24">
      <Link href="/" className="block text-center font-serif text-3xl text-[var(--color-black)]">
        FIRMAN
      </Link>
      <h1 className="text-center text-2xl mt-8 mb-1.5">{title}</h1>
      <p className="text-center text-[0.85rem] text-[var(--color-mid-gray)] mb-8">{subtitle}</p>
      {children}
    </div>
  )
}
