'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/components/providers/StoreProvider'
import { useToast } from '@/components/ui/ToastProvider'
import { formatCents } from '@/lib/format'

/* Shared overlay scaffolding ------------------------------------------------ */
function Backdrop({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="absolute inset-0 bg-[var(--color-black)]/50"
      style={{ animation: 'fade-in 0.35s var(--ease-out) both' }}
      aria-hidden="true"
    />
  )
}

function useEscape(active, onClose) {
  useEffect(() => {
    if (!active) return
    const h = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', h)
    document.body.classList.add('overflow-locked')
    return () => {
      document.removeEventListener('keydown', h)
      document.body.classList.remove('overflow-locked')
    }
  }, [active, onClose])
}

/* ── Cart drawer ───────────────────────────────────────────────────── */
function CartDrawer() {
  const { cartOpen, closeCart, cart, cartCount, cartSubtotal, cartInc, cartDec, cartRemove } = useStore()
  const router = useRouter()
  useEscape(cartOpen, closeCart)
  if (!cartOpen) return null

  const go = (path) => { closeCart(); router.push(path) }

  return (
    <div className="fixed inset-0 z-[600]">
      <Backdrop onClick={closeCart} />
      <aside
        className="absolute top-0 right-0 h-full w-[min(440px,100%)] bg-[var(--color-ivory)] flex flex-col shadow-[-20px_0_60px_rgba(13,12,11,0.18)]"
        style={{ animation: 'slide-in-right 0.45s var(--ease-out) both' }}
        role="dialog"
        aria-label="Shopping bag"
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-stone)]">
          <span className="text-[0.7rem] tracking-[0.24em] uppercase font-medium">Your Bag ({cartCount})</span>
          <button onClick={closeCart} className="text-xl leading-none text-[var(--color-mid-gray)] hover:text-[var(--color-black)]" aria-label="Close">✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
            <p className="font-serif text-2xl text-[var(--color-charcoal)]">Your bag is empty</p>
            <p className="text-[var(--color-mid-gray)] text-sm">Discover pieces made to be lived with.</p>
            <button onClick={() => go('/shop')} className="px-8 py-3.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.2em] uppercase hover:bg-[var(--color-champagne-dark)] transition-colors">Shop now</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cart.map((c, idx) => (
                <div key={`${c.id}-${c.variant}`} className="grid grid-cols-[84px_1fr_auto] gap-4">
                  <div className="aspect-[4/5] overflow-hidden bg-[var(--color-stone)]">
                    <img loading="lazy" src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">{c.category}</p>
                    <h4 className="font-serif text-lg mt-0.5">{c.name}</h4>
                    <p className="text-[0.72rem] text-[var(--color-mid-gray)] mt-0.5">{c.variant}</p>
                    <div className="inline-flex items-center border border-[var(--color-stone)] mt-2.5">
                      <button onClick={() => cartDec(idx)} className="w-7 h-7 text-[var(--color-mid-gray)] hover:text-[var(--color-black)]" aria-label="Decrease">−</button>
                      <span className="w-[30px] text-center text-sm">{c.qty}</span>
                      <button onClick={() => cartInc(idx)} className="w-7 h-7 text-[var(--color-mid-gray)] hover:text-[var(--color-black)]" aria-label="Increase">+</button>
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-between">
                    <span className="text-sm">{formatCents(c.price * c.qty)}</span>
                    <button onClick={() => cartRemove(idx)} className="text-[0.62rem] tracking-[0.14em] uppercase text-[var(--color-warm-gray)] hover:text-[var(--color-error)]">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--color-stone)] p-6">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-[var(--color-mid-gray)]">Subtotal</span>
                <span className="font-medium">{formatCents(cartSubtotal)}</span>
              </div>
              <p className="text-[0.72rem] text-[var(--color-warm-gray)] mb-4">Shipping &amp; taxes calculated at checkout.</p>
              <button onClick={() => go('/checkout')} className="w-full py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[var(--color-champagne-dark)] transition-colors">Checkout</button>
              <button onClick={() => go('/cart')} className="w-full py-3 mt-2 text-[0.64rem] tracking-[0.18em] uppercase text-[var(--color-mid-gray)] hover:text-[var(--color-black)]">View full bag</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

