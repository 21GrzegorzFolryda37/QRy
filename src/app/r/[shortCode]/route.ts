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

  // Return HTML page with loading animation and JS redirect
  const html = generateRedirectPage(destinationUrl)

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

function generateRedirectPage(destinationUrl: string): string {
  // Escape the URL for safe embedding in HTML/JS
  const safeUrl = destinationUrl
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="1;url=${safeUrl}">
  <title>Przekierowywanie...</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #0f0f14;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #f0f0f5;
    }
    .container {
      text-align: center;
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 2rem;
      background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 3px solid #1c1c26;
      border-top-color: #8b5cf6;
      border-right-color: #06b6d4;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1.5rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .status {
      font-size: 0.875rem;
      color: #9393a8;
      margin-bottom: 0.5rem;
    }
    .url {
      font-size: 0.75rem;
      color: #6b6b80;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">EngageQR</div>
    <div class="spinner"></div>
    <div class="status">Przekierowywanie...</div>
    <div class="url">${safeUrl}</div>
  </div>
  <script>
    setTimeout(function() {
      window.location.replace("${destinationUrl.replace(/"/g, '\\"')}");
    }, 400);
  </script>
</body>
</html>`
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
