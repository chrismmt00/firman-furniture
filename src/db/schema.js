import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['customer', 'staff', 'admin'])
export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
])
export const reviewStatusEnum = pgEnum('review_status', ['pending', 'approved', 'rejected'])
export const discountTypeEnum = pgEnum('discount_type', ['percentage', 'fixed_amount', 'free_shipping'])
export const discountTargetEnum = pgEnum('discount_target', ['product', 'category', 'collection'])
export const visibilityStatusEnum = pgEnum('visibility_status', ['draft', 'published', 'scheduled', 'archived'])
export const tradeApplicationStatusEnum = pgEnum('trade_application_status', [
  'pending',
  'approved',
  'rejected',
])

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }),
    firstName: varchar('first_name', { length: 100 }),
    lastName: varchar('last_name', { length: 100 }),
    phone: varchar('phone', { length: 30 }),
    role: userRoleEnum('role').default('customer').notNull(),
    emailVerified: timestamp('email_verified', { withTimezone: true }),
    isTrade: boolean('is_trade').default(false).notNull(),
    brevoContactId: varchar('brevo_contact_id', { length: 100 }),
    avatarUrl: varchar('avatar_url', { length: 500 }),
    ...timestamps,
  },
  (table) => ({
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
    roleIdx: index('users_role_idx').on(table.role),
  })
)

export const oauthAccounts = pgTable(
  'oauth_accounts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: varchar('provider', { length: 50 }).notNull(),
    providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    providerAccountIdx: uniqueIndex('oauth_accounts_provider_account_idx').on(
      table.provider,
      table.providerAccountId
    ),
    userIdx: index('oauth_accounts_user_idx').on(table.userId),
  })
)

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    sessionToken: varchar('session_token', { length: 255 }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tokenIdx: uniqueIndex('sessions_token_idx').on(table.sessionToken),
    userIdx: index('sessions_user_idx').on(table.userId),
  })
)

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: varchar('token', { length: 255 }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    used: boolean('used').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tokenIdx: uniqueIndex('password_reset_tokens_token_idx').on(table.token),
  })
)

export const addresses = pgTable(
  'addresses',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    label: varchar('label', { length: 50 }),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    addressLine1: varchar('address_line1', { length: 255 }).notNull(),
    addressLine2: varchar('address_line2', { length: 255 }),
    city: varchar('city', { length: 100 }).notNull(),
    state: varchar('state', { length: 100 }),
    postalCode: varchar('postal_code', { length: 20 }).notNull(),
    country: varchar('country', { length: 2 }).notNull(),
    phone: varchar('phone', { length: 30 }),
    isDefault: boolean('is_default').default(false).notNull(),
    ...timestamps,
  },
  (table) => ({
    userIdx: index('addresses_user_idx').on(table.userId),
  })
)

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 120 }).notNull(),
    description: text('description'),
    imageUrl: varchar('image_url', { length: 500 }),
    parentId: uuid('parent_id').references(() => categories.id, { onDelete: 'set null' }),
    sortOrder: integer('sort_order').default(0).notNull(),
    isVisible: boolean('is_visible').default(true).notNull(),
    ...timestamps,
  },
  (table) => ({
    slugIdx: uniqueIndex('categories_slug_idx').on(table.slug),
    parentIdx: index('categories_parent_idx').on(table.parentId),
  })
)

export const collections = pgTable(
  'collections',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 150 }).notNull(),
    slug: varchar('slug', { length: 170 }).notNull(),
    description: text('description'),
    imageUrl: varchar('image_url', { length: 500 }),
    isVisible: boolean('is_visible').default(true).notNull(),
    sortOrder: integer('sort_order').default(0).notNull(),
    ...timestamps,
  },
  (table) => ({
    slugIdx: uniqueIndex('collections_slug_idx').on(table.slug),
  })
)

