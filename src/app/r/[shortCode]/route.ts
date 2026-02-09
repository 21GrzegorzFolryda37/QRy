import { NextRequest, NextResponse, after } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { extractUtmParams, appendUtmParams } from '@/lib/utils'
import { UAParser } from 'ua-parser-js'

// Use edge runtime for faster cold starts and global distribution
export const runtime = 'nodejs' // Edge doesn't support after(), keep nodejs
export const dynamic = 'force-dynamic'
export const revalidate = 0

// In-memory cache for QR codes (works well on serverless with warm instances)
const qrCodeCache = new Map<string, { data: QrCodeRecord; timestamp: number }>()
const CACHE_TTL = 60 * 1000 // 1 minute cache

interface QrCodeRecord {
  id: string
  user_id: string
  destination_url: string
  is_active: boolean
}

async function getQrCodeCached(shortCode: string, supabase: ReturnType<typeof createAdminClient>): Promise<QrCodeRecord | null> {
  const cached = qrCodeCache.get(shortCode)
  const now = Date.now()

  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: qrCodeData, error } = await (supabase.from('qr_codes') as any)
    .select('id,user_id,destination_url,is_active')
    .eq('short_code', shortCode)
    .single()

  if (error || !qrCodeData) {
    return null
  }

  const qrCode = qrCodeData as QrCodeRecord
  qrCodeCache.set(shortCode, { data: qrCode, timestamp: now })

  return qrCode
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params
  const supabase = createAdminClient()

  // Fetch QR code with caching
  const qrCode = await getQrCodeCached(shortCode, supabase)

  // If not found or inactive, redirect to not found
  if (!qrCode || !qrCode.is_active) {
    return NextResponse.redirect(new URL('/not-found', request.url))
  }

  // Get UTM params from request
  const requestUrl = new URL(request.url)
  const utmParams = extractUtmParams(requestUrl)

  // Append UTM params to destination URL
  const destinationUrl = appendUtmParams(qrCode.destination_url, utmParams)

  // Track scan after response is sent (Vercel waits for this to complete)
  after(async () => {
    await trackScan(request, qrCode, supabase)
  })

  // Instant 302 redirect - no loading page
  return NextResponse.redirect(destinationUrl, 302)
}

// Fast geo lookup with timeout
async function getGeoData(ip: string): Promise<{
  country: string | null
  countryCode: string | null
  region: string | null
  city: string | null
  lat: number | null
  lon: number | null
}> {
  const defaultGeo = {
    country: null,
    countryCode: null,
    region: null,
    city: null,
    lat: null,
    lon: null,
  }

  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    return defaultGeo
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000) // 2s timeout

    const geoResponse = await fetch(
      `http://ip-api.com/json/${ip}?fields=country,countryCode,region,city,lat,lon`,
      { signal: controller.signal }
    )

    clearTimeout(timeoutId)

    if (geoResponse.ok) {
      const geoJson = await geoResponse.json()
      if (geoJson.country) {
        return geoJson
      }
    }
  } catch {
    // Silently fail - geo data is optional
  }

  return defaultGeo
}

async function trackScan(
  request: NextRequest,
  qrCode: { id: string; user_id: string },
  supabase: ReturnType<typeof createAdminClient>
) {
  try {
    // Parse IP address
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0].trim() || realIp || null

    // Parse user agent
    const userAgent = request.headers.get('user-agent') || ''
    const parser = new UAParser(userAgent)
    const device = parser.getDevice()
    const browser = parser.getBrowser()
    const os = parser.getOS()

    // Get device type
    let deviceType = device.type || 'desktop'
    if (!device.type) {
      if (/mobile/i.test(userAgent)) {
        deviceType = 'mobile'
      } else if (/tablet/i.test(userAgent)) {
        deviceType = 'tablet'
      }
    }

    // Get UTM params
    const requestUrl = new URL(request.url)
    const utmParams = extractUtmParams(requestUrl)

    // Get geo data with timeout (non-blocking)
    const geoData = await getGeoData(ip || '')

    // Insert scan record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('scans') as any).insert({
      qr_code_id: qrCode.id,
      user_id: qrCode.user_id,
      ip_address: ip,
      country: geoData.country,
      country_code: geoData.countryCode,
      region: geoData.region,
      city: geoData.city,
      latitude: geoData.lat,
      longitude: geoData.lon,
      device_type: deviceType,
      browser: browser.name || null,
      browser_version: browser.version || null,
      os: os.name || null,
      os_version: os.version || null,
      utm_source: utmParams.utm_source,
      utm_medium: utmParams.utm_medium,
      utm_campaign: utmParams.utm_campaign,
      utm_term: utmParams.utm_term,
      utm_content: utmParams.utm_content,
      referrer: request.headers.get('referer') || null,
      scanned_at: new Date().toISOString(),
    })
  } catch (trackError) {
    console.error('Scan tracking failed:', trackError)
  }
}
