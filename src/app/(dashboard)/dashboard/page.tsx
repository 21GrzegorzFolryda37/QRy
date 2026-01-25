import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { StatsCard } from '@/components/dashboard'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { getOverviewStats, getTopQrCodes } from '@/actions/analytics'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const [statsResult, topQrCodesResult] = await Promise.all([
    getOverviewStats(),
    getTopQrCodes('30d', 5),
  ])

  const stats = statsResult.data
  const topQrCodes = topQrCodesResult.data || []

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here&apos;s an overview of your QR codes.</p>
        </div>
        <Link href="/qr-codes/new">
          <Button>Create QR Code</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total QR Codes"
          value={stats?.totalQrCodes || 0}
          subtitle={`${stats?.qrLimit === -1 ? 'Unlimited' : `Limit: ${stats?.qrLimit}`}`}
        />
        <StatsCard
          title="Total Scans"
          value={stats?.totalScans || 0}
          subtitle="All time"
        />
        <StatsCard
          title="Scans This Month"
          value={stats?.scansThisMonth || 0}
          subtitle={`${stats?.scanLimit === -1 ? 'Unlimited' : `Limit: ${stats?.scanLimit}/mo`}`}
        />
        <StatsCard
          title="Usage"
          value={
            stats?.scanLimit === -1
              ? 0
              : Math.round(((stats?.currentMonthScans || 0) / (stats?.scanLimit || 1)) * 100)
          }
          subtitle={stats?.scanLimit === -1 ? 'Unlimited' : `${stats?.currentMonthScans || 0} of ${stats?.scanLimit}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing QR Codes</CardTitle>
          </CardHeader>
          <CardContent>
            {topQrCodes.length === 0 ? (
              <p className="text-gray-500 text-sm">No scans recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {topQrCodes.map((qr, index) => (
                  <div key={qr.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-400">
                        #{index + 1}
                      </span>
                      <div>
                        <Link
                          href={`/qr-codes/${qr.id}`}
                          className="text-sm font-medium text-gray-900 hover:underline"
                        >
                          {qr.name}
                        </Link>
                        <p className="text-xs text-gray-500">{qr.shortCode}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {qr.scanCount} scans
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/qr-codes/new" className="block">
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <PlusIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Create QR Code</p>
                  <p className="text-sm text-gray-500">Generate a new dynamic QR code</p>
                </div>
              </div>
            </Link>
            <Link href="/analytics" className="block">
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <ChartIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">View Analytics</p>
                  <p className="text-sm text-gray-500">See detailed scan statistics</p>
                </div>
              </div>
            </Link>
            <Link href="/billing" className="block">
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <UpgradeIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Upgrade Plan</p>
                  <p className="text-sm text-gray-500">Get more QR codes and scans</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  )
}

function UpgradeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  )
}
