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
    <Card
      variant={isCurrentPlan ? 'glow' : 'default'}
      hover={!isCurrentPlan}
      className={isCurrentPlan ? 'border-[var(--primary)]' : ''}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{plan.name}</CardTitle>
          {isCurrentPlan && <Badge variant="primary">Aktualny plan</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <span className="text-4xl font-bold text-[var(--foreground)]">{plan.price} PLN</span>
          {plan.price > 0 && <span className="text-[var(--foreground-muted)]">/miesiąc</span>}
        </div>

        <ul className="space-y-3">
          <li className="flex items-center gap-2 text-sm">
            <CheckIcon className="h-4 w-4 text-[var(--success)]" />
            <span className="text-[var(--foreground-muted)]">
              {plan.qrLimit === -1 ? 'Bez limitu' : plan.qrLimit} kodów QR
            </span>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <CheckIcon className="h-4 w-4 text-[var(--success)]" />
            <span className="text-[var(--foreground-muted)]">
              {plan.scanLimit === -1 ? 'Bez limitu' : plan.scanLimit.toLocaleString()} skanów/miesiąc
            </span>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <CheckIcon className="h-4 w-4 text-[var(--success)]" />
            <span className="text-[var(--foreground-muted)]">Własny styl QR</span>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <CheckIcon className="h-4 w-4 text-[var(--success)]" />
            <span className="text-[var(--foreground-muted)]">Panel analityczny</span>
          </li>
          {planId !== 'free' && (
            <>
              <li className="flex items-center gap-2 text-sm">
                <CheckIcon className="h-4 w-4 text-[var(--success)]" />
                <span className="text-[var(--foreground-muted)]">Logo na kodzie QR</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckIcon className="h-4 w-4 text-[var(--success)]" />
                <span className="text-[var(--foreground-muted)]">Priorytetowe wsparcie</span>
              </li>
            </>
          )}
          {planId === 'enterprise' && (
            <>
              <li className="flex items-center gap-2 text-sm">
                <CheckIcon className="h-4 w-4 text-[var(--success)]" />
                <span className="text-[var(--foreground-muted)]">Dostęp do API</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckIcon className="h-4 w-4 text-[var(--success)]" />
                <span className="text-[var(--foreground-muted)]">Dedykowany opiekun konta</span>
              </li>
            </>
          )}
        </ul>

        {isCurrentPlan ? (
          <Button variant="outline" className="w-full" disabled>
            Aktualny plan
          </Button>
        ) : isFreePlan ? (
          <Button variant="outline" className="w-full" disabled>
            Zawsze darmowy
          </Button>
        ) : canUpgrade ? (
          <Button variant="gradient" className="w-full" onClick={handleUpgrade} isLoading={isLoading}>
            Ulepsz do {plan.name}
          </Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            {getPlanRank(planId) < getPlanRank(currentPlan || 'free') ? 'Obniż plan' : 'Niedostępne'}
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
