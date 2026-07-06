'use client'

import { useStore } from '@/components/providers/StoreProvider'

/* Live saved-items count for the account dashboard stat card. */
export default function WishlistCount() {
  const { wishlist, hydrated } = useStore()
  return <>{hydrated ? wishlist.length : 0}</>
}
