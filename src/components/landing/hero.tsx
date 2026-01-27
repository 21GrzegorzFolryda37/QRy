import Link from 'next/link'
import { Button } from '@/components/ui'

export function Hero() {
  return (
    <section className="section-hero pt-32 pb-20 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl animate-fade-in-up">
            <span className="text-[var(--foreground)]">Dynamiczne kody QR z</span>
            <br />
            <span className="gradient-text">zaawansowaną analityką</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-[var(--foreground-muted)] animate-fade-in-up animate-delay-100">
            Twórz markowe, śledzalne kody QR, które pomogą Ci zrozumieć Twoją publiczność.
            Aktualizuj adresy docelowe w dowolnym momencie bez ponownego drukowania.
            Otrzymuj statystyki skanów, lokalizacji i urządzeń w czasie rzeczywistym.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in-up animate-delay-200">
            <Link href="/register">
              <Button variant="gradient" size="lg" className="shadow-lg shadow-[var(--primary)]/25">
                Zacznij za darmo
              </Button>
            </Link>
            <Link
              href="/features"
              className="text-sm font-semibold leading-6 text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors group"
            >
              Dowiedz się więcej <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </div>

        <div className="mt-16 flex justify-center animate-fade-in-up animate-delay-300">
          <div className="relative rounded-2xl gradient-border p-1 shadow-xl">
            <div className="rounded-xl bg-white p-8">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center animate-float">
                  <div className="w-40 h-40 bg-[var(--background-surface)] rounded-xl flex items-center justify-center border border-[var(--border)] shadow-lg shadow-[var(--primary)]/10">
                    <QrCodeIcon className="w-24 h-24 text-[var(--primary)]" />
                  </div>
                  <p className="mt-4 text-sm text-[var(--foreground-muted)]">Twój markowy kod QR</p>
                </div>
                <ArrowIcon className="w-8 h-8 text-[var(--secondary)] animate-pulse" />
                <div className="text-center animate-float animate-delay-200">
                  <div className="w-40 h-40 bg-[var(--background-surface)] rounded-xl flex items-center justify-center border border-[var(--border)] shadow-lg shadow-[var(--secondary)]/10">
                    <ChartIcon className="w-24 h-24 text-[var(--secondary)]" />
                  </div>
                  <p className="mt-4 text-sm text-[var(--foreground-muted)]">Analityka w czasie rzeczywistym</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function QrCodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
    </svg>
  )
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  )
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  )
}
