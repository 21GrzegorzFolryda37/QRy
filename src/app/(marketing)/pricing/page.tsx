import Link from 'next/link'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { PLANS } from '@/lib/stripe'

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
      'Email support',
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
      'Geographic tracking',
      'Device breakdown',
      'Priority email support',
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
      'Geographic tracking',
      'Device breakdown',
      'UTM tracking',
      'API access',
      'Priority support',
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
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
                      <CheckIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
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

        <div className="mt-24 mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Can I change plans anytime?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                What happens if I exceed my limits?
              </h3>
              <p className="mt-2 text-gray-600">
                We&apos;ll notify you when you&apos;re approaching your limits. You can upgrade your plan to continue creating QR codes and tracking scans.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Do QR codes expire?
              </h3>
              <p className="mt-2 text-gray-600">
                No, your QR codes never expire. They&apos;ll continue to work as long as your account is active.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                What payment methods do you accept?
              </h3>
              <p className="mt-2 text-gray-600">
                We accept all major credit cards through our secure payment processor, Stripe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}
