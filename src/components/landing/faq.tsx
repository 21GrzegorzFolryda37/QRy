'use client'

import { useState } from 'react'
import Image from 'next/image'
import { WaveDivider } from './wave-divider'

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

      {/* Mesh gradient */}
      <div className="absolute inset-0 mesh-gradient-primary" />

      {/* Crosshatch pattern */}
      <div className="absolute inset-0 pattern-crosshatch" />

      {/* Static blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="blob blob-primary blob-static"
          style={{
            top: '15%',
            right: '-5%',
            width: '350px',
            height: '350px',
          }}
        />
        <div
          className="blob blob-secondary blob-static"
          style={{
            bottom: '10%',
            left: '-8%',
            width: '400px',
            height: '400px',
          }}
        />
      </div>

      {/* Wave divider top */}
      <WaveDivider variant="wave2" position="top" fillColor="#f8fafc" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left side - Header & Image */}
          <div className="lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--secondary-muted)] border border-[var(--secondary)]/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--secondary)] animate-pulse" />
              <span className="text-sm font-medium text-[var(--secondary)]">FAQ</span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display mb-6">
              <span className="text-[var(--foreground)]">Często zadawane </span>
              <span className="gradient-text">pytania</span>
            </h2>

            <p className="text-lg text-[var(--foreground-muted)] leading-relaxed mb-8">
              Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące naszego generatora kodów QR.
            </p>

            {/* Decorative image */}
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-2xl blur-2xl opacity-20" />
              <div className="relative p-8 rounded-2xl bg-[var(--background-surface)] border border-[var(--border)]">
                <Image
                  src="/FAQ.webp"
                  alt="FAQ Illustration"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Right side - FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-2xl overflow-hidden transition-all duration-300 ${
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
                  <span className={`ml-6 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    openIndex === index
                      ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rotate-180'
                      : 'bg-[var(--background-elevated)] text-[var(--foreground-muted)]'
                  }`}>
                    <ChevronIcon className="h-4 w-4" />
                  </span>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openIndex === index
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-6 pb-5 text-[var(--foreground-muted)] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
