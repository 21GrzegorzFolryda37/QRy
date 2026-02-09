'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui'
import { PricingCard } from '@/components/billing'
import { createPortalSession, createCheckoutSession } from '@/actions/billing'
import { PLANS, PlanId } from '@/lib/stripe'
import { purchase } from '@/lib/analytics'

interface BillingClientProps {
  initialPlan: PlanId
  initialSubscriptionStatus: string | null
  success?: boolean
  canceled?: boolean
  checkoutPlan?: PlanId | null
}

export function BillingClient({
  initialPlan,
  initialSubscriptionStatus,
  success,
  canceled,
  checkoutPlan,
}: BillingClientProps) {
  const [plan] = useState<PlanId>(initialPlan)
  const [subscriptionStatus] = useState<string | null>(initialSubscriptionStatus)
  const [portalLoading, setPortalLoading] = useState(false)
  const checkoutInitiated = useRef(false)

  // Track purchase on successful return from Stripe
  useEffect(() => {
    if (success && initialPlan !== 'free') {
      purchase({
        userId: '',
        plan: PLANS[initialPlan].name,
        billingCycle: 'monthly',
        value: PLANS[initialPlan].price,
        transactionId: `stripe_${Date.now()}`,
      })
    }
  }, [success, initialPlan])

  // Auto-start checkout if redirected from landing page
  useEffect(() => {
    async function startCheckout() {
      if (checkoutPlan && PLANS[checkoutPlan] && !checkoutInitiated.current) {
        checkoutInitiated.current = true
        const result = await createCheckoutSession(checkoutPlan)
        if (result.url) {
          window.location.href = result.url
        }
      }
    }

    startCheckout()
  }, [checkoutPlan])

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
