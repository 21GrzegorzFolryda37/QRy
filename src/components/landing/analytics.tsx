'use client'

const analyticsFeatures = [
  {
    name: 'Statystyki skanowania',
    description: 'Śledź liczbę skanów w czasie rzeczywistym. Zobacz dokładnie ile osób zeskanowało Twój kod QR każdego dnia, tygodnia czy miesiąca.',
    icon: ChartBarIcon,
  },
  {
    name: 'Lokalizacja użytkowników',
    description: 'Dowiedz się skąd pochodzą Twoi odbiorcy. Mapa świata pokazuje kraje i miasta, z których skanowano Twoje kody.',
    icon: MapIcon,
  },
  {
    name: 'Urządzenia i przeglądarki',
    description: 'Sprawdź na jakich urządzeniach skanowane są Twoje kody - smartfony, tablety czy komputery. Poznaj popularne przeglądarki.',
    icon: DeviceIcon,
  },
  {
    name: 'Analiza czasowa',
    description: 'Odkryj kiedy Twoje kody są najczęściej skanowane. Godziny szczytu i dni tygodnia pomogą Ci zoptymalizować kampanie.',
    icon: ClockIcon,
  },
  {
    name: 'Śledzenie UTM',
    description: 'Integruj z Google Analytics dzięki parametrom UTM. Śledź źródła ruchu i efektywność różnych kanałów marketingowych.',
    icon: LinkIcon,
  },
  {
    name: 'Eksport raportów',
    description: 'Pobieraj szczegółowe raporty w formacie PDF. Udostępniaj statystyki zespołowi lub klientom jednym kliknięciem.',
    icon: DocumentIcon,
  },
]

export function Analytics() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-[var(--secondary)]">
            Zaawansowana analityka
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Poznaj swoich <span className="gradient-text">odbiorców</span>
          </p>
          <p className="mt-6 text-lg leading-8 text-[var(--foreground-muted)]">
            Każdy skan to cenna informacja. Nasze narzędzia analityczne pomogą Ci zrozumieć
            kto, kiedy i gdzie korzysta z Twoich kodów QR.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
            {analyticsFeatures.map((feature, index) => (
              <div
                key={feature.name}
                className="group relative flex flex-col p-6 rounded-xl bg-white border border-[var(--border)] shadow-sm hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-[var(--foreground)]">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] shadow-md">
                    <feature.icon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-[var(--foreground-muted)]">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual showcase */}
        <div className="mt-16 sm:mt-20 lg:mt-24">
          <div className="relative rounded-2xl bg-gradient-to-br from-[var(--primary)]/5 to-[var(--secondary)]/5 border border-[var(--border)] p-8 lg:p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl lg:text-5xl font-bold gradient-text">99.9%</div>
                <div className="mt-2 text-sm text-[var(--foreground-muted)]">Dostępność systemu</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold gradient-text">&lt;1s</div>
                <div className="mt-2 text-sm text-[var(--foreground-muted)]">Czas przekierowania</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold gradient-text">190+</div>
                <div className="mt-2 text-sm text-[var(--foreground-muted)]">Obsługiwane kraje</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold gradient-text">24/7</div>
                <div className="mt-2 text-sm text-[var(--foreground-muted)]">Monitoring w czasie rzeczywistym</div>
              </div>
            </div>
          </div>
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
