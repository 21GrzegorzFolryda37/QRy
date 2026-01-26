'use client'

import { useState, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { StatsCard } from '@/components/dashboard'
import { ScansChart, DeviceChart, GeoChart, DateRangeSelect, ScanMap, TimeHeatmap, ExportButtons, RealtimeCard } from '@/components/analytics'
import {
  useOverviewStats,
  useScansOverTime,
  useDeviceBreakdown,
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
  const { data: geoData, loading: geoLoading, refetch: refetchGeo } = useGeographicData(dateRange)
  const { data: topQrCodes, loading: topLoading, refetch: refetchTop } = useTopQrCodes(dateRange)
  const { data: scanLocations, loading: locationsLoading, refetch: refetchLocations } = useScanLocations(dateRange)
  const { data: timePatterns, loading: timePatternsLoading, refetch: refetchTimePatterns } = useTimePatterns(dateRange)

  // Handler for new scans - refetch all analytics data
  const handleNewScan = useCallback(() => {
    refetchStats()
    refetchScans()
    refetchDevices()
    refetchGeo()
    refetchTop()
    refetchLocations()
    refetchTimePatterns()
  }, [refetchStats, refetchScans, refetchDevices, refetchGeo, refetchTop, refetchLocations, refetchTimePatterns])

  // Subscribe to realtime scan updates
  const { connectionStatus } = useScansRealtime({
    userId: user?.id,
    onNewScan: handleNewScan,
    enabled: !!user?.id,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500">Track your QR code performance</p>
        </div>
        <div className="flex items-center gap-4">
          {connectionStatus === 'connected' && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          )}
          {connectionStatus === 'connecting' && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
              Connecting...
            </span>
          )}
          {connectionStatus === 'error' && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Error
            </span>
          )}
          {connectionStatus === 'disconnected' && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
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

      <Card className="border-green-200 bg-green-50/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <CardTitle className="text-lg">W czasie rzeczywistym</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <RealtimeCard userId={user?.id} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total QR Codes"
          value={stats?.totalQrCodes || 0}
          subtitle={`Limit: ${stats?.qrLimit === -1 ? 'Unlimited' : stats?.qrLimit}`}
        />
        <StatsCard
          title="Total Scans"
          value={stats?.totalScans || 0}
          subtitle="All time"
        />
        <StatsCard
          title="Scans This Month"
          value={stats?.scansThisMonth || 0}
          subtitle={`Limit: ${stats?.scanLimit === -1 ? 'Unlimited' : stats?.scanLimit}`}
        />
        <StatsCard
          title="Active QR Codes"
          value={stats?.totalQrCodes || 0}
          subtitle="With scans"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scans Over Time</CardTitle>
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
          <CardTitle>Scan Locations</CardTitle>
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
          <CardTitle>Time Patterns</CardTitle>
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
            <CardTitle>Devices</CardTitle>
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
            <CardTitle>Top Countries</CardTitle>
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
            <CardTitle>Browsers</CardTitle>
          </CardHeader>
          <CardContent>
            {devicesLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : browsers.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center text-gray-500">
                No browser data available
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
            <CardTitle>Operating Systems</CardTitle>
          </CardHeader>
          <CardContent>
            {devicesLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : os.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center text-gray-500">
                No OS data available
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

      <Card>
        <CardHeader>
          <CardTitle>Top Performing QR Codes</CardTitle>
        </CardHeader>
        <CardContent>
          {topLoading ? (
            <div className="flex h-[200px] items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : topQrCodes.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-gray-500">
              No QR code data available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 text-left text-sm font-medium text-gray-500">Rank</th>
                    <th className="py-3 text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="py-3 text-left text-sm font-medium text-gray-500">Short Code</th>
                    <th className="py-3 text-right text-sm font-medium text-gray-500">Scans</th>
                  </tr>
                </thead>
                <tbody>
                  {topQrCodes.map((qr, index) => (
                    <tr key={qr.id} className="border-b border-gray-100">
                      <td className="py-3 text-sm text-gray-500">#{index + 1}</td>
                      <td className="py-3">
                        <Link
                          href={`/qr-codes/${qr.id}`}
                          className="text-sm font-medium text-gray-900 hover:underline"
                        >
                          {qr.name}
                        </Link>
                      </td>
                      <td className="py-3 text-sm text-gray-500">{qr.shortCode}</td>
                      <td className="py-3 text-sm text-gray-900 text-right font-medium">
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
