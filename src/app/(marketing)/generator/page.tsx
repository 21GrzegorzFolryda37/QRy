'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { GeneratorWizard } from '@/components/landing/generator-wizard'

type QRType = 'website' | 'text' | 'email' | 'phone' | 'sms' | 'whatsapp' | 'vcard' | 'wifi' | 'social' | 'pdf' | 'video' | 'facebook' | 'instagram' | 'twitter' | 'bitcoin' | 'mp3' | 'appstore'

const validTypes: QRType[] = ['website', 'text', 'email', 'phone', 'sms', 'whatsapp', 'vcard', 'wifi', 'social', 'pdf', 'video', 'facebook', 'instagram', 'twitter', 'bitcoin', 'mp3', 'appstore']

function GeneratorContent() {
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type') ?? 'website'
  const type: QRType = validTypes.includes(typeParam as QRType) ? (typeParam as QRType) : 'website'
  const url = searchParams.get('url') ?? undefined

  return (
    <section className="hero-section relative flex flex-col justify-start pt-24 pb-16 overflow-x-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%)' }} />

      {/* Ambient glow */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full" style={{ background: 'rgba(109, 40, 217, 0.15)', filter: 'blur(100px)' }} />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full" style={{ background: 'rgba(109, 40, 217, 0.15)', filter: 'blur(100px)' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl font-display animate-fade-in-up animate-delay-100">
            <span className="text-white">Generator Kodów </span>
            <span className="text-[#a78bfa] drop-shadow-lg">QR</span>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
            Stwórz profesjonalny kod QR w kilka sekund.
          </p>
        </div>

        <div className="max-w-6xl mx-auto animate-fade-in-up animate-delay-400">
          <div className="bg-white rounded-3xl border border-[var(--border)] shadow-xl">
            <div className="p-5 sm:p-6 lg:p-8">
              <GeneratorWizard initialType={type} initialUrl={url} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function GeneratorPage() {
  return (
    <Suspense>
      <GeneratorContent />
    </Suspense>
  )
}
