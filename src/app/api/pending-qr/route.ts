import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateShortCode } from '@/lib/utils/short-code'
import { getRedirectUrl } from '@/lib/utils'

// Rate limit: 5 per hour per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return true
  }

  if (entry.count >= RATE_LIMIT) {
    return false
  }

  entry.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0].trim() || realIp || 'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.' },
        { status: 429 }
      )
    }

    const { destinationUrl, qrType, style, logoUrl, logoSize, email } = await request.json()

    if (!destinationUrl) {
      return NextResponse.json({ error: 'Missing destination URL' }, { status: 400 })
    }

    const shortCode = generateShortCode()
    const redirectUrl = getRedirectUrl(shortCode)
    const supabase = createAdminClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('pending_qr_codes') as any)
      .insert({
        short_code: shortCode,
        destination_url: destinationUrl,
        qr_type: qrType || 'website',
        style: style || {},
        logo_url: logoUrl || null,
        logo_size: logoSize || null,
        email: email || null,
        ip_address: ip !== 'unknown' ? ip : null,
      })
      .select('signup_token')
      .single()

    if (error) {
      console.error('Error creating pending QR:', error)
      return NextResponse.json({ error: 'Failed to create pending QR code' }, { status: 500 })
    }

    return NextResponse.json({
      shortCode,
      redirectUrl,
      signupToken: data.signup_token,
    })
  } catch (error) {
    console.error('Pending QR error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
