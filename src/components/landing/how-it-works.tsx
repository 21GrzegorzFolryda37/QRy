'use client'

import { useEffect, useRef, useState } from 'react'

const steps = [
  {
    number: '01',
    title: 'Wybierz typ kodu',
    description: 'Wybierz spośród wielu typów: link, wizytówka, WiFi, social media, menu i wiele innych.',
    icon: SelectIcon,
  },
  {
    number: '02',
    title: 'Dostosuj wygląd',
    description: 'Personalizuj kolory, kształty, dodaj logo i ramkę. Stwórz kod pasujący do Twojej marki.',
    icon: CustomizeIcon,
  },
  {
    number: '03',
    title: 'Pobierz i śledź',
    description: 'Pobierz kod QR w wysokiej jakości i zacznij śledzić skany w czasie rzeczywistym.',
    icon: DownloadIcon,
  },
]

export function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            steps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps((prev) => [...prev, index])
              }, index * 200)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center py-24 sm:py-32 overflow-hidden bg-white">
      {/* Smooth transition from dark hero */}
      <div className="absolute top-0 left-0 right-0 h-72 pointer-events-none z-10" style={{ background: 'linear-gradient(to bottom, #1a0b2e 0%, rgba(26,11,46,0.7) 25%, rgba(26,11,46,0.35) 50%, rgba(26,11,46,0.1) 75%, transparent 100%)' }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display">
            <span className="text-[var(--foreground)]">Jak to </span>
            <span className="text-[#6d28d9]">działa?</span>
          </h2>

          <p className="mt-6 text-lg text-[var(--foreground-muted)] leading-relaxed">
            Stworzenie profesjonalnego kodu QR zajmuje tylko kilka chwil.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line - desktop */}
          <div className="hidden lg:block absolute top-[4.5rem] left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-[2px]">
            <div className="h-full bg-[#6d28d9] rounded-full opacity-20" />
            <div
              className="absolute top-0 left-0 h-full bg-[#6d28d9] rounded-full transition-all duration-1000"
              style={{
                width: `${(visibleSteps.length / steps.length) * 100}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative flex flex-col items-center text-center transition-all duration-700 ${
                  visibleSteps.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                }`}
              >
                {/* Step icon container */}
                <div className="relative mb-8">
                  {/* Glow effect */}
                  <div
                    className={`absolute inset-0 bg-[#6d28d9] rounded-2xl blur-xl transition-opacity duration-500 ${
                      visibleSteps.includes(index) ? 'opacity-30' : 'opacity-0'
                    }`}
                  />

                  {/* Icon box */}
                  <div className="relative w-24 h-24 rounded-2xl bg-[#6d28d9] p-[2px]">
                    <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                      <step.icon className="w-10 h-10 text-[#6d28d9]" />
                    </div>
                  </div>

                  {/* Number badge */}
                  <div
                    className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-[#6d28d9] flex items-center justify-center text-white text-sm font-bold shadow-lg"
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3 font-display">
                  {step.title}
                </h3>
                <p className="text-[var(--foreground-muted)] max-w-xs leading-relaxed">
                  {step.description}
                </p>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden mt-8">
                    <div className="w-10 h-10 rounded-full bg-[#6d28d9] p-[1px]">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#6d28d9]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SelectIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  )
}

function CustomizeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
    </svg>
  )
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  )
}
