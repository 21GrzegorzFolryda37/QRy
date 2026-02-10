'use client'

import Link from 'next/link'
import { Button } from '@/components/ui'
import { gtagReportConversion } from '@/lib/analytics'

export function CTA() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--background-surface)]" />

      {/* Subtle gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--primary)] rounded-full filter blur-[150px] opacity-[0.05]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[var(--secondary)] rounded-full filter blur-[150px] opacity-[0.05]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-3xl">
          {/* Glowing card */}
          <div className="relative p-12 sm:p-16 rounded-3xl bg-white border border-[var(--border)] shadow-xl overflow-hidden">
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-3xl p-[1px] overflow-hidden">
              <div className="absolute inset-[-100%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent,var(--primary),transparent_30%)]" />
            </div>

            {/* Inner content */}
            <div className="relative text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-muted)] border border-[var(--accent)]/30 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
                </span>
                <span className="text-sm font-medium text-[var(--accent)]">Zacznij teraz za darmo</span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-display mb-6">
                <span className="text-[var(--foreground)]">Gotowy, żeby </span>
                <span className="gradient-text">zacząć?</span>
              </h2>

              {/* Description */}
              <p className="text-lg text-[var(--foreground-muted)] leading-relaxed mb-10 max-w-xl mx-auto">
                Stwórz swój pierwszy kod QR w kilka sekund. Karta kredytowa nie jest wymagana.
                Dołącz do tysięcy firm, które już korzystają z QRenixy.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register?source=cta" onClick={() => gtagReportConversion()}>
                  <Button
                    variant="gradient"
                    size="lg"
                    className="shadow-lg shadow-[var(--primary)]/30 hover:shadow-xl hover:shadow-[var(--primary)]/40 transition-shadow"
                  >
                    <span className="flex items-center gap-2">
                      Zacznij za darmo
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Button>
                </Link>

                <Link
                  href="/pricing"
                  className="group flex items-center gap-2 px-6 py-3 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  Zobacz cennik
                  <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 pt-8 border-t border-[var(--border)]">
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-[var(--foreground-muted)]">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--success)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    <span>Bez karty kredytowej</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--success)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    <span>Darmowy plan na zawsze</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--success)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    <span>Anuluj w każdej chwili</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
