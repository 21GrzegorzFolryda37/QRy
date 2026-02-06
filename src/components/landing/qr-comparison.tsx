'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { PhoneMockup, Button } from '@/components/ui'
import { FrameRenderer } from '@/components/qr/frame-renderer'

const QR_URL = 'https://pl.wikipedia.org/wiki/Kod_QR'

const leftPoints = [
  { title: 'Generyczny', desc: 'Czarno-biały kod, który wygląda jak każdy inny' },
  { title: 'Bez logo', desc: 'Zero rozpoznawalności Twojej marki' },
  { title: 'Ignorowany', desc: 'Nie przyciąga uwagi na materiałach' },
]

const rightPoints = [
  { title: 'Twoja marka', desc: 'Kolory i styl dopasowane do identyfikacji wizualnej' },
  { title: 'Twoje logo', desc: 'Logo w centrum kodu buduje zaufanie' },
  { title: 'Więcej skanów', desc: 'Profesjonalny wygląd zachęca do interakcji' },
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

      // Custom QR code - violet/cyan brand gradient
      if (customQrRef.current) {
        customQrRef.current.innerHTML = ''
        const customQR = new QRCodeStyling({
          width: 180,
          height: 180,
          data: QR_URL,
          image: '/logo.webp',
          dotsOptions: {
            type: 'dots',
            gradient: {
              type: 'linear',
              rotation: 135,
              colorStops: [
                { offset: 0, color: '#7c3aed' },
                { offset: 0.5, color: '#6d28d9' },
                { offset: 1, color: '#0891b2' },
              ],
            },
          },
          cornersSquareOptions: {
            type: 'extra-rounded',
            gradient: {
              type: 'linear',
              rotation: 135,
              colorStops: [
                { offset: 0, color: '#5b21b6' },
                { offset: 1, color: '#0e7490' },
              ],
            },
          },
          cornersDotOptions: {
            type: 'dot',
            gradient: {
              type: 'linear',
              rotation: 135,
              colorStops: [
                { offset: 0, color: '#7c3aed' },
                { offset: 1, color: '#06b6d4' },
              ],
            },
          },
          backgroundOptions: {
            color: '#ffffff',
          },
          imageOptions: {
            crossOrigin: 'anonymous',
            margin: 5,
            imageSize: 0.35,
          },
        })
        customQR.append(customQrRef.current)
      }
    }

    loadQRCode()
  }, [visible])

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Indigo to Slate gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4c1d95] via-[#2e1065] to-[#0f172a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(109,40,217,0.25),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(15,23,42,0.6),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionTimingFunction: 'var(--ease-smooth)' }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display mb-4">
            <span className="text-white">Który kod QR </span>
            <span className="text-violet-300">skanujesz?</span>
          </h2>
          <p className="text-lg text-violet-200/80 max-w-2xl mx-auto">
            Pierwsze wrażenie ma znaczenie. Zobacz różnicę między zwykłym kodem a profesjonalnym rozwiązaniem.
          </p>
        </div>

        {/* Phone Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-16 items-center justify-items-center">
          {/* Left: oval boxes + phone */}
          <div
            className={`relative flex items-center gap-12 transition-all duration-700 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-smooth)' }}
          >
            {/* 3 oval boxes — left of phone, desktop only */}
            <div className="hidden lg:flex flex-col gap-6">
              {leftPoints.map((point, i) => (
                <div
                  key={i}
                  className={`w-52 px-6 py-5 rounded-3xl bg-white text-center transition-all duration-700 ${
                    visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
                  }`}
                  style={{ transitionDelay: `${400 + i * 120}ms`, transitionTimingFunction: 'var(--ease-smooth)' }}
                >
                  <p className="text-sm font-semibold text-gray-900">{point.title}</p>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{point.desc}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-medium text-violet-300/70 text-center mb-6">
                Zwykły QR
              </h3>
              <PhoneMockup className="w-[260px]">
                <div className="w-full h-full bg-gray-50 flex flex-col">
                  <div className="h-14" />
                  <div className="flex-1 flex flex-col items-center justify-center px-6">
                    <p className="text-xs text-[#6d28d9] mb-4 font-medium">Zeskanuj kod QR</p>
                    <div className="relative p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                      <div ref={basicQrRef} className="w-[180px] h-[180px] flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                      </div>
                    </div>
                  </div>
                  <div className="h-8" />
                </div>
              </PhoneMockup>
            </div>
          </div>

          {/* VS Element */}
          <div
            className={`flex items-center justify-center transition-all duration-700 delay-200 ${
              visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-smooth)' }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-20" />
              <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-xl lg:text-2xl">VS</span>
              </div>
            </div>
          </div>

          {/* Right: phone + white oval boxes */}
          <div
            className={`relative flex items-center gap-12 transition-all duration-700 delay-150 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-smooth)' }}
          >
            <div>
              <h3 className="text-lg font-medium text-violet-300 text-center mb-6">
                Kod QRapple
              </h3>
              <PhoneMockup className="w-[260px]" variant="highlighted" statusBarColor="#000000">
                <div className="w-full h-full bg-gradient-to-b from-violet-50 to-white flex flex-col">
                  <div className="h-14" />
                  <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <p className="text-xs text-[#6d28d9] mb-4 font-semibold">Zeskanuj kod QR</p>
                    <FrameRenderer
                      frame={{
                        style: 'rounded',
                        color: '#6d28d9',
                        gradient: {
                          type: 'linear',
                          rotation: 135,
                          colorStops: [
                            { offset: 0, color: '#7c3aed' },
                            { offset: 1, color: '#0891b2' },
                          ],
                        },
                        textColor: '#ffffff',
                        text: 'Zeskanuj',
                        showText: true,
                      }}
                      size={180}
                    >
                      <div ref={customQrRef} className="w-[180px] h-[180px] flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-[#6d28d9]/30 border-t-[#6d28d9] rounded-full animate-spin" />
                      </div>
                    </FrameRenderer>
                  </div>
                  <div className="h-8" />
                </div>
              </PhoneMockup>
            </div>

            {/* 3 white oval boxes — right of phone, desktop only */}
            <div className="hidden lg:flex flex-col gap-6">
              {rightPoints.map((point, i) => (
                <div
                  key={i}
                  className={`w-52 px-6 py-5 rounded-3xl bg-white text-center transition-all duration-700 ${
                    visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
                  }`}
                  style={{ transitionDelay: `${400 + i * 120}ms`, transitionTimingFunction: 'var(--ease-smooth)' }}
                >
                  <p className="text-sm font-semibold text-gray-900">{point.title}</p>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link href="/register">
            <Button className="bg-white text-[#6d28d9] hover:bg-gray-50 shadow-lg">
              Stwórz swój pierwszy kod QR
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
