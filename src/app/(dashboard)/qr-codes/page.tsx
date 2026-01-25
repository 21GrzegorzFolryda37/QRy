import Link from 'next/link'
import { Button } from '@/components/ui'
import { QrCard } from '@/components/qr'
import { getQrCodes } from '@/actions/qr'

export default async function QrCodesPage() {
  const { data: qrCodes, error } = await getQrCodes()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">QR Codes</h1>
          <p className="text-gray-500">Manage your dynamic QR codes</p>
        </div>
        <Link href="/qr-codes/new">
          <Button>Create QR Code</Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {qrCodes && qrCodes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <QrCodeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No QR codes yet</h3>
          <p className="mt-2 text-gray-500">Get started by creating your first QR code.</p>
          <Link href="/qr-codes/new" className="mt-4 inline-block">
            <Button>Create QR Code</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {qrCodes?.map((qrCode) => (
            <QrCard key={qrCode.id} qrCode={qrCode} />
          ))}
        </div>
      )}
    </div>
  )
}

function QrCodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
    </svg>
  )
}
