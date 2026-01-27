import Link from 'next/link'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { PLANS } from '@/lib/stripe'

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
      'Wsparcie e-mail',
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
      'Śledzenie geograficzne',
      'Statystyki urządzeń',
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
      'Śledzenie geograficzne',
      'Statystyki urządzeń',
      'Śledzenie UTM',
      'Dostęp do API',
      'Priorytetowe wsparcie',
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Prosty i przejrzysty cennik
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Wybierz plan dopasowany do Twoich potrzeb. Wszystkie plany zawierają 14-dniowy okres próbny.
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
                      Popularny
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{tier.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="text-4xl font-bold text-gray-900">{tier.price} PLN</span>
                  {tier.price > 0 && <span className="text-gray-500">/miesiąc</span>}
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
                    Rozpocznij
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-24 mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Często zadawane pytania
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Czy mogę zmienić plan w dowolnym momencie?
              </h3>
              <p className="mt-2 text-gray-600">
                Tak, możesz ulepszać lub obniżać swój plan w dowolnym momencie. Zmiany wchodzą w życie natychmiast.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Co się stanie, jeśli przekroczę limity?
              </h3>
              <p className="mt-2 text-gray-600">
                Powiadomimy Cię, gdy zbliżysz się do limitów. Możesz ulepszyć swój plan, aby kontynuować tworzenie kodów QR i śledzenie skanów.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Czy kody QR wygasają?
              </h3>
              <p className="mt-2 text-gray-600">
                Nie, Twoje kody QR nigdy nie wygasają. Będą działać tak długo, jak Twoje konto jest aktywne.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Jakie metody płatności akceptujecie?
              </h3>
              <p className="mt-2 text-gray-600">
                Akceptujemy wszystkie główne karty kredytowe przez nasz bezpieczny procesor płatności Stripe.
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
