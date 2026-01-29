import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import type { LinkPageData } from '@/types/database'
import { LinkPageView } from './link-page-view'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{ shortCode: string }>
}

async function getQrCode(shortCode: string) {
  const supabase = createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('qr_codes') as any)
    .select('id, user_id, content_data, is_active')
    .eq('short_code', shortCode)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

async function trackScan(qrCodeId: string, userId: string) {
  const supabase = createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('scans') as any).insert({
    qr_code_id: qrCodeId,
    user_id: userId,
    scanned_at: new Date().toISOString(),
  })
}

export default async function LinkPage({ params }: PageProps) {
  const { shortCode } = await params
  const qrCode = await getQrCode(shortCode)

  if (!qrCode || !qrCode.is_active || !qrCode.content_data) {
    notFound()
  }

  // Track scan (fire and forget)
  trackScan(qrCode.id, qrCode.user_id).catch(() => {})

  const linkPageData = qrCode.content_data as LinkPageData

  return <LinkPageView data={linkPageData} />
}