/* ── Search ───────────────────────────────────────────────────────── */
function SearchOverlay() {
  const { searchOpen, closeSearch, searchIndex } = useStore()
  const router = useRouter()
  const [q, setQ] = useState('')
  useEscape(searchOpen, closeSearch)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (!searchOpen) setQ('') }, [searchOpen])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return searchIndex.slice(0, 8)
    return searchIndex
      .filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(term))
      .slice(0, 12)
  }, [q, searchIndex])

  if (!searchOpen) return null
  const go = (slug) => { closeSearch(); router.push(`/product/${slug}`) }

  return (
    <div className="fixed inset-0 z-[600]">
      <div onClick={closeSearch} className="absolute inset-0 bg-[var(--color-black)]/50" style={{ animation: 'fade-in 0.35s var(--ease-out) both' }} aria-hidden="true" />
      <div
        className="absolute top-0 left-0 right-0 bg-[var(--color-ivory)] p-[clamp(1.5rem,4vw,3rem)]"
        style={{ animation: 'scale-in 0.4s var(--ease-out) both' }}
        role="dialog"
        aria-label="Search"
      >
        <div className="max-w-[760px] mx-auto">
          <div className="flex items-center gap-4 border-b border-[var(--color-charcoal)] pb-4">
            <span className="text-[var(--color-warm-gray)]">⌕</span>
            <input
              autoFocus
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search furniture, materials, rooms…"
              className="flex-1 bg-transparent outline-none font-serif text-[clamp(1.4rem,3vw,2.2rem)] font-light"
            />
            <button onClick={closeSearch} className="text-[0.66rem] tracking-[0.18em] uppercase text-[var(--color-mid-gray)]">Esc</button>
          </div>
          <div className="mt-6">
            <p className="text-[0.62rem] tracking-[0.24em] uppercase text-[var(--color-warm-gray)] mb-4">
              {q.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Popular this season'}
            </p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-5">
              {results.map((p) => (
                <button key={p.id} onClick={() => go(p.slug)} className="block text-left group">
                  <div className="aspect-square overflow-hidden bg-[var(--color-stone)]">
                    <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <h4 className="font-serif text-base mt-2.5">{p.name}</h4>
                  <p className="text-[0.78rem] text-[var(--color-mid-gray)]">{p.priceFmt}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Auth ─────────────────────────────────────────────────────────── */
function AuthModal() {
  const { authOpen, closeAuth, authMode, setAuthMode } = useStore()
  const toast = useToast()
  useEscape(authOpen, closeAuth)
  if (!authOpen) return null

  const isRegister = authMode === 'register'
  const submit = () => {
    toast.success(isRegister ? 'Welcome to Firman' : 'Signed in — welcome back')
    closeAuth()
  }

  const input = 'p-4 bg-[var(--color-white)] border border-[var(--color-stone)] outline-none text-sm font-light focus:border-[var(--color-charcoal)]'

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
      <Backdrop onClick={closeAuth} />
      <div
        className="relative w-[min(880px,100%)] bg-[var(--color-ivory)] grid grid-cols-1 sm:grid-cols-2 shadow-[0_30px_90px_rgba(13,12,11,0.3)] max-h-[92vh] overflow-hidden"
        style={{ animation: 'scale-in 0.45s var(--ease-out) both' }}
        role="dialog"
        aria-label={isRegister ? 'Create account' : 'Sign in'}
      >
        <div className="relative min-h-[240px] bg-[var(--color-black)] hidden sm:block">
          <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=85" alt="" className="w-full h-full object-cover opacity-60 absolute inset-0" />
          <div className="relative z-10 p-10 h-full flex flex-col justify-end">
            <div className="font-serif text-3xl text-[var(--color-white)] tracking-[0.04em]">FIRMAN</div>
            <p className="text-[var(--color-white)]/80 text-sm mt-2">Members enjoy saved bags, order tracking, and early access.</p>
          </div>
        </div>
        <div className="p-[clamp(2rem,4vw,3rem)] overflow-y-auto relative">
          <button onClick={closeAuth} className="absolute top-5 right-5 text-lg text-[var(--color-mid-gray)] hover:text-[var(--color-black)] z-10" aria-label="Close">✕</button>
          <h2 className="text-3xl font-serif">{isRegister ? 'Create account' : 'Welcome back'}</h2>
          <p className="text-[var(--color-mid-gray)] text-sm mt-1">{isRegister ? 'Join the Firman list and start saving pieces.' : 'Sign in to your account to continue.'}</p>
          <div className="mt-6 flex flex-col gap-3">
            {isRegister && <input type="text" placeholder="Full name" className={input} />}
            <input type="email" placeholder="Email address" className={input} />
            <input type="password" placeholder="Password" className={input} />
          </div>
          <button onClick={submit} className="w-full py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.68rem] tracking-[0.22em] uppercase font-medium mt-5 hover:bg-[var(--color-champagne-dark)] transition-colors">
            {isRegister ? 'Create account' : 'Sign in'}
          </button>
          <div className="flex items-center gap-4 my-5 text-[var(--color-warm-gray)] text-[0.7rem]">
            <div className="flex-1 h-px bg-[var(--color-stone)]" />OR<div className="flex-1 h-px bg-[var(--color-stone)]" />
          </div>
          <button onClick={submit} className="w-full py-4 bg-[var(--color-white)] border border-[var(--color-stone)] text-[0.7rem] tracking-[0.12em] uppercase text-[var(--color-charcoal)] hover:border-[var(--color-charcoal)]">Continue with Google</button>
          <p className="text-center text-sm text-[var(--color-mid-gray)] mt-6">
            {isRegister ? 'Already have an account?' : 'New to Firman?'}{' '}
            <button onClick={() => setAuthMode(isRegister ? 'login' : 'register')} className="text-[var(--color-champagne-dark)] border-b border-[var(--color-champagne)] font-medium">
              {isRegister ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Quick view ───────────────────────────────────────────────────── */
function QuickView() {
  const { quickProduct, closeQuick, addToCart } = useStore()
  const router = useRouter()
  useEscape(Boolean(quickProduct), closeQuick)
  if (!quickProduct) return null
  const p = quickProduct

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
      <Backdrop onClick={closeQuick} />
      <div
        className="relative w-[min(900px,100%)] bg-[var(--color-ivory)] grid grid-cols-1 sm:grid-cols-2 shadow-[0_30px_90px_rgba(13,12,11,0.3)] max-h-[92vh] overflow-hidden"
        style={{ animation: 'scale-in 0.45s var(--ease-out) both' }}
        role="dialog"
        aria-label={p.name}
      >
        <button onClick={closeQuick} className="absolute top-5 right-5 text-xl text-[var(--color-ivory)] z-10 mix-blend-difference" aria-label="Close">✕</button>
        <div className="aspect-[4/5] bg-[var(--color-stone)] overflow-hidden">
          <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-[clamp(2rem,4vw,3rem)] flex flex-col overflow-y-auto">
          <p className="text-[0.62rem] tracking-[0.22em] uppercase text-[var(--color-champagne-dark)]">{p.category}</p>
          <h2 className="text-3xl font-serif mt-2">{p.name}</h2>
          <p className="text-xl text-[var(--color-charcoal)] mt-2 font-light">{p.priceFmt}</p>
          <p className="text-[var(--color-mid-gray)] text-sm mt-4 leading-relaxed">{p.shortDescription || p.description}</p>
          <div className="mt-auto pt-6 flex gap-2.5">
            <button onClick={() => { addToCart(p); closeQuick() }} className="flex-1 py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.68rem] tracking-[0.2em] uppercase font-medium hover:bg-[var(--color-champagne-dark)] transition-colors">Add to Bag</button>
            <button onClick={() => { closeQuick(); router.push(`/product/${p.slug}`) }} className="py-4 px-6 border border-[var(--color-charcoal)] text-[0.68rem] tracking-[0.2em] uppercase">Details</button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Newsletter popup ─────────────────────────────────────────────── */
function NewsletterPopup() {
  const { newsletterOpen, closeNewsletter } = useStore()
  const toast = useToast()
  const [email, setEmail] = useState('')
  useEscape(newsletterOpen, closeNewsletter)
  if (!newsletterOpen) return null

  const claim = () => {
    if (!email.includes('@')) { toast.error('Please enter a valid email'); return }
    toast.success('Welcome — your 10% code is on its way')
    closeNewsletter()
  }

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
      <Backdrop onClick={closeNewsletter} />
      <div
        className="relative w-[min(560px,100%)] bg-[var(--color-ivory)] shadow-[0_30px_90px_rgba(13,12,11,0.3)] text-center p-[clamp(2.5rem,5vw,3.5rem)]"
        style={{ animation: 'scale-in 0.45s var(--ease-out) both' }}
        role="dialog"
        aria-label="Newsletter"
      >
        <button onClick={closeNewsletter} className="absolute top-5 right-5 text-lg text-[var(--color-mid-gray)] hover:text-[var(--color-black)]" aria-label="Close">✕</button>
        <span className="block text-[var(--color-champagne-dark)] text-[0.66rem] tracking-[0.26em] uppercase mb-4">Welcome to Firman</span>
        <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-serif leading-tight">Enjoy 10% off<br />your first piece.</h2>
        <p className="text-[var(--color-mid-gray)] text-sm mt-4">Join our list for early access to collections and private sales.</p>
        <div className="flex gap-2.5 mt-6 flex-wrap">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="flex-1 min-w-[180px] p-4 bg-[var(--color-white)] border border-[var(--color-stone)] outline-none text-sm font-light" />
          <button onClick={claim} className="px-7 py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.2em] uppercase font-medium">Claim Offer</button>
        </div>
        <button onClick={closeNewsletter} className="mt-5 text-[0.72rem] text-[var(--color-warm-gray)] underline">No thanks, I&apos;ll pay full price</button>
      </div>
    </div>
  )
}

/* ── Confirm dialog ───────────────────────────────────────────────── */
function ConfirmDialog() {
  const { confirmState, resolveConfirm } = useStore()
  useEscape(Boolean(confirmState), () => resolveConfirm(false))
  if (!confirmState) return null

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-6">
      <div onClick={() => resolveConfirm(false)} className="absolute inset-0 bg-[var(--color-black)]/55" style={{ animation: 'fade-in 0.3s var(--ease-out) both' }} aria-hidden="true" />
      <div
        className="relative w-[min(420px,100%)] bg-[var(--color-ivory)] shadow-[0_30px_90px_rgba(13,12,11,0.3)] p-9 text-center"
        style={{ animation: 'scale-in 0.35s var(--ease-out) both' }}
        role="alertdialog"
        aria-label={confirmState.title}
      >
        <h3 className="text-2xl font-serif">{confirmState.title}</h3>
        {confirmState.message && <p className="text-[var(--color-mid-gray)] text-sm mt-2">{confirmState.message}</p>}
        <div className="flex gap-2.5 mt-7">
          <button onClick={() => resolveConfirm(false)} className="flex-1 py-3.5 border border-[var(--color-stone)] text-[0.66rem] tracking-[0.16em] uppercase text-[var(--color-charcoal)] hover:border-[var(--color-charcoal)]">Cancel</button>
          <button onClick={() => resolveConfirm(true)} className="flex-1 py-3.5 bg-[var(--color-error)] text-[var(--color-white)] text-[0.66rem] tracking-[0.16em] uppercase">{confirmState.cta}</button>
        </div>
      </div>
    </div>
  )
}

export default function GlobalOverlays() {
  return (
    <>
      <CartDrawer />
      <SearchOverlay />
      <AuthModal />
      <QuickView />
      <NewsletterPopup />
      <ConfirmDialog />
    </>
  )
}
