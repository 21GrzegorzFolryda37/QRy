import { QrForm } from '@/components/qr'

export default function NewQrCodePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create QR Code</h1>
        <p className="text-gray-500">Generate a new dynamic QR code with custom styling</p>
      </div>

      <QrForm />
    </div>
  )
}
