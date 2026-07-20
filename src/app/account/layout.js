import { requireUser } from '@/lib/auth'

// Authoritative gate for the whole /account section. The proxy only does an optimistic
// cookie-presence redirect; this server check is what actually enforces authentication.
export default async function AccountLayout({ children }) {
  await requireUser()
  return children
}
