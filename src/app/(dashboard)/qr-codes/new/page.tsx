import { QrForm } from '@/components/qr'

// Version indicator for deployment verification
const BUILD_VERSION = 'v2.0.1'

export default function NewQrCodePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create QR Code</h1>
        <p className="text-gray-500">Generate a new dynamic QR code with custom styling</p>
        <p className="text-xs text-gray-400 mt-1">Build: {BUILD_VERSION}</p>
      </div>

      <QrForm />
    </div>
  )
}
