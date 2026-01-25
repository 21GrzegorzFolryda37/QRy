import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { StatsCard } from '@/components/dashboard'
import { getQrCode } from '@/actions/qr'
import { getScansOverTime, getDeviceBreakdown, getGeographicData } from '@/actions/analytics'
import { getRedirectUrl, formatNumber } from '@/lib/utils'
import { ScansChart } from '@/components/analytics/scans-chart'
import { DeviceChart } from '@/components/analytics/device-chart'
import { GeoChart } from '@/components/analytics/geo-chart'

interface QrCodeDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function QrCodeDetailPage({ params }: QrCodeDetailPageProps) {
  const { id } = await params
  const { data: qrCode, error } = await getQrCode(id)

  if (error || !qrCode) {
    notFound()
  }

  const [scansResult, devicesResult, geoResult] = await Promise.all([
    getScansOverTime('30d', id),
    getDeviceBreakdown('30d', id),
    getGeographicData('30d', id),
  ])

  const totalScans = scansResult.data?.reduce((acc, d) => acc + d.scans, 0) || 0
  const redirectUrl = getRedirectUrl(qrCode.short_code)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{qrCode.name}</h1>
            <Badge variant={qrCode.is_active ? 'success' : 'outline'}>
              {qrCode.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="text-gray-500">{qrCode.destination_url}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/qr-codes/${qrCode.id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          {qrCode.qr_image_url && (
            <a href={qrCode.qr_image_url} download={`${qrCode.name}.png`}>
              <Button>Download</Button>
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>QR Code Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <div className="relative h-48 w-48 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                {qrCode.qr_image_url ? (
                  <Image
                    src={`${qrCode.qr_image_url}?v=${new Date(qrCode.updated_at).getTime()}`}
                    alt={qrCode.name}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Short URL</p>
                  <a
                    href={redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 hover:underline"
                  >
                    {redirectUrl}
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Destination</p>
                  <a
                    href={qrCode.destination_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 hover:underline break-all"
                  >
                    {qrCode.destination_url}
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p className="text-gray-900">
                    {new Date(qrCode.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Style</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="h-6 w-6 rounded border"
                      style={{ backgroundColor: qrCode.style.foregroundColor }}
                      title="Foreground"
                    />
                    <div
                      className="h-6 w-6 rounded border"
                      style={{ backgroundColor: qrCode.style.backgroundColor }}
                      title="Background"
                    />
                    <span className="text-sm text-gray-600">
                      {qrCode.style.width}px, EC: {qrCode.style.errorCorrectionLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <StatsCard
          title="Total Scans (30d)"
          value={totalScans}
          subtitle="Last 30 days"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scans Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ScansChart data={scansResult.data || []} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <DeviceChart data={devicesResult.data?.devices || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <GeoChart data={geoResult.data || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
