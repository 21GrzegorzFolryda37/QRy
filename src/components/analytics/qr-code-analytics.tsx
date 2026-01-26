'use client'

import { useState, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { StatsCard } from '@/components/dashboard'
import { ScansChart, DeviceChart, GeoChart, DateRangeSelect, ScanMap, TimeHeatmap } from '@/components/analytics'
import {
  useScansOverTime,
  useDeviceBreakdown,
  useGeographicData,
  useScanLocations,
  useTimePatterns,
} from '@/hooks/use-analytics'
import { useScansRealtime } from '@/hooks/use-scans-realtime'
import { DateRange } from '@/types/analytics'

interface QrCodeAnalyticsProps {
  qrCodeId: string
  userId?: string
}

export function QrCodeAnalytics({ qrCodeId, userId }: QrCodeAnalyticsProps) {
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  const { data: scansData, loading: scansLoading, refetch: refetchScans } = useScansOverTime(dateRange, qrCodeId)
  const { devices, browsers, os, loading: devicesLoading, refetch: refetchDevices } = useDeviceBreakdown(dateRange, qrCodeId)
  const { data: geoData, loading: geoLoading, refetch: refetchGeo } = useGeographicData(dateRange, qrCodeId)
  const { data: scanLocations, loading: locationsLoading, refetch: refetchLocations } = useScanLocations(dateRange, qrCodeId)
  const { data: timePatterns, loading: timePatternsLoading, refetch: refetchTimePatterns } = useTimePatterns(dateRange, qrCodeId)

  // Calculate totals from scans data
  const totalScans = scansData.reduce((acc, d) => acc + d.scans, 0)
  const uniqueCountries = geoData.length
  const topDevice = devices.length > 0 ? devices[0] : null

  // Handler for new scans - refetch all analytics data
  const handleNewScan = useCallback(() => {
    refetchScans()
    refetchDevices()
    refetchGeo()
    refetchLocations()
    refetchTimePatterns()
  }, [refetchScans, refetchDevices, refetchGeo, refetchLocations, refetchTimePatterns])

  // Subscribe to realtime scan updates for this QR code
  const { connectionStatus } = useScansRealtime({
    userId,
    qrCodeId,
    onNewScan: handleNewScan,
    enabled: !!userId,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900">Analityka</h2>
          {connectionStatus === 'connected' && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Na żywo
            </span>
          )}
        </div>
        <DateRangeSelect value={dateRange} onChange={setDateRange} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Skany"
          value={totalScans}
          subtitle={`Ostatnie ${dateRange === '7d' ? '7 dni' : dateRange === '30d' ? '30 dni' : dateRange === '90d' ? '90 dni' : dateRange === '12m' ? '12 miesięcy' : 'wszystko'}`}
        />
        <StatsCard
          title="Kraje"
          value={uniqueCountries}
          subtitle="Unikalne lokalizacje"
        />
        <StatsCard
          title="Top urządzenie"
          value={topDevice ? `${topDevice.deviceType} (${topDevice.percentage}%)` : '-'}
          subtitle="Najczęstsze"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skany w czasie</CardTitle>
        </CardHeader>
        <CardContent>
          {scansLoading ? (
            <div className="flex h-[300px] items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <ScansChart data={scansData} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lokalizacje skanów</CardTitle>
        </CardHeader>
        <CardContent>
          {locationsLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <ScanMap data={scanLocations} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wzorce czasowe</CardTitle>
        </CardHeader>
        <CardContent>
          {timePatternsLoading ? (
            <div className="flex h-[300px] items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <TimeHeatmap data={timePatterns} />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Urządzenia</CardTitle>
          </CardHeader>
          <CardContent>
            {devicesLoading ? (
              <div className="flex h-[250px] items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <DeviceChart data={devices} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top kraje</CardTitle>
          </CardHeader>
          <CardContent>
            {geoLoading ? (
              <div className="flex h-[250px] items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <GeoChart data={geoData} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Przeglądarki</CardTitle>
          </CardHeader>
          <CardContent>
            {devicesLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : browsers.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center text-gray-500">
                Brak danych o przeglądarkach
              </div>
            ) : (
              <div className="space-y-3">
                {browsers.slice(0, 5).map((browser) => (
                  <div key={browser.browser} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{browser.browser}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-900 rounded-full"
                          style={{ width: `${browser.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-12 text-right">
                        {browser.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Systemy operacyjne</CardTitle>
          </CardHeader>
          <CardContent>
            {devicesLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : os.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center text-gray-500">
                Brak danych o systemach
              </div>
            ) : (
              <div className="space-y-3">
                {os.slice(0, 5).map((item) => (
                  <div key={item.os} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.os}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-900 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-12 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="h-6 w-6 animate-spin text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}
