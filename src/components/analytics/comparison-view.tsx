'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { DateRangeSelect } from './date-range-select'
import { ComparisonScansChart } from './comparison-scans-chart'
import { QrCodeSelect } from './qr-code-select'
import { DeviceChart } from './device-chart'
import { CityChart } from './city-chart'
import { GeoChart } from './geo-chart'
import { TimeHeatmap } from './time-heatmap'
import { ScanMap } from './scan-map'
import { useComparison } from '@/hooks/use-comparison'
import { DateRange } from '@/types/analytics'

interface QrCodeOption {
  id: string
  name: string
  scanCount: number
}

interface ComparisonViewProps {
  qrCodes: QrCodeOption[]
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
  onBack: () => void
}

function LoadingSpinner() {
  return (
    <svg
      className="h-6 w-6 animate-spin text-[var(--foreground-subtle)]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export function ComparisonView({ qrCodes, dateRange, onDateRangeChange, onBack }: ComparisonViewProps) {
  const [qrCodeAId, setQrCodeAId] = useState('')
  const [qrCodeBId, setQrCodeBId] = useState('')

  const { data, loading } = useComparison(
    dateRange,
    qrCodeAId || undefined,
    qrCodeBId || undefined
  )

  const nameA = qrCodes.find((q) => q.id === qrCodeAId)?.name || 'Kod A'
  const nameB = qrCodes.find((q) => q.id === qrCodeBId)?.name || 'Kod B'

  const bothSelected = qrCodeAId && qrCodeBId

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Widok normalny
          </button>
          <div className="h-5 w-px bg-[var(--border)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Porównanie kodów QR</h1>
            <p className="text-[var(--foreground-muted)]">Porównaj wydajność dwóch kodów QR</p>
          </div>
        </div>
        <DateRangeSelect value={dateRange} onChange={onDateRangeChange} />
      </div>

      {/* QR Code selectors */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-[#8b5cf6]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="primary">A</Badge>
              <span className="text-sm font-medium text-[var(--foreground)]">Kod QR A</span>
            </div>
            <QrCodeSelect
              value={qrCodeAId}
              onChange={setQrCodeAId}
              options={qrCodes}
              excludeId={qrCodeBId}
            />
          </CardContent>
        </Card>
        <Card className="border-[#06b6d4]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">B</Badge>
              <span className="text-sm font-medium text-[var(--foreground)]">Kod QR B</span>
            </div>
            <QrCodeSelect
              value={qrCodeBId}
              onChange={setQrCodeBId}
              options={qrCodes}
              excludeId={qrCodeAId}
            />
          </CardContent>
        </Card>
      </div>

      {/* Gate: require both selected */}
      {!bothSelected ? (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center gap-3 text-[var(--foreground-muted)]">
              <svg className="h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
              <p className="text-lg">Wybierz dwa kody QR aby rozpocząć porównanie</p>
            </div>
          </CardContent>
        </Card>
      ) : loading ? (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center gap-3">
              <LoadingSpinner />
              <p className="text-sm text-[var(--foreground-muted)]">Ładowanie danych...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats comparison */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-[#8b5cf6]/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)]">Całkowite skany</p>
                    <p className="text-3xl font-bold text-[#8b5cf6]">{data.totalScansA}</p>
                  </div>
                  <Badge variant="primary">A</Badge>
                </div>
                <p className="text-xs text-[var(--foreground-muted)] mt-1 truncate">{nameA}</p>
              </CardContent>
            </Card>
            <Card className="border-[#06b6d4]/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)]">Całkowite skany</p>
                    <p className="text-3xl font-bold text-[#06b6d4]">{data.totalScansB}</p>
                  </div>
                  <Badge variant="secondary">B</Badge>
                </div>
                <p className="text-xs text-[var(--foreground-muted)] mt-1 truncate">{nameB}</p>
              </CardContent>
            </Card>
          </div>

          {/* Scans over time - overlaid */}
          <Card>
            <CardHeader>
              <CardTitle>Skany w czasie</CardTitle>
            </CardHeader>
            <CardContent>
              <ComparisonScansChart data={data.scansOverTime} nameA={nameA} nameB={nameB} />
            </CardContent>
          </Card>

          {/* Devices side-by-side */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-[#8b5cf6]/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Urządzenia</CardTitle>
                  <Badge variant="primary">A</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <DeviceChart data={data.devicesA} />
              </CardContent>
            </Card>
            <Card className="border-[#06b6d4]/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Urządzenia</CardTitle>
                  <Badge variant="secondary">B</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <DeviceChart data={data.devicesB} />
              </CardContent>
            </Card>
          </div>

          {/* Cities side-by-side */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-[#8b5cf6]/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Miasta</CardTitle>
                  <Badge variant="primary">A</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CityChart data={data.cityA} />
              </CardContent>
            </Card>
            <Card className="border-[#06b6d4]/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Miasta</CardTitle>
                  <Badge variant="secondary">B</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CityChart data={data.cityB} />
              </CardContent>
            </Card>
          </div>

          {/* Countries side-by-side */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-[#8b5cf6]/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Kraje</CardTitle>
                  <Badge variant="primary">A</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <GeoChart data={data.geoA} />
              </CardContent>
            </Card>
            <Card className="border-[#06b6d4]/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Kraje</CardTitle>
                  <Badge variant="secondary">B</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <GeoChart data={data.geoB} />
              </CardContent>
            </Card>
          </div>

          {/* Time patterns side-by-side */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-[#8b5cf6]/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Wzorce czasowe</CardTitle>
                  <Badge variant="primary">A</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <TimeHeatmap data={data.timePatternsA} />
              </CardContent>
            </Card>
            <Card className="border-[#06b6d4]/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Wzorce czasowe</CardTitle>
                  <Badge variant="secondary">B</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <TimeHeatmap data={data.timePatternsB} />
              </CardContent>
            </Card>
          </div>

          {/* Browsers side-by-side */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-[#8b5cf6]/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Przeglądarki</CardTitle>
                  <Badge variant="primary">A</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {data.browsersA.length === 0 ? (
                  <div className="flex h-[200px] items-center justify-center text-[var(--foreground-muted)]">
                    Brak danych o przeglądarkach
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.browsersA.slice(0, 5).map((browser) => (
                      <div key={browser.browser} className="flex items-center justify-between">
                        <span className="text-sm text-[var(--foreground-muted)]">{browser.browser}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-[var(--background-elevated)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#8b5cf6] rounded-full"
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
            <Card className="border-[#06b6d4]/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Przeglądarki</CardTitle>
                  <Badge variant="secondary">B</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {data.browsersB.length === 0 ? (
                  <div className="flex h-[200px] items-center justify-center text-[var(--foreground-muted)]">
                    Brak danych o przeglądarkach
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.browsersB.slice(0, 5).map((browser) => (
                      <div key={browser.browser} className="flex items-center justify-between">
                        <span className="text-sm text-[var(--foreground-muted)]">{browser.browser}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-[var(--background-elevated)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#06b6d4] rounded-full"
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
          </div>

          {/* OS side-by-side */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-[#8b5cf6]/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Systemy operacyjne</CardTitle>
                  <Badge variant="primary">A</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {data.osA.length === 0 ? (
                  <div className="flex h-[200px] items-center justify-center text-[var(--foreground-muted)]">
                    Brak danych o systemach
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.osA.slice(0, 5).map((item) => (
                      <div key={item.os} className="flex items-center justify-between">
                        <span className="text-sm text-[var(--foreground-muted)]">{item.os}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-[var(--background-elevated)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#8b5cf6] rounded-full"
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
            <Card className="border-[#06b6d4]/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Systemy operacyjne</CardTitle>
                  <Badge variant="secondary">B</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {data.osB.length === 0 ? (
                  <div className="flex h-[200px] items-center justify-center text-[var(--foreground-muted)]">
                    Brak danych o systemach
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.osB.slice(0, 5).map((item) => (
                      <div key={item.os} className="flex items-center justify-between">
                        <span className="text-sm text-[var(--foreground-muted)]">{item.os}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-[var(--background-elevated)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#06b6d4] rounded-full"
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

          {/* Maps side-by-side */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-[#8b5cf6]/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Lokalizacje skanów</CardTitle>
                  <Badge variant="primary">A</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScanMap data={data.locationsA} />
              </CardContent>
            </Card>
            <Card className="border-[#06b6d4]/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Lokalizacje skanów</CardTitle>
                  <Badge variant="secondary">B</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScanMap data={data.locationsB} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
