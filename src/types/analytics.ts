export interface OverviewStats {
  totalQrCodes: number
  totalScans: number
  scansThisMonth: number
  qrLimit: number
  scanLimit: number
  currentMonthScans: number
}

export interface ScansOverTime {
  date: string
  scans: number
}

export interface GeographicData {
  country: string
  countryCode: string
  scans: number
}

export interface DeviceBreakdown {
  deviceType: string
  count: number
  percentage: number
}

export interface BrowserBreakdown {
  browser: string
  count: number
  percentage: number
}

export interface OsBreakdown {
  os: string
  count: number
  percentage: number
}

export interface TopQrCode {
  id: string
  name: string
  shortCode: string
  scanCount: number
}

export interface ScanLocation {
  id: string
  city: string | null
  country: string | null
  latitude: number
  longitude: number
  scannedAt: string
  qrCodeName: string
}

export interface TimePatternData {
  hourly: { hour: number; count: number }[]
  daily: { day: number; dayName: string; count: number }[]
  heatmap: { day: number; hour: number; count: number }[]
}

export type DateRange = '7d' | '30d' | '90d' | '12m' | 'all'
