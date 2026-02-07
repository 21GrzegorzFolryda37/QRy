'use client'

import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 25%, #e0f2fe 50%, #f0e7fe 75%, #ecfeff 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 8s ease infinite',
      }}
    >
      {/* Floating color blobs - same as Hero */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="absolute rounded-full"
          style={{
            top: '-10%',
            left: '-5%',
            width: '600px',
            height: '600px',
            background: 'rgba(139, 92, 246, 0.15)',
            filter: 'blur(100px)',
            animation: 'blob 5s infinite ease-in-out',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: '20%',
            right: '-5%',
            width: '550px',
            height: '550px',
            background: 'rgba(6, 182, 212, 0.12)',
            filter: 'blur(100px)',
            animation: 'blob 6s infinite ease-in-out 1s',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: '-5%',
            left: '30%',
            width: '600px',
            height: '600px',
            background: 'rgba(167, 139, 250, 0.12)',
            filter: 'blur(100px)',
            animation: 'blob 5.5s infinite ease-in-out 2s',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: '50%',
            left: '10%',
            width: '400px',
            height: '400px',
            background: 'rgba(34, 211, 238, 0.1)',
            filter: 'blur(80px)',
            animation: 'blob 6s infinite ease-in-out 0.5s',
          }}
        />
      </div>

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
