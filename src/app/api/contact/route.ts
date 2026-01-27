import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

// Initialize Resend - will fail gracefully if key not set
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Simple in-memory rate limiting (per IP, 3 requests per hour)
// In production, use Redis or similar
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 3
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in ms

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true, remaining: RATE_LIMIT - 1, resetIn: RATE_LIMIT_WINDOW }
  }

  if (record.count >= RATE_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: record.resetTime - now,
    }
  }

  record.count++
  return {
    allowed: true,
    remaining: RATE_LIMIT - record.count,
    resetIn: record.resetTime - now,
  }
}

// Validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'Imie jest wymagane').max(100),
  email: z.string().email('Nieprawidlowy adres email'),
  subject: z.string().min(1, 'Temat jest wymagany').max(200),
  message: z.string().min(10, 'Wiadomosc musi miec minimum 10 znakow').max(5000),
})

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown'

    // Check rate limit
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Przekroczono limit wiadomosci. Sprobuj ponownie pozniej.',
          resetIn: Math.ceil(rateLimit.resetIn / 1000 / 60) // minutes
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(rateLimit.resetIn / 1000)),
          }
        }
      )
    }

    // Parse and validate body
    const body = await request.json()
    const validatedData = contactSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = validatedData.data

    // Check if Resend is configured
    if (!resend) {
      console.warn('Resend API key not configured. Email not sent.')
      // In development, just log the message
      console.log('Contact form submission:', { name, email, subject, message })

      return NextResponse.json(
        {
          success: true,
          message: 'Wiadomosc zostala odebrana (tryb deweloperski)'
        },
        {
          headers: {
            'X-RateLimit-Remaining': String(rateLimit.remaining),
          }
        }
      )
    }

    // Send email via Resend
    const supportEmail = process.env.SUPPORT_EMAIL || 'contact@engageqr.com'

    const { error: sendError } = await resend.emails.send({
      from: 'EngageQR Contact <noreply@engageqr.com>',
      to: [supportEmail],
      replyTo: email,
      subject: `[Kontakt] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Nowa wiadomosc z formularza kontaktowego</h2>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px;"><strong>Od:</strong> ${name}</p>
            <p style="margin: 0 0 10px;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 0;"><strong>Temat:</strong> ${subject}</p>
          </div>

          <div style="background: #fff; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Tresc wiadomosci:</h3>
            <p style="color: #555; white-space: pre-wrap;">${message}</p>
          </div>

          <p style="color: #888; font-size: 12px; margin-top: 20px;">
            Ta wiadomosc zostala wyslana z formularza kontaktowego EngageQR.
            Aby odpowiedziec, uzyj przycisku "Odpowiedz" - wiadomosc zostanie wyslana bezposrednio do ${email}.
          </p>
        </div>
      `,
    })

    if (sendError) {
      console.error('Resend error:', sendError)
      return NextResponse.json(
        { error: 'Nie udalo sie wyslac wiadomosci. Sprobuj ponownie.' },
        { status: 500 }
      )
    }

    // Send confirmation to user
    await resend.emails.send({
      from: 'EngageQR <noreply@engageqr.com>',
      to: [email],
      subject: 'Potwierdzenie otrzymania wiadomosci - EngageQR',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Dziekujemy za kontakt!</h2>

          <p style="color: #555;">
            Cześć ${name},
          </p>

          <p style="color: #555;">
            Otrzymalismy Twoja wiadomosc dotyczaca: <strong>${subject}</strong>
          </p>

          <p style="color: #555;">
            Nasz zespol przejrzy Twoje zgloszenie i odpowie najszybciej jak to mozliwe,
            zazwyczaj w ciagu 24 godzin w dni robocze.
          </p>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Twoja wiadomosc:</h3>
            <p style="color: #555; white-space: pre-wrap;">${message}</p>
          </div>

          <p style="color: #555;">
            Pozdrawiamy,<br/>
            Zespol EngageQR
          </p>

          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;"/>

          <p style="color: #888; font-size: 12px;">
            To jest automatyczna wiadomosc potwierdzajaca. Prosimy nie odpowiadac na tego emaila.
          </p>
        </div>
      `,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Wiadomosc zostala wyslana pomyslnie'
      },
      {
        headers: {
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        }
      }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Wystapil nieoczekiwany blad. Sprobuj ponownie.' },
      { status: 500 }
    )
  }
}
