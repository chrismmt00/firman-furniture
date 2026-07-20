import LegalPage from '@/components/layout/LegalPage'

export const metadata = { title: 'Shipping & Returns' }

// NOTE: template content — align numbers with your actual operations before launch.
export default function ShippingReturnsPage() {
  return (
    <LegalPage title="Shipping & Returns" updated="July 14, 2026">
      <h2>Delivery options</h2>
      <ul>
        <li>
          <strong>White-Glove Delivery — complimentary.</strong> In-home placement, assembly, and
          packaging removal. Typical window: 3–5 weeks after your piece is ready.
        </li>
        <li>
          <strong>Standard Freight — $250.</strong> Curbside delivery, 1–2 weeks after your piece is
          ready.
        </li>
      </ul>
      <h2>Made-to-order lead times</h2>
      <p>
        Made-to-order pieces are crafted for you with a typical lead time of 6–8 weeks before
        delivery scheduling. In-stock items move straight to delivery.
      </p>
      <h2>Returns</h2>
      <ul>
        <li>In-stock items may be returned within 30 days of delivery in original condition.</li>
        <li>Made-to-order pieces are crafted specifically for you and are not returnable, except for defects.</li>
        <li>To start a return, contact us with your order number via the contact page.</li>
      </ul>
      <h2>Refunds</h2>
      <p>
        Once a return is received and inspected, refunds are issued to the original payment method
        within 5–10 business days. Outbound shipping charges are non-refundable; return freight for
        non-defective items is the customer’s responsibility.
      </p>
      <h2>Damage on arrival</h2>
      <p>
        Please inspect your piece at delivery. Report damage within 48 hours with photos and we will
        arrange repair, replacement, or refund at no cost to you.
      </p>
    </LegalPage>
  )
}
