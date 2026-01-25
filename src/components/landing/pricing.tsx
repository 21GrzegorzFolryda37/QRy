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
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-gray-600">Pricing</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose the right plan for you
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Start free and scale as you grow. All plans include a 14-day trial.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={tier.featured ? 'border-2 border-gray-900 shadow-lg' : ''}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{tier.name}</CardTitle>
                  {tier.featured && (
                    <span className="rounded-full bg-gray-900 px-2.5 py-1 text-xs font-semibold text-white">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{tier.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="text-4xl font-bold text-gray-900">{tier.price} PLN</span>
                  {tier.price > 0 && <span className="text-gray-500">/month</span>}
                </div>

                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/register" className="block">
                  <Button
                    className="w-full"
                    variant={tier.featured ? 'default' : 'outline'}
                  >
                    Get started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Need more?{' '}
            <Link href="/pricing" className="font-semibold text-gray-900 hover:underline">
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
