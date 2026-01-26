import { NextRequest, NextResponse, after } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { extractUtmParams, appendUtmParams } from '@/lib/utils'
import { UAParser } from 'ua-parser-js'

interface QrCodeRecord {
  id: string
  user_id: string
  destination_url: string
  is_active: boolean
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params
  const supabase = createAdminClient()

  // Fetch QR code by short_code
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: qrCodeData, error } = await (supabase.from('qr_codes') as any)
    .select('*')
    .eq('short_code', shortCode)
    .single()

  const qrCode = qrCodeData as QrCodeRecord | null

  // If not found or inactive, redirect to not found
  if (error || !qrCode || !qrCode.is_active) {
    return NextResponse.redirect(new URL('/not-found', request.url))
  }

  // Track scan after response is sent (Vercel waits for this to complete)
  after(async () => {
    await trackScan(request, qrCode, supabase)
  })

  // Get UTM params from request
  const requestUrl = new URL(request.url)
  const utmParams = extractUtmParams(requestUrl)

  // Append UTM params to destination URL
  const destinationUrl = appendUtmParams(qrCode.destination_url, utmParams)

  // Redirect to destination URL
  return NextResponse.redirect(destinationUrl, { status: 302 })
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

    // Get geo data from IP (using ip-api.com - free service)
    let geoData = {
      country: null as string | null,
      countryCode: null as string | null,
      region: null as string | null,
      city: null as string | null,
      lat: null as number | null,
      lon: null as number | null,
    }

    if (ip && ip !== '127.0.0.1' && ip !== '::1') {
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=country,countryCode,region,city,lat,lon`)
        if (geoResponse.ok) {
          const geoJson = await geoResponse.json()
          if (geoJson.country) {
            geoData = geoJson
          }
        }
      } catch (geoError) {
        console.error('Geo lookup failed:', geoError)
      }
    }

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
