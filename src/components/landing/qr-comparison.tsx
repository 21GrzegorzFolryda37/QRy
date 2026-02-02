'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'

const QR_URL = 'https://pl.wikipedia.org/wiki/Kod_QR'

const comparisonFeatures = [
  { feature: 'Pierwsze wrażenie', boring: 'Ignorowany', qrapple: 'Przyciąga wzrok' },
  { feature: 'Skanowalność', boring: 'Standardowa', qrapple: 'Wysoka (korekcja błędów)' },
  { feature: 'Branding', boring: 'Brak', qrapple: 'Logo + kolory marki' },
  { feature: 'Konwersja', boring: 'Niska', qrapple: 'Nawet +80%' },
  { feature: 'Profesjonalizm', boring: 'Amatorski', qrapple: 'Premium' },
  { feature: 'Zapamiętywalność', boring: 'Żadna', qrapple: 'Buduje rozpoznawalność' },
]

export function QRComparison() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const basicQrRef = useRef<HTMLDivElement>(null)
  const customQrRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return

    const loadQRCode = async () => {
      const QRCodeStyling = (await import('qr-code-styling')).default

      // Basic QR code
      if (basicQrRef.current) {
        basicQrRef.current.innerHTML = ''
        const basicQR = new QRCodeStyling({
          width: 180,
          height: 180,
          data: QR_URL,
          dotsOptions: {
            color: '#000000',
            type: 'square',
          },
          cornersSquareOptions: {
            type: 'square',
            color: '#000000',
          },
          cornersDotOptions: {
            type: 'square',
            color: '#000000',
          },
          backgroundOptions: {
            color: '#ffffff',
          },
        })
        basicQR.append(basicQrRef.current)
      }

      // Custom QR code
      if (customQrRef.current) {
        customQrRef.current.innerHTML = ''
        const customQR = new QRCodeStyling({
          width: 180,
          height: 180,
          data: QR_URL,
          image: '/logo.webp',
          dotsOptions: {
            type: 'rounded',
            gradient: {
              type: 'linear',
              rotation: 45,
              colorStops: [
                { offset: 0, color: '#7c3aed' },
                { offset: 1, color: '#0891b2' },
              ],
            },
          },
          cornersSquareOptions: {
            type: 'extra-rounded',
            gradient: {
              type: 'linear',
              rotation: 45,
              colorStops: [
                { offset: 0, color: '#7c3aed' },
                { offset: 1, color: '#0891b2' },
              ],
            },
          },
          cornersDotOptions: {
            type: 'dot',
            gradient: {
              type: 'linear',
              rotation: 45,
              colorStops: [
                { offset: 0, color: '#7c3aed' },
                { offset: 1, color: '#0891b2' },
              ],
            },
          },
          backgroundOptions: {
            color: '#ffffff',
          },
          imageOptions: {
            crossOrigin: 'anonymous',
            margin: 4,
            imageSize: 0.4,
          },
        })
        customQR.append(customQrRef.current)
      }
    }

    loadQRCode()
  }, [visible])

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden bg-[var(--background-surface)]">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display mb-4">
            <span className="text-[var(--foreground)]">Który kod QR </span>
            <span className="gradient-text">skanujesz?</span>
          </h2>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
            Pierwsze wrażenie ma znaczenie. Zobacz różnicę między zwykłym kodem a profesjonalnym rozwiązaniem.
          </p>
        </div>

        {/* Visual Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-4 items-center mb-16">
          {/* Boring QR */}
          <div
            className={`relative p-8 rounded-3xl bg-white border border-[var(--border)] transition-all duration-700 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold text-[var(--foreground-muted)] font-display mb-6">
                Zwykły QR
              </h3>

              {/* QR Code */}
              <div className="relative inline-block mb-6">
                <div ref={basicQrRef} className="w-[180px] h-[180px] mx-auto flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                </div>
              </div>

              {/* Cons list */}
              <ul className="space-y-3 text-left max-w-[220px] mx-auto">
                {['Ignorowany przez użytkowników', 'Brak rozpoznawalności marki', 'Wygląda amatorsko', 'Niska konwersja'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--foreground-muted)]">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* VS Element */}
          <div
            className={`flex items-center justify-center transition-all duration-700 delay-200 ${
              visible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">VS</span>
              </div>
            </div>
          </div>

          {/* QRapple QR */}
          <div
            className={`relative p-8 rounded-3xl bg-gradient-to-br from-white to-[var(--primary-muted)]/30 border-2 border-[var(--primary)]/20 shadow-xl transition-all duration-700 delay-150 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold text-[var(--foreground)] font-display mb-6">
                Kod QRapple
              </h3>

              {/* QR Code - highlighted with effects */}
              <div className="relative inline-block mb-6">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-2xl blur-2xl opacity-30 animate-pulse" />

                {/* Scanline effect */}
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--primary)]/50 to-transparent animate-scanline" />
                </div>

                {/* QR code */}
                <div className="relative">
                  <div ref={customQrRef} className="w-[180px] h-[180px] mx-auto flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
                  </div>
                </div>
              </div>

              {/* Pros list */}
              <ul className="space-y-3 text-left max-w-[220px] mx-auto">
                {['Przyciąga uwagę klientów', 'Buduje rozpoznawalność marki', 'Profesjonalny wizerunek', 'Wyższa konwersja +80%'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div
          className={`rounded-2xl overflow-hidden border border-[var(--border)] bg-white shadow-lg mb-12 transition-all duration-700 delay-300 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-3 text-center font-semibold">
            <div className="p-4 bg-[var(--background-surface)] text-[var(--foreground-muted)]">Cecha</div>
            <div className="p-4 bg-red-50 text-red-700">Zwykły QR</div>
            <div className="p-4 bg-green-50 text-green-700">QRapple</div>
          </div>
          {comparisonFeatures.map((row, i) => (
            <div key={i} className="grid grid-cols-3 text-center border-t border-[var(--border)]">
              <div className="p-4 text-[var(--foreground)] font-medium bg-[var(--background-surface)]/50">{row.feature}</div>
              <div className="p-4 text-red-600/80 bg-red-50/30">{row.boring}</div>
              <div className="p-4 text-green-700 bg-green-50/30 font-medium">{row.qrapple}</div>
            </div>
          ))}
        </div>

        {/* Punchline + CTA */}
        <div
          className={`text-center transition-all duration-700 delay-500 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-[var(--primary-muted)] to-[var(--secondary-muted)] border border-[var(--primary)]/20 mb-8">
            <span className="text-3xl">📈</span>
            <p className="text-lg font-medium text-[var(--foreground)]">
              Brandowane kody QR są skanowane nawet <span className="text-[var(--primary)] font-bold">o 80% częściej</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button variant="gradient" size="lg" className="shadow-lg shadow-[var(--primary)]/25">
                Stwórz swój kod QRapple
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" size="lg">
                Zobacz wszystkie funkcje
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scanline animation */}
      <style jsx>{`
        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        .animate-scanline {
          animation: scanline 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
