import Link from 'next/link'
import { Button } from '@/components/ui'

export function Hero() {
  return (
    <section className="pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl animate-fade-in-up">
            <span className="text-[var(--foreground)]">Dynamiczne kody QR</span>
            <br />
            <span className="text-[var(--foreground)]">z </span>
            <span className="gradient-text">zaawansowaną analityką</span>
          </h1>
          <p className="mt-8 text-xl leading-8 text-[var(--foreground)] opacity-80 max-w-2xl mx-auto animate-fade-in-up animate-delay-100">
            Twórz śledzalne kody QR i otrzymuj statystyki skanów w czasie rzeczywistym.
            Aktualizuj adresy docelowe bez ponownego drukowania.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-fade-in-up animate-delay-200">
            <Link href="/register">
              <Button variant="gradient" size="lg" className="shadow-lg shadow-[var(--primary)]/25 text-base px-8 py-3">
                Zacznij za darmo
              </Button>
            </Link>
            <Link
              href="/features"
              className="text-base font-semibold leading-6 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors group"
            >
              Dowiedz się więcej <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

