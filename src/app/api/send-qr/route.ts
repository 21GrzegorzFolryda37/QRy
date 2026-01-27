import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, qrCodeBase64, url } = await request.json()

    if (!email || !qrCodeBase64) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Extract base64 data (remove data URL prefix)
    const base64Data = qrCodeBase64.replace(/^data:image\/\w+;base64,/, '')

    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY

    if (!resendApiKey) {
      // Fallback: just log and return success (for development)
      console.log('Email would be sent to:', email)
      console.log('QR code URL:', url)
      return NextResponse.json({ success: true, message: 'Email logged (no RESEND_API_KEY configured)' })
    }

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'QRy <noreply@resend.dev>',
        to: [email],
        subject: 'Twój kod QR jest gotowy!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
            <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <h1 style="color: #1e293b; font-size: 24px; margin: 0 0 16px 0; text-align: center;">
                Twój kod QR jest gotowy!
              </h1>
              <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
                Dziękujemy za skorzystanie z naszego generatora. Poniżej znajdziesz swój spersonalizowany kod QR.
              </p>

              <div style="text-align: center; margin: 32px 0;">
                <img src="cid:qrcode" alt="Kod QR" style="max-width: 250px; border-radius: 12px; border: 1px solid #e2e8f0;" />
              </div>

              <p style="color: #64748b; font-size: 14px; text-align: center; margin: 0 0 8px 0;">
                Zakodowany link:
              </p>
              <p style="color: #8b5cf6; font-size: 14px; text-align: center; word-break: break-all; margin: 0 0 32px 0;">
                ${url}
              </p>

              <div style="text-align: center;">
                <a href="https://q-ry.vercel.app/register" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px;">
                  Stwórz darmowe konto
                </a>
              </div>

              <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 32px 0 0 0;">
                Załóż konto, aby śledzić skany i edytować swoje kody QR w dowolnym momencie.
              </p>
            </div>

            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 24px 0 0 0;">
              © ${new Date().getFullYear()} QRy. Wszelkie prawa zastrzeżone.
            </p>
          </body>
          </html>
        `,
        attachments: [
          {
            filename: 'kod-qr.png',
            content: base64Data,
            content_id: 'qrcode',
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send QR error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
