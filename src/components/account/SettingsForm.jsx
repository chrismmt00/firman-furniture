'use client'

import { useToast } from '@/components/ui/ToastProvider'
import AccountTabs from './AccountTabs'
import { account } from '@/lib/demo-data'

const input =
  'p-4 bg-[var(--color-white)] border border-[var(--color-stone)] outline-none text-[0.86rem] font-light focus:border-[var(--color-charcoal)]'

export default function SettingsForm() {
  const toast = useToast()

  return (
    <div className="max-w-[760px] mx-auto px-[clamp(1.5rem,5vw,4rem)] pt-10 pb-24">
      <span className="block text-[var(--color-champagne-dark)] text-[0.66rem] tracking-[0.26em] uppercase mb-3">Account</span>
      <h1 className="text-[clamp(2.2rem,4.5vw,3.2rem)]">Settings</h1>

      <AccountTabs active="/account/settings" />

      <h2 className="text-xl mt-2 mb-4">Profile</h2>
      <div className="grid grid-cols-2 gap-3">
        <input defaultValue={account.firstName} className={input} />
        <input defaultValue={account.lastName} className={input} />
        <input defaultValue={account.email} className={`${input} col-span-2`} />
      </div>

      <h2 className="text-xl mt-9 mb-4">Password</h2>
      <div className="grid grid-cols-2 gap-3">
        <input type="password" placeholder="Current password" className={input} />
        <input type="password" placeholder="New password" className={input} />
      </div>

      <h2 className="text-xl mt-9 mb-4">Email preferences</h2>
      <label className="flex items-center gap-3 py-2.5 text-[0.9rem] text-[var(--color-charcoal)]"><input type="checkbox" defaultChecked className="accent-[var(--color-champagne-dark)] w-4 h-4" />New collections &amp; private sales</label>
      <label className="flex items-center gap-3 py-2.5 text-[0.9rem] text-[var(--color-charcoal)]"><input type="checkbox" defaultChecked className="accent-[var(--color-champagne-dark)] w-4 h-4" />Order &amp; shipping updates</label>
      <label className="flex items-center gap-3 py-2.5 text-[0.9rem] text-[var(--color-charcoal)]"><input type="checkbox" className="accent-[var(--color-champagne-dark)] w-4 h-4" />Design notes &amp; journal</label>

      <button onClick={() => toast.success('Your settings have been saved')} className="mt-7 px-10 py-4 bg-[var(--color-black)] text-[var(--color-ivory)] text-[0.68rem] tracking-[0.22em] uppercase font-medium hover:bg-[var(--color-champagne-dark)] transition-colors">Save changes</button>
    </div>
  )
}
