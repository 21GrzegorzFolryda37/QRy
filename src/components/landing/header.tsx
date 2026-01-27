'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)] border-b border-[var(--border)] shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-bold gradient-text">EngageQR</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[var(--foreground-muted)]"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Otwórz menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          <Link
            href="/features"
            className="text-sm font-semibold leading-6 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Funkcje
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-semibold leading-6 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Cennik
          </Link>
          <Link
            href="/contact"
            className="text-sm font-semibold leading-6 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Kontakt
          </Link>
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-4">
          <Link
            href="/login"
            className="text-sm font-semibold leading-6 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Zaloguj się
          </Link>
          <Link href="/register">
            <Button variant="gradient">Rozpocznij</Button>
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[var(--background)] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-[var(--border)]">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-xl font-bold gradient-text">EngageQR</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-[var(--foreground-muted)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Zamknij menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-[var(--border)]">
                <div className="space-y-2 py-6">
                  <Link
                    href="/features"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[var(--foreground)] hover:bg-[var(--background-surface)]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Funkcje
                  </Link>
                  <Link
                    href="/pricing"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[var(--foreground)] hover:bg-[var(--background-surface)]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cennik
                  </Link>
                  <Link
                    href="/contact"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[var(--foreground)] hover:bg-[var(--background-surface)]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Kontakt
                  </Link>
                </div>
                <div className="py-6 space-y-3">
                  <Link
                    href="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-[var(--foreground)] hover:bg-[var(--background-surface)]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Zaloguj się
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="gradient" className="w-full">Rozpocznij za darmo</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
