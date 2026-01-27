'use client'

import { useState, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { StatsCard } from '@/components/dashboard'
import { ScansChart, DeviceChart, CityChart, GeoChart, DateRangeSelect, ScanMap, TimeHeatmap, ExportButtons, RealtimeCard } from '@/components/analytics'
import {
  useOverviewStats,
  useScansOverTime,
  useDeviceBreakdown,
  useCityBreakdown,
  useGeographicData,
  useTopQrCodes,
  useScanLocations,
  useTimePatterns,
} from '@/hooks/use-analytics'
import { useScansRealtime } from '@/hooks/use-scans-realtime'
import { useUser } from '@/hooks/use-user'
import { DateRange } from '@/types/analytics'
import Link from 'next/link'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d')
  const { user } = useUser()

  const { stats, loading: statsLoading, refetch: refetchStats } = useOverviewStats()
  const { data: scansData, loading: scansLoading, refetch: refetchScans } = useScansOverTime(dateRange)
  const { devices, browsers, os, loading: devicesLoading, refetch: refetchDevices } = useDeviceBreakdown(dateRange)
  const { data: cityData, loading: cityLoading, refetch: refetchCity } = useCityBreakdown(dateRange)
  const { data: geoData, loading: geoLoading, refetch: refetchGeo } = useGeographicData(dateRange)
  const { data: topQrCodes, loading: topLoading, refetch: refetchTop } = useTopQrCodes(dateRange)
  const { data: scanLocations, loading: locationsLoading, refetch: refetchLocations } = useScanLocations(dateRange)
  const { data: timePatterns, loading: timePatternsLoading, refetch: refetchTimePatterns } = useTimePatterns(dateRange)

  // Handler for new scans - refetch all analytics data
  const handleNewScan = useCallback(() => {
    refetchStats()
    refetchScans()
    refetchDevices()
    refetchCity()
    refetchGeo()
    refetchTop()
    refetchLocations()
    refetchTimePatterns()
  }, [refetchStats, refetchScans, refetchDevices, refetchCity, refetchGeo, refetchTop, refetchLocations, refetchTimePatterns])

  // Subscribe to realtime scan updates
  const { connectionStatus } = useScansRealtime({
    userId: user?.id,
    onNewScan: handleNewScan,
    enabled: !!user?.id,
  })

  return (
    <div className="space-y-6">
      {/* Header - responsive */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Analityka</h1>
          <p className="text-[var(--foreground-muted)]">Śledź wydajność swoich kodów QR</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {connectionStatus === 'connected' && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Na żywo
            </span>
          )}
          {connectionStatus === 'connecting' && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
              <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
              Łączenie...
            </span>
          )}
          {connectionStatus === 'error' && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Błąd
            </span>
          )}
          {connectionStatus === 'disconnected' && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
              <span className="h-2 w-2 rounded-full bg-gray-400" />
              Offline
            </span>
          )}
          <DateRangeSelect value={dateRange} onChange={setDateRange} />
          <ExportButtons
            stats={stats}
            scansOverTime={scansData}
            geographic={geoData}
            devices={devices}
            browsers={browsers}
            os={os}
            topQrCodes={topQrCodes}
            timePatterns={timePatterns}
            dateRange={dateRange}
          />
        </div>
      </div>

      <Card className="border-[var(--secondary)]/30 bg-[var(--secondary)]/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--secondary)] animate-pulse" />
            <CardTitle className="text-lg">W czasie rzeczywistym</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <RealtimeCard userId={user?.id} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Wszystkie kody QR"
          value={stats?.totalQrCodes || 0}
          subtitle={`Limit: ${stats?.qrLimit === -1 ? 'Bez limitu' : stats?.qrLimit}`}
        />
        <StatsCard
          title="Wszystkie skany"
          value={stats?.totalScans || 0}
          subtitle="Od początku"
        />
        <StatsCard
          title="Skany w tym miesiącu"
          value={stats?.scansThisMonth || 0}
          subtitle={`Limit: ${stats?.scanLimit === -1 ? 'Bez limitu' : stats?.scanLimit}`}
        />
        <StatsCard
          title="Aktywne kody QR"
          value={stats?.totalQrCodes || 0}
          subtitle="Ze skanami"
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

      <div className="grid gap-6 lg:grid-cols-3">
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
            <CardTitle>Miasta</CardTitle>
          </CardHeader>
          <CardContent>
            {cityLoading ? (
              <div className="flex h-[250px] items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <CityChart data={cityData} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kraje</CardTitle>
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
              <div className="flex h-[200px] items-center justify-center text-[var(--foreground-muted)]">
                Brak danych o przeglądarkach
              </div>
            ) : (
              <div className="space-y-3">
                {browsers.slice(0, 5).map((browser) => (
                  <div key={browser.browser} className="flex items-center justify-between">
                    <span className="text-sm text-[var(--foreground-muted)]">{browser.browser}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-[var(--background-elevated)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full"
                          style={{ width: `${browser.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-[var(--foreground-subtle)] w-12 text-right">
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
              <div className="flex h-[200px] items-center justify-center text-[var(--foreground-muted)]">
                Brak danych o systemach
              </div>
            ) : (
              <div className="space-y-3">
                {os.slice(0, 5).map((item) => (
                  <div key={item.os} className="flex items-center justify-between">
                    <span className="text-sm text-[var(--foreground-muted)]">{item.os}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-[var(--background-elevated)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-[var(--foreground-subtle)] w-12 text-right">
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

      <Card>
        <CardHeader>
          <CardTitle>Najlepsze kody QR</CardTitle>
        </CardHeader>
        <CardContent>
          {topLoading ? (
            <div className="flex h-[200px] items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : topQrCodes.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-[var(--foreground-muted)]">
              Brak danych o kodach QR
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="py-3 text-left text-sm font-medium text-[var(--foreground-muted)]">Pozycja</th>
                    <th className="py-3 text-left text-sm font-medium text-[var(--foreground-muted)]">Nazwa</th>
                    <th className="py-3 text-left text-sm font-medium text-[var(--foreground-muted)]">Krótki kod</th>
                    <th className="py-3 text-right text-sm font-medium text-[var(--foreground-muted)]">Skany</th>
                  </tr>
                </thead>
                <tbody>
                  {topQrCodes.map((qr, index) => (
                    <tr key={qr.id} className="border-b border-[var(--border)]/50">
                      <td className="py-3 text-sm text-[var(--foreground-subtle)]">#{index + 1}</td>
                      <td className="py-3">
                        <Link
                          href={`/qr-codes/${qr.id}`}
                          className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                        >
                          {qr.name}
                        </Link>
                      </td>
                      <td className="py-3 text-sm text-[var(--foreground-muted)]">{qr.shortCode}</td>
                      <td className="py-3 text-sm text-[var(--primary)] text-right font-medium">
                        {qr.scanCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="h-6 w-6 animate-spin text-[var(--foreground-subtle)]"
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
