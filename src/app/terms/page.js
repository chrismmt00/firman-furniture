import LegalPage from '@/components/layout/LegalPage'

export const metadata = { title: 'Terms of Service' }

// NOTE: template content — have counsel review before launch.
export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="July 14, 2026">
      <p>
        These terms govern your use of the Firman Furniture website and your purchases from us. By
        placing an order you agree to these terms.
      </p>
      <h2>Orders &amp; payment</h2>
      <ul>
        <li>All prices are in USD. Payment is collected securely by Stripe at checkout.</li>
        <li>An order is accepted when payment succeeds and you receive a confirmation email.</li>
        <li>We may cancel and refund an order affected by an obvious pricing or stock error.</li>
      </ul>
      <h2>Made-to-order items</h2>
      <p>
        Many pieces are made to order with a typical lead time of 6–8 weeks. Lead times are estimates
        and may vary; we will keep you informed of significant changes.
      </p>
      <h2>Delivery</h2>
      <p>
        Delivery options, timing, and responsibilities are described in our{' '}
        <a href="/shipping-returns" className="underline">Shipping &amp; Returns policy</a>.
      </p>
      <h2>Returns &amp; refunds</h2>
      <p>
        Return eligibility and the refund process are described in our{' '}
        <a href="/shipping-returns" className="underline">Shipping &amp; Returns policy</a>. Refunds are
        issued to the original payment method.
      </p>
      <h2>Accounts</h2>
      <p>
        You are responsible for keeping your account credentials confidential. We may suspend accounts
        used for fraud or abuse.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, our liability for any claim related to an order is
        limited to the amount you paid for that order.
      </p>
      <h2>Changes</h2>
      <p>We may update these terms; the “last updated” date above reflects the current version.</p>
    </LegalPage>
  )
}
