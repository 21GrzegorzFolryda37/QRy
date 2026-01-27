'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getOverviewStats,
  getScansOverTime,
  getGeographicData,
  getCityBreakdown,
  getDeviceBreakdown,
  getTopQrCodes,
  getScanLocations,
  getTimePatterns,
  getRecentScans,
} from '@/actions/analytics'
import {
  OverviewStats,
  ScansOverTime,
  GeographicData,
  CityBreakdown,
  DeviceBreakdown,
  BrowserBreakdown,
  OsBreakdown,
  TopQrCode,
  ScanLocation,
  TimePatternData,
  DateRange,
  RecentScan,
} from '@/types/analytics'

export function useOverviewStats() {
  const [stats, setStats] = useState<OverviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const result = await getOverviewStats()
    if (result.error) {
      setError(result.error)
    } else {
      setStats(result.data || null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { stats, loading, error, refetch }
}

export function useScansOverTime(dateRange: DateRange, qrCodeId?: string) {
  const [data, setData] = useState<ScansOverTime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const result = await getScansOverTime(dateRange, qrCodeId)
    if (result.error) {
      setError(result.error)
    } else {
      setData(result.data || [])
    }
    setLoading(false)
  }, [dateRange, qrCodeId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}

export function useGeographicData(dateRange: DateRange, qrCodeId?: string) {
  const [data, setData] = useState<GeographicData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const result = await getGeographicData(dateRange, qrCodeId)
    if (result.error) {
      setError(result.error)
    } else {
      setData(result.data || [])
    }
    setLoading(false)
  }, [dateRange, qrCodeId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}

export function useCityBreakdown(dateRange: DateRange, qrCodeId?: string) {
  const [data, setData] = useState<CityBreakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const result = await getCityBreakdown(dateRange, qrCodeId)
    if (result.error) {
      setError(result.error)
    } else {
      setData(result.data || [])
    }
    setLoading(false)
  }, [dateRange, qrCodeId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}

export function useDeviceBreakdown(dateRange: DateRange, qrCodeId?: string) {
  const [devices, setDevices] = useState<DeviceBreakdown[]>([])
  const [browsers, setBrowsers] = useState<BrowserBreakdown[]>([])
  const [os, setOs] = useState<OsBreakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const result = await getDeviceBreakdown(dateRange, qrCodeId)
    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      setDevices(result.data.devices)
      setBrowsers(result.data.browsers)
      setOs(result.data.os)
    }
    setLoading(false)
  }, [dateRange, qrCodeId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { devices, browsers, os, loading, error, refetch }
}

export function useTopQrCodes(dateRange: DateRange, limit = 5) {
  const [data, setData] = useState<TopQrCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const result = await getTopQrCodes(dateRange, limit)
    if (result.error) {
      setError(result.error)
    } else {
      setData(result.data || [])
    }
    setLoading(false)
  }, [dateRange, limit])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}

export function useScanLocations(dateRange: DateRange, qrCodeId?: string) {
  const [data, setData] = useState<ScanLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const result = await getScanLocations(dateRange, qrCodeId)
    if (result.error) {
      setError(result.error)
    } else {
      setData(result.data || [])
    }
    setLoading(false)
  }, [dateRange, qrCodeId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}

export function useTimePatterns(dateRange: DateRange, qrCodeId?: string) {
  const [data, setData] = useState<TimePatternData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const result = await getTimePatterns(dateRange, qrCodeId)
    if (result.error) {
      setError(result.error)
    } else {
      setData(result.data || null)
    }
    setLoading(false)
  }, [dateRange, qrCodeId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}

export function useRecentScans(minutes = 30) {
  const [data, setData] = useState<RecentScan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const result = await getRecentScans(minutes)
    if (result.error) {
      setError(result.error)
    } else {
      setData(result.data || [])
    }
    setLoading(false)
  }, [minutes])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}
