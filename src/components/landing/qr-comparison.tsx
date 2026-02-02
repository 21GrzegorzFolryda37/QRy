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
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Generate QR codes using qr-code-styling
  useEffect(() => {
    if (!visible) return

    const loadQRCode = async () => {
      const QRCodeStyling = (await import('qr-code-styling')).default

      // Basic QR code
      if (basicQrRef.current) {
        basicQrRef.current.innerHTML = ''
        const basicQR = new QRCodeStyling({
          width: 200,
          height: 200,
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
          width: 200,
          height: 200,
          data: QR_URL,
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
        })
        customQR.append(customQrRef.current)
      }
    }

    loadQRCode()
  }, [visible])

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 animated-gradient-bg blur-3xl" />
      <div className="absolute inset-0 grid-pattern opacity-50" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display mb-6">
            <span className="text-[var(--foreground)]">Który kod QR </span>
            <span className="gradient-text">wygląda lepiej?</span>
          </h2>
          <p className="text-lg text-[var(--foreground-muted)] leading-relaxed max-w-2xl mx-auto">
            Porównaj standardowy kod QR z naszym spersonalizowanym rozwiązaniem
          </p>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Basic QR */}
          <a
            href={QR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative p-8 rounded-3xl bg-white border-2 border-[var(--border)] shadow-lg transition-all duration-700 hover:shadow-xl hover:border-gray-300 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="text-center">
              <div className="inline-block p-4 rounded-2xl bg-gray-50 mb-6">
                <div ref={basicQrRef} className="w-[200px] h-[200px] flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] font-display mb-2">
                Standardowy kod QR
              </h3>
              <p className="text-[var(--foreground-muted)]">
                Prosty, czarno-biały, bez charakteru
              </p>
            </div>
          </a>

          {/* Custom QR */}
          <a
            href={QR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative p-8 rounded-3xl bg-gradient-to-br from-[var(--primary-muted)] to-[var(--secondary-muted)] border-2 border-[var(--primary)]/30 shadow-lg transition-all duration-700 hover:shadow-2xl hover:shadow-[var(--primary)]/20 hover:-translate-y-1 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: '150ms' }}
          >
            {/* Recommended badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white text-xs font-semibold shadow-lg">
                Polecany
              </span>
            </div>

            <div className="text-center">
              <div className="inline-block p-4 rounded-2xl bg-white shadow-md mb-6">
                <div ref={customQrRef} className="w-[200px] h-[200px] flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] font-display mb-2">
                Spersonalizowany kod QR
              </h3>
              <p className="text-[var(--foreground-muted)]">
                Wyróżnia się, buduje markę, przyciąga uwagę
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
