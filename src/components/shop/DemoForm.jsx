'use client'

import { useToast } from '@/components/ui/ToastProvider'

/* Wraps a set of fields and shows a success toast on submit (no backend).
   Used by the Trade and Contact pages. */
export default function DemoForm({ children, message = 'Thank you — we will be in touch shortly.', className = '' }) {
  const toast = useToast()
  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault()
        e.currentTarget.reset()
        toast.success(message)
      }}
    >
      {children}
    </form>
  )
}
