'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getScansOverTime,
  getDeviceBreakdown,
  getCityBreakdown,
  getGeographicData,
  getTimePatterns,
  getScanLocations,
} from '@/actions/analytics'
import {
  ScansOverTime,
  GeographicData,
  CityBreakdown,
  DeviceBreakdown,
  BrowserBreakdown,
  OsBreakdown,
  ScanLocation,
  TimePatternData,
  DateRange,
} from '@/types/analytics'

export interface ComparisonScansOverTime {
  date: string
  scansA: number
  scansB: number
}

interface ComparisonData {
  scansOverTime: ComparisonScansOverTime[]
  totalScansA: number
  totalScansB: number
  devicesA: DeviceBreakdown[]
  devicesB: DeviceBreakdown[]
  browsersA: BrowserBreakdown[]
  browsersB: BrowserBreakdown[]
  osA: OsBreakdown[]
  osB: OsBreakdown[]
  cityA: CityBreakdown[]
  cityB: CityBreakdown[]
  geoA: GeographicData[]
  geoB: GeographicData[]
  timePatternsA: TimePatternData | null
  timePatternsB: TimePatternData | null
  locationsA: ScanLocation[]
  locationsB: ScanLocation[]
}

const emptyData: ComparisonData = {
  scansOverTime: [],
  totalScansA: 0,
  totalScansB: 0,
  devicesA: [],
  devicesB: [],
  browsersA: [],
  browsersB: [],
  osA: [],
  osB: [],
  cityA: [],
  cityB: [],
  geoA: [],
  geoB: [],
  timePatternsA: null,
  timePatternsB: null,
  locationsA: [],
  locationsB: [],
}

export function useComparison(dateRange: DateRange, qrCodeAId?: string, qrCodeBId?: string) {
  const [data, setData] = useState<ComparisonData>(emptyData)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    if (!qrCodeAId || !qrCodeBId) {
      setData(emptyData)
      return
    }

    setLoading(true)

    const [
      scansA, scansB,
      deviceA, deviceB,
      cityA, cityB,
      geoA, geoB,
      timeA, timeB,
      locA, locB,
    ] = await Promise.all([
      getScansOverTime(dateRange, qrCodeAId),
      getScansOverTime(dateRange, qrCodeBId),
      getDeviceBreakdown(dateRange, qrCodeAId),
      getDeviceBreakdown(dateRange, qrCodeBId),
      getCityBreakdown(dateRange, qrCodeAId),
      getCityBreakdown(dateRange, qrCodeBId),
      getGeographicData(dateRange, qrCodeAId),
      getGeographicData(dateRange, qrCodeBId),
      getTimePatterns(dateRange, qrCodeAId),
      getTimePatterns(dateRange, qrCodeBId),
      getScanLocations(dateRange, qrCodeAId),
      getScanLocations(dateRange, qrCodeBId),
    ])

    // Merge scans over time by date
    const scansAData = scansA.data || []
    const scansBData = scansB.data || []
    const dateMap = new Map<string, { scansA: number; scansB: number }>()

    scansAData.forEach((s: ScansOverTime) => {
      dateMap.set(s.date, { scansA: s.scans, scansB: 0 })
    })
    scansBData.forEach((s: ScansOverTime) => {
      const existing = dateMap.get(s.date)
      if (existing) {
        existing.scansB = s.scans
      } else {
        dateMap.set(s.date, { scansA: 0, scansB: s.scans })
      }
    })

    const scansOverTime: ComparisonScansOverTime[] = Array.from(dateMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, counts]) => ({ date, ...counts }))

    const totalScansA = scansAData.reduce((sum: number, s: ScansOverTime) => sum + s.scans, 0)
    const totalScansB = scansBData.reduce((sum: number, s: ScansOverTime) => sum + s.scans, 0)

    setData({
      scansOverTime,
      totalScansA,
      totalScansB,
      devicesA: deviceA.data?.devices || [],
      devicesB: deviceB.data?.devices || [],
      browsersA: deviceA.data?.browsers || [],
      browsersB: deviceB.data?.browsers || [],
      osA: deviceA.data?.os || [],
      osB: deviceB.data?.os || [],
      cityA: cityA.data || [],
      cityB: cityB.data || [],
      geoA: geoA.data || [],
      geoB: geoB.data || [],
      timePatternsA: timeA.data || null,
      timePatternsB: timeB.data || null,
      locationsA: locA.data || [],
      locationsB: locB.data || [],
    })

    setLoading(false)
  }, [dateRange, qrCodeAId, qrCodeBId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading }
}
