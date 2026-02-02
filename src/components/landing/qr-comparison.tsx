'use client'

import { useEffect, useRef, useState } from 'react'
import { PhoneMockup } from '@/components/ui'

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
          width: 140,
          height: 140,
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
          width: 140,
          height: 140,
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
      {/* Indigo to Slate gradient background */}
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

        {/* Phone Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-16 items-center justify-items-center">
          {/* Phone with Boring QR */}
          <div
            className={`relative transition-all duration-700 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <h3 className="text-lg font-medium text-violet-300/70 text-center mb-6">
              Zwykły QR
            </h3>

            <div className="relative">
              <PhoneMockup className="w-[260px]">
              <div className="w-full h-full bg-gray-50 flex flex-col">
                {/* Status bar - iPhone style */}
                <div className="relative h-14 flex items-end justify-between px-6 pb-1">
                  {/* Time - left side */}
                  <span className="text-sm font-semibold text-black">9:41</span>

                  {/* Right side icons */}
                  <div className="flex items-center gap-1.5">
                    {/* Cellular signal */}
                    <div className="flex items-end gap-[2px]">
                      <div className="w-[3px] h-[4px] bg-black rounded-sm" />
                      <div className="w-[3px] h-[6px] bg-black rounded-sm" />
                      <div className="w-[3px] h-[8px] bg-black rounded-sm" />
                      <div className="w-[3px] h-[10px] bg-black/30 rounded-sm" />
                    </div>
                    {/* WiFi */}
                    <svg className="w-[15px] h-[11px] text-black" viewBox="0 0 15 11" fill="currentColor">
                      <path d="M7.5 2.5c2.7 0 5.2 1.1 7 2.9l-1.4 1.4c-1.4-1.4-3.4-2.3-5.6-2.3s-4.2.9-5.6 2.3L.5 5.4c1.8-1.8 4.3-2.9 7-2.9zm0 3c1.7 0 3.2.7 4.2 1.8l-1.4 1.4c-.7-.7-1.7-1.2-2.8-1.2s-2.1.5-2.8 1.2L3.3 7.3c1-.1 2.5-1.8 4.2-1.8zm0 3c.8 0 1.5.3 2 .9l-2 2-2-2c.5-.6 1.2-.9 2-.9z" />
                    </svg>
                    {/* Battery */}
                    <div className="flex items-center gap-[2px]">
                      <div className="w-[22px] h-[11px] border border-black/40 rounded-[3px] p-[1px]">
                        <div className="w-[65%] h-full bg-black rounded-[1px]" />
                      </div>
                      <div className="w-[1px] h-[4px] bg-black/40 rounded-r-full" />
                    </div>
                  </div>
                </div>

                {/* Scanner content */}
                <div className="flex-1 flex flex-col items-center justify-center px-6">
                  <p className="text-xs text-[#6d28d9] mb-4 font-medium">Zeskanuj kod QR</p>

                  {/* QR container with annotation dots */}
                  <div className="relative p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div ref={basicQrRef} className="w-[140px] h-[140px] flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                    </div>

                    {/* Annotation dots - positioned on QR elements */}
                    <div className="hidden lg:block">
                      {/* Dot 1: Top-left finder pattern */}
                      <div className="absolute top-[24px] left-[24px] w-3 h-3 bg-[#6d28d9] rounded-full border-2 border-white shadow-lg z-10" />
                      {/* Dot 2: Center of QR */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#6d28d9] rounded-full border-2 border-white shadow-lg z-10" />
                      {/* Dot 3: Bottom-left module area */}
                      <div className="absolute bottom-[35px] left-[35px] w-3 h-3 bg-[#6d28d9] rounded-full border-2 border-white shadow-lg z-10" />
                    </div>
                  </div>
                </div>

                {/* Bottom padding for home indicator */}
                <div className="h-8" />
              </div>
            </PhoneMockup>

            {/* Annotation labels - outside phone, left side */}
            <div className="hidden lg:block absolute right-[calc(100%+80px)] top-0 bottom-0">
              {/* Box 1 - top */}
              <div className="absolute top-[60px] right-0 flex items-center gap-4">
                <div className="px-4 py-3 bg-white rounded-xl shadow-lg max-w-[180px]">
                  <p className="text-[13px] font-semibold text-gray-900">Identyczny wzór</p>
                  <p className="text-[11px] text-gray-500 mt-1">Każdy kod wygląda tak samo</p>
                </div>
                <div className="w-8 h-[2px] bg-[#6d28d9]" />
              </div>
              {/* Box 2 - middle */}
              <div className="absolute top-1/2 -translate-y-1/2 right-0 flex items-center gap-4">
                <div className="px-4 py-3 bg-white rounded-xl shadow-lg max-w-[180px]">
                  <p className="text-[13px] font-semibold text-gray-900">Brak miejsca na logo</p>
                  <p className="text-[11px] text-gray-500 mt-1">Nie wyróżnisz swojej marki</p>
                </div>
                <div className="w-8 h-[2px] bg-[#6d28d9]" />
              </div>
              {/* Box 3 - bottom */}
              <div className="absolute bottom-[60px] right-0 flex items-center gap-4">
                <div className="px-4 py-3 bg-white rounded-xl shadow-lg max-w-[180px]">
                  <p className="text-[13px] font-semibold text-gray-900">Kwadratowe moduły</p>
                  <p className="text-[11px] text-gray-500 mt-1">Nudny, techniczny wygląd</p>
                </div>
                <div className="w-8 h-[2px] bg-[#6d28d9]" />
              </div>
            </div>
          </div>
          </div>

          {/* VS Element */}
          <div
            className={`flex items-center justify-center transition-all duration-700 delay-200 ${
              visible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-20" />
              <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-xl lg:text-2xl">VS</span>
              </div>
            </div>
          </div>

          {/* Phone with QRapple QR */}
          <div
            className={`transition-all duration-700 delay-150 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <h3 className="text-lg font-medium text-violet-300 text-center mb-6">
              Kod QRapple
            </h3>

            <PhoneMockup className="w-[260px]" variant="highlighted">
              <div className="w-full h-full bg-gradient-to-b from-violet-50 to-white flex flex-col">
                {/* Status bar - iPhone style */}
                <div className="relative h-14 flex items-end justify-between px-6 pb-1">
                  {/* Time - left side */}
                  <span className="text-sm font-semibold text-[#6d28d9]">9:41</span>

                  {/* Right side icons */}
                  <div className="flex items-center gap-1.5">
                    {/* Cellular signal - full */}
                    <div className="flex items-end gap-[2px]">
                      <div className="w-[3px] h-[4px] bg-[#6d28d9] rounded-sm" />
                      <div className="w-[3px] h-[6px] bg-[#6d28d9] rounded-sm" />
                      <div className="w-[3px] h-[8px] bg-[#6d28d9] rounded-sm" />
                      <div className="w-[3px] h-[10px] bg-[#6d28d9] rounded-sm" />
                    </div>
                    {/* WiFi */}
                    <svg className="w-[15px] h-[11px] text-[#6d28d9]" viewBox="0 0 15 11" fill="currentColor">
                      <path d="M7.5 2.5c2.7 0 5.2 1.1 7 2.9l-1.4 1.4c-1.4-1.4-3.4-2.3-5.6-2.3s-4.2.9-5.6 2.3L.5 5.4c1.8-1.8 4.3-2.9 7-2.9zm0 3c1.7 0 3.2.7 4.2 1.8l-1.4 1.4c-.7-.7-1.7-1.2-2.8-1.2s-2.1.5-2.8 1.2L3.3 7.3c1-.1 2.5-1.8 4.2-1.8zm0 3c.8 0 1.5.3 2 .9l-2 2-2-2c.5-.6 1.2-.9 2-.9z" />
                    </svg>
                    {/* Battery - full, green charging */}
                    <div className="flex items-center gap-[2px]">
                      <div className="w-[22px] h-[11px] border border-[#6d28d9]/60 rounded-[3px] p-[1px]">
                        <div className="w-full h-full bg-[#22c55e] rounded-[1px]" />
                      </div>
                      <div className="w-[1px] h-[4px] bg-[#6d28d9]/40 rounded-r-full" />
                    </div>
                  </div>
                </div>

                {/* Scanner content */}
                <div className="flex-1 flex flex-col items-center justify-center px-6">
                  <p className="text-xs text-[#6d28d9] mb-4 font-semibold">Zeskanuj kod QR</p>

                  {/* QR container with accents */}
                  <div className="relative">
                    {/* Corner accents */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#6d28d9] rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#6d28d9] rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#6d28d9] rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#6d28d9] rounded-br-lg" />

                    <div className="p-3 bg-white rounded-xl shadow-lg shadow-[#6d28d9]/10 border border-[#6d28d9]/20">
                      <div ref={customQrRef} className="w-[140px] h-[140px] flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-[#6d28d9]/30 border-t-[#6d28d9] rounded-full animate-spin" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom padding for home indicator */}
                <div className="h-8" />
              </div>
            </PhoneMockup>
          </div>
        </div>
      </div>
    </section>
  )
}
