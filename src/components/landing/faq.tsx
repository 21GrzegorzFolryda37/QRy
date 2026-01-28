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
    <section className="py-24 sm:py-32 bg-[var(--background-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-[var(--primary)]">
            FAQ
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Często zadawane <span className="gradient-text">pytania</span>
          </p>
          <p className="mt-6 text-lg leading-8 text-[var(--foreground-muted)]">
            Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące naszego generatora kodów QR.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <dl className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-xl border bg-white overflow-hidden transition-all duration-200 ${
                  openIndex === index
                    ? 'border-[var(--primary)] shadow-md'
                    : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                }`}
              >
                <dt>
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                  >
                    <span className="text-base font-semibold text-[var(--foreground)]">
                      {faq.question}
                    </span>
                    <span className="ml-6 flex-shrink-0">
                      <ChevronIcon
                        className={`h-5 w-5 text-[var(--foreground-muted)] transition-transform duration-500 ${
                          openIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </span>
                  </button>
                </dt>
                <dd
                  className={`transition-all duration-500 ease-in-out ${
                    openIndex === index
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <p className="px-6 pb-5 text-base text-[var(--foreground-muted)] leading-7">
                    {faq.answer}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  )
}
