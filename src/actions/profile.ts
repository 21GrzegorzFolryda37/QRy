'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export type ProfileActionResponse = {
  error?: string
  success?: boolean
}

// Validation schemas
const updateProfileSchema = z.object({
  fullName: z.string().min(1, 'Imie i nazwisko jest wymagane').max(100, 'Imie jest za dlugie'),
})

export async function updateProfile(
  _prevState: ProfileActionResponse | null,
  formData: FormData
): Promise<ProfileActionResponse> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Musisz byc zalogowany' }
  }

  const validatedFields = updateProfileSchema.safeParse({
    fullName: formData.get('fullName'),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  const { fullName } = validatedFields.data

  // Use admin client for database operations (bypasses RLS)
  const adminClient = createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (adminClient.from('profiles') as any)
    .update({
      full_name: fullName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    return { error: 'Nie udalo sie zaktualizowac profilu' }
  }

  revalidatePath('/settings')
  return { success: true }
}

export async function deleteAccount(): Promise<ProfileActionResponse> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Musisz byc zalogowany' }
  }

  // Use admin client for database operations
  const adminClient = createAdminClient()

  try {
    // Deactivate all QR codes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: qrError } = await (adminClient.from('qr_codes') as any)
      .update({ is_active: false })
      .eq('user_id', user.id)

    if (qrError) {
      console.error('Error deactivating QR codes:', qrError)
    }

    // Soft delete - mark profile as deleted
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: profileError } = await (adminClient.from('profiles') as any)
      .update({
        full_name: '[Konto usuniete]',
        email: `deleted_${Date.now()}_${user.email}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (profileError) {
      console.error('Error soft-deleting profile:', profileError)
      return { error: 'Nie udalo sie usunac konta' }
    }

    // Sign out the user
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Error in deleteAccount:', error)
    return { error: 'Wystapil blad podczas usuwania konta' }
  }

  redirect('/login?deleted=true')
}

export async function getProfile() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Musisz byc zalogowany' }
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    return { error: 'Nie udalo sie pobrac profilu' }
  }

  return { data: profile }
}
