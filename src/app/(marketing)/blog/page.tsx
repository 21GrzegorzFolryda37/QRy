import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog - QRenixy',
  description: 'Artykuły o kodach QR, marketingu i rozwoju biznesu. Dowiedz się jak wykorzystać kody QR w swojej firmie.',
}

const articles = [
  {
    title: 'Darmowy Generator Kodu QR — Zacznij Za Darmo, Rozwijaj Profesjonalnie',
    excerpt:
      'Szukasz darmowego generatora kodów QR? Dowiedz się kiedy darmowy generator wystarczy, a kiedy warto przejść na wersję Pro z analityką, dynamicznymi kodami i brandingiem.',
    href: '/blog/darmowy-generator-kodu-qr',
    date: '28 stycznia 2025',
    dateTime: '2025-01-28',
    readingTime: '~8 min',
  },
]

export default function BlogPage() {
  return (
    <div className="bg-[var(--background)] py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl font-display">
            Blog
          </h1>
          <p className="mt-4 text-lg text-[var(--foreground-muted)]">
            Artykuły o kodach QR, marketingu i rozwoju biznesu.
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {articles.map((article) => (
            <Link
              key={article.href}
              href={article.href}
              className="block group rounded-2xl border border-[var(--border)] bg-[var(--background-surface)] p-6 sm:p-8 transition-all duration-200 hover:border-[var(--border-hover)] hover:shadow-lg"
            >
              <div className="flex items-center gap-3 text-sm text-[var(--foreground-subtle)] mb-3">
                <time dateTime={article.dateTime}>{article.date}</time>
                <span className="inline-flex items-center rounded-full bg-[var(--background)] border border-[var(--border)] px-2.5 py-0.5 text-xs font-medium text-[var(--foreground-muted)]">
                  {article.readingTime}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] group-hover:text-[#6d28d9] transition-colors font-display">
                {article.title}
              </h2>
              <p className="mt-3 text-[var(--foreground-muted)] leading-relaxed">
                {article.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-[#6d28d9] group-hover:underline">
                Czytaj więcej
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
