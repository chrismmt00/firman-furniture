# Firman Furniture — E-Commerce Platform Scope

## Project Overview

**Brand:** Firman Furniture (Luxury Furniture)
**Stack:** Next.js (Vercel), Neon (PostgreSQL), Brevo (Email/Marketing), Cloudflare Images (Media)
**Goal:** Full-featured luxury e-commerce experience with customer accounts, wishlists, checkout, email marketing, and a complete admin portal for store management.

---

## Tech Stack Details

| Layer | Technology | Purpose |
|---|---|---|
| Frontend & SSR | Next.js (App Router) | Pages, API routes, server components |
| Hosting | Vercel | Production deployment, edge functions, preview deploys |
| Database | Neon (PostgreSQL) | All persistent data — users, products, orders, etc. |
| ORM | Drizzle or Prisma | Type-safe database queries and migrations |
| Auth | NextAuth.js (Auth.js v5) | Customer + Admin authentication (credentials + OAuth) |
| Email | Brevo (Sendinblue) | Transactional emails, marketing campaigns, automations |
| Image Storage | Cloudflare Images | Product images, category banners, lifestyle photos |
| Payments | Stripe | Checkout, saved cards, refunds, webhooks |
| Search | Meilisearch or Algolia | Product search with filters and facets |

---

## Sitemap & Page Inventory

### Public Storefront Pages

```
/                               → Homepage
/shop                           → Shop (all products, filterable)
/shop/[category-slug]           → Category page
/shop/[category-slug]/[subcategory-slug] → Subcategory page
/product/[product-slug]         → Product detail page (PDP)
/collections                    → Curated collections landing
/collections/[collection-slug]  → Single collection page
/search                         → Search results
/about                          → Brand story
/contact                        → Contact form
/faq                            → Frequently asked questions
/shipping-returns               → Shipping & return policy
/privacy-policy                 → Privacy policy
/terms-of-service               → Terms of service
/blog                           → Blog listing
/blog/[post-slug]               → Blog post
/lookbook                       → Lifestyle gallery / room inspiration
/trade-program                  → Trade / designer program application
```

### Customer Account Pages (Authenticated)

```
/account                        → Account dashboard
/account/orders                 → Order history
/account/orders/[order-id]      → Order detail / tracking
/account/wishlist               → Saved wishlist
/account/addresses              → Saved addresses (CRUD)
/account/settings               → Profile, password, email prefs
/account/reviews                → Customer's submitted reviews
```

### Auth Pages

```
/login                          → Email/password + OAuth login
/register                       → Create account
/forgot-password                → Password reset request
/reset-password/[token]         → Password reset form
```

### Checkout Flow

```
/cart                           → Shopping cart
/checkout                       → Multi-step checkout (guest or authenticated)
/checkout/success               → Order confirmation
```

### Admin Portal Pages

```
/admin                          → Admin dashboard (KPIs, recent orders, low stock)
/admin/products                 → Product list (search, filter, bulk actions)
/admin/products/new             → Create product
/admin/products/[id]/edit       → Edit product
/admin/categories               → Category & subcategory management
/admin/collections              → Collection management
/admin/orders                   → Order list (filter by status, date, customer)
/admin/orders/[id]              → Order detail (status updates, notes, refund)
/admin/customers                → Customer list (search, filter, export)
/admin/customers/[id]           → Customer detail (orders, addresses, notes)
/admin/reviews                  → Review moderation
/admin/discounts                → Promo codes & discount rules
/admin/blog                     → Blog post management
/admin/blog/new                 → Create blog post
/admin/blog/[id]/edit           → Edit blog post
/admin/pages                    → Static page content editor (About, FAQ, etc.)
/admin/media                    → Media library (Cloudflare Images browser)
/admin/email                    → Email subscriber list, Brevo campaign triggers
/admin/settings                 → Store settings (tax, shipping zones, general)
/admin/settings/shipping        → Shipping rates & zones
/admin/settings/taxes           → Tax rules
/admin/settings/payments        → Stripe connection status
/admin/team                     → Staff accounts & role management
/admin/analytics                → Sales reports, traffic, conversion
```

