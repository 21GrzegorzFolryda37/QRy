'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Card, CardContent, Button, Badge } from '@/components/ui'
import { QrCode } from '@/types/database'
import { deleteQrCode } from '@/actions/qr'
import { getRedirectUrl } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface QrCardProps {
  qrCode: QrCode & { scan_count: number }
}

export function QrCard({ qrCode }: QrCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const redirectUrl = getRedirectUrl(qrCode.short_code)

  async function handleDelete() {
    setIsDeleting(true)
    await deleteQrCode(qrCode.id)
    router.refresh()
  }

  return (
    <Card hover className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          <div className="relative h-32 w-32 flex-shrink-0 bg-[var(--background-elevated)]">
            {qrCode.qr_image_url ? (
              <Image
                src={`${qrCode.qr_image_url}?v=${new Date(qrCode.updated_at).getTime()}`}
                alt={qrCode.name}
                fill
                className="object-contain p-2"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[var(--foreground-subtle)]">
                No image
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col p-4">
            <div className="flex items-start justify-between">
              <div>
                <Link
                  href={`/qr-codes/${qrCode.id}`}
                  className="font-semibold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                >
                  {qrCode.name}
                </Link>
                <p className="text-sm text-[var(--foreground-muted)] truncate max-w-xs">
                  {qrCode.destination_url}
                </p>
              </div>
              <Badge variant={qrCode.is_active ? 'success' : 'outline'}>
                {qrCode.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="mt-2 flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
              <span className="text-[var(--primary)]">{qrCode.scan_count} scans</span>
              <span className="text-[var(--border)]">|</span>
              <a
                href={redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--secondary)] transition-colors truncate max-w-[200px]"
              >
                {redirectUrl}
              </a>
            </div>

            <div className="mt-auto pt-3 flex gap-2">
              <Link href={`/qr-codes/${qrCode.id}/edit`}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </Link>
              <Link href={`/qr-codes/${qrCode.id}`}>
                <Button variant="outline" size="sm">
                  Analytics
                </Button>
              </Link>
              {qrCode.qr_image_url && (
                <a href={qrCode.qr_image_url} download={`${qrCode.name}.png`}>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </a>
              )}
              {showDeleteConfirm ? (
                <div className="flex gap-2 ml-auto">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    isLoading={isDeleting}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-[var(--error)] hover:text-[var(--error)] hover:bg-[var(--error)]/10"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
