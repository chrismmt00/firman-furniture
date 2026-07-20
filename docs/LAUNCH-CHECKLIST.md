# Production Launch Checklist

Work through this top-to-bottom before flipping DNS / announcing. Items marked **[you]**
need dashboard access or business decisions only you can make.

## 1. Environment & keys

- [ ] **[you]** Vercel **Production** env: `sk_live_…`, `pk_live_…`, production `whsec_…`, Neon production `DATABASE_URL` (pooler host) + `DIRECT_URL` (direct host), real `NEXT_PUBLIC_SITE_URL`/`AUTH_URL`, strong unique `AUTH_SECRET`, `BREVO_API_KEY`, `SENTRY_DSN` + `NEXT_PUBLIC_SENTRY_DSN`.
- [ ] **[you]** Vercel **Preview/Development** env: `sk_test_…` keys only, a separate Neon branch/database — live keys must exist in Production scope *only*.
- [ ] Confirm no `.env*` file is committed: `git ls-files | grep .env` → only `.env.example`.
- [ ] `GET /api/health` on the deployed URL returns `ok: true` with `stripe`, `stripeWebhook`, `email` all `true`.

## 2. Stripe live mode

- [ ] **[you]** In the Stripe **live** dashboard → Webhooks, add endpoint `https://<domain>/api/webhooks/stripe` with events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`, `charge.dispute.created`.
- [ ] Copy that endpoint's `whsec_…` into Vercel Production env (it is different from the test-mode/CLI secret).
- [ ] **[you]** Complete Stripe account activation (business details, bank account) so live payments settle.

## 3. Database

- [ ] `npm run db:status` against production (`DIRECT_URL` pointed at prod, carefully) → "Database schema is up to date!".
- [ ] Verify the deploy build ran `prisma migrate deploy` (Vercel build logs show the migrations step).
- [ ] Promote your own account: `UPDATE users SET role='admin' WHERE email='…';` then confirm `/admin` loads for you and 404s for a normal account.

## 4. End-to-end live test (the real proof)

- [ ] Place **one real purchase on production** with a real card (smallest item).
- [ ] Watch the order flip `pending → confirmed` in `/account/orders` — via the webhook, without visiting the success page (close the tab after paying if you want to prove it).
- [ ] Confirm the order-confirmation email arrives.
- [ ] Refund the payment from the Stripe dashboard → order flips to `refunded` via `charge.refunded`.
- [ ] Check Stripe dashboard → Webhooks → endpoint shows all deliveries `200`.

## 5. Rollback plan

**Revert a bad deployment (instant):**
Vercel dashboard → Project → Deployments → previous good deployment → ⋯ → **Promote to Production** (or `vercel rollback` with the CLI). Vercel keeps every previous build warm — rollback is seconds.

**Revert the last migration (only if it broke something):**
Prisma has no automatic down-migrations. Pattern:
1. `npx prisma migrate diff --from-schema prisma/schema.prisma --to-migrations prisma/migrations --script` to generate the reverse SQL, review it by hand.
2. Apply it with `npx prisma db execute --file <reverse.sql>` against `DIRECT_URL`.
3. `npx prisma migrate resolve --rolled-back <migration_name>` so migrate history matches reality.
Because the deploy that carried the migration is also rolled back (step above), do the code rollback *first*, then decide whether the schema change actually needs reverting (additive migrations — like ours so far — are safe to leave in place).

## 6. Final sweep

- [ ] Legal pages reviewed by a human (**[you]** — `/privacy`, `/terms`, `/shipping-returns` are templates).
- [ ] `robots.txt` and `sitemap.xml` show the production domain (they derive from `NEXT_PUBLIC_SITE_URL`).
- [ ] Sentry receives a test event (throw one from a preview deployment).
- [ ] Uptime monitor pointed at `GET /api/health` (UptimeRobot/Betterstack — 1-minute checks, alert on 503).
- [ ] Neon: point-in-time recovery / backups confirmed enabled on the production branch.
