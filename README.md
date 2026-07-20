# Firman Furniture

Luxury furniture storefront: Next.js 16 (App Router, JavaScript) · Prisma 7 + PostgreSQL (Neon in production) · Stripe Checkout · Brevo transactional email · deployed on Vercel.

## Local development

```bash
npm install
cp .env.example .env.local     # fill in values (see below)
npm run db:setup:local         # create the local Postgres database
npm run db:migrate:deploy      # apply Prisma migrations
npm run db:import:products     # seed the catalogue from data/products.json
npm run dev                    # http://localhost:3000
```

### Environment variables

Copy `.env.example` → `.env.local`. Key groups:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | **Pooled** connection used by the app at runtime. Locally: your direct localhost Postgres. On Neon: the **pooler** endpoint (host contains `-pooler`). |
| `DIRECT_URL` | **Unpooled** connection used only by `prisma migrate` / introspection. Locally it can equal `DATABASE_URL`; on Neon use the non-pooler host. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin — used for Stripe redirect URLs, sitemap, emails. |
| `AUTH_SECRET` / `AUTH_URL` | Session/auth configuration. `AUTH_URL` = site origin. |
| `STRIPE_SECRET_KEY` | Stripe API key (`sk_test_…` everywhere except Production, which uses `sk_live_…`). Server-only — never exposed to the client. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_…` / `pk_live_…`). |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` for the webhook endpoint. Locally this comes from `stripe listen` (below); in production from the Stripe dashboard endpoint. |
| `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME` | Transactional email. Without a key, emails log to the console in dev. |
| `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN` | Error tracking (server / client). Optional — everything no-ops when unset. |

### Testing Stripe locally

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and log in: `stripe login`
2. Forward webhooks to your dev server:

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. Copy the `whsec_…` secret it prints into `STRIPE_WEBHOOK_SECRET` in `.env.local`, restart `npm run dev`.
4. Go through checkout with Stripe's test cards:

   | Card | Behaviour |
   | --- | --- |
   | `4242 4242 4242 4242` | Succeeds |
   | `4000 0000 0000 0002` | Declined |
   | `4000 0025 0000 3155` | Requires 3D Secure challenge |

   Any future expiry, any CVC, any ZIP.
5. Watch the `stripe listen` terminal: `checkout.session.completed` marks the order **confirmed** (paid) — the success page never does. Test a refund from the Stripe dashboard and watch `charge.refunded` flip the order to **refunded**.

## Vercel deployment

- **Build command**: Vercel runs `vercel-build` (`prisma generate && prisma migrate deploy && next build`) — migrations always deploy with `migrate deploy`, never `db push` or `migrate dev`.
- **Environment scopes**:
  - *Production*: live keys only (`sk_live_…`, `pk_live_…`, production `whsec_…`, Neon production DB, real `NEXT_PUBLIC_SITE_URL`).
  - *Preview / Development*: test keys only (`sk_test_…`), a separate Neon branch/database, and the preview URL as `NEXT_PUBLIC_SITE_URL`.
- **Neon URLs**: `DATABASE_URL` = pooled (`…-pooler…`), `DIRECT_URL` = direct. Both set in every scope.
- **Stripe webhook (production)**: in the Stripe **live-mode** dashboard, add endpoint `https://<your-domain>/api/webhooks/stripe` with events `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`, `charge.dispute.created`, and put its `whsec_…` into the Production env only.
- **Health check**: `GET /api/health` returns `{ ok, checks }` — 200 when the DB answers, 503 otherwise.

## Database operations

```bash
npm run db:migrate          # create + apply a new migration in dev (interactive terminal)
npm run db:migrate:deploy   # apply pending migrations (what production runs)
npm run db:status           # migration status
npm run db:studio           # browse data
npm run db:import:products  # (re)import catalogue from data/products.json
npm run db:verify:products  # sanity-check imported products
```

### Making a user an admin

`/admin` requires `role = 'admin'` (enforced server-side). After registering, promote your account:

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

## Architecture notes

- **Payments**: client carts send only product ids + quantities. All prices/totals are recomputed from the database at checkout; the Stripe session is created server-side with an idempotency key. The **webhook** (signature-verified, idempotent via `processed_stripe_events`) is the only thing that marks orders paid, decrementing stock atomically in the same transaction.
- **Order state machine**: `pending → confirmed → processing → shipped → delivered` (+ `cancelled`/`refunded`), enforced in `src/lib/orders.js` with an audit trail in `order_status_history`. No client-driven status writes.
- **Auth**: database-backed sessions (`sessions` table stores SHA-256 of an opaque token; httpOnly/secure/sameSite cookie). Guards: `requireUser()` / `requireAdmin()`; the proxy only does optimistic redirects.
- **Made-to-order inventory**: catalogue-wide `allow_backorder = true`; strict-stock items (backorder off) can never oversell — the stock floor is enforced inside the UPDATE.
