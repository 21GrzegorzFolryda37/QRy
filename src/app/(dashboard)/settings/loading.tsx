export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="h-8 w-36 animate-pulse rounded bg-[var(--border)]/50" />
        <div className="mt-2 h-5 w-56 animate-pulse rounded bg-[var(--border)]/50" />
      </div>

      {/* Settings Form Card */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--background-surface)] p-6">
        <div className="h-5 w-28 animate-pulse rounded bg-[var(--border)]/50 mb-6" />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 w-24 animate-pulse rounded bg-[var(--border)]/50" />
              <div className="mt-2 h-10 w-full animate-pulse rounded-lg bg-[var(--border)]/50" />
            </div>
          ))}
          <div className="h-10 w-32 animate-pulse rounded-lg bg-[var(--border)]/50" />
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className="rounded-xl border border-[var(--error)]/30 bg-[var(--background-surface)] p-6">
        <div className="h-5 w-24 animate-pulse rounded bg-[var(--border)]/50 mb-4" />
        <div className="h-4 w-72 animate-pulse rounded bg-[var(--border)]/50" />
        <div className="mt-4 h-10 w-32 animate-pulse rounded-lg bg-[var(--border)]/50" />
      </div>
    </div>
  )
}
