import { formatCentsExact } from './format'

// Transactional email via Brevo's REST API (no SDK needed).
// Design rules:
//  - Email is always sent from background/webhook paths, never blocking checkout.
//  - A send failure NEVER throws to the caller — it logs and returns false, so a
//    provider outage can't break auth flows or webhook processing.
//  - Without BREVO_API_KEY (local dev), messages log to the console instead.

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email'

function sender() {
  return {
    email: process.env.BREVO_SENDER_EMAIL || 'hello@firmanfurniture.com',
    name: process.env.BREVO_SENDER_NAME || 'Firman Furniture',
  }
}

async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`[email:dev] To: ${to} | ${subject}\n${html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300)}`)
    } else {
      console.error('[email] BREVO_API_KEY missing — email not sent:', subject)
    }
    return false
  }

  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ sender: sender(), to: [{ email: to }], subject, htmlContent: html }),
    })
    if (!res.ok) {
      console.error(`[email] Brevo responded ${res.status}:`, (await res.text()).slice(0, 300))
      return false
    }
    return true
  } catch (err) {
    console.error('[email] send failed:', err.message)
    return false
  }
}

/* Minimal, inline-styled shell that renders acceptably in all major clients. */
function shell(title, bodyHtml) {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f8f6f2;font-family:Georgia,'Times New Roman',serif;color:#2b2b28;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <p style="text-align:center;font-size:26px;letter-spacing:2px;margin:0 0 28px;">FIRMAN</p>
    <div style="background:#ffffff;border:1px solid #e4dfd6;padding:32px;">
      <h1 style="font-size:20px;font-weight:normal;margin:0 0 16px;">${title}</h1>
      ${bodyHtml}
    </div>
    <p style="text-align:center;font-size:11px;color:#9a9488;margin-top:24px;">Firman Furniture · This email was sent automatically, please do not reply.</p>
  </div>
</body></html>`
}

export async function sendPasswordResetEmail(email, resetUrl) {
  return sendEmail({
    to: email,
    subject: 'Reset your Firman Furniture password',
    html: shell(
      'Reset your password',
      `<p style="font-size:14px;line-height:1.6;">We received a request to reset the password for your account. This link is valid for 1 hour.</p>
       <p style="text-align:center;margin:28px 0;">
         <a href="${resetUrl}" style="background:#1c1b1a;color:#f8f6f2;text-decoration:none;padding:14px 32px;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Choose a new password</a>
       </p>
       <p style="font-size:12px;color:#9a9488;line-height:1.6;">If you didn't request this, you can safely ignore this email — your password will not change.</p>`
    ),
  })
}

export async function sendOrderConfirmationEmail(email, { orderNumber, totalCents }) {
  return sendEmail({
    to: email,
    subject: `Order ${orderNumber} confirmed — Firman Furniture`,
    html: shell(
      'Thank you for your order',
      `<p style="font-size:14px;line-height:1.6;">Your order <strong>${orderNumber}</strong> is confirmed${
        totalCents != null ? ` — total <strong>${formatCentsExact(totalCents)}</strong>` : ''
      }.</p>
       <p style="font-size:14px;line-height:1.6;">Our delivery team will be in touch to schedule your delivery. You can follow your order from your account at any time.</p>
       <p style="font-size:12px;color:#9a9488;line-height:1.6;">Questions? Reply to this email or visit our contact page.</p>`
    ),
  })
}