---

## User Flows

### 1. Guest Browsing → Purchase

```
Homepage → Browse Shop/Category → View Product → Add to Cart → Cart Page
→ Checkout (enter email, shipping, payment) → Order Confirmation
→ Brevo sends order confirmation email
→ Option to create account from confirmation page
```

### 2. Account Registration → Purchase

```
Register Page → Verify email (Brevo transactional) → Login
→ Browse → Add to Cart → Checkout (address auto-filled from account)
→ Payment → Order Confirmation → Order visible in /account/orders
```

### 3. Wishlist Flow

```
(Logged in) Browse → Click heart icon on product card or PDP
→ Product saved to wishlist → View /account/wishlist
→ Move item to cart from wishlist
→ Optional: Brevo automation — "item on your wishlist is on sale"
```

### 4. Search & Filter Flow

```
Click search bar (global header) → Type query → Live suggestions dropdown
→ Hit enter → /search?q=... results page
→ Apply filters (category, price range, material, color, dimensions)
→ Sort (price, newest, popularity)
→ Click product → PDP
```

### 5. Checkout Flow (Detailed)

```
Step 1: Information
  - Guest: enter email, shipping address
  - Authenticated: select saved address or add new
  - Shipping method selection (rates from shipping zones config)

Step 2: Payment
  - Stripe Elements embedded form
  - Apply promo code
  - Order summary sidebar

Step 3: Confirmation
  - Order number, summary, estimated delivery
  - Brevo sends confirmation email
  - If guest → prompt to create account with pre-filled email
```

### 6. Admin — Product Upload Flow

```
Login to /admin → Products → New Product
→ Fill: title, slug (auto-generated), description (rich text), price, compare-at price
→ Select category + subcategory
→ Upload images via Cloudflare Images (drag & drop, reorder)
→ Set variants (if applicable): size, finish, fabric
→ Inventory: SKU, stock quantity, track inventory toggle
→ SEO: meta title, meta description, OG image
→ Visibility: draft / published / scheduled
→ Save → product live on storefront
```

### 7. Admin — Order Fulfillment Flow

```
/admin/orders → Click order → View details
→ Update status: Pending → Processing → Shipped → Delivered
→ Add tracking number → Brevo sends shipping notification email
→ Handle returns/refunds → Stripe refund API → Status updated
→ Internal notes for team
```

### 8. Email Capture & Marketing Flow

```
Visitor lands on site → Footer newsletter signup / popup modal (timed or exit-intent)
→ Email sent to Brevo contact list via API
→ Brevo sends welcome email (automation)
→ Ongoing: abandoned cart emails, back-in-stock alerts, promotional campaigns
```

### 9. Trade Program Application

```
/trade-program → Fill form (business name, license, email, portfolio)
→ Submission stored in DB + Brevo tags contact as "trade-applicant"
→ Admin reviews in /admin → approves → account flagged as trade
→ Trade customers see trade pricing on PDP
```

---

## Page-by-Page Detail

### Homepage

- Hero banner (full-width image/video, headline, CTA) — admin-editable
- Featured collections row (3–4 cards)
- New arrivals product carousel
- Brand story teaser section with link to /about
- Lifestyle/lookbook image grid
- Testimonial/press quotes
- Newsletter signup block
- Instagram feed embed (optional)

### Shop / Category Page

- Breadcrumb navigation
- Category header (banner image, title, description — admin-editable)
- Filter sidebar: category tree, price range slider, material, color, dimensions, availability
- Sort dropdown: featured, price low-high, price high-low, newest
- Product grid (responsive: 2 col mobile, 3–4 col desktop)
- Product card: image (hover swap), title, price, wishlist heart, quick-add
- Pagination or infinite scroll
- Empty state for no results

### Product Detail Page (PDP)

