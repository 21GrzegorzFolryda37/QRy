'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { createQrSchema, updateQrSchema } from '@/lib/validations/qr'
import { generateQrCode, getQrImageFileName } from '@/lib/qr/generator'
import { generateShortCode } from '@/lib/utils/short-code'
import { getRedirectUrl } from '@/lib/utils'
import { migrateQrStyle } from '@/lib/utils/style-migration'
import { QrCode, QrStyle } from '@/types/database'
import { DEFAULT_QR_STYLE } from '@/types/qr'

export type QrActionResponse = {
  error?: string
  data?: QrCode
}

export type QrListResponse = {
  error?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any[]
}

async function uploadQrImage(buffer: Buffer, fileName: string): Promise<string | null> {
  const adminClient = createAdminClient()

  const { error } = await adminClient.storage
    .from('qr-images')
    .upload(fileName, buffer, {
      contentType: 'image/png',
      upsert: true,
    })

  if (error) {
    console.error('Error uploading QR image:', error)
    return null
  }

  const { data: urlData } = adminClient.storage.from('qr-images').getPublicUrl(fileName)

  return urlData.publicUrl
}

export async function createQrCode(formData: FormData): Promise<QrActionResponse> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Parse and validate input
  const rawStyle = formData.get('style')
  const style = rawStyle ? JSON.parse(rawStyle as string) : undefined

  const validatedFields = createQrSchema.safeParse({
    name: formData.get('name'),
    destinationUrl: formData.get('destinationUrl'),
    style,
    logoUrl: formData.get('logoUrl') || null,
    logoSize: formData.get('logoSize') ? Number(formData.get('logoSize')) : undefined,
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  const { name, destinationUrl, logoUrl, logoSize } = validatedFields.data
  const finalStyle: QrStyle = { ...DEFAULT_QR_STYLE, ...validatedFields.data.style }

  // Check QR limit
  const { data: profile } = await supabase
    .from('profiles')
    .select('qr_limit')
    .eq('id', user.id)
    .single()

  const profileData = profile as { qr_limit: number } | null

  const { count } = await supabase
    .from('qr_codes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (profileData && profileData.qr_limit !== -1 && (count || 0) >= profileData.qr_limit) {
    return { error: 'You have reached your QR code limit. Please upgrade your plan.' }
  }

  // Generate short code
  const shortCode = generateShortCode()
  const redirectUrl = getRedirectUrl(shortCode)

  // Generate QR code image
  const qrBuffer = await generateQrCode({
    url: redirectUrl,
    style: finalStyle,
    logoUrl,
    logoSize,
  })

  // Upload to storage
  const fileName = getQrImageFileName(shortCode)
  const qrImageUrl = await uploadQrImage(qrBuffer, fileName)

  // Insert QR code record
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('qr_codes') as any)
    .insert({
      user_id: user.id,
      name,
      short_code: shortCode,
      destination_url: destinationUrl,
      style: finalStyle,
      logo_url: logoUrl || null,
      logo_size: logoSize || null,
      qr_image_url: qrImageUrl,
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating QR code:', error)
    return { error: 'Failed to create QR code' }
  }

  revalidatePath('/qr-codes')
  return { data }
}

export async function updateQrCode(id: string, formData: FormData): Promise<QrActionResponse> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Get existing QR code
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existingQr, error: fetchError } = await (supabase.from('qr_codes') as any)
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !existingQr) {
    return { error: 'QR code not found' }
  }

  // Parse and validate input
  const rawStyle = formData.get('style')
  const style = rawStyle ? JSON.parse(rawStyle as string) : undefined

  const validatedFields = updateQrSchema.safeParse({
    name: formData.get('name') || undefined,
    destinationUrl: formData.get('destinationUrl') || undefined,
    style,
    logoUrl: formData.has('logoUrl') ? formData.get('logoUrl') || null : undefined,
    logoSize: formData.get('logoSize') ? Number(formData.get('logoSize')) : undefined,
    isActive: formData.has('isActive') ? formData.get('isActive') === 'true' : undefined,
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  const updates = validatedFields.data
  // Migrate existing style before merging with updates
  const migratedExistingStyle = migrateQrStyle(existingQr.style)
  const finalStyle: QrStyle = { ...migratedExistingStyle, ...updates.style }

  // Check if we need to regenerate the QR code image
  const needsRegeneration =
    updates.style !== undefined ||
    updates.logoUrl !== undefined ||
    updates.logoSize !== undefined

  let qrImageUrl = existingQr.qr_image_url

  if (needsRegeneration) {
    const redirectUrl = getRedirectUrl(existingQr.short_code)
    const qrBuffer = await generateQrCode({
      url: redirectUrl,
      style: finalStyle,
      logoUrl: updates.logoUrl !== undefined ? updates.logoUrl : existingQr.logo_url,
      logoSize: updates.logoSize !== undefined ? updates.logoSize : existingQr.logo_size || undefined,
    })

    const fileName = getQrImageFileName(existingQr.short_code)
    qrImageUrl = await uploadQrImage(qrBuffer, fileName)
  }

  // Update QR code record
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('qr_codes') as any)
    .update({
      name: updates.name,
      destination_url: updates.destinationUrl,
      style: finalStyle,
      logo_url: updates.logoUrl !== undefined ? updates.logoUrl : existingQr.logo_url,
      logo_size: updates.logoSize !== undefined ? updates.logoSize : existingQr.logo_size,
      qr_image_url: qrImageUrl,
      is_active: updates.isActive !== undefined ? updates.isActive : existingQr.is_active,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating QR code:', error)
    return { error: 'Failed to update QR code' }
  }

  revalidatePath('/qr-codes')
  revalidatePath(`/qr-codes/${id}`)
  return { data }
}

export async function deleteQrCode(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('qr_codes') as any)
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting QR code:', error)
    return { error: 'Failed to delete QR code' }
  }

  revalidatePath('/qr-codes')
  return {}
}

export async function getQrCodes(): Promise<QrListResponse> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('qr_codes') as any)
    .select(`
      *,
      scan_count:scans(count)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching QR codes:', error)
    return { error: 'Failed to fetch QR codes' }
  }

  // Transform the data to include scan_count as a number and migrate old styles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformedData = (data || []).map((qr: any) => ({
    ...qr,
    style: migrateQrStyle(qr.style),
    scan_count: Array.isArray(qr.scan_count) ? qr.scan_count[0]?.count || 0 : 0,
  }))

  return { data: transformedData }
}

export async function getQrCode(id: string): Promise<QrActionResponse> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('qr_codes') as any)
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching QR code:', error)
    return { error: 'QR code not found' }
  }

  // Migrate old style format to new
  return { data: { ...data, style: migrateQrStyle(data.style) } }
}
