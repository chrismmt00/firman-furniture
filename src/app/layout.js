import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import ToastProvider from '@/components/ui/ToastProvider'
import StoreProvider from '@/components/providers/StoreProvider'
import Chrome from '@/components/layout/Chrome'
import { getAllProducts } from '@/lib/products'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://firmanfurniture.com'),
  title: {
    default: 'Firman Furniture — Luxury Furniture',
    template: '%s — Firman Furniture',
  },
  description:
    'Discover exquisite luxury furniture crafted for the discerning home. Timeless pieces, uncompromising quality.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Firman Furniture',
  },
  robots: { index: true, follow: true },
}

export default async function RootLayout({ children }) {
  // Lightweight product index for the global search overlay.
  let searchIndex = []
  try {
    const products = await getAllProducts()
    searchIndex = products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      price: p.price,
      priceFmt: p.priceFmt,
      image: p.image,
    }))
  } catch {
    // DB unavailable at build/render time — search simply has no index.
  }

  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <ToastProvider>
          <StoreProvider searchIndex={searchIndex}>
            <Chrome>{children}</Chrome>
          </StoreProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
