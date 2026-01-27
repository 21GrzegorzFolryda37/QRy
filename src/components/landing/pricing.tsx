import Link from 'next/link'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { PLANS } from '@/lib/stripe/plans'

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
  return (
    <section className="section-pricing py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-[var(--secondary)]">Cennik</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Wybierz odpowiedni <span className="gradient-text">plan dla siebie</span>
          </p>
          <p className="mt-6 text-lg leading-8 text-[var(--foreground-muted)]">
            Zacznij za darmo i skaluj w miarę rozwoju. Wszystkie plany zawierają 14-dniowy okres próbny.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <Card
              key={tier.id}
              variant={tier.featured ? 'gradient-border' : 'default'}
              hover
              className={`animate-fade-in-up ${tier.featured ? 'lg:scale-105 shadow-xl shadow-[var(--primary)]/10' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{tier.name}</CardTitle>
                  {tier.featured && (
                    <span className="rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-3 py-1 text-xs font-semibold text-white">
                      Popularny
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--foreground-muted)]">{tier.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="text-4xl font-bold text-[var(--foreground)]">{tier.price} PLN</span>
                  {tier.price > 0 && <span className="text-[var(--foreground-muted)]">/miesiąc</span>}
                </div>

                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckIcon className={`h-4 w-4 ${tier.featured ? 'text-[var(--secondary)]' : 'text-[var(--success)]'}`} />
                      <span className="text-[var(--foreground-muted)]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/register" className="block">
                  <Button
                    className="w-full"
                    variant={tier.featured ? 'gradient' : 'outline'}
                  >
                    Rozpocznij
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[var(--foreground-muted)]">
            Potrzebujesz więcej?{' '}
            <Link href="/pricing" className="font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors">
              Zobacz cennik Enterprise
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}