export const products = pgTable(
  'products',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 280 }).notNull(),
    description: text('description'),
    shortDescription: varchar('short_description', { length: 500 }),
    priceCents: integer('price_cents').notNull(),
    compareAtPriceCents: integer('compare_at_price_cents'),
    costPriceCents: integer('cost_price_cents'),
    tradePriceCents: integer('trade_price_cents'),
    sku: varchar('sku', { length: 100 }),
    barcode: varchar('barcode', { length: 100 }),
    weightValue: integer('weight_value'),
    weightUnit: varchar('weight_unit', { length: 5 }).default('lb').notNull(),
    lengthValue: integer('length_value'),
    widthValue: integer('width_value'),
    heightValue: integer('height_value'),
    dimensionUnit: varchar('dimension_unit', { length: 5 }).default('in').notNull(),
    material: varchar('material', { length: 255 }),
    color: varchar('color', { length: 100 }),
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
    status: visibilityStatusEnum('status').default('draft').notNull(),
    isFeatured: boolean('is_featured').default(false).notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    metaTitle: varchar('meta_title', { length: 255 }),
    metaDescription: varchar('meta_description', { length: 500 }),
    ogImageUrl: varchar('og_image_url', { length: 500 }),
    trackInventory: boolean('track_inventory').default(true).notNull(),
    stockQuantity: integer('stock_quantity').default(0).notNull(),
    lowStockThreshold: integer('low_stock_threshold').default(5).notNull(),
    allowBackorder: boolean('allow_backorder').default(false).notNull(),
    tags: text('tags').array(),
    ...timestamps,
  },
  (table) => ({
    slugIdx: uniqueIndex('products_slug_idx').on(table.slug),
    skuIdx: uniqueIndex('products_sku_idx').on(table.sku),
    categoryIdx: index('products_category_idx').on(table.categoryId),
    statusIdx: index('products_status_idx').on(table.status, table.publishedAt),
    featuredIdx: index('products_featured_idx').on(table.isFeatured),
  })
)

export const productImages = pgTable(
  'product_images',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    cloudflareImageId: varchar('cloudflare_image_id', { length: 255 }).notNull(),
    url: varchar('url', { length: 500 }).notNull(),
    altText: varchar('alt_text', { length: 255 }),
    sortOrder: integer('sort_order').default(0).notNull(),
    isPrimary: boolean('is_primary').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    productIdx: index('product_images_product_idx').on(table.productId),
  })
)

export const productOptionTypes = pgTable(
  'product_option_types',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    sortOrder: integer('sort_order').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    productIdx: index('product_option_types_product_idx').on(table.productId),
  })
)

export const productOptionValues = pgTable(
  'product_option_values',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    optionTypeId: uuid('option_type_id')
      .notNull()
      .references(() => productOptionTypes.id, { onDelete: 'cascade' }),
    value: varchar('value', { length: 100 }).notNull(),
    sortOrder: integer('sort_order').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    optionTypeIdx: index('product_option_values_type_idx').on(table.optionTypeId),
  })
)

export const productVariants = pgTable(
  'product_variants',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    sku: varchar('sku', { length: 100 }),
    priceCents: integer('price_cents'),
    compareAtPriceCents: integer('compare_at_price_cents'),
    costPriceCents: integer('cost_price_cents'),
    stockQuantity: integer('stock_quantity').default(0).notNull(),
    weightValue: integer('weight_value'),
    imageId: uuid('image_id').references(() => productImages.id, { onDelete: 'set null' }),
    isActive: boolean('is_active').default(true).notNull(),
    ...timestamps,
  },
  (table) => ({
    productIdx: index('product_variants_product_idx').on(table.productId),
    skuIdx: uniqueIndex('product_variants_sku_idx').on(table.sku),
  })
)

export const variantOptionValues = pgTable(
  'variant_option_values',
  {
    variantId: uuid('variant_id')
      .notNull()
      .references(() => productVariants.id, { onDelete: 'cascade' }),
    optionValueId: uuid('option_value_id')
      .notNull()
      .references(() => productOptionValues.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.variantId, table.optionValueId] }),
  })
)

