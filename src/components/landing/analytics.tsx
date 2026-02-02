'use client'

import { useEffect, useRef, useState } from 'react'

const analyticsFeatures = [
  {
    name: 'Statystyki skanowania',
    description: 'Śledź liczbę skanów w czasie rzeczywistym. Zobacz dokładnie ile osób zeskanowało Twój kod QR każdego dnia, tygodnia czy miesiąca.',
    icon: ChartBarIcon,
    color: 'primary',
  },
  {
    name: 'Lokalizacja użytkowników',
    description: 'Dowiedz się skąd pochodzą Twoi odbiorcy. Mapa świata pokazuje kraje i miasta, z których skanowano Twoje kody.',
    icon: MapIcon,
    color: 'secondary',
  },
  {
    name: 'Urządzenia i przeglądarki',
    description: 'Sprawdź na jakich urządzeniach i systemach operacyjnych skanowane są Twoje kody - smartfony, tablety czy komputery.',
    icon: DeviceIcon,
    color: 'accent',
  },
  {
    name: 'Analiza czasowa',
    description: 'Odkryj kiedy Twoje kody są najczęściej skanowane. Godziny szczytu i dni tygodnia pomogą Ci zoptymalizować kampanie.',
    icon: ClockIcon,
    color: 'primary',
  },
  {
    name: 'Porównanie kodów',
    description: 'Porównuj wyniki różnych kodów QR obok siebie. Analizuj, które kampanie osiągają najlepsze rezultaty.',
    icon: LinkIcon,
    color: 'secondary',
  },
  {
    name: 'Wygodny eksport raportów',
    description: 'Pobieraj szczegółowe raporty w formacie PDF. Udostępniaj statystyki zespołowi lub klientom jednym kliknięciem.',
    icon: DocumentIcon,
    color: 'accent',
  },
]

export function Analytics() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            analyticsFeatures.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index])
              }, index * 100)
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

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white" />

      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient-bg blur-3xl" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--secondary-muted)] border border-[var(--secondary)]/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--secondary)] animate-pulse" />
            <span className="text-sm font-medium text-[var(--secondary)]">Zaawansowana analityka</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display">
            <span className="text-[var(--foreground)]">Poznaj swoich </span>
            <span className="gradient-text">odbiorców</span>
          </h2>

          <p className="mt-6 text-lg text-[var(--foreground-muted)] leading-relaxed">
            Każdy skan to cenna informacja. Nasze narzędzia analityczne pomogą Ci zrozumieć
            kto, kiedy i gdzie korzysta z Twoich kodów QR.
          </p>
        </div>

        {/* Features grid */}
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3">
            {analyticsFeatures.map((feature, index) => (
              <div
                key={feature.name}
                className={`group relative flex flex-col p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-500 hover:-translate-y-1 ${
                  visibleCards.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <dt className="relative flex items-center gap-x-4 text-base font-semibold leading-7 text-[var(--foreground)]">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] shadow-md">
                    <feature.icon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="relative mt-4 flex flex-auto flex-col text-sm leading-relaxed text-[var(--foreground-muted)]">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

function ChartBarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  )
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
    </svg>
  )
}

function DeviceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
  )
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  )
}
