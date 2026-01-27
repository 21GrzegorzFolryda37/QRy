import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '@/components/ui'
import { Profile } from '@/types/database'

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Ustawienia</h1>
        <p className="text-[var(--foreground-muted)]">Zarządzaj ustawieniami konta</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informacje o profilu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Imię i nazwisko"
            defaultValue={profile?.full_name || ''}
            disabled
          />
          <Input
            label="Email"
            defaultValue={profile?.email || ''}
            disabled
          />
          <p className="text-sm text-[var(--foreground-muted)]">
            Skontaktuj się z pomocą techniczną, aby zaktualizować dane profilu.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Szczegóły konta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-[var(--foreground-muted)]">ID konta</p>
              <p className="text-sm text-[var(--foreground)] font-mono">{user?.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground-muted)]">Data utworzenia</p>
              <p className="text-sm text-[var(--foreground)]">
                {new Date(profile?.created_at || '').toLocaleDateString('pl-PL')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground-muted)]">Aktualny plan</p>
              <p className="text-sm text-[var(--foreground)] capitalize">{profile?.plan || 'Free'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground-muted)]">Status subskrypcji</p>
              <p className="text-sm text-[var(--foreground)] capitalize">
                {profile?.subscription_status || 'Brak'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wykorzystanie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-[var(--foreground-muted)]">Kody QR</p>
              <p className="text-sm text-[var(--foreground)]">
                {profile?.qr_limit === -1
                  ? 'Bez limitu'
                  : `Limit: ${profile?.qr_limit || 5}`}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground-muted)]">Skany miesięcznie</p>
              <p className="text-sm text-[var(--foreground)]">
                {profile?.current_month_scans || 0} /{' '}
                {profile?.monthly_scan_limit === -1
                  ? 'Bez limitu'
                  : profile?.monthly_scan_limit || 1000}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[var(--error)]">Strefa niebezpieczna</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[var(--foreground-muted)]">
            Po usunięciu konta nie ma możliwości jego przywrócenia. Upewnij się, że na pewno chcesz to zrobić.
          </p>
          <Button variant="destructive" disabled>
            Usuń konto
          </Button>
          <p className="text-xs text-[var(--foreground-subtle)]">
            Usuwanie konta jest obecnie wyłączone. Skontaktuj się z pomocą techniczną, aby usunąć konto.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
