'use client'

import { Badge, Button } from '@/components/ui'
import Link from 'next/link'

export function AnalyticsUpgradePrompt() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--background-elevated)]">
        <svg className="h-8 w-8 text-[var(--foreground-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      </div>

      <Badge variant="gradient">Starter</Badge>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Odblokuj panel analityczny</h1>
        <p className="mt-2 max-w-md text-[var(--foreground-muted)]">
          Śledź wydajność swoich kodów QR z szczegółową analityką, wykresami i eksportem danych.
        </p>
      </div>

      <ul className="space-y-2 text-sm text-[var(--foreground-muted)]">
        <li className="flex items-center gap-2">
          <svg className="h-4 w-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          Wykresy skanów w czasie
        </li>
        <li className="flex items-center gap-2">
          <svg className="h-4 w-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          Rozkład urządzeń, przeglądarek i systemów
        </li>
        <li className="flex items-center gap-2">
          <svg className="h-4 w-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          Dane geograficzne (kraje i miasta)
        </li>
        <li className="flex items-center gap-2">
          <svg className="h-4 w-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          Top kody QR i eksport CSV/PDF
        </li>
      </ul>

      <Link href="/billing">
        <Button variant="gradient" size="lg">
          Ulepsz do Starter - 29 PLN/mies.
        </Button>
      </Link>

      <Link
        href="/dashboard"
        className="text-sm text-[var(--foreground-muted)] underline underline-offset-4 hover:text-[var(--foreground)]"
      >
        Podstawowe statystyki na stronie głównej
      </Link>
    </div>
  )
}
