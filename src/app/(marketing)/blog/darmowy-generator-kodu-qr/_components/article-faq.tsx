'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'Czy darmowy generator QR w QRenixy ma ograniczenia czasowe?',
    answer:
      'Nie, kody QR wygenerowane za darmo w QRenixy działają bez limitu czasu. Możesz ich używać tak długo jak potrzebujesz — nie ma żadnych ukrytych opłat ani dat wygaśnięcia.',
  },
  {
    question: 'Czy muszę się rejestrować żeby użyć darmowego generatora kodów QR?',
    answer:
      'Nie musisz zakładać konta. Wystarczy że podasz adres email na który wyślemy gotowy kod QR. Cały proces zajmuje około 30 sekund.',
  },
  {
    question: 'Ile kosztuje przejście na wersję Pro generatora QR?',
    answer:
      'Plan Starter kosztuje 29 PLN miesięcznie i zawiera 10 dynamicznych kodów QR z podstawową analityką. Plan Pro to 69 PLN miesięcznie z nieograniczoną liczbą kodów i pełną analityką.',
  },
  {
    question: 'Czy mogę zmienić link w kodzie QR po wydrukowaniu?',
    answer:
      'Z darmowym, statycznym kodem QR nie możesz zmienić linku po wygenerowaniu. Jednak kody dynamiczne w planach Starter i Pro pozwalają zmieniać docelowy URL bez konieczności drukowania nowego kodu.',
  },
  {
    question: 'Jakie dane pokazuje analityka kodów QR w QRenixy?',
    answer:
      'Analityka w planach płatnych pokazuje: liczbę skanów w czasie rzeczywistym, lokalizację geograficzną użytkowników (mapa Polski), typ urządzenia (iOS/Android), przeglądarkę, oraz wzorce czasowe skanowania z możliwością eksportu do CSV.',
  },
]

export function ArticleFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="mt-12">
      <h2 className="text-2xl sm:text-3xl font-bold font-display mt-12 mb-6 scroll-mt-20" id="faq">
        Najczęściej Zadawane Pytania o Generator QR
      </h2>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-xl border border-[var(--border)] bg-[var(--background-surface)] transition-all duration-200"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <span
                className={`text-base font-semibold transition-colors ${
                  openIndex === index ? 'text-[#6d28d9]' : 'text-[var(--foreground)]'
                }`}
              >
                {faq.question}
              </span>
              <span
                className={`ml-4 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  openIndex === index
                    ? 'bg-[#6d28d9] text-white rotate-180'
                    : 'bg-[var(--background)] text-[var(--foreground-subtle)]'
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </button>

            <div
              className="grid transition-all duration-300 ease-in-out"
              style={{
                gridTemplateRows: openIndex === index ? '1fr' : '0fr',
              }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-[var(--foreground-muted)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
