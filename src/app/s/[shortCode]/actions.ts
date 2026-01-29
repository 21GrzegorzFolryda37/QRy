'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function submitSurveyResponse(
  qrCodeId: string,
  answers: Record<string, string | string[] | number>
): Promise<{ error?: string; success?: boolean }> {
  const supabase = createAdminClient()

  // Get QR code to find user_id
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: qrCode, error: qrError } = await (supabase.from('qr_codes') as any)
    .select('user_id')
    .eq('id', qrCodeId)
    .single()

  if (qrError || !qrCode) {
    return { error: 'Nie znaleziono ankiety' }
  }

  // Insert survey response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('survey_responses') as any).insert({
    qr_code_id: qrCodeId,
    user_id: qrCode.user_id,
    answers,
    submitted_at: new Date().toISOString(),
  })

  if (error) {
    console.error('Error saving survey response:', error)
    return { error: 'Nie udało się zapisać odpowiedzi' }
  }

  return { success: true }
}
