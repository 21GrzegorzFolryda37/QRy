import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/types/database'
import { SettingsClient } from './settings-client'

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id || '')
    .single()

  const profile = profileData as Profile | null

  return <SettingsClient profile={profile} userId={user?.id || ''} />
}
