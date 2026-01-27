'use client'

import { useState } from 'react'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter,
} from '@/components/ui'
import { useToast } from '@/components/ui/toast'
import { PLANS, PlanId } from '@/lib/stripe/plans'
import { createCheckoutSession, getDowngradeInfo, downgradePlan, DowngradeInfo } from '@/actions/billing'

interface PricingCardProps {
  planId: PlanId
  currentPlan?: PlanId
  onUpgrade?: () => void
}

export function PricingCard({ planId, currentPlan, onUpgrade }: PricingCardProps) {
  const { error: showError, success } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showDowngradeModal, setShowDowngradeModal] = useState(false)
  const [downgradeInfo, setDowngradeInfo] = useState<DowngradeInfo | null>(null)
  const [isDowngrading, setIsDowngrading] = useState(false)

  const plan = PLANS[planId]
  const isCurrentPlan = currentPlan === planId
  const isFreePlan = planId === 'free'
  const canUpgrade = !isFreePlan && !isCurrentPlan && (currentPlan === 'free' || getPlanRank(planId) > getPlanRank(currentPlan || 'free'))
  const canDowngrade = !isCurrentPlan && !isFreePlan && currentPlan !== 'free' && getPlanRank(planId) < getPlanRank(currentPlan || 'free')
  const canDowngradeToFree = !isCurrentPlan && isFreePlan && currentPlan !== 'free'

  async function handleUpgrade() {
    if (!plan.priceId) return

    setIsLoading(true)
    const result = await createCheckoutSession(planId)
    setIsLoading(false)

    if (result.error) {
      showError(result.error)
      return
    }

    if (result.url) {
      window.location.href = result.url
    }
  }

  async function handleDowngradeClick() {
    setIsLoading(true)

    const result = await getDowngradeInfo(planId)

    setIsLoading(false)

    if (result.error) {
      showError(result.error)
      return
    }

    if (result.data) {
      setDowngradeInfo(result.data)
      setShowDowngradeModal(true)
    }
  }

  async function confirmDowngrade() {
    setIsDowngrading(true)

    const result = await downgradePlan(planId)

    setIsDowngrading(false)

    if (result.error) {
      showError(result.error)
      return
    }

    if (result.url) {
      success('Plan zostal zmieniony pomyslnie')
      window.location.href = result.url
    }
  }

  return (
    <>
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
            {plan.price > 0 && <span className="text-[var(--foreground-muted)]">/miesiac</span>}
          </div>

          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-sm">
              <CheckIcon className="h-4 w-4 text-[var(--success)]" />
              <span className="text-[var(--foreground-muted)]">
                {plan.qrLimit === -1 ? 'Bez limitu' : plan.qrLimit} kodow QR
              </span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckIcon className="h-4 w-4 text-[var(--success)]" />
              <span className="text-[var(--foreground-muted)]">
                {plan.scanLimit === -1 ? 'Bez limitu' : plan.scanLimit.toLocaleString()} skanow/miesiac
              </span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckIcon className="h-4 w-4 text-[var(--success)]" />
              <span className="text-[var(--foreground-muted)]">Wlasny styl QR</span>
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
                  <span className="text-[var(--foreground-muted)]">Dostep do API</span>
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
          ) : isFreePlan && currentPlan === 'free' ? (
            <Button variant="outline" className="w-full" disabled>
              Zawsze darmowy
            </Button>
          ) : canUpgrade ? (
            <Button variant="gradient" className="w-full" onClick={handleUpgrade} isLoading={isLoading}>
              Ulepsz do {plan.name}
            </Button>
          ) : canDowngrade || canDowngradeToFree ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDowngradeClick}
              isLoading={isLoading}
            >
              Obniz do {plan.name}
            </Button>
          ) : (
            <Button variant="outline" className="w-full" disabled>
              Niedostepne
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Downgrade Confirmation Modal */}
      <Modal isOpen={showDowngradeModal} onClose={() => setShowDowngradeModal(false)}>
        <ModalHeader>
          <ModalTitle>Potwierdzenie obniżenia planu</ModalTitle>
          <ModalDescription>
            Przechodzisz z planu {downgradeInfo?.currentPlan && PLANS[downgradeInfo.currentPlan].name} na{' '}
            {plan.name}
          </ModalDescription>
        </ModalHeader>
        <ModalContent>
          <div className="space-y-4">
            {downgradeInfo?.warnings && downgradeInfo.warnings.length > 0 && (
              <div className="rounded-lg bg-[var(--warning)]/10 border border-[var(--warning)]/30 p-4">
                <p className="text-sm font-medium text-[var(--warning)] mb-2">Uwaga:</p>
                <ul className="space-y-2">
                  {downgradeInfo.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-[var(--warning)]/80 flex items-start gap-2">
                      <span className="mt-1">-</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-lg bg-[var(--background-surface)] border border-[var(--border)] p-4">
              <h4 className="text-sm font-medium text-[var(--foreground)] mb-3">
                Porownanie planow:
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[var(--foreground-muted)]">Aktualny plan</p>
                  <p className="font-medium text-[var(--foreground)]">
                    {downgradeInfo?.currentPlan && PLANS[downgradeInfo.currentPlan].name}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--foreground-muted)]">Nowy plan</p>
                  <p className="font-medium text-[var(--foreground)]">{plan.name}</p>
                </div>
                <div>
                  <p className="text-[var(--foreground-muted)]">Kody QR</p>
                  <p className="font-medium text-[var(--foreground)]">
                    {downgradeInfo?.currentQrCount} / {plan.qrLimit === -1 ? '∞' : plan.qrLimit}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--foreground-muted)]">Limit skanow</p>
                  <p className="font-medium text-[var(--foreground)]">
                    {plan.scanLimit === -1 ? 'Bez limitu' : plan.scanLimit.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {downgradeInfo?.excessQrCodes && downgradeInfo.excessQrCodes > 0 && (
              <p className="text-sm text-[var(--foreground-muted)]">
                <strong>{downgradeInfo.excessQrCodes}</strong> najstarszych kodow QR zostanie
                automatycznie dezaktywowanych po zmianie planu.
              </p>
            )}

            {planId === 'free' && (
              <p className="text-sm text-[var(--foreground-muted)]">
                Zostaniesz przekierowany do portalu Stripe, gdzie mozesz anulowac subskrypcje.
              </p>
            )}
          </div>
        </ModalContent>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setShowDowngradeModal(false)}
            disabled={isDowngrading}
          >
            Anuluj
          </Button>
          <Button
            variant="primary"
            onClick={confirmDowngrade}
            isLoading={isDowngrading}
          >
            Potwierdz zmiane
          </Button>
        </ModalFooter>
      </Modal>
    </>
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
