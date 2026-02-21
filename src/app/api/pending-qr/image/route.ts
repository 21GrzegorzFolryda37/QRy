import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const { signupToken, qrCodeBase64 } = await request.json()

    if (!signupToken || !qrCodeBase64) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const base64Data = qrCodeBase64.replace(/^data:image\/\w+;base64,/, '')
    const supabase = createAdminClient()
    const fileName = `pending-qr-${signupToken}-${Date.now()}.png`
    const imageBuffer = Buffer.from(base64Data, 'base64')

    const { error: uploadError } = await supabase.storage
      .from('qr-images')
      .upload(fileName, imageBuffer, { contentType: 'image/png', upsert: true })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from('qr-images').getPublicUrl(fileName)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('pending_qr_codes') as any)
      .update({ qr_image_url: urlData.publicUrl })
      .eq('signup_token', signupToken)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Pending QR image upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
