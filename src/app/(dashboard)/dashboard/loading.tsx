export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-40 animate-pulse rounded bg-[var(--border)]/50" />
          <div className="mt-2 h-5 w-72 animate-pulse rounded bg-[var(--border)]/50" />
        </div>
        <div className="h-10 w-36 animate-pulse rounded-lg bg-[var(--border)]/50" />
      </div>

      {/* 4 Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--background-surface)] p-6">
            <div className="h-4 w-28 animate-pulse rounded bg-[var(--border)]/50" />
            <div className="mt-3 h-8 w-16 animate-pulse rounded bg-[var(--border)]/50" />
            <div className="mt-2 h-3 w-20 animate-pulse rounded bg-[var(--border)]/50" />
          </div>
        ))}
      </div>

      {/* 2 Content Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--background-surface)] p-6">
            <div className="h-5 w-36 animate-pulse rounded bg-[var(--border)]/50" />
            <div className="mt-6 space-y-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--border)]/50" />
                    <div>
                      <div className="h-4 w-32 animate-pulse rounded bg-[var(--border)]/50" />
                      <div className="mt-1 h-3 w-24 animate-pulse rounded bg-[var(--border)]/50" />
                    </div>
                  </div>
                  <div className="h-4 w-16 animate-pulse rounded bg-[var(--border)]/50" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
