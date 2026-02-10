'use client'

import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: '#efeefe' }}
    >

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-5xl font-bold gradient-text">QRenixy</h1>
          </Link>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[var(--border)] shadow-xl p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
