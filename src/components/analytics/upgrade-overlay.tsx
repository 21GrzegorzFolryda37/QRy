'use client'

import { Badge, Button } from '@/components/ui'
import { type AnalyticsFeature, FEATURE_LABELS, getRequiredPlan } from '@/lib/plans/analytics-access'
import Link from 'next/link'

interface UpgradeOverlayProps {
  feature: AnalyticsFeature
  children: React.ReactNode
}

export function UpgradeOverlay({ feature, children }: UpgradeOverlayProps) {
  const requiredPlan = getRequiredPlan(feature)
  const label = FEATURE_LABELS[feature]

  return (
    <div className="relative">
      <div className="pointer-events-none select-none" style={{ filter: 'blur(6px)' }}>
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-white/70 backdrop-blur-sm">
        <Badge variant="gradient" className="text-xs uppercase">
          {requiredPlan}
        </Badge>
        <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
        <p className="max-w-xs text-center text-xs text-[var(--foreground-muted)]">
          Ta funkcja jest dostępna w planie {requiredPlan === 'pro' ? 'Pro' : 'Starter'} i wyższych.
        </p>
        <Link href="/billing">
          <Button variant="gradient" size="sm">
            Ulepsz plan
          </Button>
        </Link>
      </div>
    </div>
  )
}
