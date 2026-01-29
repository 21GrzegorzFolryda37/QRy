'use client'

const features = [
  {
    name: 'Dynamiczne kody QR',
    description:
      'Aktualizuj adres docelowy kodu QR w dowolnym momencie bez ponownego drukowania. Zmieniaj URL-e, śledź kampanie i dostosowuj się do potrzeb.',
    icon: QrCodeIcon,
    gradient: 'from-[var(--primary)] to-[var(--primary-hover)]',
  },
  {
    name: 'Analityka w czasie rzeczywistym',
    description:
      'Śledź skany w czasie rzeczywistym. Zobacz kto skanował Twoje kody, kiedy, gdzie i na jakim urządzeniu.',
    icon: ChartIcon,
    gradient: 'from-[var(--secondary)] to-[var(--secondary-hover)]',
  },
  {
    name: 'Personalizacja marki',
    description:
      'Dostosuj kolory, dodaj logo i twórz kody QR, które pasują do identyfikacji wizualnej Twojej marki.',
    icon: PaletteIcon,
    gradient: 'from-[var(--primary)] to-[var(--secondary)]',
  },
  {
    name: 'Łatwe zarządzanie',
    description:
      'Zarządzaj wszystkimi kodami QR z jednego panelu. Twórz, edytuj i organizuj z łatwością.',
    icon: FolderIcon,
    gradient: 'from-[var(--secondary-hover)] to-[var(--primary)]',
  },
]

export function Features() {
  return (
    <section className="py-24 sm:py-32" style={{ backgroundColor: 'rgba(139, 92, 246, 0.9)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-white/80">
            Wszystko czego potrzebujesz
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Potężne funkcje dla <span className="text-cyan-300">nowoczesnego marketingu</span>
          </p>
          <p className="mt-6 text-lg leading-8 text-white/80">
            Twórz kody QR, które pracują ciężej dla Twojego biznesu dzięki funkcjom
            zaprojektowanym z myślą o wydajności i wglądzie w dane.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className="group flex flex-col p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <div className="p-2 rounded-lg bg-white/20 shadow-md">
                    <feature.icon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-white/80">
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

function QrCodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
    </svg>
  )
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  )
}

function PaletteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
    </svg>
  )
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
    </svg>
  )
}
