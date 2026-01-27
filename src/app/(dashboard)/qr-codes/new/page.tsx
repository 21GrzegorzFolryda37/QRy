import { QrForm } from '@/components/qr'

export default function NewQrCodePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Utwórz kod QR</h1>
        <p className="text-[var(--foreground-muted)]">Wygeneruj nowy dynamiczny kod QR z własnym stylem</p>
      </div>

      <QrForm />
    </div>
  )
}
