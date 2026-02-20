import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Rate limit: 10 per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10
const RATE_WINDOW = 60 * 1000 // 1 minute

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

    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (adminClient.from('profiles') as any)
      .select('has_password')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    return NextResponse.json({
      exists: !!profile,
      hasPassword: profile?.has_password ?? false,
    })
  } catch (error) {
    console.error('Check email error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
