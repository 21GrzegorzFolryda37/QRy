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
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500">Manage your subscription and billing</p>
      </div>

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-700">
            Your subscription has been successfully updated!
          </p>
        </div>
      )}

      {canceled && (
        <div className="rounded-md bg-yellow-50 p-4">
          <p className="text-sm text-yellow-700">
            Subscription checkout was canceled.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner />
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-900 capitalize">
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
                      {subscriptionStatus}
                    </Badge>
                  )}
                </div>
                <p className="text-gray-500 mt-1">
                  {PLANS[plan].qrLimit === -1 ? 'Unlimited' : PLANS[plan].qrLimit} QR codes |{' '}
                  {PLANS[plan].scanLimit === -1
                    ? 'Unlimited'
                    : PLANS[plan].scanLimit.toLocaleString()}{' '}
                  scans/month
                </p>
              </div>
              {plan !== 'free' && (
                <Button
                  variant="outline"
                  onClick={handleManageSubscription}
                  isLoading={portalLoading}
                >
                  Manage Subscription
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <PricingCard planId="free" currentPlan={plan} />
          <PricingCard planId="starter" currentPlan={plan} />
          <PricingCard planId="pro" currentPlan={plan} />
          <PricingCard planId="enterprise" currentPlan={plan} />
        </div>
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-gray-400"
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
