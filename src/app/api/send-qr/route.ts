import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const { email, qrCodeBase64, url, signupToken } = await request.json()

    if (!email || !qrCodeBase64) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Extract base64 data (remove data URL prefix)
    const base64Data = qrCodeBase64.replace(/^data:image\/\w+;base64,/, '')

    if (!resend) {
      console.log('Email would be sent to:', email)
      console.log('QR code URL:', url)
      return NextResponse.json({ success: true, message: 'Email logged (no RESEND_API_KEY configured)' })
    }

    const registerUrl = signupToken
      ? `https://qrenixy.com/register?token=${signupToken}`
      : 'https://qrenixy.com/register'

    const { error: sendError } = await resend.emails.send({
      from: 'QRenixy <hello@qrenixy.com>',
      to: [email],
      subject: 'Twój kod QR jest gotowy!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; background: white;">

            <!-- Header -->
            <div style="background: white; padding: 30px 40px; border-bottom: 1px solid #e5e7eb;">
              <table style="width: 100%;">
                <tr>
                  <td style="width: 50px; vertical-align: middle;">
                    <div style="width: 44px; height: 44px; background: #6d28d9; border-radius: 10px; line-height: 44px; text-align: center;">
                      <span style="color: white; font-size: 20px; font-weight: 700;">QR</span>
                    </div>
                  </td>
                  <td style="vertical-align: middle; text-align: center;">
                    <h1 style="color: #6d28d9; margin: 0; font-size: 28px; font-weight: 700; line-height: 1.2;">
                      Twoj kod QR jest gotowy!
                    </h1>
                  </td>
                  <td style="width: 50px;"></td>
                </tr>
              </table>
            </div>

            <!-- QR Code -->
            <div style="padding: 40px 20px; text-align: center;">
              <img src="cid:qrcode" alt="Twoj QR kod" style="max-width: 300px; border-radius: 16px; box-shadow: 0 6px 20px rgba(0,0,0,0.15);" />

              <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
                Zakodowany link: <span style="color: #6d28d9; font-weight: 500;">${url.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>
              </p>
            </div>

            <!-- CTA Section -->
            <div style="background: #6d28d9; padding: 35px 40px; color: white;">
              <div style="text-align: center; margin-bottom: 28px;">
                <a href="${registerUrl}" style="display: inline-block; background: white; color: #6d28d9; padding: 18px 48px; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 18px; box-shadow: 0 10px 20px rgba(0,0,0,0.2);">
                  Stworz darmowe konto i zobacz:
                </a>
              </div>

              <table style="width: 100%; color: white; margin-bottom: 20px;">
                <tr><td style="padding: 10px 0; font-size: 17px; text-align: center;">Ile razy zeskanowano twoj kod</td></tr>
                <tr><td style="padding: 10px 0; font-size: 17px; text-align: center;">Lokalizacje uzytkownikow na mapie</td></tr>
                <tr><td style="padding: 10px 0; font-size: 17px; text-align: center;">Urzadzenia (telefon/komputer/tablet)</td></tr>
              </table>

              <p style="text-align: center; margin: 20px 0 0 0; font-size: 14px; opacity: 0.9;">
                Darmowe konto · Bez karty kredytowej · Gotowe w 30 sekund
              </p>
            </div>

            <!-- Footer -->
            <div style="padding: 30px 20px; text-align: center; color: #9ca3af; font-size: 14px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0;">
                Masz pytania? Napisz do nas: <a href="mailto:contact@qrenixy.com" style="color: #6d28d9; text-decoration: none;">contact@qrenixy.com</a>
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px;">
                &copy; ${new Date().getFullYear()} QRenixy. Wszelkie prawa zastrzezone.
              </p>
            </div>

          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: 'kod-qr.png',
          content: Buffer.from(base64Data, 'base64'),
          contentId: 'qrcode',
        },
      ],
    })

    if (sendError) {
      console.error('Resend error:', sendError)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    // Upload QR image to storage and save URL in pending record
    if (signupToken) {
      try {
        const supabase = createAdminClient()
        const fileName = `pending-qr-${signupToken}-${Date.now()}.png`
        const imageBuffer = Buffer.from(base64Data, 'base64')

        const { error: uploadError } = await supabase.storage
          .from('qr-images')
          .upload(fileName, imageBuffer, { contentType: 'image/png', upsert: true })

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('qr-images').getPublicUrl(fileName)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from('pending_qr_codes') as any)
            .update({ qr_image_url: urlData.publicUrl })
            .eq('signup_token', signupToken)
        }
      } catch (uploadErr) {
        console.error('Failed to upload pending QR image (non-blocking):', uploadErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send QR error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
