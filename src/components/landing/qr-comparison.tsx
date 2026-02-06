'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { PhoneMockup, Button } from '@/components/ui'
import { FrameRenderer } from '@/components/qr/frame-renderer'

const QR_URL = 'https://pl.wikipedia.org/wiki/Kod_QR'

const problemPoints = [
  { text: 'Czarno-biały, generyczny wygląd' },
  { text: 'Brak logo — zero rozpoznawalności' },
  { text: 'Nie wyróżnia się na materiałach' },
]

const solutionPoints = [
  { text: 'Kolory dopasowane do Twojej marki' },
  { text: 'Twoje logo w centrum kodu' },
  { text: 'Profesjonalny wygląd, który zachęca do skanowania' },
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
      {/* Background */}
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

        {/* 4-column layout: [cards] [phone] [phone] [cards] */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-10 lg:gap-5 justify-center">

          {/* Left: Problem cards — desktop only */}
          <div className="hidden lg:flex flex-col gap-4 w-[210px]">
            {problemPoints.map((point, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06] transition-all duration-700 ${
                  visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
                style={{
                  transitionDelay: `${400 + i * 150}ms`,
                  transitionTimingFunction: 'var(--ease-smooth)',
                }}
              >
                <span className="text-sm shrink-0 mt-0.5 grayscale opacity-70">❌</span>
                <p className="text-sm text-gray-500 leading-snug">{point.text}</p>
              </div>
            ))}
          </div>

          {/* Left phone — Zwykły QR */}
          <div
            className={`flex flex-col items-center transition-all duration-700 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-smooth)' }}
          >
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

            {/* Problem cards — mobile only */}
            <div className="lg:hidden mt-6 flex flex-col gap-3 w-full max-w-[280px]">
              {problemPoints.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                >
                  <span className="text-sm shrink-0 mt-0.5 grayscale opacity-70">❌</span>
                  <p className="text-sm text-gray-500 leading-snug">{point.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* VS — mobile only */}
          <div
            className={`lg:hidden flex items-center justify-center transition-all duration-700 delay-200 ${
              visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-smooth)' }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-20" />
              <div className="relative w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-xl">VS</span>
              </div>
            </div>
          </div>

          {/* Right phone — Kod QRapple */}
          <div
            className={`flex flex-col items-center transition-all duration-700 delay-150 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-smooth)' }}
          >
            <h3 className="text-lg font-medium text-violet-300 text-center mb-6">
              Kod QRapple
            </h3>

            <div className="relative">
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

              {/* Annotation callouts — desktop only */}
              <div
                className={`hidden lg:block transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: '900ms' }}
              >
                {/* Colors callout */}
                <div className="absolute flex items-center" style={{ left: 'calc(100% - 2px)', top: '34%', transform: 'translateY(-50%)' }}>
                  <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(139,92,246,0.5)]" />
                  <div className="w-10 h-px bg-gradient-to-r from-violet-400/60 to-transparent" />
                </div>
                {/* Logo callout */}
                <div className="absolute flex items-center" style={{ left: 'calc(100% - 2px)', top: '49%', transform: 'translateY(-50%)' }}>
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
                  <div className="w-10 h-px bg-gradient-to-r from-cyan-400/60 to-transparent" />
                </div>
                {/* Frame callout */}
                <div className="absolute flex items-center" style={{ left: 'calc(100% - 2px)', top: '65%', transform: 'translateY(-50%)' }}>
                  <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(139,92,246,0.5)]" />
                  <div className="w-10 h-px bg-gradient-to-r from-violet-400/60 to-transparent" />
                </div>
              </div>
            </div>

            {/* Solution cards — mobile only */}
            <div className="lg:hidden mt-6 flex flex-col gap-3 w-full max-w-[280px]">
              {solutionPoints.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/[0.12]"
                >
                  <span className="text-sm shrink-0 mt-0.5">✅</span>
                  <p className="text-sm text-violet-200 leading-snug">{point.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Solution cards — desktop only */}
          <div className="hidden lg:flex flex-col gap-4 w-[210px]">
            {solutionPoints.map((point, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/[0.12] transition-all duration-700 ${
                  visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
                style={{
                  transitionDelay: `${400 + i * 150}ms`,
                  transitionTimingFunction: 'var(--ease-smooth)',
                }}
              >
                <span className="text-sm shrink-0 mt-0.5">✅</span>
                <p className="text-sm text-violet-200 leading-snug">{point.text}</p>
              </div>
            ))}
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
