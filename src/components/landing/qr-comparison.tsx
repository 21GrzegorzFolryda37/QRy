'use client'

import { useEffect, useRef, useState } from 'react'

const QR_URL = 'https://pl.wikipedia.org/wiki/Kod_QR'

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
    <section ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Indigo to Slate gradient background - darker */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4c1d95] via-[#2e1065] to-[#0f172a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(109,40,217,0.25),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(15,23,42,0.6),transparent_50%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display mb-4">
            <span className="text-white">Który kod QR </span>
            <span className="text-violet-300">skanujesz?</span>
          </h2>
          <p className="text-lg text-violet-200/80 max-w-2xl mx-auto">
            Pierwsze wrażenie ma znaczenie. Zobacz różnicę między zwykłym kodem a profesjonalnym rozwiązaniem.
          </p>
        </div>

        {/* Visual Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-4 items-center">
          {/* Boring QR */}
          <div
            className={`relative p-8 rounded-3xl bg-white/95 backdrop-blur-sm shadow-xl transition-all duration-700 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-500 font-display mb-6">
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
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs">✗</span>
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
              <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-30 animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">VS</span>
              </div>
            </div>
          </div>

          {/* QRapple QR */}
          <div
            className={`relative p-8 rounded-3xl bg-white shadow-2xl shadow-violet-500/20 ring-2 ring-violet-400/30 transition-all duration-700 delay-150 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold text-[#6d28d9] font-display mb-6">
                Kod QRapple
              </h3>

              {/* QR Code - highlighted with effects */}
              <div className="relative inline-block mb-6">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-[#6d28d9] rounded-2xl blur-2xl opacity-40 animate-pulse" />

                {/* Scanline effect */}
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#6d28d9]/60 to-transparent animate-scanline" />
                </div>

                {/* QR code */}
                <div className="relative">
                  <div ref={customQrRef} className="w-[180px] h-[180px] mx-auto flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-[#6d28d9]/30 border-t-[#6d28d9] rounded-full animate-spin" />
                  </div>
                </div>
              </div>

              {/* Pros list */}
              <ul className="space-y-3 text-left max-w-[220px] mx-auto">
                {['Przyciąga uwagę klientów', 'Buduje rozpoznawalność marki', 'Profesjonalny wizerunek', 'Wyższa konwersja +80%'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#6d28d9]/10 text-[#6d28d9] flex items-center justify-center text-xs font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
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
