export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-32 animate-pulse rounded bg-[var(--border)]/50" />
          <div className="mt-2 h-5 w-64 animate-pulse rounded bg-[var(--border)]/50" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-9 w-28 animate-pulse rounded-lg bg-[var(--border)]/50" />
          <div className="h-9 w-24 animate-pulse rounded-lg bg-[var(--border)]/50" />
        </div>
      </div>

      {/* Realtime Card */}
      <div className="rounded-xl border border-[var(--secondary)]/30 bg-[var(--secondary)]/5 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2 w-2 rounded-full bg-[var(--secondary)] animate-pulse" />
          <div className="h-5 w-36 animate-pulse rounded bg-[var(--border)]/50" />
        </div>
        <div className="h-16 animate-pulse rounded bg-[var(--border)]/50" />
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

      {/* Scans Over Time Chart */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--background-surface)] p-6">
        <div className="h-5 w-32 animate-pulse rounded bg-[var(--border)]/50" />
        <div className="mt-6 h-[300px] animate-pulse rounded bg-[var(--border)]/50" />
      </div>

      {/* Map */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--background-surface)] p-6">
        <div className="h-5 w-36 animate-pulse rounded bg-[var(--border)]/50" />
        <div className="mt-6 h-[400px] animate-pulse rounded bg-[var(--border)]/50" />
      </div>

      {/* 3 Small Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--background-surface)] p-6">
            <div className="h-5 w-24 animate-pulse rounded bg-[var(--border)]/50" />
            <div className="mt-6 h-[250px] animate-pulse rounded bg-[var(--border)]/50" />
          </div>
        ))}
      </div>
    </div>
  )
}
