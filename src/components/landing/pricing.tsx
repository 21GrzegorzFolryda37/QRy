import Link from 'next/link'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { PLANS } from '@/lib/stripe/plans'

const tiers = [
  {
    id: 'free',
    name: PLANS.free.name,
    price: PLANS.free.price,
    description: 'Perfect for getting started',
    features: [
      `${PLANS.free.qrLimit} QR codes`,
      `${PLANS.free.scanLimit.toLocaleString()} scans/month`,
      'Custom colors',
      'Basic analytics',
    ],
  },
  {
    id: 'starter',
    name: PLANS.starter.name,
    price: PLANS.starter.price,
    description: 'Great for small businesses',
    features: [
      `${PLANS.starter.qrLimit} QR codes`,
      `${PLANS.starter.scanLimit.toLocaleString()} scans/month`,
      'Custom colors & logo',
      'Full analytics',
      'Priority support',
    ],
    featured: true,
  },
  {
    id: 'pro',
    name: PLANS.pro.name,
    price: PLANS.pro.price,
    description: 'For growing teams',
    features: [
      `${PLANS.pro.qrLimit} QR codes`,
      `${PLANS.pro.scanLimit.toLocaleString()} scans/month`,
      'Custom colors & logo',
      'Full analytics',
      'Priority support',
      'API access',
    ],
  },
]

export function Pricing() {
  return (
    <section className="bg-[var(--background)] py-24 sm:py-32 relative overflow-hidden">
      {/* Background glows */}
      <div className="glow-orb glow-orb-primary w-80 h-80 top-1/4 -left-40 opacity-20" />
      <div className="glow-orb glow-orb-secondary w-64 h-64 bottom-1/4 -right-32 opacity-15" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-[var(--secondary)]">Pricing</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Choose the right <span className="gradient-text">plan for you</span>
          </p>
          <p className="mt-6 text-lg leading-8 text-[var(--foreground-muted)]">
            Start free and scale as you grow. All plans include a 14-day trial.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <Card
              key={tier.id}
              variant={tier.featured ? 'gradient-border' : 'default'}
              hover
              className={`animate-fade-in-up ${tier.featured ? 'lg:scale-105 glow-primary' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{tier.name}</CardTitle>
                  {tier.featured && (
                    <span className="rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-3 py-1 text-xs font-semibold text-white">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--foreground-muted)]">{tier.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="text-4xl font-bold text-[var(--foreground)]">{tier.price} PLN</span>
                  {tier.price > 0 && <span className="text-[var(--foreground-muted)]">/month</span>}
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
                    Get started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[var(--foreground-muted)]">
            Need more?{' '}
            <Link href="/pricing" className="font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors">
              View Enterprise pricing
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
