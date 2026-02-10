export default function BlogPage() {
  return (
    <div className="bg-[var(--background)] py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Blog
          </h1>
          <p className="mt-4 text-lg text-[var(--foreground-muted)]">
            Wkrotce pojawia sie tutaj artykuly o kodach QR, marketingu i nie tylko.
          </p>
        </div>

        <div className="mt-16 flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-[var(--background-surface)] border border-[var(--border)] flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-[var(--foreground-subtle)]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
            </svg>
          </div>
          <p className="text-[var(--foreground-muted)] text-center max-w-md">
            Pracujemy nad pierwszymi wpisami. Sprawdz ponownie wkrotce!
          </p>
        </div>
      </div>
    </div>
  )
}
