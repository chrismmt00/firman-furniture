'use client'

import { useState } from 'react'
import { useStore } from '@/components/providers/StoreProvider'
import { useToast } from '@/components/ui/ToastProvider'
import AccountTabs from './AccountTabs'

const input =
  'p-3.5 bg-[var(--color-white)] border border-[var(--color-stone)] outline-none text-[0.85rem] font-light focus:border-[var(--color-charcoal)]'

const BLANK = { label: '', name: '', line1: '', city: '', state: '', zip: '', phone: '', country: 'United States', def: false }

export default function AddressBook({ initial }) {
  const { askConfirm } = useStore()
  const toast = useToast()
  const [list, setList] = useState(initial)
  const [editing, setEditing] = useState(null) // { idx, draft } or null
  const [draft, setDraft] = useState(BLANK)

  const openNew = () => { setDraft(BLANK); setEditing({ idx: -1 }) }
  const openEdit = (idx) => { setDraft({ ...list[idx] }); setEditing({ idx }) }

  const save = () => {
    if (!draft.name || !draft.line1) { toast.error('Name and address are required'); return }
    setList((prev) => {
      if (editing.idx === -1) return [...prev, draft]
      return prev.map((a, i) => (i === editing.idx ? draft : a))
    })
    setEditing(null)
    toast.success('Address saved')
  }

  const setDefault = (idx) => {
    setList((prev) => prev.map((a, i) => ({ ...a, def: i === idx })))
    toast.success('Default address updated')
  }

  const remove = async (idx) => {
    const ok = await askConfirm({ title: 'Delete address?', message: 'This address will be removed from your account.', cta: 'Delete' })
    if (!ok) return
    setList((prev) => prev.filter((_, i) => i !== idx))
    toast.show('Address removed')
  }

  return (
    <div className="max-w-[1000px] mx-auto px-[clamp(1.5rem,5vw,4rem)] pt-10 pb-24">
      <div className="flex justify-between items-end gap-4 flex-wrap">
        <div>
          <span className="block text-[var(--color-champagne-dark)] text-[0.66rem] tracking-[0.26em] uppercase mb-3">Account</span>
          <h1 className="text-[clamp(2.2rem,4.5vw,3.2rem)]">Saved addresses</h1>
        </div>
        <button onClick={openNew} className="px-8 py-3.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.2em] uppercase hover:bg-[var(--color-champagne-dark)] transition-colors">+ Add address</button>
      </div>

      <AccountTabs active="/account/addresses" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {list.map((a, idx) => (
          <div key={idx} className="bg-[var(--color-white)] border border-[var(--color-stone)] p-6 relative">
            <div className="flex justify-between items-center">
              <span className="text-[0.62rem] tracking-[0.18em] uppercase text-[var(--color-champagne-dark)]">{a.label || 'Address'}</span>
              {a.def && <span className="text-[0.56rem] tracking-[0.14em] uppercase bg-[var(--color-champagne-pale)] text-[var(--color-champagne-dark)] px-2 py-1">Default</span>}
            </div>
            <p className="text-[0.92rem] leading-relaxed mt-3.5">{a.name}<br />{a.line1}<br />{a.city}, {a.state} {a.zip}<br />{a.country}</p>
            <div className="flex gap-4.5 mt-5 border-t border-[var(--color-stone)] pt-4" style={{ gap: '1.1rem' }}>
              <button onClick={() => openEdit(idx)} className="text-[0.62rem] tracking-[0.14em] uppercase text-[var(--color-charcoal)] hover:text-[var(--color-champagne-dark)]">Edit</button>
              <button onClick={() => setDefault(idx)} className="text-[0.62rem] tracking-[0.14em] uppercase text-[var(--color-mid-gray)] hover:text-[var(--color-champagne-dark)]">Set default</button>
              <button onClick={() => remove(idx)} className="text-[0.62rem] tracking-[0.14em] uppercase text-[var(--color-warm-gray)] ml-auto hover:text-[var(--color-error)]">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[650] flex items-center justify-center p-6">
          <div onClick={() => setEditing(null)} className="absolute inset-0 bg-[var(--color-black)]/55" style={{ animation: 'fade-in 0.35s var(--ease-out) both' }} />
          <div className="relative w-[min(520px,100%)] bg-[var(--color-ivory)] shadow-[0_30px_90px_rgba(13,12,11,0.3)] p-[clamp(1.8rem,4vw,2.4rem)] max-h-[92vh] overflow-y-auto" style={{ animation: 'scale-in 0.4s var(--ease-out) both' }}>
            <h2 className="text-2xl">{editing.idx === -1 ? 'Add address' : 'Edit address'}</h2>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="Label (Home, Studio)" className={input} />
              <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Full name" className={input} />
              <input value={draft.line1} onChange={(e) => setDraft({ ...draft, line1: e.target.value })} placeholder="Address" className={`${input} col-span-2`} />
              <input value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} placeholder="City" className={input} />
              <input value={draft.state} onChange={(e) => setDraft({ ...draft, state: e.target.value })} placeholder="State" className={input} />
              <input value={draft.zip} onChange={(e) => setDraft({ ...draft, zip: e.target.value })} placeholder="ZIP" className={input} />
              <input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} placeholder="Phone" className={input} />
            </div>
            <div className="flex gap-2.5 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 py-3.5 border border-[var(--color-stone)] text-[0.66rem] tracking-[0.16em] uppercase text-[var(--color-charcoal)] hover:border-[var(--color-charcoal)]">Cancel</button>
              <button onClick={save} className="flex-1 py-3.5 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.66rem] tracking-[0.16em] uppercase hover:bg-[var(--color-champagne-dark)] transition-colors">Save address</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
