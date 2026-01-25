'use client'

import { useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { PLANS, PlanId } from '@/lib/stripe/plans'
import { createCheckoutSession } from '@/actions/billing'

interface PricingCardProps {
  planId: PlanId
  currentPlan?: PlanId
  onUpgrade?: () => void
}

export function PricingCard({ planId, currentPlan, onUpgrade }: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const plan = PLANS[planId]
  const isCurrentPlan = currentPlan === planId
  const isFreePlan = planId === 'free'
  const canUpgrade = !isFreePlan && !isCurrentPlan && (currentPlan === 'free' || getPlanRank(planId) > getPlanRank(currentPlan || 'free'))

  async function handleUpgrade() {
    if (!plan.priceId) return

    setIsLoading(true)
    const result = await createCheckoutSession(planId)
    setIsLoading(false)

    if (result.url) {
      window.location.href = result.url
    }
  }

  return (
    <Card className={isCurrentPlan ? 'border-2 border-gray-900' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{plan.name}</CardTitle>
          {isCurrentPlan && <Badge variant="success">Current Plan</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <span className="text-4xl font-bold text-gray-900">{plan.price} PLN</span>
          {plan.price > 0 && <span className="text-gray-500">/month</span>}
        </div>

        <ul className="space-y-3">
          <li className="flex items-center gap-2 text-sm">
            <CheckIcon className="h-4 w-4 text-green-500" />
            <span>
              {plan.qrLimit === -1 ? 'Unlimited' : plan.qrLimit} QR codes
            </span>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <CheckIcon className="h-4 w-4 text-green-500" />
            <span>
              {plan.scanLimit === -1 ? 'Unlimited' : plan.scanLimit.toLocaleString()} scans/month
            </span>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <CheckIcon className="h-4 w-4 text-green-500" />
            <span>Custom QR styling</span>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <CheckIcon className="h-4 w-4 text-green-500" />
            <span>Analytics dashboard</span>
          </li>
          {planId !== 'free' && (
            <>
              <li className="flex items-center gap-2 text-sm">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>Logo overlay</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>Priority support</span>
              </li>
            </>
          )}
          {planId === 'enterprise' && (
            <>
              <li className="flex items-center gap-2 text-sm">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>API access</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckIcon className="h-4 w-4 text-green-500" />
                <span>Dedicated account manager</span>
              </li>
            </>
          )}
        </ul>

        {isCurrentPlan ? (
          <Button variant="outline" className="w-full" disabled>
            Current Plan
          </Button>
        ) : isFreePlan ? (
          <Button variant="outline" className="w-full" disabled>
            Free Forever
          </Button>
        ) : canUpgrade ? (
          <Button className="w-full" onClick={handleUpgrade} isLoading={isLoading}>
            Upgrade to {plan.name}
          </Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            {getPlanRank(planId) < getPlanRank(currentPlan || 'free') ? 'Downgrade' : 'N/A'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function getPlanRank(plan: PlanId): number {
  const ranks: Record<PlanId, number> = {
    free: 0,
    starter: 1,
    pro: 2,
    enterprise: 3,
  }
  return ranks[plan]
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}
