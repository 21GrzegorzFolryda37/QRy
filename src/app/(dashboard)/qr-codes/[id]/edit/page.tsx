import { notFound } from 'next/navigation'
import { QrForm } from '@/components/qr'
import { getQrCode } from '@/actions/qr'

interface EditQrCodePageProps {
  params: Promise<{ id: string }>
}

export default async function EditQrCodePage({ params }: EditQrCodePageProps) {
  const { id } = await params
  const { data: qrCode, error } = await getQrCode(id)

  if (error || !qrCode) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Edytuj kod QR</h1>
        <p className="text-[var(--foreground-muted)]">Zaktualizuj ustawienia i styl kodu QR</p>
      </div>

      <QrForm qrCode={qrCode} />
    </div>
  )
}
