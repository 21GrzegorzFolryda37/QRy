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
              <a href="${registerUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px;">
                Stwórz darmowe konto
              </a>
            </div>

            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 32px 0 0 0;">
              Załóż konto, aby śledzić skany i edytować swoje kody QR w dowolnym momencie.
            </p>
          </div>

          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 24px 0 0 0;">
            © ${new Date().getFullYear()} QRenixy. Wszelkie prawa zastrzeżone.
          </p>
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