export const productCollections = pgTable(
  'product_collections',
  {
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    collectionId: uuid('collection_id')
      .notNull()
      .references(() => collections.id, { onDelete: 'cascade' }),
    sortOrder: integer('sort_order').default(0).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.productId, table.collectionId] }),
  })
)

export const discountCodes = pgTable(
  'discount_codes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    code: varchar('code', { length: 50 }).notNull(),
    description: text('description'),
    type: discountTypeEnum('type').notNull(),
    value: integer('value').notNull(),
    minimumOrderCents: integer('minimum_order_cents'),
    maxUses: integer('max_uses'),
    maxUsesPerUser: integer('max_uses_per_user').default(1).notNull(),
    usedCount: integer('used_count').default(0).notNull(),
    appliesTo: varchar('applies_to', { length: 30 }).default('all').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    startsAt: timestamp('starts_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    ...timestamps,
  },
  (table) => ({
    codeIdx: uniqueIndex('discount_codes_code_idx').on(table.code),
    activeIdx: index('discount_codes_active_idx').on(table.isActive),
  })
)

export const discountTargets = pgTable(
  'discount_targets',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    discountCodeId: uuid('discount_code_id')
      .notNull()
      .references(() => discountCodes.id, { onDelete: 'cascade' }),
    targetType: discountTargetEnum('target_type').notNull(),
    targetId: uuid('target_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    discountIdx: index('discount_targets_discount_idx').on(table.discountCodeId),
  })
)

export const carts = pgTable(
  'carts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    sessionId: varchar('session_id', { length: 255 }),
    ...timestamps,
  },
  (table) => ({
    userIdx: index('carts_user_idx').on(table.userId),
    sessionIdx: index('carts_session_idx').on(table.sessionId),
  })
)

export const cartItems = pgTable(
  'cart_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    cartId: uuid('cart_id')
      .notNull()
      .references(() => carts.id, { onDelete: 'cascade' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'set null' }),
    quantity: integer('quantity').default(1).notNull(),
    ...timestamps,
  },
  (table) => ({
    cartIdx: index('cart_items_cart_idx').on(table.cartId),
  })
)

export const orders = pgTable(
  'orders',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderNumber: varchar('order_number', { length: 30 }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    email: varchar('email', { length: 255 }).notNull(),
    status: orderStatusEnum('status').default('pending').notNull(),
    subtotalCents: integer('subtotal_cents').notNull(),
    discountAmountCents: integer('discount_amount_cents').default(0).notNull(),
    shippingAmountCents: integer('shipping_amount_cents').default(0).notNull(),
    taxAmountCents: integer('tax_amount_cents').default(0).notNull(),
    totalCents: integer('total_cents').notNull(),
    currency: varchar('currency', { length: 3 }).default('USD').notNull(),
    shippingFirstName: varchar('shipping_first_name', { length: 100 }),
    shippingLastName: varchar('shipping_last_name', { length: 100 }),
    shippingAddress1: varchar('shipping_address1', { length: 255 }),
    shippingAddress2: varchar('shipping_address2', { length: 255 }),
    shippingCity: varchar('shipping_city', { length: 100 }),
    shippingState: varchar('shipping_state', { length: 100 }),
    shippingPostalCode: varchar('shipping_postal_code', { length: 20 }),
    shippingCountry: varchar('shipping_country', { length: 2 }),
    shippingPhone: varchar('shipping_phone', { length: 30 }),
    billingFirstName: varchar('billing_first_name', { length: 100 }),
    billingLastName: varchar('billing_last_name', { length: 100 }),
    billingAddress1: varchar('billing_address1', { length: 255 }),
    billingAddress2: varchar('billing_address2', { length: 255 }),
    billingCity: varchar('billing_city', { length: 100 }),
    billingState: varchar('billing_state', { length: 100 }),
    billingPostalCode: varchar('billing_postal_code', { length: 20 }),
    billingCountry: varchar('billing_country', { length: 2 }),
    shippingMethod: varchar('shipping_method', { length: 100 }),
    trackingNumber: varchar('tracking_number', { length: 255 }),
    trackingUrl: varchar('tracking_url', { length: 500 }),
    stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
    stripeChargeId: varchar('stripe_charge_id', { length: 255 }),
    discountCodeId: uuid('discount_code_id').references(() => discountCodes.id, { onDelete: 'set null' }),
    notes: text('notes'),
    customerNotes: text('customer_notes'),
    placedAt: timestamp('placed_at', { withTimezone: true }).defaultNow().notNull(),
    shippedAt: timestamp('shipped_at', { withTimezone: true }),
    deliveredAt: timestamp('delivered_at', { withTimezone: true }),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    ...timestamps,
  },
  (table) => ({
    numberIdx: uniqueIndex('orders_number_idx').on(table.orderNumber),
    userIdx: index('orders_user_idx').on(table.userId),
    statusIdx: index('orders_status_idx').on(table.status),
    placedAtIdx: index('orders_placed_at_idx').on(table.placedAt),
  })
)

