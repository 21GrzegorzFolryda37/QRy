import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { getQrCode } from '@/actions/qr'
import { getRedirectUrl } from '@/lib/utils'
import { QrCodeAnalytics } from '@/components/analytics'
import { createClient } from '@/lib/supabase/server'
import type { Plan } from '@/types/database'
import { QrPreview } from '@/components/qr/qr-preview'

interface QrCodeDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function QrCodeDetailPage({ params }: QrCodeDetailPageProps) {
  const { id } = await params
  const { data: qrCode, error } = await getQrCode(id)

  if (error || !qrCode) {
    notFound()
  }

  // Get user and plan for realtime updates and access control
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userPlan: Plan = 'free'
  if (user) {
    const { data: profileData } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
    userPlan = (profileData as { plan: Plan } | null)?.plan || 'free'
  }

  const redirectUrl = getRedirectUrl(qrCode.short_code)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--foreground)]">{qrCode.name}</h1>
            <Badge variant={qrCode.is_active ? 'success' : 'outline'}>
              {qrCode.is_active ? 'Aktywny' : 'Nieaktywny'}
            </Badge>
          </div>
          <p className="text-[var(--foreground-muted)] truncate max-w-md">{qrCode.destination_url}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/qr-codes/${qrCode.id}/edit`}>
            <Button variant="outline">Edytuj</Button>
          </Link>
          {qrCode.qr_image_url && (
            <a href={qrCode.qr_image_url} download={`${qrCode.name}.png`}>
              <Button variant="gradient">Pobierz</Button>
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
            <div className="relative h-48 w-48 flex-shrink-0 bg-[var(--background-elevated)] rounded-lg overflow-hidden">
              {qrCode.qr_image_url ? (
                <Image
                  src={`${qrCode.qr_image_url}?v=${new Date(qrCode.updated_at).getTime()}`}
                  alt={qrCode.name}
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center p-2">
                  <QrPreview
                    url={redirectUrl}
                    style={{ ...qrCode.style, width: 176 }}
                    logoUrl={qrCode.logo_url || undefined}
                    logoSize={qrCode.logo_size || 45}
                  />
                </div>
              )}
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <p className="text-sm font-medium text-[var(--foreground-muted)]">Krótki URL</p>
                <a
                  href={redirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                >
                  {redirectUrl}
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--foreground-muted)]">Docelowy URL</p>
                <a
                  href={qrCode.destination_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors break-all"
                >
                  {qrCode.destination_url}
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-[var(--foreground-muted)]">Utworzono</p>
                  <p className="text-[var(--foreground)]">
                    {new Date(qrCode.created_at).toLocaleDateString('pl-PL')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground-muted)]">Ostatnia aktualizacja</p>
                  <p className="text-[var(--foreground)]">
                    {new Date(qrCode.updated_at).toLocaleDateString('pl-PL')}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--foreground-muted)]">Styl</p>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="h-6 w-6 rounded border border-[var(--border)]"
                    style={{ backgroundColor: qrCode.style.foregroundColor }}
                    title="Kolor główny"
                  />
                  <div
                    className="h-6 w-6 rounded border border-[var(--border)]"
                    style={{ backgroundColor: qrCode.style.backgroundColor }}
                    title="Kolor tła"
                  />
                  <span className="text-sm text-[var(--foreground-muted)]">
                    {qrCode.style.width}px, Korekcja: {qrCode.style.errorCorrectionLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Analytics Section */}
      <QrCodeAnalytics qrCodeId={qrCode.id} userId={user?.id} userPlan={userPlan} />
    </div>
  )
}
