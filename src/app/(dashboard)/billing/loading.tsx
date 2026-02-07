export default function BillingLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="h-8 w-32 animate-pulse rounded bg-[var(--border)]/50" />
        <div className="mt-2 h-5 w-60 animate-pulse rounded bg-[var(--border)]/50" />
      </div>

      {/* Current Plan Card */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--background-surface)] p-6">
        <div className="h-5 w-28 animate-pulse rounded bg-[var(--border)]/50 mb-4" />
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-24 animate-pulse rounded bg-[var(--border)]/50" />
            <div className="mt-2 h-4 w-48 animate-pulse rounded bg-[var(--border)]/50" />
          </div>
          <div className="h-10 w-40 animate-pulse rounded-lg bg-[var(--border)]/50" />
        </div>
      </div>

      {/* Plans Header */}
      <div className="h-6 w-36 animate-pulse rounded bg-[var(--border)]/50" />

      {/* 3 Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--background-surface)] p-6">
            <div className="h-6 w-20 animate-pulse rounded bg-[var(--border)]/50" />
            <div className="mt-4 h-10 w-28 animate-pulse rounded bg-[var(--border)]/50" />
            <div className="mt-2 h-4 w-16 animate-pulse rounded bg-[var(--border)]/50" />
            <div className="mt-6 space-y-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-pulse rounded-full bg-[var(--border)]/50" />
                  <div className="h-4 w-40 animate-pulse rounded bg-[var(--border)]/50" />
                </div>
              ))}
            </div>
            <div className="mt-6 h-10 w-full animate-pulse rounded-lg bg-[var(--border)]/50" />
          </div>
        ))}
      </div>
    </div>
  )
}
