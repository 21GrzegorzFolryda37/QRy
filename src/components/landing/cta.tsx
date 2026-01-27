import Link from 'next/link'
import { Button } from '@/components/ui'

export function CTA() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-[var(--foreground)]">Gotowy, żeby </span>
            <span className="gradient-text">zacząć?</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-[var(--foreground-muted)]">
            Stwórz swój pierwszy kod QR w kilka sekund. Karta kredytowa nie jest wymagana.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/register">
              <Button
                variant="gradient"
                size="lg"
                className="shadow-lg shadow-[var(--primary)]/25"
              >
                Zacznij za darmo
              </Button>
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-semibold leading-6 text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors group"
            >
              Zobacz cennik <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
