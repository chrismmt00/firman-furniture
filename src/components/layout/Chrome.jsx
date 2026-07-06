'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import GlobalOverlays from '@/components/overlays/GlobalOverlays'
import CursorFX from '@/components/layout/CursorFX'

/* Renders the storefront chrome (header/footer/cursor) everywhere except the
   admin portal, which provides its own full-screen layout. Global overlays
   (cart, search, auth, confirm…) stay mounted on every route. */
export default function Chrome({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return (
      <>
        {children}
        <GlobalOverlays />
      </>
    )
  }

  return (
    <>
      <CursorFX />
      <Header />
      <main>{children}</main>
      <Footer />
      <GlobalOverlays />
    </>
  )
}
