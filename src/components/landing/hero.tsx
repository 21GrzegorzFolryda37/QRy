'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'
import QRCodeStyling from 'qr-code-styling'

export function Hero() {
  const [url, setUrl] = useState('')
  const [isGenerated, setIsGenerated] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)
  const qrCodeRef = useRef<QRCodeStyling | null>(null)

  useEffect(() => {
    qrCodeRef.current = new QRCodeStyling({
      width: 200,
      height: 200,
      type: 'svg',
      data: 'https://twoja-strona.pl',
      dotsOptions: {
        color: '#8b5cf6',
        type: 'rounded',
      },
      cornersSquareOptions: {
        color: '#06b6d4',
        type: 'extra-rounded',
      },
      cornersDotOptions: {
        color: '#8b5cf6',
        type: 'dot',
      },
      backgroundOptions: {
        color: '#ffffff',
      },
    })

    if (qrRef.current) {
      qrRef.current.innerHTML = ''
      qrCodeRef.current.append(qrRef.current)
    }
  }, [])

  const handleGenerate = () => {
    if (!url.trim()) return

    let finalUrl = url.trim()
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl
    }

    if (qrCodeRef.current) {
      qrCodeRef.current.update({ data: finalUrl })
      setIsGenerated(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate()
    }
  }

  return (
    <section className="pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl animate-fade-in-up">
            <span className="text-[var(--foreground)]">Stwórz </span>
            <span className="gradient-text">dynamiczny kod QR</span>
          </h1>
          <p className="mt-4 text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto animate-fade-in-up animate-delay-100">
            Wygeneruj kod QR w kilka sekund. Śledź skany i aktualizuj link w dowolnym momencie.
          </p>
        </div>

        {/* Generator */}
        <div className="max-w-4xl mx-auto animate-fade-in-up animate-delay-200">
          <div className="bg-white rounded-2xl shadow-xl border border-[var(--border)] p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left - Form */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Wprowadź adres URL
                  </label>
                  <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="https://twoja-strona.pl"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background-surface)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                  />
                </div>

                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full shadow-lg shadow-[var(--primary)]/25"
                  onClick={handleGenerate}
                >
                  Generuj kod QR
                </Button>

                {isGenerated && (
                  <div className="pt-2 animate-fade-in-up">
                    <Link href="/register">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                      >
                        Pobierz kod QR
                      </Button>
                    </Link>
                    <p className="mt-2 text-xs text-center text-[var(--foreground-muted)]">
                      Załóż darmowe konto, aby pobrać i śledzić swój kod QR
                    </p>
                  </div>
                )}
              </div>

              {/* Right - QR Preview */}
              <div className="flex flex-col items-center justify-center">
                <div className="bg-[var(--background-surface)] rounded-2xl p-6 border border-[var(--border)]">
                  <div
                    ref={qrRef}
                    className="w-[200px] h-[200px] flex items-center justify-center"
                  />
                </div>
                <p className="mt-4 text-sm text-[var(--foreground-muted)]">
                  Podgląd Twojego kodu QR
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features hint */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-[var(--foreground-muted)] animate-fade-in-up animate-delay-300">
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-[var(--success)]" />
            <span>Darmowe kody QR</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-[var(--success)]" />
            <span>Analityka skanów</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-[var(--success)]" />
            <span>Edycja w każdej chwili</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}
