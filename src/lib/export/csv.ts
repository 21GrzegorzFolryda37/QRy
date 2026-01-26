import {
  OverviewStats,
  ScansOverTime,
  GeographicData,
  DeviceBreakdown,
  BrowserBreakdown,
  OsBreakdown,
  TopQrCode,
  TimePatternData
} from '@/types/analytics'

interface ExportData {
  stats: OverviewStats | null
  scansOverTime: ScansOverTime[]
  geographic: GeographicData[]
  devices: DeviceBreakdown[]
  browsers: BrowserBreakdown[]
  os: OsBreakdown[]
  topQrCodes: TopQrCode[]
  timePatterns: TimePatternData | null
  dateRange: string
}

export function generateCSV(data: ExportData): string {
  const lines: string[] = []
  const now = new Date().toISOString().split('T')[0]

  // Header
  lines.push(`QR Analytics Report - ${now}`)
  lines.push(`Date Range: ${data.dateRange}`)
  lines.push('')

  // Overview Stats
  lines.push('=== OVERVIEW STATS ===')
  lines.push('Metric,Value')
  if (data.stats) {
    lines.push(`Total QR Codes,${data.stats.totalQrCodes}`)
    lines.push(`Total Scans,${data.stats.totalScans}`)
    lines.push(`Scans This Month,${data.stats.scansThisMonth}`)
    lines.push(`QR Limit,${data.stats.qrLimit === -1 ? 'Unlimited' : data.stats.qrLimit}`)
    lines.push(`Scan Limit,${data.stats.scanLimit === -1 ? 'Unlimited' : data.stats.scanLimit}`)
  }
  lines.push('')

  // Scans Over Time
  lines.push('=== SCANS OVER TIME ===')
  lines.push('Date,Scans')
  data.scansOverTime.forEach(item => {
    lines.push(`${item.date},${item.scans}`)
  })
  lines.push('')

  // Geographic Data
  lines.push('=== GEOGRAPHIC DATA ===')
  lines.push('Country,Country Code,Scans')
  data.geographic.forEach(item => {
    lines.push(`${item.country},${item.countryCode},${item.scans}`)
  })
  lines.push('')

  // Device Breakdown
  lines.push('=== DEVICES ===')
  lines.push('Device Type,Count,Percentage')
  data.devices.forEach(item => {
    lines.push(`${item.deviceType},${item.count},${item.percentage}%`)
  })
  lines.push('')

  // Browser Breakdown
  lines.push('=== BROWSERS ===')
  lines.push('Browser,Count,Percentage')
  data.browsers.forEach(item => {
    lines.push(`${item.browser},${item.count},${item.percentage}%`)
  })
  lines.push('')

  // OS Breakdown
  lines.push('=== OPERATING SYSTEMS ===')
  lines.push('OS,Count,Percentage')
  data.os.forEach(item => {
    lines.push(`${item.os},${item.count},${item.percentage}%`)
  })
  lines.push('')

  // Top QR Codes
  lines.push('=== TOP QR CODES ===')
  lines.push('Rank,Name,Short Code,Scans')
  data.topQrCodes.forEach((item, index) => {
    lines.push(`${index + 1},${item.name},${item.shortCode},${item.scanCount}`)
  })
  lines.push('')

  // Time Patterns
  if (data.timePatterns) {
    lines.push('=== TIME PATTERNS - HOURLY ===')
    lines.push('Hour,Scans')
    data.timePatterns.hourly.forEach(item => {
      lines.push(`${item.hour.toString().padStart(2, '0')}:00,${item.count}`)
    })
    lines.push('')

    lines.push('=== TIME PATTERNS - DAILY ===')
    lines.push('Day,Scans')
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    data.timePatterns.daily.forEach(item => {
      lines.push(`${dayNames[item.day]},${item.count}`)
    })
  }

  return lines.join('\n')
}

export function downloadCSV(data: ExportData, filename?: string) {
  const csv = generateCSV(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `qr-analytics-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
