import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute w-96 h-96 -top-48 -left-48 rounded-full bg-[var(--primary)] opacity-20 blur-3xl animate-pulse-glow" />
      <div className="absolute w-80 h-80 -bottom-40 -right-40 rounded-full bg-[var(--secondary)] opacity-20 blur-3xl animate-pulse-glow animate-delay-300" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold gradient-text">QRapple</h1>
          </Link>
        </div>
        <div className="bg-[var(--background-surface)] rounded-xl border border-[var(--border)] shadow-lg p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
