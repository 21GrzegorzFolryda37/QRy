'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/lib/validations/auth'
import { DEFAULT_QR_STYLE } from '@/types/qr'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export type ActionResponse = {
  error?: string
  success?: boolean
}

export async function login(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const supabase = await createClient()

  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  const { email, password } = validatedFields.data

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  const redirectTo = formData.get('redirectTo') as string
  revalidatePath('/', 'layout')

  if (redirectTo) {
    const separator = redirectTo.includes('?') ? '&' : '?'
    redirect(`${redirectTo}${separator}login=success`)
  } else {
    redirect('/dashboard?login=success')
  }
}

export async function register(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const supabase = await createClient()

  const validatedFields = registerSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
    newsletterConsent: formData.get('newsletterConsent') === 'on',
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  const { email, password, fullName, newsletterConsent } = validatedFields.data

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Save newsletter consent if opted in
  if (newsletterConsent && data.user?.id) {
    try {
      const adminClient = createAdminClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (adminClient.from('profiles') as any)
        .update({ newsletter_consent: true })
        .eq('id', data.user.id)
    } catch (consentError) {
      console.error('Failed to save newsletter consent (non-blocking):', consentError)
    }
  }

  // Claim pending QR code if signup token provided
  const signupToken = formData.get('signupToken') as string | null
  if (signupToken && data.user?.id) {
    try {
      await claimPendingQrCode(signupToken, data.user.id, email)
    } catch (claimError) {
      console.error('Failed to claim pending QR (non-blocking):', claimError)
    }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

async function claimPendingQrCode(token: string, userId: string, email?: string): Promise<void> {
  const adminClient = createAdminClient()

  // Find unclaimed, non-expired pending QR
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: pending, error: fetchError } = await (adminClient.from('pending_qr_codes') as any)
    .select('*')
    .eq('signup_token', token)
    .eq('claimed', false)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (fetchError || !pending) {
    return // Token invalid, expired, or already claimed — skip silently
  }

  // Wait for profile row to exist (Supabase trigger may not have committed yet)
  // qr_codes.user_id is FK → profiles.id, so insert fails if profile isn't ready
  let profile: { qr_limit: number } | null = null
  for (let attempt = 0; attempt < 5; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 500))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (adminClient.from('profiles') as any)
      .select('qr_limit')
      .eq('id', userId)
      .single()
    if (data) { profile = data; break }
    console.log(`claimPendingQrCode: profile not found yet (attempt ${attempt + 1}/5)`)
  }

  if (!profile) {
    console.error('claimPendingQrCode: profile never appeared for userId', userId)
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count } = await (adminClient.from('qr_codes') as any)
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (profile.qr_limit !== -1 && (count || 0) >= profile.qr_limit) {
    console.log('claimPendingQrCode: user at QR limit', { qr_limit: profile.qr_limit, count })
    return
  }

  // Build style: merge with defaults
  const finalStyle = { ...DEFAULT_QR_STYLE, ...(pending.style || {}) }

  // Send welcome email first (independent of DB insert outcome)
  if (email && resend) {
    try {
      const qrImageUrl = pending.qr_image_url as string | null
      const destinationUrl = pending.destination_url as string

      await resend.emails.send({
        from: 'QRenixy <hello@qrenixy.com>',
        to: [email],
        subject: 'Twój kod QR jest gotowy!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; background: white;">

              <!-- Header: logo + brand name -->
              <div style="background: white; padding: 20px 32px; border-bottom: 1px solid #e5e7eb;">
                <table style="border-collapse: collapse;">
                  <tr>
                    <td style="vertical-align: middle; padding-right: 10px;">
                      <img src="https://qrenixy.com/logo.png" alt="QRenixy" width="36" height="36" style="display: block; border-radius: 8px;" />
                    </td>
                    <td style="vertical-align: middle;">
                      <span style="color: #6d28d9; font-size: 20px; font-weight: 700; line-height: 1;">QRenixy</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- QR Code -->
              <div style="padding: 40px 20px; text-align: center; background: white;">
                ${qrImageUrl ? `<img src="${qrImageUrl}" alt="Twoj QR kod" style="max-width: 300px; border-radius: 16px; box-shadow: 0 6px 20px rgba(0,0,0,0.15);" />` : ''}
                <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
                  Zakodowany link: <a href="${destinationUrl.replace(/</g, '&lt;').replace(/>/g, '&gt;')}" style="color: #6d28d9; font-weight: 500; text-decoration: none;">${destinationUrl.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</a>
                </p>
              </div>

              <!-- CTA Section -->
              <div style="background: #6d28d9; padding: 36px 32px; text-align: center;">
                <a href="https://qrenixy.com/dashboard" style="display: inline-block; background: white; color: #6d28d9; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 8px 16px rgba(0,0,0,0.2);">
                  Zobacz ile osob zeskanowalo twoj kod
                </a>
              </div>

              <!-- Footer -->
              <div style="padding: 28px 20px; text-align: center; color: #9ca3af; font-size: 13px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 6px 0;">
                  Masz pytania? Napisz do nas: <a href="mailto:contact@qrenixy.com" style="color: #6d28d9; text-decoration: none;">contact@qrenixy.com</a>
                </p>
                <p style="margin: 0; font-size: 12px;">
                  &copy; ${new Date().getFullYear()} QRenixy. Wszelkie prawa zastrzezone.
                </p>
              </div>

            </div>
          </body>
          </html>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send welcome QR email (non-blocking):', emailError)
    }
  }

  // Insert into qr_codes with the SAME short_code
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: insertError } = await (adminClient.from('qr_codes') as any)
    .insert({
      user_id: userId,
      name: pending.destination_url,
      short_code: pending.short_code,
      destination_url: pending.destination_url,
      style: finalStyle,
      logo_url: pending.logo_url,
      logo_size: pending.logo_size,
      qr_image_url: pending.qr_image_url,
      is_active: true,
    })

  if (insertError) {
    console.error('Failed to insert claimed QR code:', JSON.stringify(insertError, null, 2))
    return
  }

  // Mark pending as claimed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (adminClient.from('pending_qr_codes') as any)
    .update({ claimed: true, claimed_by: userId })
    .eq('id', pending.id)
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function resetPassword(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const supabase = await createClient()

  const validatedFields = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  const { email } = validatedFields.data

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updatePassword(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const supabase = await createClient()

  const validatedFields = resetPasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  const { password } = validatedFields.data

  const { data: userData } = await supabase.auth.getUser()
  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Mark has_password = true in profile
  if (userData?.user?.id) {
    try {
      const adminClient = createAdminClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (adminClient.from('profiles') as any)
        .update({ has_password: true })
        .eq('id', userData.user.id)
    } catch (e) {
      console.error('Failed to set has_password (non-blocking):', e)
    }
  }

  revalidatePath('/', 'layout')

  // If called from settings page, return success without redirecting
  if (formData.get('noRedirect') === 'true') {
    return { success: true }
  }

  redirect('/dashboard')
}

export async function signupInstant(
  email: string,
  signupToken?: string,
  marketingConsent?: boolean
): Promise<ActionResponse> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password: crypto.randomUUID(),
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user?.id && marketingConsent) {
    await (supabase.from('profiles') as any)
      .update({ newsletter_consent: true })
      .eq('id', data.user.id)
  }

  if (signupToken && data.user?.id) {
    try {
      await claimPendingQrCode(signupToken, data.user.id, email)
    } catch (claimError) {
      console.error('Failed to claim pending QR (non-blocking):', claimError)
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function sendMagicLink(
  email: string,
  redirectTo?: string
): Promise<ActionResponse> {
  const supabase = await createClient()
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL

  const next = redirectTo ?? '/dashboard'
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${APP_URL}/auth/callback?next=${next}`,
      shouldCreateUser: false,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
