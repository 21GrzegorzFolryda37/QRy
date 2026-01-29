import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import type { SurveyData } from '@/types/database'
import { SurveyView } from './survey-view'

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

export default async function SurveyPage({ params }: PageProps) {
  const { shortCode } = await params
  const qrCode = await getQrCode(shortCode)

  if (!qrCode || !qrCode.is_active || !qrCode.content_data) {
    notFound()
  }

  // Track scan (fire and forget)
  trackScan(qrCode.id, qrCode.user_id).catch(() => {})

  const surveyData = qrCode.content_data as SurveyData

  return <SurveyView data={surveyData} qrCodeId={qrCode.id} shortCode={shortCode} />
}
