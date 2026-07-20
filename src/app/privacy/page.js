import LegalPage from '@/components/layout/LegalPage'

export const metadata = { title: 'Privacy Policy' }

// NOTE: template content — have counsel review before launch.
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 14, 2026">
      <p>
        Firman Furniture (“we”, “us”) respects your privacy. This policy explains what information we
        collect, how we use it, and the choices you have.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li><strong>Account details</strong> — name, email, and password hash when you create an account.</li>
        <li><strong>Order details</strong> — items purchased, shipping address, and contact information.</li>
        <li><strong>Payment</strong> — processed entirely by Stripe. We never see or store your full card number.</li>
        <li><strong>Usage</strong> — basic technical logs (IP address, pages viewed) for security and troubleshooting.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To fulfil and deliver your orders and provide customer service.</li>
        <li>To send transactional email (order confirmations, password resets).</li>
        <li>To send marketing email only when you opt in — unsubscribe at any time.</li>
        <li>To protect the site against fraud and abuse.</li>
      </ul>
      <h2>Sharing</h2>
      <p>
        We share data only with the service providers required to run the store — Stripe (payments),
        our delivery partners (shipping), and our email provider (transactional messages). We do not
        sell your personal information.
      </p>
      <h2>Retention &amp; your rights</h2>
      <p>
        Order records are retained as required for tax and accounting purposes. You may request a copy
        or deletion of your personal data at any time by contacting us via the contact page.
      </p>
      <h2>Contact</h2>
      <p>Questions about this policy? Reach us through the contact page and we’ll respond promptly.</p>
    </LegalPage>
  )
}
