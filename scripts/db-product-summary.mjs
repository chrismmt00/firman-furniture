import postgres from 'postgres'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required.')
}

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  prepare: false,
})

try {
  const [products] = await sql`SELECT COUNT(*)::int AS count FROM products`
  const [images] = await sql`SELECT COUNT(*)::int AS count FROM product_images`
  const [variantGroups] = await sql`
    SELECT COUNT(DISTINCT substring(tag FROM 21))::int AS count
    FROM products, unnest(tags) tag
    WHERE tag LIKE 'color-variant-group:%'
  `
  const [variantTaggedProducts] = await sql`
    SELECT COUNT(*)::int AS count
    FROM products
    WHERE EXISTS (
      SELECT 1
      FROM unnest(tags) tag
      WHERE tag LIKE 'color-variant-group:%'
    )
  `

  console.log(
    JSON.stringify(
      {
        products: products.count,
        images: images.count,
        variantGroups: variantGroups.count,
        variantTaggedProducts: variantTaggedProducts.count,
      },
      null,
      2
    )
  )
} finally {
  await sql.end()
}