export const orderItems = pgTable(
  'order_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
    variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'set null' }),
    productName: varchar('product_name', { length: 255 }).notNull(),
    variantName: varchar('variant_name', { length: 255 }),
    sku: varchar('sku', { length: 100 }),
    quantity: integer('quantity').notNull(),
    unitPriceCents: integer('unit_price_cents').notNull(),
    totalPriceCents: integer('total_price_cents').notNull(),
    imageUrl: varchar('image_url', { length: 500 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orderIdx: index('order_items_order_idx').on(table.orderId),
  })
)

export const orderStatusHistory = pgTable(
  'order_status_history',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    fromStatus: orderStatusEnum('from_status'),
    toStatus: orderStatusEnum('to_status').notNull(),
    changedBy: uuid('changed_by').references(() => users.id, { onDelete: 'set null' }),
    note: text('note'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orderIdx: index('order_status_history_order_idx').on(table.orderId),
  })
)

export const wishlistItems = pgTable(
  'wishlist_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    uniqueItemIdx: uniqueIndex('wishlist_items_unique_idx').on(
      table.userId,
      table.productId,
      table.variantId
    ),
    userIdx: index('wishlist_items_user_idx').on(table.userId),
  })
)

export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    orderItemId: uuid('order_item_id').references(() => orderItems.id, { onDelete: 'set null' }),
    rating: integer('rating').notNull(),
    title: varchar('title', { length: 200 }),
    body: text('body'),
    status: reviewStatusEnum('status').default('pending').notNull(),
    isFeatured: boolean('is_featured').default(false).notNull(),
    adminResponse: text('admin_response'),
    ...timestamps,
  },
  (table) => ({
    productIdx: index('reviews_product_idx').on(table.productId),
    statusIdx: index('reviews_status_idx').on(table.status),
  })
)

export const reviewImages = pgTable(
  'review_images',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    reviewId: uuid('review_id')
      .notNull()
      .references(() => reviews.id, { onDelete: 'cascade' }),
    cloudflareImageId: varchar('cloudflare_image_id', { length: 255 }).notNull(),
    url: varchar('url', { length: 500 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    reviewIdx: index('review_images_review_idx').on(table.reviewId),
  })
)

export const emailSubscribers = pgTable(
  'email_subscribers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    source: varchar('source', { length: 50 }),
    brevoContactId: varchar('brevo_contact_id', { length: 100 }),
    isSubscribed: boolean('is_subscribed').default(true).notNull(),
    subscribedAt: timestamp('subscribed_at', { withTimezone: true }).defaultNow().notNull(),
    unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex('email_subscribers_email_idx').on(table.email),
  })
)

