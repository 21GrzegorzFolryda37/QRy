'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { StatsCard } from '@/components/dashboard'
import { ScansChart, DeviceChart, CityChart, GeoChart, DateRangeSelect, ScanMap, TimeHeatmap, ExportButtons, RealtimeCard, ComparisonView } from '@/components/analytics'
import { UpgradeOverlay } from '@/components/analytics/upgrade-overlay'
import { AnalyticsUpgradePrompt } from '@/components/analytics/analytics-upgrade-prompt'
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
import { canAccessAnalytics, canAccessFeature } from '@/lib/plans/analytics-access'
import { DateRange } from '@/types/analytics'
import { getQrCodes } from '@/actions/qr'
import Link from 'next/link'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d')
  const [compareMode, setCompareMode] = useState(false)
  const [qrCodeOptions, setQrCodeOptions] = useState<{ id: string; name: string; scanCount: number }[]>([])
  const { user, profile, loading: userLoading } = useUser()

  const userPlan = profile?.plan || 'free'
  const hasAnalyticsAccess = canAccessAnalytics(userPlan)
  const hasProAccess = canAccessFeature(userPlan, 'scan_map')

  // Fetch QR codes list for comparison selector
  useEffect(() => {
    if (!hasAnalyticsAccess) return
    async function fetchQrCodes() {
      const result = await getQrCodes()
      if (result.data) {
        setQrCodeOptions(
          result.data.map((qr: { id: string; name: string; scan_count: number }) => ({
            id: qr.id,
            name: qr.name,
            scanCount: qr.scan_count || 0,
          }))
        )
      }
    }
    fetchQrCodes()
  }, [hasAnalyticsAccess])

  const { stats, loading: statsLoading, refetch: refetchStats } = useOverviewStats()
  const { data: scansData, loading: scansLoading, refetch: refetchScans } = useScansOverTime(dateRange)
  const { devices, browsers, os, loading: devicesLoading, refetch: refetchDevices } = useDeviceBreakdown(dateRange)
  const { data: cityData, loading: cityLoading, refetch: refetchCity } = useCityBreakdown(dateRange)
  const { data: geoData, loading: geoLoading, refetch: refetchGeo } = useGeographicData(dateRange)
  const { data: topQrCodes, loading: topLoading, refetch: refetchTop } = useTopQrCodes(dateRange)
  const { data: scanLocations, loading: locationsLoading, refetch: refetchLocations } = useScanLocations(dateRange, undefined, hasProAccess)
  const { data: timePatterns, loading: timePatternsLoading, refetch: refetchTimePatterns } = useTimePatterns(dateRange, undefined, hasProAccess)

  // Handler for new scans - debounced refetch of all analytics data
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleNewScan = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      refetchStats()
      refetchScans()
      refetchDevices()
      refetchCity()
      refetchGeo()
      refetchTop()
      if (hasProAccess) {
        refetchLocations()
        refetchTimePatterns()
      }
    }, 2000)
  }, [refetchStats, refetchScans, refetchDevices, refetchCity, refetchGeo, refetchTop, refetchLocations, refetchTimePatterns, hasProAccess])

  // Subscribe to realtime scan updates
  const { connectionStatus } = useScansRealtime({
    userId: user?.id,
    onNewScan: handleNewScan,
    enabled: !!user?.id && hasProAccess,
  })

  // Show loading spinner while user data loads to prevent flash of upgrade prompt
  if (userLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // FREE users see upgrade prompt instead of analytics
  if (!hasAnalyticsAccess) {
    return <AnalyticsUpgradePrompt />
  }

  if (compareMode && hasProAccess) {
    return (
      <ComparisonView
        qrCodes={qrCodeOptions}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onBack={() => setCompareMode(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header - responsive */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Analityka</h1>
          <p className="text-[var(--foreground-muted)]">Śledź wydajność swoich kodów QR</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {hasProAccess && (
            <>
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
              <button
                onClick={() => setCompareMode(true)}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm font-medium text-[var(--foreground-muted)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
                Porównaj
              </button>
            </>
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

      {hasProAccess ? (
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
      ) : (
        <UpgradeOverlay feature="realtime_card">
          <Card className="border-[var(--secondary)]/30 bg-[var(--secondary)]/5">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--secondary)] animate-pulse" />
                <CardTitle className="text-lg">W czasie rzeczywistym</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[120px]" />
            </CardContent>
          </Card>
        </UpgradeOverlay>
      )}

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

      {hasProAccess ? (
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
      ) : (
        <UpgradeOverlay feature="scan_map">
          <Card>
            <CardHeader>
              <CardTitle>Lokalizacje skanów</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]" />
            </CardContent>
          </Card>
        </UpgradeOverlay>
      )}

      {hasProAccess ? (
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
      ) : (
        <UpgradeOverlay feature="time_heatmap">
          <Card>
            <CardHeader>
              <CardTitle>Wzorce czasowe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]" />
            </CardContent>
          </Card>
        </UpgradeOverlay>
      )}

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
