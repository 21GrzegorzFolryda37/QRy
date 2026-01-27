'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui'
import { PricingCard } from '@/components/billing'
import { getUserPlan, createPortalSession } from '@/actions/billing'
import { PLANS, PlanId } from '@/lib/stripe'

export default function BillingPage() {
  const searchParams = useSearchParams()
  const [plan, setPlan] = useState<PlanId>('free')
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)

  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  useEffect(() => {
    async function fetchPlan() {
      const result = await getUserPlan()
      if (result.data) {
        setPlan(result.data.plan)
        setSubscriptionStatus(result.data.subscriptionStatus)
      }
      setLoading(false)
    }

    fetchPlan()
  }, [])

  async function handleManageSubscription() {
    setPortalLoading(true)
    const result = await createPortalSession()
    setPortalLoading(false)

    if (result.url) {
      window.location.href = result.url
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Płatności</h1>
        <p className="text-[var(--foreground-muted)]">Zarządzaj subskrypcją i płatnościami</p>
      </div>

      {success && (
        <div className="rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/30 p-4">
          <p className="text-sm text-[var(--success)]">
            Twoja subskrypcja została pomyślnie zaktualizowana!
          </p>
        </div>
      )}

      {canceled && (
        <div className="rounded-lg bg-[var(--warning)]/10 border border-[var(--warning)]/30 p-4">
          <p className="text-sm text-[var(--warning)]">
            Proces płatności został anulowany.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Aktualny plan</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner />
              <span className="text-[var(--foreground-muted)]">Ładowanie...</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-[var(--foreground)] capitalize">
                    {PLANS[plan].name}
                  </span>
                  {subscriptionStatus && (
                    <Badge
                      variant={
                        subscriptionStatus === 'active'
                          ? 'success'
                          : subscriptionStatus === 'past_due'
                          ? 'warning'
                          : 'outline'
                      }
                    >
                      {subscriptionStatus === 'active' ? 'Aktywna' :
                       subscriptionStatus === 'past_due' ? 'Zaległa płatność' :
                       subscriptionStatus}
                    </Badge>
                  )}
                </div>
                <p className="text-[var(--foreground-muted)] mt-1">
                  {PLANS[plan].qrLimit === -1 ? 'Bez limitu' : PLANS[plan].qrLimit} kodów QR |{' '}
                  {PLANS[plan].scanLimit === -1
                    ? 'Bez limitu'
                    : PLANS[plan].scanLimit.toLocaleString()}{' '}
                  skanów/miesiąc
                </p>
              </div>
              {plan !== 'free' && (
                <Button
                  variant="outline"
                  onClick={handleManageSubscription}
                  isLoading={portalLoading}
                >
                  Zarządzaj subskrypcją
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Dostępne plany</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PricingCard planId="free" currentPlan={plan} />
          <PricingCard planId="starter" currentPlan={plan} />
          <PricingCard planId="pro" currentPlan={plan} />
        </div>
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-[var(--foreground-subtle)]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}
