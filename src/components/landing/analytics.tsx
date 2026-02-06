'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'

const stats = [
  { label: 'Całkowite skany', value: '12,847', change: '↑ 34%' },
  { label: 'Unikalni użytkownicy', value: '8,432', change: '↑ 28%' },
  { label: 'Aktywne kody', value: '47', change: '↑ 12%' },
  { label: 'Conversion rate', value: '23.4%', change: '↑ 5.2%' },
]

const barHeights = [45, 62, 38, 75, 55, 88, 92, 68, 78, 95]

const heatmapData = [
  [0.3, 0.5, 0.8, 1, 0.7, 0.4, 0.3],
  [0.4, 0.6, 0.9, 0.8, 0.6, 0.5, 0.3],
]

const rankingItems = [
  { rank: 1, label: 'Wizytówka VIP', width: 95 },
  { rank: 2, label: 'Menu restauracji', width: 72 },
  { rank: 3, label: 'Landing promo', width: 58 },
]

export function Analytics() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-20 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionTimingFunction: 'var(--ease-smooth)' }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display">
            <span className="text-[var(--foreground)]">Każdy skan to </span>
            <span className="text-[#6d28d9]">historia</span>
          </h2>
          <p className="mt-6 text-lg text-[var(--foreground-muted)] leading-relaxed max-w-2xl mx-auto">
            Śledź skuteczność swoich kodów QR w czasie rzeczywistym i podejmuj lepsze decyzje marketingowe
          </p>
        </div>

        {/* Laptop + floating cards */}
        <div className="relative mx-auto max-w-4xl mb-24">
          {/* Laptop mockup */}
          <div
            className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            style={{ perspective: '1500px', transitionDelay: '200ms' }}
          >
            <div
              className="transition-transform duration-700 ease-out"
              style={{
                transform: hovered
                  ? 'rotateX(0deg) rotateY(0deg) scale(1.02)'
                  : 'rotateX(5deg) rotateY(-5deg)',
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {/* Screen bezel */}
              <div className="bg-[#2d2d3d] rounded-t-2xl p-3 shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-[#3a3a4a] mx-auto mb-2" />

                {/* Screen */}
                <div className="bg-[#1a1a2e] rounded-lg overflow-hidden">
                  {/* Dashboard header */}
                  <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/5">
                    <span className="text-white/90 text-sm font-semibold">Twój Dashboard</span>
                    <span className="text-white/40 text-xs">Ostatnie 30 dni</span>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4">
                    {stats.map((stat) => (
                      <div key={stat.label} className="bg-white/5 rounded-lg p-2.5 sm:p-3">
                        <p className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-wider truncate">{stat.label}</p>
                        <p className="text-white text-base sm:text-lg font-bold mt-1">{stat.value}</p>
                        <span className="text-emerald-400 text-[10px] sm:text-xs">{stat.change}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bar chart */}
                  <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-2">
                    <div className="flex items-end gap-1.5 sm:gap-2 h-24 sm:h-32">
                      {barHeights.map((height, i) => (
                        <div key={i} className="flex-1 flex items-end h-full">
                          <div
                            className="w-full rounded-t-sm sm:rounded-t-md transition-all ease-out"
                            style={{
                              height: visible ? `${height}%` : '0%',
                              background: 'linear-gradient(to top, #278575, #667eea)',
                              transitionDuration: '1000ms',
                              transitionDelay: `${600 + i * 100}ms`,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop base */}
              <div
                className="mx-auto h-3 rounded-b-xl"
                style={{ width: '105%', marginLeft: '-2.5%', background: 'linear-gradient(to bottom, #c5c5ca, #a8a8ad)' }}
              />
              <div
                className="mx-auto h-1 rounded-b-lg"
                style={{ width: '30%', background: 'linear-gradient(to bottom, #b0b0b5, #999)' }}
              />
            </div>
          </div>

          {/* Floating card 1 — top-left: Skąd skanują */}
          <div
            className={`absolute hidden lg:block z-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ top: '10%', left: '-5%', transitionDelay: '400ms' }}
          >
            <div className="w-56 p-4 rounded-2xl bg-white/95 backdrop-blur-[20px] border border-gray-200/50 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🗺️</span>
                <span className="text-sm font-semibold text-gray-900">Skąd skanują</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Dowiedz się z jakich miast i krajów przychodzą Twoi odbiorcy</p>
              <div className="relative w-full h-16 rounded-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                {[
                  { top: '20%', left: '15%' },
                  { top: '45%', left: '55%' },
                  { top: '65%', left: '30%' },
                  { top: '25%', left: '75%' },
                  { top: '70%', left: '65%' },
                ].map((pos, i) => (
                  <div key={i} className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.8)]" style={pos} />
                ))}
              </div>
            </div>
          </div>

          {/* Floating card 2 — top-right: Kiedy skanują */}
          <div
            className={`absolute hidden lg:block z-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ top: '30%', right: '-5%', transitionDelay: '600ms' }}
          >
            <div className="w-56 p-4 rounded-2xl bg-white/95 backdrop-blur-[20px] border border-gray-200/50 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📊</span>
                <span className="text-sm font-semibold text-gray-900">Kiedy skanują</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Znajdź szczytowe godziny i dni — planuj kampanie w idealnym momencie</p>
              <div className="grid grid-cols-7 gap-1">
                {heatmapData.flat().map((opacity, i) => (
                  <div
                    key={i}
                    className="h-4 rounded-sm"
                    style={{ backgroundColor: `rgba(39, 133, 117, ${opacity})` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Floating card 3 — bottom-left: Czego używają */}
          <div
            className={`absolute hidden lg:block z-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ bottom: '25%', left: '-8%', transitionDelay: '800ms' }}
          >
            <div className="w-56 p-4 rounded-2xl bg-white/95 backdrop-blur-[20px] border border-gray-200/50 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📱</span>
                <span className="text-sm font-semibold text-gray-900">Czego używają</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Poznaj urządzenia i przeglądarki swoich odbiorców</p>
              <div className="flex items-end justify-center gap-4 py-2">
                <span className="text-3xl">📱</span>
                <span className="text-2xl opacity-60">💻</span>
                <span className="text-lg opacity-40">⌚</span>
              </div>
            </div>
          </div>

          {/* Floating card 4 — bottom-right: Co działa najlepiej */}
          <div
            className={`absolute hidden lg:block z-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ bottom: '10%', right: '-8%', transitionDelay: '1000ms' }}
          >
            <div className="w-56 p-4 rounded-2xl bg-white/95 backdrop-blur-[20px] border border-gray-200/50 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🏆</span>
                <span className="text-sm font-semibold text-gray-900">Co działa najlepiej</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Zobacz które kody performują najlepiej i dlaczego</p>
              <div className="space-y-2">
                {rankingItems.map((item) => (
                  <div key={item.rank} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#278575] text-white text-[10px] font-bold flex items-center justify-center shrink-0">{item.rank}</span>
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-600 mb-0.5">{item.label}</p>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.width}%`, background: 'linear-gradient(to right, #278575, #51cf66)' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile cards — grid below laptop */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
            {[
              { icon: '🗺️', title: 'Skąd skanują', desc: 'Miasta i kraje Twoich odbiorców' },
              { icon: '📊', title: 'Kiedy skanują', desc: 'Szczytowe godziny i dni' },
              { icon: '📱', title: 'Czego używają', desc: 'Urządzenia i przeglądarki' },
              { icon: '🏆', title: 'Co działa najlepiej', desc: 'Ranking Twoich kodów QR' },
            ].map((card, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <span className="text-2xl">{card.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{card.title}</p>
                  <p className="text-xs text-gray-500">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Storytelling flow */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-20 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '600ms', transitionTimingFunction: 'var(--ease-smooth)' }}
        >
          {[
            { icon: '✨', label: 'Stwórz kod' },
            { icon: '🚀', label: 'Udostępnij' },
            { icon: '📈', label: 'Analizuj wyniki' },
          ].map((step, i, arr) => (
            <div key={i} className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                >
                  {step.icon}
                </div>
                <span className="text-sm font-semibold text-gray-700">{step.label}</span>
              </div>
              {i < arr.length - 1 && (
                <span className="text-[#278575] text-xl font-bold hidden sm:block">→</span>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`text-center rounded-2xl py-12 px-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{
            background: 'linear-gradient(135deg, rgba(102,126,234,0.05), rgba(118,75,162,0.05))',
            border: '1px solid rgba(102,126,234,0.2)',
            transitionDelay: '800ms',
            transitionTimingFunction: 'var(--ease-smooth)',
          }}
        >
          <Link href="/register">
            <Button
              size="lg"
              className="text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
            >
              Stwórz swój pierwszy kod QR
            </Button>
          </Link>
          <p className="mt-4 text-sm text-gray-500">Pełna analityka już w darmowym planie</p>
        </div>
      </div>
    </section>
  )
}
