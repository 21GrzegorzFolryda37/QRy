'use client'

import { useEffect, useRef, useState } from 'react'

const features = [
  {
    name: 'Dynamiczne kody QR',
    description:
      'Aktualizuj adres docelowy kodu QR w dowolnym momencie bez ponownego drukowania. Zmieniaj URL-e, śledź kampanie i dostosowuj się do potrzeb.',
    icon: QrCodeIcon,
    gradient: 'from-[#a855f7] to-[#c084fc]',
    glow: 'rgba(168, 85, 247, 0.3)',
  },
  {
    name: 'Analityka w czasie rzeczywistym',
    description:
      'Śledź skany w czasie rzeczywistym. Zobacz kto skanował Twoje kody, kiedy, gdzie i na jakim urządzeniu.',
    icon: ChartIcon,
    gradient: 'from-[#22d3ee] to-[#67e8f9]',
    glow: 'rgba(34, 211, 238, 0.3)',
  },
  {
    name: 'Personalizacja marki',
    description:
      'Dostosuj kolory, dodaj logo i twórz kody QR, które pasują do identyfikacji wizualnej Twojej marki.',
    icon: PaletteIcon,
    gradient: 'from-[#f472b6] to-[#f9a8d4]',
    glow: 'rgba(244, 114, 182, 0.3)',
  },
  {
    name: 'Łatwe zarządzanie',
    description:
      'Zarządzaj wszystkimi kodami QR z jednego panelu. Twórz, edytuj i organizuj z łatwością.',
    icon: FolderIcon,
    gradient: 'from-[#10b981] to-[#34d399]',
    glow: 'rgba(16, 185, 129, 0.3)',
  },
]

export function Features() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            features.forEach((_, index) => {
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

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--background)]" />

      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)] rounded-full mix-blend-screen filter blur-[150px] opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[var(--secondary)] rounded-full mix-blend-screen filter blur-[150px] opacity-20" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-muted)] border border-[var(--primary)]/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
            <span className="text-sm font-medium text-[var(--primary)]">Wszystko czego potrzebujesz</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display">
            <span className="text-[var(--foreground)]">Potężne funkcje dla </span>
            <span className="gradient-text">nowoczesnego marketingu</span>
          </h2>

          <p className="mt-6 text-lg text-[var(--foreground-muted)] leading-relaxed max-w-xl mx-auto">
            Twórz kody QR, które pracują ciężej dla Twojego biznesu dzięki funkcjom
            zaprojektowanym z myślą o wydajności i wglądzie w dane.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.name}
              className={`group relative p-8 rounded-2xl bg-[var(--background-surface)] border border-[var(--border)] transition-all duration-500 ${
                visibleCards.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                style={{
                  boxShadow: `0 0 60px ${feature.glow}`,
                }}
              />

              {/* Top gradient line */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feature.gradient} rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
              />

              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3 font-display">
                {feature.name}
              </h3>
              <p className="text-[var(--foreground-muted)] leading-relaxed">
                {feature.description}
              </p>

              {/* Arrow indicator */}
              <div className="mt-5 flex items-center gap-2 text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium">Dowiedz się więcej</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          ))}
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
