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

        {/* Visual Comparison - Phone Mockups */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-12 items-center justify-items-center">
          {/* Phone with Boring QR */}
          <div
            className={`relative transition-all duration-700 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            {/* Phone label */}
            <h3 className="text-xl font-semibold text-gray-400 font-display mb-6 text-center">
              Zwykły QR
            </h3>

            {/* Phone Frame */}
            <div className="relative">
              {/* Phone body */}
              <div className="relative w-[280px] h-[560px] bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-[50px] p-[12px] shadow-2xl">
                {/* Side buttons - left */}
                <div className="absolute -left-[3px] top-[100px] w-[3px] h-[30px] bg-[#2a2a2a] rounded-l-sm" />
                <div className="absolute -left-[3px] top-[150px] w-[3px] h-[60px] bg-[#2a2a2a] rounded-l-sm" />
                <div className="absolute -left-[3px] top-[220px] w-[3px] h-[60px] bg-[#2a2a2a] rounded-l-sm" />
                {/* Side button - right */}
                <div className="absolute -right-[3px] top-[180px] w-[3px] h-[80px] bg-[#2a2a2a] rounded-r-sm" />

                {/* Screen bezel */}
                <div className="relative w-full h-full bg-[#000] rounded-[40px] overflow-hidden">
                  {/* Screen content */}
                  <div className="absolute inset-[2px] bg-white rounded-[38px] overflow-hidden">
                    {/* Status bar */}
                    <div className="h-12 bg-gray-50 flex items-center justify-between px-6 pt-2">
                      <span className="text-xs text-gray-500 font-medium">9:41</span>
                      {/* Dynamic Island */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-3 w-[90px] h-[28px] bg-black rounded-full flex items-center justify-center gap-2">
                        <div className="w-[8px] h-[8px] rounded-full bg-[#1a1a1a] ring-1 ring-[#333]" />
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-[2px]">
                          <div className="w-[3px] h-[10px] bg-gray-400 rounded-sm" />
                          <div className="w-[3px] h-[10px] bg-gray-400 rounded-sm" />
                          <div className="w-[3px] h-[10px] bg-gray-300 rounded-sm" />
                          <div className="w-[3px] h-[10px] bg-gray-200 rounded-sm" />
                        </div>
                      </div>
                    </div>

                    {/* QR Scanner UI */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
                      <p className="text-sm text-gray-400 mb-4">Zeskanuj kod QR</p>

                      {/* QR Code container */}
                      <div className="relative p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div ref={basicQrRef} className="w-[160px] h-[160px] flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                        </div>
                      </div>

                      {/* Reaction */}
                      <div className="mt-6 flex items-center gap-2 text-gray-400">
                        <span className="text-2xl">😐</span>
                        <span className="text-sm">Kolejny nudny kod...</span>
                      </div>
                    </div>

                    {/* Home indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-gray-300 rounded-full" />
                  </div>

                  {/* Screen reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-[38px]" />
                </div>
              </div>

              {/* Phone shadow */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[200px] h-[20px] bg-black/30 blur-xl rounded-full" />
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
              <div className="relative w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-2xl">VS</span>
              </div>
            </div>
          </div>

          {/* Phone with QRapple QR */}
          <div
            className={`relative transition-all duration-700 delay-150 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            {/* Phone label */}
            <h3 className="text-xl font-semibold text-violet-300 font-display mb-6 text-center">
              Kod QRapple
            </h3>

            {/* Phone Frame with glow */}
            <div className="relative">
              {/* Glow effect behind phone */}
              <div className="absolute -inset-4 bg-[#6d28d9] rounded-[60px] blur-2xl opacity-30 animate-pulse" />

              {/* Phone body */}
              <div className="relative w-[280px] h-[560px] bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-[50px] p-[12px] shadow-2xl ring-1 ring-violet-500/20">
                {/* Side buttons - left */}
                <div className="absolute -left-[3px] top-[100px] w-[3px] h-[30px] bg-[#2a2a2a] rounded-l-sm" />
                <div className="absolute -left-[3px] top-[150px] w-[3px] h-[60px] bg-[#2a2a2a] rounded-l-sm" />
                <div className="absolute -left-[3px] top-[220px] w-[3px] h-[60px] bg-[#2a2a2a] rounded-l-sm" />
                {/* Side button - right */}
                <div className="absolute -right-[3px] top-[180px] w-[3px] h-[80px] bg-[#2a2a2a] rounded-r-sm" />

                {/* Screen bezel */}
                <div className="relative w-full h-full bg-[#000] rounded-[40px] overflow-hidden">
                  {/* Screen content */}
                  <div className="absolute inset-[2px] bg-white rounded-[38px] overflow-hidden">
                    {/* Status bar */}
                    <div className="h-12 bg-gradient-to-r from-violet-50 to-indigo-50 flex items-center justify-between px-6 pt-2">
                      <span className="text-xs text-[#6d28d9] font-medium">9:41</span>
                      {/* Dynamic Island */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-3 w-[90px] h-[28px] bg-black rounded-full flex items-center justify-center gap-2">
                        <div className="w-[8px] h-[8px] rounded-full bg-[#1a1a1a] ring-1 ring-[#333]" />
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-[2px]">
                          <div className="w-[3px] h-[10px] bg-[#6d28d9] rounded-sm" />
                          <div className="w-[3px] h-[10px] bg-[#6d28d9] rounded-sm" />
                          <div className="w-[3px] h-[10px] bg-[#6d28d9]/60 rounded-sm" />
                          <div className="w-[3px] h-[10px] bg-[#6d28d9]/30 rounded-sm" />
                        </div>
                      </div>
                    </div>

                    {/* QR Scanner UI */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-violet-50/50 to-white">
                      <p className="text-sm text-[#6d28d9] mb-4 font-medium">Zeskanuj kod QR</p>

                      {/* QR Code container with effects */}
                      <div className="relative">
                        {/* Animated ring */}
                        <div className="absolute -inset-3 border-2 border-[#6d28d9]/30 rounded-2xl animate-pulse" />

                        {/* QR container */}
                        <div className="relative p-4 bg-white rounded-2xl shadow-lg shadow-[#6d28d9]/10 border border-[#6d28d9]/20">
                          {/* Corner accents */}
                          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#6d28d9] rounded-tl-lg" />
                          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#6d28d9] rounded-tr-lg" />
                          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#6d28d9] rounded-bl-lg" />
                          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#6d28d9] rounded-br-lg" />

                          <div ref={customQrRef} className="w-[160px] h-[160px] flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-[#6d28d9]/30 border-t-[#6d28d9] rounded-full animate-spin" />
                          </div>
                        </div>
                      </div>

                      {/* Reaction */}
                      <div className="mt-6 flex items-center gap-2 text-[#6d28d9]">
                        <span className="text-2xl">🤩</span>
                        <span className="text-sm font-medium">Wow, muszę to zeskanować!</span>
                      </div>
                    </div>

                    {/* Home indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-[#6d28d9]/30 rounded-full" />
                  </div>

                  {/* Screen reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none rounded-[38px]" />
                </div>
              </div>

              {/* Phone shadow with purple tint */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[200px] h-[20px] bg-[#6d28d9]/40 blur-xl rounded-full" />
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
