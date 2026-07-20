import { NextResponse } from 'next/server'
import { SESSION_COOKIE } from './lib/auth-constants'

// Proxy (Next 16's renamed Middleware). Optimistic auth only — it redirects requests
// with no session cookie away from protected areas so unauthenticated users don't render
// those pages. The authoritative checks live in the account layout and admin page
// (a present-but-invalid cookie is caught there). Per the Next docs, proxy must not be
// used as the real authorization layer.
export function proxy(request) {
  if (request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = '/login'
  url.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
}
