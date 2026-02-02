'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'Czym jest kod QR?',
    answer: 'Kod QR (Quick Response) to dwuwymiarowy kod kreskowy, który może przechowywać różne informacje - linki do stron, dane kontaktowe, hasła WiFi i wiele więcej. Wystarczy zeskanować go smartfonem, aby uzyskać dostęp do zakodowanej treści.',
  },
  {
    question: 'Czy generowanie kodów QR jest darmowe?',
    answer: 'Tak! Nasz podstawowy generator kodów QR jest całkowicie darmowy. Możesz tworzyć nieograniczoną liczbę statycznych kodów QR. Dla zaawansowanych funkcji jak dynamiczne kody, analityka czy własne domeny oferujemy plany premium.',
  },
  {
    question: 'Jaka jest różnica między statycznym a dynamicznym kodem QR?',
    answer: 'Statyczny kod QR zawiera stałe dane, których nie można zmienić po utworzeniu. Dynamiczny kod QR kieruje do specjalnego linku przekierowującego, który możesz edytować w dowolnym momencie bez konieczności ponownego drukowania kodu.',
  },
  {
    question: 'Czy mogę śledzić skany moich kodów QR?',
    answer: 'Tak! Dzięki dynamicznym kodom QR możesz śledzić liczbę skanów, lokalizację użytkowników, typy urządzeń, godziny skanowania i wiele więcej. Wszystkie dane są dostępne w czasie rzeczywistym w panelu analitycznym.',
  },
  {
    question: 'W jakich formatach mogę pobrać kod QR?',
    answer: 'Kody QR możesz pobrać w formatach PNG, SVG i PDF. Format SVG jest idealny do druku w wysokiej rozdzielczości, ponieważ jest skalowalny bez utraty jakości.',
  },
  {
    question: 'Czy mogę dodać logo do kodu QR?',
    answer: 'Tak! Możesz dodać własne logo lub wybrać jedno z predefiniowanych logo popularnych marek. Kod QR pozostanie czytelny dzięki wbudowanej korekcji błędów.',
  },
  {
    question: 'Jak długo działają kody QR?',
    answer: 'Statyczne kody QR działają bezterminowo - tak długo, jak istnieje strona docelowa. Dynamiczne kody QR działają tak długo, jak aktywne jest Twoje konto i subskrypcja.',
  },
  {
    question: 'Czy kody QR działają na wszystkich smartfonach?',
    answer: 'Tak! Większość nowoczesnych smartfonów ma wbudowany skaner kodów QR w aplikacji aparatu. Wystarczy skierować kamerę na kod, aby go zeskanować.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white" />

      {/* Subtle gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[var(--secondary)] rounded-full filter blur-[150px] opacity-[0.03]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[var(--primary)] rounded-full filter blur-[150px] opacity-[0.03]" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--secondary-muted)] border border-[var(--secondary)]/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--secondary)] animate-pulse" />
            <span className="text-sm font-medium text-[var(--secondary)]">FAQ</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display mb-6">
            <span className="text-[var(--foreground)]">Często zadawane </span>
            <span className="gradient-text">pytania</span>
          </h2>

          <p className="text-lg text-[var(--foreground-muted)] leading-relaxed">
            Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące naszego generatora kodów QR.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl transition-colors duration-300 ${
                openIndex === index
                  ? 'bg-gradient-to-r from-[var(--primary-muted)] to-[var(--secondary-muted)] border border-[var(--primary)]/30 shadow-md'
                  : 'bg-white border border-[var(--border)] shadow-sm hover:shadow-md hover:border-[var(--border-hover)]'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className={`text-base font-semibold transition-colors ${
                  openIndex === index ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'
                }`}>
                  {faq.question}
                </span>
                <span className={`ml-6 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  openIndex === index
                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rotate-180'
                    : 'bg-[var(--background-elevated)] text-[var(--foreground-muted)]'
                }`}>
                  <ChevronIcon className="h-4 w-4" />
                </span>
              </button>

              <div
                className="grid transition-all duration-300 ease-in-out"
                style={{
                  gridTemplateRows: openIndex === index ? '1fr' : '0fr',
                }}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-[var(--foreground-muted)] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  )
}
