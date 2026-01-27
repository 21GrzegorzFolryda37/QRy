import Link from 'next/link'
import { Button } from '@/components/ui'

const features = [
  {
    name: 'Dynamiczne kody QR',
    description:
      'W przeciwieństwie do statycznych kodów QR, nasze dynamiczne kody pozwalają zmienić docelowy URL w dowolnym momencie bez ponownego drukowania. Idealne do kampanii marketingowych, opakowań produktów i wizytówek.',
    details: [
      'Zmień docelowy URL w dowolnym momencie',
      'Bez konieczności ponownego druku',
      'Automatyczne śledzenie wszystkich skanów',
      'Testy A/B różnych stron docelowych',
    ],
  },
  {
    name: 'Zaawansowana analityka',
    description:
      'Uzyskaj szczegółowe informacje o tym, kto skanuje Twoje kody QR, kiedy i gdzie. Podejmuj decyzje oparte na danych dzięki kompleksowej analityce.',
    details: [
      'Śledzenie skanów w czasie rzeczywistym',
      'Dane o lokalizacji geograficznej',
      'Statystyki urządzeń i przeglądarek',
      'Analityka czasowa',
    ],
  },
  {
    name: 'Własny branding',
    description:
      'Twórz kody QR pasujące do identyfikacji wizualnej Twojej marki. Dostosuj kolory, dodaj logo i zachowaj spójność marki we wszystkich punktach kontaktu.',
    details: [
      'Własne kolory pierwszego planu/tła',
      'Obsługa nakładki z logo',
      'Regulowana korekcja błędów',
      'Wiele rozmiarów i formatów',
    ],
  },
  {
    name: 'Śledzenie parametrów UTM',
    description:
      'Śledź skuteczność swoich kampanii marketingowych dzięki pełnej obsłudze parametrów UTM. Dowiedz się dokładnie, skąd pochodzi Twój ruch.',
    details: [
      'Automatyczne przechwytywanie UTM',
      'Śledzenie wydajności kampanii',
      'Atrybucja źródła/medium',
      'Łatwa integracja z narzędziami analitycznymi',
    ],
  },
  {
    name: 'Łatwe zarządzanie',
    description:
      'Zarządzaj wszystkimi kodami QR z jednego, intuicyjnego panelu. Twórz, edytuj, organizuj i analizuj z łatwością.',
    details: [
      'Scentralizowany panel',
      'Operacje zbiorcze',
      'Wyszukiwanie i filtrowanie',
      'Możliwości eksportu',
    ],
  },
  {
    name: 'Niezawodna infrastruktura',
    description:
      'Zbudowana na infrastrukturze klasy enterprise dla maksymalnej niezawodności. Twoje kody QR zawsze będą działać, gdy Twoi klienci ich potrzebują.',
    details: [
      'Gwarancja 99,9% dostępności',
      'Globalna dystrybucja CDN',
      'Szybkie czasy przekierowania',
      'Bezpieczne punkty końcowe HTTPS',
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Wszystko, czego potrzebujesz do sukcesu z kodami QR
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Zaawansowane funkcje zaprojektowane dla nowoczesnych marketerów, firm i twórców.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="space-y-16">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className={`flex flex-col gap-8 lg:flex-row ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{feature.name}</h2>
                  <p className="mt-4 text-gray-600">{feature.description}</p>
                  <ul className="mt-6 space-y-3">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm">[Ilustracja funkcji]</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Gotowy, aby zacząć?</h2>
          <p className="mt-4 text-gray-600">
            Stwórz swój pierwszy kod QR w kilka sekund. Nie wymagamy karty kredytowej.
          </p>
          <div className="mt-8 flex items-center justify-center gap-x-4">
            <Link href="/register">
              <Button size="lg">Zacznij za darmo</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                Zobacz cennik
              </Button>
            </Link>
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
