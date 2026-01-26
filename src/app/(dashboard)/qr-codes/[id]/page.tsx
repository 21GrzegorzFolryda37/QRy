import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { getQrCode } from '@/actions/qr'
import { getRedirectUrl } from '@/lib/utils'
import { QrCodeAnalytics } from '@/components/analytics'
import { createClient } from '@/lib/supabase/server'

interface QrCodeDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function QrCodeDetailPage({ params }: QrCodeDetailPageProps) {
  const { id } = await params
  const { data: qrCode, error } = await getQrCode(id)

  if (error || !qrCode) {
    notFound()
  }

  // Get user for realtime updates
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const redirectUrl = getRedirectUrl(qrCode.short_code)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{qrCode.name}</h1>
            <Badge variant={qrCode.is_active ? 'success' : 'outline'}>
              {qrCode.is_active ? 'Aktywny' : 'Nieaktywny'}
            </Badge>
          </div>
          <p className="text-gray-500 truncate max-w-md">{qrCode.destination_url}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/qr-codes/${qrCode.id}/edit`}>
            <Button variant="outline">Edytuj</Button>
          </Link>
          {qrCode.qr_image_url && (
            <a href={qrCode.qr_image_url} download={`${qrCode.name}.png`}>
              <Button>Pobierz</Button>
            </a>
          )}
        </div>
      </div>

      {/* QR Code Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Szczegóły kodu QR</CardTitle>
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
                  Brak obrazu
                </div>
              )}
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <p className="text-sm font-medium text-gray-500">Krótki URL</p>
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
                <p className="text-sm font-medium text-gray-500">Docelowy URL</p>
                <a
                  href={qrCode.destination_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:underline break-all"
                >
                  {qrCode.destination_url}
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Utworzono</p>
                  <p className="text-gray-900">
                    {new Date(qrCode.created_at).toLocaleDateString('pl-PL')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Ostatnia aktualizacja</p>
                  <p className="text-gray-900">
                    {new Date(qrCode.updated_at).toLocaleDateString('pl-PL')}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Styl</p>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="h-6 w-6 rounded border"
                    style={{ backgroundColor: qrCode.style.foregroundColor }}
                    title="Kolor główny"
                  />
                  <div
                    className="h-6 w-6 rounded border"
                    style={{ backgroundColor: qrCode.style.backgroundColor }}
                    title="Kolor tła"
                  />
                  <span className="text-sm text-gray-600">
                    {qrCode.style.width}px, Korekcja: {qrCode.style.errorCorrectionLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Analytics Section */}
      <QrCodeAnalytics qrCodeId={qrCode.id} userId={user?.id} />
    </div>
  )
}
