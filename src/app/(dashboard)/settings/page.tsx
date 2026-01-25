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
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Full Name"
            defaultValue={profile?.full_name || ''}
            disabled
          />
          <Input
            label="Email"
            defaultValue={profile?.email || ''}
            disabled
          />
          <p className="text-sm text-gray-500">
            Contact support to update your profile information.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Account ID</p>
              <p className="text-sm text-gray-900 font-mono">{user?.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created</p>
              <p className="text-sm text-gray-900">
                {new Date(profile?.created_at || '').toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Current Plan</p>
              <p className="text-sm text-gray-900 capitalize">{profile?.plan || 'Free'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Subscription Status</p>
              <p className="text-sm text-gray-900 capitalize">
                {profile?.subscription_status || 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">QR Codes</p>
              <p className="text-sm text-gray-900">
                {profile?.qr_limit === -1
                  ? 'Unlimited'
                  : `Limit: ${profile?.qr_limit || 5}`}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Scans</p>
              <p className="text-sm text-gray-900">
                {profile?.current_month_scans || 0} /{' '}
                {profile?.monthly_scan_limit === -1
                  ? 'Unlimited'
                  : profile?.monthly_scan_limit || 1000}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive" disabled>
            Delete Account
          </Button>
          <p className="text-xs text-gray-500">
            Account deletion is currently disabled. Contact support to delete your account.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
