'use server'

import { createClient } from '@/lib/supabase/server'
import { subDays, subMonths, format, startOfDay, endOfDay } from 'date-fns'
import {
  OverviewStats,
  ScansOverTime,
  GeographicData,
  DeviceBreakdown,
  BrowserBreakdown,
  OsBreakdown,
  TopQrCode,
  ScanLocation,
  DateRange,
} from '@/types/analytics'

function getDateRangeFilter(dateRange: DateRange): { start: Date; end: Date } {
  const now = new Date()
  const end = endOfDay(now)

  switch (dateRange) {
    case '7d':
      return { start: startOfDay(subDays(now, 7)), end }
    case '30d':
      return { start: startOfDay(subDays(now, 30)), end }
    case '90d':
      return { start: startOfDay(subDays(now, 90)), end }
    case '12m':
      return { start: startOfDay(subMonths(now, 12)), end }
    case 'all':
      return { start: new Date(0), end }
    default:
      return { start: startOfDay(subDays(now, 30)), end }
  }
}

export async function getOverviewStats(): Promise<{ error?: string; data?: OverviewStats }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Get profile with limits
  const { data: profile } = await supabase
    .from('profiles')
    .select('qr_limit, monthly_scan_limit, current_month_scans')
    .eq('id', user.id)
    .single()

  const profileData = profile as { qr_limit: number; monthly_scan_limit: number; current_month_scans: number } | null

  // Get total QR codes count
  const { count: totalQrCodes } = await supabase
    .from('qr_codes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Get total scans count
  const { count: totalScans } = await supabase
    .from('scans')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Get scans this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count: scansThisMonth } = await supabase
    .from('scans')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('scanned_at', startOfMonth.toISOString())

  return {
    data: {
      totalQrCodes: totalQrCodes || 0,
      totalScans: totalScans || 0,
      scansThisMonth: scansThisMonth || 0,
      qrLimit: profileData?.qr_limit || 5,
      scanLimit: profileData?.monthly_scan_limit || 1000,
      currentMonthScans: profileData?.current_month_scans || 0,
    },
  }
}

export async function getScansOverTime(
  dateRange: DateRange,
  qrCodeId?: string
): Promise<{ error?: string; data?: ScansOverTime[] }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { start, end } = getDateRangeFilter(dateRange)

  let query = supabase
    .from('scans')
    .select('scanned_at')
    .eq('user_id', user.id)
    .gte('scanned_at', start.toISOString())
    .lte('scanned_at', end.toISOString())

  if (qrCodeId) {
    query = query.eq('qr_code_id', qrCodeId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching scans over time:', error)
    return { error: 'Failed to fetch analytics data' }
  }

  const scansData = (data || []) as { scanned_at: string }[]

  // Aggregate by day
  const aggregated: Record<string, number> = {}

  scansData.forEach((scan) => {
    const date = format(new Date(scan.scanned_at), 'yyyy-MM-dd')
    aggregated[date] = (aggregated[date] || 0) + 1
  })

  // Fill in missing dates with 0
  const result: ScansOverTime[] = []
  const current = new Date(start)

  while (current <= end) {
    const dateStr = format(current, 'yyyy-MM-dd')
    result.push({
      date: dateStr,
      scans: aggregated[dateStr] || 0,
    })
    current.setDate(current.getDate() + 1)
  }

  return { data: result }
}

export async function getGeographicData(
  dateRange: DateRange,
  qrCodeId?: string
): Promise<{ error?: string; data?: GeographicData[] }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { start, end } = getDateRangeFilter(dateRange)

  let query = supabase
    .from('scans')
    .select('country, country_code')
    .eq('user_id', user.id)
    .gte('scanned_at', start.toISOString())
    .lte('scanned_at', end.toISOString())

  if (qrCodeId) {
    query = query.eq('qr_code_id', qrCodeId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching geographic data:', error)
    return { error: 'Failed to fetch analytics data' }
  }

  const scansData = (data || []) as { country: string | null; country_code: string | null }[]

  // Aggregate by country
  const aggregated: Record<string, { country: string; countryCode: string; scans: number }> = {}

  scansData.forEach((scan) => {
    const country = scan.country || 'Unknown'
    const countryCode = scan.country_code || 'XX'

    if (!aggregated[country]) {
      aggregated[country] = { country, countryCode, scans: 0 }
    }
    aggregated[country].scans++
  })

  // Sort by scans descending
  const result = Object.values(aggregated).sort((a, b) => b.scans - a.scans)

  return { data: result }
}

