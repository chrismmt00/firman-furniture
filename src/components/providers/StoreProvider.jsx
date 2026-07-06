'use client'

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useToast } from '@/components/ui/ToastProvider'

const StoreContext = createContext(null)

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within <StoreProvider>')
  return ctx
}

const CART_KEY = 'firman.cart'
const WISH_KEY = 'firman.wishlist'

function loadJSON(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export default function StoreProvider({ children, searchIndex = [] }) {
  const toast = useToast()

  /* ── Cart + wishlist (persisted) ──────────────────────────────── */
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // One-time hydration from localStorage after mount (avoids SSR mismatch).
    /* eslint-disable react-hooks/set-state-in-effect */
    setCart(loadJSON(CART_KEY, []))
    setWishlist(loadJSON(WISH_KEY, []))
    setHydrated(true)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart, hydrated])

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist))
  }, [wishlist, hydrated])

  /* ── UI / overlay state ───────────────────────────────────────── */
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' | 'register'
  const [quickProduct, setQuickProduct] = useState(null)
  const [newsletterOpen, setNewsletterOpen] = useState(false)
  const [confirmState, setConfirmState] = useState(null)
  const confirmResolver = useRef(null)

  /* ── Cart actions ─────────────────────────────────────────────── */
  const addToCart = useCallback((product, { variant, qty = 1, silent = false } = {}) => {
    const finish = variant || product.color || 'Default'
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id && i.variant === finish)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + qty }
        return next
      }
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          variant: finish,
          qty,
        },
      ]
    })
    if (!silent) {
      toast.success(`${product.name} added to your bag`)
      setCartOpen(true)
    }
  }, [toast])

  const cartInc = useCallback((idx) => {
    setCart((prev) => prev.map((i, x) => (x === idx ? { ...i, qty: i.qty + 1 } : i)))
  }, [])

  const cartDec = useCallback((idx) => {
    setCart((prev) =>
      prev
        .map((i, x) => (x === idx ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    )
  }, [])

  const cartRemove = useCallback((idx) => {
    setCart((prev) => prev.filter((_, x) => x !== idx))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart])
  const cartSubtotal = useMemo(() => cart.reduce((n, i) => n + i.price * i.qty, 0), [cart])

  /* ── Wishlist actions ─────────────────────────────────────────── */
  const isWished = useCallback((id) => wishlist.some((w) => w.id === id), [wishlist])

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      if (prev.some((w) => w.id === product.id)) {
        toast.show('Removed from your saved items')
        return prev.filter((w) => w.id !== product.id)
      }
      toast.success('Saved to your wishlist')
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          price: product.price,
          priceFmt: product.priceFmt,
          image: product.image,
        },
      ]
    })
  }, [toast])

  /* ── Overlay openers ──────────────────────────────────────────── */
  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])
  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])
  const openAuth = useCallback((mode = 'login') => { setAuthMode(mode); setAuthOpen(true) }, [])
  const closeAuth = useCallback(() => setAuthOpen(false), [])
  const openQuick = useCallback((product) => setQuickProduct(product), [])
  const closeQuick = useCallback(() => setQuickProduct(null), [])
  const openNewsletter = useCallback(() => setNewsletterOpen(true), [])
  const closeNewsletter = useCallback(() => setNewsletterOpen(false), [])

  /* Promise-based confirm dialog. */
  const askConfirm = useCallback((opts) => {
    return new Promise((resolve) => {
      confirmResolver.current = resolve
      setConfirmState({ cta: 'Confirm', ...opts })
    })
  }, [])

  const resolveConfirm = useCallback((value) => {
    confirmResolver.current?.(value)
    confirmResolver.current = null
    setConfirmState(null)
  }, [])

  /* ── Newsletter auto-open (once per session) ──────────────────── */
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.sessionStorage.getItem('firman.nl')) return
    const t = setTimeout(() => {
      setNewsletterOpen(true)
      window.sessionStorage.setItem('firman.nl', '1')
    }, 12000)
    return () => clearTimeout(t)
  }, [])

  const value = {
    // data
    cart, wishlist, hydrated, cartCount, cartSubtotal, searchIndex,
    // cart
    addToCart, cartInc, cartDec, cartRemove, clearCart,
    // wishlist
    isWished, toggleWishlist,
    // overlays state
    cartOpen, searchOpen, authOpen, authMode, quickProduct, newsletterOpen, confirmState,
    setAuthMode,
    // overlay actions
    openCart, closeCart, openSearch, closeSearch, openAuth, closeAuth,
    openQuick, closeQuick, openNewsletter, closeNewsletter,
    askConfirm, resolveConfirm,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