- Image gallery (thumbnails, zoom, lightbox)
- Product title, price, compare-at price (strikethrough for sale)
- Variant selectors (dropdowns or swatches for finish, size, fabric)
- Quantity selector
- Add to Cart button (sticky on mobile)
- Add to Wishlist button
- Accordion sections: Description, Dimensions & Specs, Materials & Care, Shipping Info
- Delivery estimate based on zip code (optional)
- Related products carousel
- Customer reviews section (star rating, written reviews, photo uploads)
- Recently viewed products row
- Social share buttons
- SEO: structured data (JSON-LD Product schema)

### Cart Page

- Line items: image thumbnail, title, variant, quantity (editable), line price, remove
- Promo code input
- Order summary: subtotal, shipping estimate, tax estimate, total
- Continue Shopping link
- Proceed to Checkout CTA
- Recommended products ("You might also like")
- Free shipping threshold progress bar

### Checkout

- Multi-step or single-page layout
- Step indicators (Information → Shipping → Payment)
- Express checkout (Apple Pay, Google Pay via Stripe)
- Guest email or login prompt
- Address form with autocomplete
- Shipping method selection with rates
- Promo code field
- Stripe Elements payment form
- Order summary sidebar (collapsible on mobile)
- Terms acceptance checkbox

### Account Dashboard

- Welcome message with first name
- Quick stats: total orders, wishlist count
- Recent orders (last 3) with status badges
- Quick links: addresses, wishlist, settings
- Logout

### Admin Dashboard

- Today's revenue, orders, new customers (cards)
- Revenue chart (last 30 days)
- Recent orders table (last 10, clickable)
- Low stock alerts
- Pending reviews count
- Quick actions: add product, view orders

### Admin Product Editor

- Two-column layout: main content left, sidebar right
- Left: title, slug, rich text description, variant matrix, SEO fields
- Right: status (draft/published), category selector, collection tags, featured toggle
- Image uploader: drag-and-drop to Cloudflare Images, reorder, set primary, alt text
- Variant manager: add option types, generate variant combinations, per-variant price/SKU/stock
- Inventory section: track stock toggle, quantity, low stock threshold
- Save / Save as Draft / Delete with confirmation

---

## Database Schema

### Auth & Users

```sql
-- Customer and admin accounts
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255),              -- null if OAuth-only
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    phone           VARCHAR(30),
    role            VARCHAR(20) DEFAULT 'customer',  -- customer | admin | staff
    email_verified  BOOLEAN DEFAULT FALSE,
    is_trade        BOOLEAN DEFAULT FALSE,     -- trade program approved
    brevo_contact_id VARCHAR(100),             -- Brevo contact reference
    avatar_url      VARCHAR(500),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- OAuth provider links
CREATE TABLE oauth_accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider        VARCHAR(50) NOT NULL,      -- google | apple | facebook
    provider_account_id VARCHAR(255) NOT NULL,
    access_token    TEXT,
    refresh_token   TEXT,
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider, provider_account_id)
);

-- Session management
CREATE TABLE sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token   VARCHAR(255) UNIQUE NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token           VARCHAR(255) UNIQUE NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL,
    used            BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Customer saved addresses
CREATE TABLE addresses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label           VARCHAR(50),               -- Home, Office, etc.
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    address_line1   VARCHAR(255) NOT NULL,
    address_line2   VARCHAR(255),
    city            VARCHAR(100) NOT NULL,
    state           VARCHAR(100),
    postal_code     VARCHAR(20) NOT NULL,
    country         VARCHAR(2) NOT NULL,       -- ISO 3166-1 alpha-2
    phone           VARCHAR(30),
    is_default      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Product Catalog

```sql
-- Top-level categories (e.g., Living Room, Bedroom, Dining)
CREATE TABLE categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(120) UNIQUE NOT NULL,
    description     TEXT,
    image_url       VARCHAR(500),              -- Cloudflare Images URL
    parent_id       UUID REFERENCES categories(id) ON DELETE SET NULL,  -- subcategories
    sort_order      INT DEFAULT 0,
    is_visible      BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Curated collections (e.g., Summer Collection, Best Sellers)