export async function getDeviceBreakdown(
  dateRange: DateRange,
  qrCodeId?: string
): Promise<{
  error?: string
  data?: {
    devices: DeviceBreakdown[]
    browsers: BrowserBreakdown[]
    os: OsBreakdown[]
  }
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { start, end } = getDateRangeFilter(dateRange)

  let query = supabase
    .from('scans')
    .select('device_type, browser, os')
    .eq('user_id', user.id)
    .gte('scanned_at', start.toISOString())
    .lte('scanned_at', end.toISOString())

  if (qrCodeId) {
    query = query.eq('qr_code_id', qrCodeId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching device breakdown:', error)
    return { error: 'Failed to fetch analytics data' }
  }

  const scansData = (data || []) as { device_type: string | null; browser: string | null; os: string | null }[]
  const totalScans = scansData.length

  // Aggregate devices
  const deviceCounts: Record<string, number> = {}
  const browserCounts: Record<string, number> = {}
  const osCounts: Record<string, number> = {}

  scansData.forEach((scan) => {
    const device = scan.device_type || 'Unknown'
    const browser = scan.browser || 'Unknown'
    const os = scan.os || 'Unknown'

    deviceCounts[device] = (deviceCounts[device] || 0) + 1
    browserCounts[browser] = (browserCounts[browser] || 0) + 1
    osCounts[os] = (osCounts[os] || 0) + 1
  })

  const devices: DeviceBreakdown[] = Object.entries(deviceCounts)
    .map(([deviceType, count]) => ({
      deviceType,
      count,
      percentage: totalScans > 0 ? Math.round((count / totalScans) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  const browsers: BrowserBreakdown[] = Object.entries(browserCounts)
    .map(([browser, count]) => ({
      browser,
      count,
      percentage: totalScans > 0 ? Math.round((count / totalScans) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  const os: OsBreakdown[] = Object.entries(osCounts)
    .map(([osName, count]) => ({
      os: osName,
      count,
      percentage: totalScans > 0 ? Math.round((count / totalScans) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  return { data: { devices, browsers, os } }
}

export async function getTopQrCodes(
  dateRange: DateRange,
  limit = 5
): Promise<{ error?: string; data?: TopQrCode[] }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { start, end } = getDateRangeFilter(dateRange)

  // Get scans within date range
  const { data: scans, error: scansError } = await supabase
    .from('scans')
    .select('qr_code_id')
    .eq('user_id', user.id)
    .gte('scanned_at', start.toISOString())
    .lte('scanned_at', end.toISOString())

  if (scansError) {
    console.error('Error fetching top QR codes:', scansError)
    return { error: 'Failed to fetch analytics data' }
  }

  const scansData = (scans || []) as { qr_code_id: string }[]

  // Count scans per QR code
  const scanCounts: Record<string, number> = {}
  scansData.forEach((scan) => {
    scanCounts[scan.qr_code_id] = (scanCounts[scan.qr_code_id] || 0) + 1
  })

  // Get top QR code IDs
  const topQrCodeIds = Object.entries(scanCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id)

  if (topQrCodeIds.length === 0) {
    return { data: [] }
  }

  // Get QR code details
  const { data: qrCodes, error: qrError } = await supabase
    .from('qr_codes')
    .select('id, name, short_code')
    .in('id', topQrCodeIds)

  if (qrError) {
    console.error('Error fetching QR code details:', qrError)
    return { error: 'Failed to fetch analytics data' }
  }

  const qrCodesData = (qrCodes || []) as { id: string; name: string; short_code: string }[]

  // Combine data
  const result: TopQrCode[] = topQrCodeIds.map((id) => {
    const qr = qrCodesData.find((q) => q.id === id)
    return {
      id,
      name: qr?.name || 'Unknown',
      shortCode: qr?.short_code || '',
      scanCount: scanCounts[id],
    }
  })

  return { data: result }
}

export async function getScanLocations(
  dateRange: DateRange,
  qrCodeId?: string
): Promise<{ error?: string; data?: ScanLocation[] }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { start, end } = getDateRangeFilter(dateRange)

  // Get scans with location data
  let query = supabase
    .from('scans')
    .select('id, city, country, latitude, longitude, scanned_at, qr_code_id')
    .eq('user_id', user.id)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .gte('scanned_at', start.toISOString())
    .lte('scanned_at', end.toISOString())
    .order('scanned_at', { ascending: false })
    .limit(100)

  if (qrCodeId) {
    query = query.eq('qr_code_id', qrCodeId)
  }

  const { data: scans, error } = await query

  if (error) {
    console.error('Error fetching scan locations:', error)
    return { error: 'Failed to fetch scan locations' }
  }

  const scansData = (scans || []) as {
    id: string
    city: string | null
    country: string | null
    latitude: number
    longitude: number
    scanned_at: string
    qr_code_id: string
  }[]

  // Get QR code names
  const qrCodeIds = [...new Set(scansData.map((s) => s.qr_code_id))]

  let qrCodeNames: Record<string, string> = {}

  if (qrCodeIds.length > 0) {
    const { data: qrCodes } = await supabase
      .from('qr_codes')
      .select('id, name')
      .in('id', qrCodeIds)

    const qrCodesData = (qrCodes || []) as { id: string; name: string }[]
    qrCodeNames = Object.fromEntries(qrCodesData.map((q) => [q.id, q.name]))
  }

  const result: ScanLocation[] = scansData.map((scan) => ({
    id: scan.id,
    city: scan.city,
    country: scan.country,
    latitude: scan.latitude,
    longitude: scan.longitude,
    scannedAt: scan.scanned_at,
    qrCodeName: qrCodeNames[scan.qr_code_id] || 'Unknown',
  }))

  return { data: result }
}
