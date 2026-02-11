'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { PLANS } from '@/lib/stripe/plans'
import { createClient } from '@/lib/supabase/client'
import { pricingViewed, checkoutStarted, gtagReportConversion } from '@/lib/analytics'

const tiers = [
  {
    id: 'free',
    name: PLANS.free.name,
    price: PLANS.free.price,
    description: 'Idealny na początek',
    features: [
      `${PLANS.free.qrLimit} kodów QR`,
      `${PLANS.free.scanLimit.toLocaleString()} skanów/miesiąc`,
      'Własne kolory',
      'Podstawowa analityka',
    ],
  },
  {
    id: 'starter',
    name: PLANS.starter.name,
    price: PLANS.starter.price,
    description: 'Świetny dla małych firm',
    features: [
      `${PLANS.starter.qrLimit} kodów QR`,
      `${PLANS.starter.scanLimit.toLocaleString()} skanów/miesiąc`,
      'Własne kolory i logo',
      'Pełna analityka',
      'Priorytetowe wsparcie',
    ],
    featured: true,
  },
  {
    id: 'pro',
    name: PLANS.pro.name,
    price: PLANS.pro.price,
    description: 'Dla rozwijających się zespołów',
    features: [
      `${PLANS.pro.qrLimit} kodów QR`,
      `${PLANS.pro.scanLimit.toLocaleString()} skanów/miesiąc`,
      'Własne kolory i logo',
      'Pełna analityka',
      'Priorytetowe wsparcie',
      'Dostęp do API',
    ],
  },
]

export function Pricing() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            pricingViewed(null, 'homepage')
            tiers.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index])
              }, index * 150)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  async function handlePlanClick(planId: string) {
    gtagReportConversion()

    // Free plan - go to register
    if (planId === 'free') {
      router.push('/register')
      return
    }

    const plan = PLANS[planId as keyof typeof PLANS]
    if (plan) {
      checkoutStarted({
        userId: '',
        plan: plan.name,
        billingCycle: 'monthly',
        value: plan.price,
      })
    }

    setLoadingPlan(planId)

    if (isLoggedIn) {
      // Logged in - call checkout API directly
      try {
        const response = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId }),
        })
        const data = await response.json()
        if (data.url) {
          window.location.href = data.url
        }
      } catch (error) {
        console.error('Checkout error:', error)
      }
    } else {
      // Not logged in - redirect to login with checkout redirect
      router.push(`/login?redirectTo=/billing?checkout=${planId}`)
    }

    setLoadingPlan(null)
  }

  return (
    <section id="pricing" ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white" />

      {/* Subtle gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[var(--primary)] rounded-full filter blur-[150px] opacity-[0.03]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[var(--secondary)] rounded-full filter blur-[150px] opacity-[0.03]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display">
            <span className="text-[var(--foreground)]">Wybierz odpowiedni </span>
            <span className="text-[#6d28d9]">plan dla siebie</span>
          </h2>

          <p className="mt-6 text-lg text-[var(--foreground-muted)] leading-relaxed">
            Zacznij za darmo i skaluj w miarę rozwoju. Wszystkie płatne plany zawierają 7-dniowy bezpłatny okres próbny.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="mx-auto grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <div
              key={tier.id}
              className={`relative p-8 rounded-2xl transition-all duration-500 flex flex-col ${
                visibleCards.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              } ${
                tier.featured
                  ? 'bg-gradient-to-b from-[var(--primary-muted)] to-white border-2 border-[var(--primary)]/50 lg:scale-105 shadow-xl'
                  : 'bg-white border border-[var(--border)] shadow-sm hover:shadow-lg'
              }`}
            >
              {/* Popular badge */}
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#6d28d9] text-white text-xs font-semibold shadow-lg shadow-[#6d28d9]/30">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Popularny
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[var(--foreground)] font-display">{tier.name}</h3>
                <p className="text-sm text-[var(--foreground-muted)] mt-1">{tier.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <span className="text-5xl font-bold text-[var(--foreground)] font-display">{tier.price}</span>
                <span className="text-lg text-[var(--foreground-muted)]"> PLN</span>
                {tier.price > 0 && <span className="text-[var(--foreground-subtle)]">/miesiąc</span>}
                {tier.price > 0 && (
                  <p className="mt-2 text-sm font-medium text-[#6d28d9]">7 dni za darmo</p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      tier.featured ? 'bg-[var(--primary-muted)]' : 'bg-[var(--success)]/10'
                    }`}>
                      <CheckIcon className={`w-3 h-3 ${tier.featured ? 'text-[var(--primary)]' : 'text-[var(--success)]'}`} />
                    </div>
                    <span className="text-sm text-[var(--foreground-muted)]">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                className={`w-full mt-8 ${tier.featured ? 'shadow-lg shadow-[#6d28d9]/30' : ''}`}
                variant={tier.featured ? 'gradient' : 'outline'}
                size="lg"
                onClick={() => handlePlanClick(tier.id)}
                isLoading={loadingPlan === tier.id}
              >
                Rozpocznij
              </Button>
            </div>
          ))}
        </div>

        {/* Contact link */}
        <div className="mt-16 text-center">
          <p className="text-[var(--foreground-muted)]">
            Potrzebujesz planu enterprise?{' '}
            <Link href="/contact" className="font-semibold text-[var(--primary)] hover:text-[var(--secondary)] transition-colors">
              Skontaktuj się z nami
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}
