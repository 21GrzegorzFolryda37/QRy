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
      await claimPendingQrCode(signupToken, data.user.id)
    } catch (claimError) {
      console.error('Failed to claim pending QR (non-blocking):', claimError)
    }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

async function claimPendingQrCode(token: string, userId: string): Promise<void> {
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

  // Check user's QR limit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (adminClient.from('profiles') as any)
    .select('qr_limit')
    .eq('id', userId)
    .single()

  if (profile) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count } = await (adminClient.from('qr_codes') as any)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (profile.qr_limit !== -1 && (count || 0) >= profile.qr_limit) {
      return // User at QR limit — skip silently
    }
  }

  // Build style: merge with defaults
  const finalStyle = { ...DEFAULT_QR_STYLE, ...(pending.style || {}) }

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
    console.error('Failed to insert claimed QR code:', insertError)
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
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
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

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
