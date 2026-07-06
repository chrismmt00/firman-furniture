import AddressBook from '@/components/account/AddressBook'
import { addresses } from '@/lib/demo-data'

export const metadata = { title: 'Saved Addresses' }

export default function AddressesPage() {
  return <AddressBook initial={addresses} />
}