CREATE TABLE collections (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(150) NOT NULL,
    slug            VARCHAR(170) UNIQUE NOT NULL,
    description     TEXT,
    image_url       VARCHAR(500),
    is_visible      BOOLEAN DEFAULT TRUE,
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(280) UNIQUE NOT NULL,
    description     TEXT,                      -- rich text / HTML
    short_description VARCHAR(500),
    price           DECIMAL(10,2) NOT NULL,    -- base price in cents or dollars
    compare_at_price DECIMAL(10,2),            -- original price for sale display
    cost_price      DECIMAL(10,2),             -- cost for margin tracking
    trade_price     DECIMAL(10,2),             -- trade program pricing
    sku             VARCHAR(100) UNIQUE,
    barcode         VARCHAR(100),
    weight          DECIMAL(8,2),              -- for shipping calculation
    weight_unit     VARCHAR(5) DEFAULT 'lb',
    length          DECIMAL(8,2),
    width           DECIMAL(8,2),
    height          DECIMAL(8,2),
    dimension_unit  VARCHAR(5) DEFAULT 'in',
    material        VARCHAR(255),
    color           VARCHAR(100),
    category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_featured     BOOLEAN DEFAULT FALSE,
    is_published    BOOLEAN DEFAULT FALSE,
    published_at    TIMESTAMPTZ,
    meta_title      VARCHAR(255),
    meta_description VARCHAR(500),
    og_image_url    VARCHAR(500),
    track_inventory BOOLEAN DEFAULT TRUE,
    stock_quantity  INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 5,
    allow_backorder BOOLEAN DEFAULT FALSE,
    tags            TEXT[],                    -- PostgreSQL array for flexible tagging
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Product images (multiple per product, stored in Cloudflare Images)
CREATE TABLE product_images (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    cloudflare_image_id VARCHAR(255) NOT NULL,  -- Cloudflare Images ID
    url             VARCHAR(500) NOT NULL,      -- Cloudflare delivery URL
    alt_text        VARCHAR(255),
    sort_order      INT DEFAULT 0,
    is_primary      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Product option types (e.g., Size, Finish, Fabric)
CREATE TABLE product_option_types (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,     -- "Size", "Finish"
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Option values (e.g., Small, Medium, Large / Oak, Walnut)
CREATE TABLE product_option_values (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    option_type_id  UUID NOT NULL REFERENCES product_option_types(id) ON DELETE CASCADE,
    value           VARCHAR(100) NOT NULL,     -- "Oak", "Queen"
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Product variants (specific combinations, e.g., Oak + Queen)
CREATE TABLE product_variants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku             VARCHAR(100) UNIQUE,
    price           DECIMAL(10,2),             -- override base price if set
    compare_at_price DECIMAL(10,2),
    cost_price      DECIMAL(10,2),
    stock_quantity  INT DEFAULT 0,
    weight          DECIMAL(8,2),
    image_id        UUID REFERENCES product_images(id) ON DELETE SET NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Maps variants to their option value combination
CREATE TABLE variant_option_values (
    variant_id      UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    option_value_id UUID NOT NULL REFERENCES product_option_values(id) ON DELETE CASCADE,
    PRIMARY KEY (variant_id, option_value_id)
);

-- Product ↔ Collection many-to-many
CREATE TABLE product_collections (
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    collection_id   UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    sort_order      INT DEFAULT 0,
    PRIMARY KEY (product_id, collection_id)
);
```

### Wishlist

```sql
CREATE TABLE wishlist_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id      UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id, variant_id)
);
```

### Cart

```sql
-- Persistent cart (survives sessions for logged-in users)
CREATE TABLE carts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,  -- null = guest cart
    session_id      VARCHAR(255),              -- for guest cart identification
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cart_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id         UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id      UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity        INT NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Orders

```sql
CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number    VARCHAR(30) UNIQUE NOT NULL,  -- human-readable (e.g., FM-20260001)
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    email           VARCHAR(255) NOT NULL,        -- for guest orders
    status          VARCHAR(30) DEFAULT 'pending',
                    -- pending | confirmed | processing | shipped | delivered | cancelled | refunded
    subtotal        DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount      DECIMAL(10,2) DEFAULT 0,
    total           DECIMAL(10,2) NOT NULL,
    currency        VARCHAR(3) DEFAULT 'USD',

    -- Shipping address snapshot (not a FK — preserved even if address deleted)
    shipping_first_name  VARCHAR(100),
    shipping_last_name   VARCHAR(100),
    shipping_address1    VARCHAR(255),
    shipping_address2    VARCHAR(255),
    shipping_city        VARCHAR(100),
    shipping_state       VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_country     VARCHAR(2),
    shipping_phone       VARCHAR(30),

    -- Billing address snapshot
    billing_first_name   VARCHAR(100),
    billing_last_name    VARCHAR(100),
    billing_address1     VARCHAR(255),
    billing_address2     VARCHAR(255),
    billing_city         VARCHAR(100),
    billing_state        VARCHAR(100),
    billing_postal_code  VARCHAR(20),
    billing_country      VARCHAR(2),

    shipping_method      VARCHAR(100),
    tracking_number      VARCHAR(255),
    tracking_url         VARCHAR(500),

    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id     VARCHAR(255),

    discount_code_id     UUID REFERENCES discount_codes(id) ON DELETE SET NULL,

    notes               TEXT,                     -- internal admin notes
    customer_notes      TEXT,                     -- notes from customer at checkout

    placed_at           TIMESTAMPTZ DEFAULT NOW(),
    shipped_at          TIMESTAMPTZ,
    delivered_at        TIMESTAMPTZ,
    cancelled_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id      UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id      UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name    VARCHAR(255) NOT NULL,     -- snapshot
    variant_name    VARCHAR(255),              -- snapshot
    sku             VARCHAR(100),
    quantity        INT NOT NULL,
    unit_price      DECIMAL(10,2) NOT NULL,
    total_price     DECIMAL(10,2) NOT NULL,
    image_url       VARCHAR(500),              -- snapshot
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Order status change log
CREATE TABLE order_status_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    from_status     VARCHAR(30),
    to_status       VARCHAR(30) NOT NULL,
    changed_by      UUID REFERENCES users(id) ON DELETE SET NULL,  -- admin user
    note            TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Reviews

```sql
CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_item_id   UUID REFERENCES order_items(id) ON DELETE SET NULL,  -- verified purchase link
    rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title           VARCHAR(200),
    body            TEXT,
    is_approved     BOOLEAN DEFAULT FALSE,     -- admin moderation
    is_featured     BOOLEAN DEFAULT FALSE,
    admin_response  TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE review_images (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id       UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    cloudflare_image_id VARCHAR(255) NOT NULL,
    url             VARCHAR(500) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Discounts & Promos

```sql
CREATE TABLE discount_codes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(50) UNIQUE NOT NULL,
    description     TEXT,
    type            VARCHAR(20) NOT NULL,       -- percentage | fixed_amount | free_shipping
    value           DECIMAL(10,2) NOT NULL,     -- percentage value or dollar amount
    minimum_order   DECIMAL(10,2),              -- minimum cart total to apply
    max_uses        INT,                        -- total uses allowed (null = unlimited)
    max_uses_per_user INT DEFAULT 1,
    used_count      INT DEFAULT 0,
    applies_to      VARCHAR(30) DEFAULT 'all',  -- all | specific_products | specific_categories
    is_active       BOOLEAN DEFAULT TRUE,
    starts_at       TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Which products/categories a discount applies to (when applies_to != 'all')
CREATE TABLE discount_targets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discount_code_id UUID NOT NULL REFERENCES discount_codes(id) ON DELETE CASCADE,
    target_type     VARCHAR(20) NOT NULL,       -- product | category
    target_id       UUID NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Email & Marketing

```sql
-- Newsletter subscribers (may not have an account)
CREATE TABLE email_subscribers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    source          VARCHAR(50),               -- footer | popup | checkout | trade_form
    brevo_contact_id VARCHAR(100),
    is_subscribed   BOOLEAN DEFAULT TRUE,
    subscribed_at   TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Abandoned cart tracking for Brevo automations
CREATE TABLE abandoned_cart_emails (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id         UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    email           VARCHAR(255) NOT NULL,
    sent_at         TIMESTAMPTZ,
    recovered       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Blog / Content

```sql
CREATE TABLE blog_posts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(255) NOT NULL,
    slug            VARCHAR(280) UNIQUE NOT NULL,
    excerpt         VARCHAR(500),
    body            TEXT NOT NULL,              -- rich text / HTML
    cover_image_url VARCHAR(500),
    author_id       UUID REFERENCES users(id) ON DELETE SET NULL,
    is_published    BOOLEAN DEFAULT FALSE,
    published_at    TIMESTAMPTZ,
    meta_title      VARCHAR(255),
    meta_description VARCHAR(500),
    tags            TEXT[],
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Admin & CMS

```sql
-- Editable page content blocks (hero banners, feature sections, etc.)
CREATE TABLE page_content (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key        VARCHAR(100) NOT NULL,     -- 'homepage_hero', 'about_story', etc.
    section_key     VARCHAR(100) NOT NULL,
    content         JSONB NOT NULL,            -- flexible structure per section type
    sort_order      INT DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(page_key, section_key)
);

-- Staff activity log
CREATE TABLE admin_audit_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action          VARCHAR(100) NOT NULL,     -- 'product.created', 'order.status_changed'
    entity_type     VARCHAR(50),               -- 'product', 'order', 'user'
    entity_id       UUID,
    metadata        JSONB,                     -- action-specific details
    ip_address      VARCHAR(45),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Media library index (mirrors Cloudflare Images for browsing)
CREATE TABLE media (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cloudflare_image_id VARCHAR(255) UNIQUE NOT NULL,
    url             VARCHAR(500) NOT NULL,
    filename        VARCHAR(255),
    alt_text        VARCHAR(255),
    folder          VARCHAR(100),              -- for organizing in admin media library
    file_size       INT,
    width           INT,
    height          INT,
    uploaded_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Shipping & Tax Configuration

```sql
CREATE TABLE shipping_zones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,     -- "Domestic", "West Coast", "International"
    countries       TEXT[],                    -- ISO codes
    states          TEXT[],                    -- state/province codes (optional)
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shipping_rates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id         UUID NOT NULL REFERENCES shipping_zones(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,     -- "Standard", "Express", "White Glove"
    description     VARCHAR(255),
    price           DECIMAL(10,2) NOT NULL,
    min_order_total DECIMAL(10,2),             -- free shipping above this amount
    min_weight      DECIMAL(8,2),
    max_weight      DECIMAL(8,2),
    estimated_days_min INT,
    estimated_days_max INT,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tax_rates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    country         VARCHAR(2) NOT NULL,
    state           VARCHAR(10),               -- null = applies to entire country
    rate            DECIMAL(5,4) NOT NULL,     -- e.g., 0.0825 for 8.25%
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Trade Program

```sql
CREATE TABLE trade_applications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    business_name   VARCHAR(255) NOT NULL,
    business_type   VARCHAR(100),              -- interior designer, architect, etc.
    tax_id          VARCHAR(50),
    website         VARCHAR(500),
    portfolio_url   VARCHAR(500),
    message         TEXT,
    status          VARCHAR(20) DEFAULT 'pending',  -- pending | approved | rejected
    reviewed_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes

```sql
-- Performance indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_published ON products(is_published, published_at);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_placed_at ON orders(placed_at);
CREATE INDEX idx_orders_number ON orders(order_number);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_wishlist_user ON wishlist_items(user_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved) WHERE is_approved = TRUE;

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_collections_slug ON collections(slug);

CREATE INDEX idx_blog_published ON blog_posts(is_published, published_at);
CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);

CREATE INDEX idx_audit_log_user ON admin_audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON admin_audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created ON admin_audit_log(created_at);
```

---

## Third-Party Integration Points

### Stripe

- **Checkout:** Create PaymentIntent on order submission, confirm via Stripe Elements
- **Webhooks:** Listen for `payment_intent.succeeded`, `charge.refunded`, `payment_intent.payment_failed`
- **Refunds:** Trigger via Stripe API from admin order detail page
- **Endpoint:** `/api/webhooks/stripe`

### Brevo (Email)

- **Transactional emails:** Order confirmation, shipping notification, password reset, email verification, review request
- **Contact sync:** On registration and newsletter signup, create/update Brevo contact via API
- **Automations:** Welcome series, abandoned cart (triggered by cron job checking stale carts), wishlist price drop, post-purchase review request
- **Lists/Tags:** Segment contacts by `customer`, `subscriber`, `trade-applicant`, `trade-approved`
- **Endpoint:** `/api/webhooks/brevo` (for unsubscribe sync)

### Cloudflare Images

- **Upload:** Admin uploads product/blog/media images → direct upload via Cloudflare Images API
- **Delivery:** Use Cloudflare image delivery URLs with variant transforms (thumbnail, medium, large, zoom)
- **Variants configured:** `thumbnail` (200px), `card` (600px), `detail` (1200px), `zoom` (2400px)
- **Flow:** Admin browser → presigned upload URL from API route → direct upload to Cloudflare → store image ID and URL in DB

### Vercel

- **Deployment:** Push to main → auto-deploy production; PRs → preview deploys
- **Edge functions:** Middleware for auth checks, geo-based shipping estimates
- **Cron jobs:** Vercel Cron for abandoned cart checks, sitemap regeneration
- **Environment variables:** Stripe keys, Brevo API key, Cloudflare API token, Neon connection string

---

## Admin Roles & Permissions

| Permission | Admin (Owner) | Staff |
|---|---|---|
| Manage products | Yes | Yes |
| Manage orders | Yes | Yes |
| Issue refunds | Yes | No |
| Manage discounts | Yes | No |
| Manage blog | Yes | Yes |
| View customers | Yes | Yes |
| Export customer data | Yes | No |
| Manage team accounts | Yes | No |
| Edit store settings | Yes | No |
| View analytics | Yes | Yes |
| Moderate reviews | Yes | Yes |
| Manage pages/content | Yes | No |
| Access audit log | Yes | No |

---

## SEO & Performance Considerations

- Server-side rendering for all storefront pages (Next.js App Router with server components)
- Dynamic sitemap generation (`/sitemap.xml`) including products, categories, collections, blog posts
- Structured data (JSON-LD) on product pages, blog posts, and breadcrumbs
- OpenGraph and Twitter Card meta tags on all public pages
- Canonical URLs on all pages
- Image optimization via Cloudflare Images variants (no over-fetching)
- ISR (Incremental Static Regeneration) for product and category pages
- Edge middleware for redirects and geo-detection
- Core Web Vitals: lazy-load below-fold images, preload hero images, minimize CLS on product grid

---

## Brevo Email Templates Required

| Email | Trigger |
|---|---|
| Welcome | Account registration |
| Email verification | Account registration |
| Password reset | Forgot password request |
| Order confirmation | Successful checkout |
| Shipping notification | Admin updates order to "shipped" |
| Delivery confirmation | Admin updates order to "delivered" |
| Review request | 7 days after delivery |
| Abandoned cart (1hr) | Cart idle 1 hour with email on file |
| Abandoned cart (24hr) | Cart idle 24 hours — second reminder |
| Wishlist price drop | Product on wishlist goes on sale |
| Back in stock | Previously out-of-stock item restocked |
| Newsletter welcome | Newsletter signup (non-account) |
| Trade program received | Trade application submitted |
| Trade program approved | Admin approves trade application |
| Trade program rejected | Admin rejects trade application |