export const abandonedCartEmails = pgTable('abandoned_cart_emails', {
  id: uuid('id').defaultRandom().primaryKey(),
  cartId: uuid('cart_id')
    .notNull()
    .references(() => carts.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }).notNull(),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  recovered: boolean('recovered').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const blogPosts = pgTable(
  'blog_posts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 280 }).notNull(),
    excerpt: varchar('excerpt', { length: 500 }),
    body: text('body').notNull(),
    coverImageUrl: varchar('cover_image_url', { length: 500 }),
    authorId: uuid('author_id').references(() => users.id, { onDelete: 'set null' }),
    status: visibilityStatusEnum('status').default('draft').notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    metaTitle: varchar('meta_title', { length: 255 }),
    metaDescription: varchar('meta_description', { length: 500 }),
    tags: text('tags').array(),
    ...timestamps,
  },
  (table) => ({
    slugIdx: uniqueIndex('blog_posts_slug_idx').on(table.slug),
    statusIdx: index('blog_posts_status_idx').on(table.status, table.publishedAt),
  })
)

export const pageContent = pgTable(
  'page_content',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    pageKey: varchar('page_key', { length: 100 }).notNull(),
    sectionKey: varchar('section_key', { length: 100 }).notNull(),
    content: jsonb('content').notNull(),
    sortOrder: integer('sort_order').default(0).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    ...timestamps,
  },
  (table) => ({
    sectionIdx: uniqueIndex('page_content_section_idx').on(table.pageKey, table.sectionKey),
  })
)

export const adminAuditLog = pgTable(
  'admin_audit_log',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    action: varchar('action', { length: 100 }).notNull(),
    entityType: varchar('entity_type', { length: 50 }),
    entityId: uuid('entity_id'),
    metadata: jsonb('metadata'),
    ipAddress: varchar('ip_address', { length: 45 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index('admin_audit_log_user_idx').on(table.userId),
    entityIdx: index('admin_audit_log_entity_idx').on(table.entityType, table.entityId),
    createdAtIdx: index('admin_audit_log_created_idx').on(table.createdAt),
  })
)

export const media = pgTable(
  'media',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    cloudflareImageId: varchar('cloudflare_image_id', { length: 255 }).notNull(),
    url: varchar('url', { length: 500 }).notNull(),
    filename: varchar('filename', { length: 255 }),
    altText: varchar('alt_text', { length: 255 }),
    folder: varchar('folder', { length: 100 }),
    fileSize: integer('file_size'),
    width: integer('width'),
    height: integer('height'),
    uploadedBy: uuid('uploaded_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    cloudflareIdx: uniqueIndex('media_cloudflare_image_idx').on(table.cloudflareImageId),
  })
)

export const shippingZones = pgTable('shipping_zones', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  countries: text('countries').array(),
  states: text('states').array(),
  ...timestamps,
})

export const shippingRates = pgTable(
  'shipping_rates',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    zoneId: uuid('zone_id')
      .notNull()
      .references(() => shippingZones.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    description: varchar('description', { length: 255 }),
    priceCents: integer('price_cents').notNull(),
    minOrderTotalCents: integer('min_order_total_cents'),
    minWeightValue: integer('min_weight_value'),
    maxWeightValue: integer('max_weight_value'),
    estimatedDaysMin: integer('estimated_days_min'),
    estimatedDaysMax: integer('estimated_days_max'),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    zoneIdx: index('shipping_rates_zone_idx').on(table.zoneId),
  })
)

export const taxRates = pgTable(
  'tax_rates',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    country: varchar('country', { length: 2 }).notNull(),
    state: varchar('state', { length: 10 }),
    rateBasisPoints: integer('rate_basis_points').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    locationIdx: index('tax_rates_location_idx').on(table.country, table.state),
  })
)

export const tradeApplications = pgTable(
  'trade_applications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    businessName: varchar('business_name', { length: 255 }).notNull(),
    businessType: varchar('business_type', { length: 100 }),
    taxId: varchar('tax_id', { length: 50 }),
    website: varchar('website', { length: 500 }),
    portfolioUrl: varchar('portfolio_url', { length: 500 }),
    message: text('message'),
    status: tradeApplicationStatusEnum('status').default('pending').notNull(),
    reviewedBy: uuid('reviewed_by').references(() => users.id, { onDelete: 'set null' }),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    statusIdx: index('trade_applications_status_idx').on(table.status),
    userIdx: index('trade_applications_user_idx').on(table.userId),
  })
)
