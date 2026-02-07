export default function QrCodesLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 animate-pulse rounded bg-[var(--border)]/50" />
          <div className="mt-2 h-5 w-64 animate-pulse rounded bg-[var(--border)]/50" />
        </div>
        <div className="h-10 w-36 animate-pulse rounded-lg bg-[var(--border)]/50" />
      </div>

      {/* QR Code Cards List */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--background-surface)] p-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 animate-pulse rounded-lg bg-[var(--border)]/50" />
              <div className="flex-1">
                <div className="h-5 w-40 animate-pulse rounded bg-[var(--border)]/50" />
                <div className="mt-2 h-3 w-56 animate-pulse rounded bg-[var(--border)]/50" />
                <div className="mt-2 flex gap-2">
                  <div className="h-5 w-16 animate-pulse rounded-full bg-[var(--border)]/50" />
                  <div className="h-5 w-20 animate-pulse rounded-full bg-[var(--border)]/50" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-8 animate-pulse rounded bg-[var(--border)]/50" />
                <div className="h-8 w-8 animate-pulse rounded bg-[var(--border)]/50" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
