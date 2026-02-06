'use client'

import { useState, useEffect, useRef } from 'react'

type TabId = 'locations' | 'timing' | 'devices' | 'rankings'

interface Tab {
  id: TabId
  icon: string
  title: string
  description: string
}

const tabs: Tab[] = [
  { id: 'locations', icon: '🗺️', title: 'Lokalizacje', description: 'Skąd skanują Twoje kody' },
  { id: 'timing', icon: '📊', title: 'Wzorce czasowe', description: 'Kiedy Twoje kody są aktywne' },
  { id: 'devices', icon: '📱', title: 'Urządzenia', description: 'Na czym skanują użytkownicy' },
  { id: 'rankings', icon: '🏆', title: 'Ranking kodów', description: 'Twoje najlepsze kody QR' },
]

const mapPins = [
  { top: '25%', left: '48%', delay: '0s' },
  { top: '35%', left: '52%', delay: '0.3s' },
  { top: '30%', left: '25%', delay: '0.6s' },
  { top: '45%', left: '70%', delay: '0.9s' },
  { top: '55%', left: '30%', delay: '1.2s' },
  { top: '40%', left: '80%', delay: '0.4s' },
  { top: '60%', left: '55%', delay: '0.7s' },
  { top: '20%', left: '65%', delay: '1.0s' },
]

// Deterministic pseudo-random to avoid SSR/client hydration mismatch
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function generateHeatmapData(): number[][] {
  const data: number[][] = []
  let seed = 42
  for (let hour = 0; hour < 12; hour++) {
    const row: number[] = []
    for (let day = 0; day < 7; day++) {
      const hourBlock = hour * 2
      let intensity = 0.1
      const rand = seededRandom(seed++)

      // Peak hours 10-18
      if (hourBlock >= 5 && hourBlock <= 9) {
        intensity = 0.5 + rand * 0.5
      }
      // Morning 6-10
      else if (hourBlock >= 3 && hourBlock < 5) {
        intensity = 0.25 + rand * 0.3
      }
      // Evening 18-22
      else if (hourBlock > 9 && hourBlock <= 11) {
        intensity = 0.2 + rand * 0.25
      }
      // Night
      else {
        intensity = 0.05 + rand * 0.1
      }

      // Weekend lower
      if (day >= 5) {
        intensity *= 0.6
      }

      row.push(Math.min(1, intensity))
    }
    data.push(row)
  }
  return data
}

const heatmapData = generateHeatmapData()
const dayLabels = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd']
const hourLabels = ['0:00', '2:00', '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']

const rankingItems = [
  { name: 'Menu restauracji', scans: '4,218', conversion: '82%', avgTime: '2m 34s', percent: 95 },
  { name: 'Wizytówka firmowa', scans: '3,847', conversion: '91%', avgTime: '1m 12s', percent: 87 },
  { name: 'Kupon rabatowy -20%', scans: '2,956', conversion: '67%', avgTime: '45s', percent: 67 },
  { name: 'Link do portfolio', scans: '1,832', conversion: '78%', avgTime: '3m 08s', percent: 41 },
  { name: 'Wi-Fi dla gości', scans: '1,204', conversion: '95%', avgTime: '8s', percent: 27 },
]

const medalGradients = [
  'linear-gradient(135deg, #FFD700, #FFA000)',
  'linear-gradient(135deg, #C0C0C0, #8A8A8A)',
  'linear-gradient(135deg, #CD7F32, #A0522D)',
]

export function Analytics() {
  const [activeTab, setActiveTab] = useState<TabId>('locations')
  const [visible, setVisible] = useState(false)
  const [barsAnimated, setBarsAnimated] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          setTimeout(() => setBarsAnimated(true), 300)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 20% 50%, rgba(39,133,117,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(102,126,234,0.04) 0%, transparent 60%)'
      }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <div className="badge-gradient mb-4 inline-flex">📈 Analityka w czasie rzeczywistym</div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Każdy skan to{' '}
            <span style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              historia
            </span>
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)' }}>
            Śledź każdy skan w czasie rzeczywistym. Dowiedz się skąd, kiedy i na jakich urządzeniach użytkownicy skanują Twoje kody QR.
          </p>
        </div>

        {/* Main layout: sidebar + content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar tabs */}
          <div
            className="lg:w-[280px] shrink-0"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1) 0.15s, transform 0.6s cubic-bezier(0.4,0,0.2,1) 0.15s',
            }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              {tabs.map((tab, i) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="text-left rounded-xl px-4 py-3.5 transition-all duration-300 border"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible
                      ? activeTab === tab.id
                        ? 'translateX(8px) translateY(0)'
                        : 'translateX(0) translateY(0)'
                      : 'translateY(20px)',
                    transition: `opacity 0.5s cubic-bezier(0.4,0,0.2,1) ${0.2 + i * 0.08}s, transform 0.3s cubic-bezier(0.4,0,0.2,1)`,
                    background: activeTab === tab.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderColor: activeTab === tab.id ? 'transparent' : 'var(--border)',
                    borderLeft: activeTab === tab.id ? '3px solid #278575' : '3px solid transparent',
                    boxShadow: activeTab === tab.id
                      ? '0 4px 20px rgba(39,133,117,0.12), 0 1px 3px rgba(0,0,0,0.06)'
                      : '0 1px 2px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl leading-none">{tab.icon}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm" style={{ color: activeTab === tab.id ? '#278575' : 'var(--foreground)' }}>
                        {tab.title}
                      </div>
                      <div className="text-xs mt-0.5 hidden lg:block" style={{ color: 'var(--foreground-muted)' }}>
                        {tab.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div
            className="flex-1 relative"
            style={{
              minHeight: 600,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1) 0.3s, transform 0.6s cubic-bezier(0.4,0,0.2,1) 0.3s',
            }}
          >
            {/* Panel 1: Locations */}
            <div
              className="absolute inset-0"
              style={{
                opacity: activeTab === 'locations' ? 1 : 0,
                transform: activeTab === 'locations' ? 'translateX(0)' : 'translateX(30px)',
                transition: 'opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)',
                pointerEvents: activeTab === 'locations' ? 'auto' : 'none',
              }}
            >
              {/* Map */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  height: 400,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                {/* Grid overlay */}
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }} />

                {/* Continent-like shapes */}
                <div className="absolute inset-0 opacity-20" style={{
                  background: `
                    radial-gradient(ellipse 120px 80px at 25% 35%, rgba(255,255,255,0.4) 0%, transparent 100%),
                    radial-gradient(ellipse 80px 100px at 50% 30%, rgba(255,255,255,0.3) 0%, transparent 100%),
                    radial-gradient(ellipse 60px 50px at 70% 50%, rgba(255,255,255,0.35) 0%, transparent 100%),
                    radial-gradient(ellipse 100px 60px at 80% 35%, rgba(255,255,255,0.3) 0%, transparent 100%),
                    radial-gradient(ellipse 50px 70px at 30% 60%, rgba(255,255,255,0.25) 0%, transparent 100%),
                    radial-gradient(ellipse 70px 40px at 55% 65%, rgba(255,255,255,0.2) 0%, transparent 100%)
                  `
                }} />

                {/* Pulsing pins */}
                {mapPins.map((pin, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{ top: pin.top, left: pin.left }}
                  >
                    <div
                      className="relative"
                      style={{
                        animation: `pulse-soft 2s ease-in-out infinite`,
                        animationDelay: pin.delay,
                      }}
                    >
                      <div className="w-3 h-3 bg-white rounded-full shadow-lg" />
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'rgba(255,255,255,0.4)',
                          animation: 'pulse-soft 2s ease-in-out infinite',
                          animationDelay: pin.delay,
                          transform: 'scale(2)',
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Map label */}
                <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-sm font-medium">
                  🌍 Mapa skanowań na żywo
                </div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { value: '47', label: 'Kraje', icon: '🌍' },
                  { value: '283', label: 'Miasta', icon: '🏙️' },
                  { value: '12.8K', label: 'Skany', icon: '📍' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4 text-center"
                    style={{
                      background: 'white',
                      boxShadow: 'var(--shadow-lg)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="font-display text-2xl sm:text-3xl font-bold" style={{ color: '#278575' }}>
                      {stat.value}
                    </div>
                    <div className="text-sm mt-0.5" style={{ color: 'var(--foreground-muted)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 2: Timing (Heatmap) */}
            <div
              className="absolute inset-0"
              style={{
                opacity: activeTab === 'timing' ? 1 : 0,
                transform: activeTab === 'timing' ? 'translateX(0)' : 'translateX(30px)',
                transition: 'opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)',
                pointerEvents: activeTab === 'timing' ? 'auto' : 'none',
              }}
            >
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'white',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border)',
                }}
              >
                <h3 className="font-display text-lg font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
                  Mapa aktywności
                </h3>
                <p className="text-sm mb-5" style={{ color: 'var(--foreground-muted)' }}>
                  Intensywność skanowań w ciągu tygodnia
                </p>

                {/* Heatmap */}
                <div className="overflow-x-auto">
                  <div className="min-w-[500px]">
                    {/* Day labels header */}
                    <div className="flex mb-2">
                      <div className="w-14 shrink-0" />
                      {dayLabels.map((day) => (
                        <div
                          key={day}
                          className="flex-1 text-center text-xs font-medium"
                          style={{ color: 'var(--foreground-muted)' }}
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Heatmap rows */}
                    {heatmapData.map((row, hourIdx) => (
                      <div key={hourIdx} className="flex items-center mb-1">
                        <div className="w-14 shrink-0 text-xs text-right pr-3" style={{ color: 'var(--foreground-subtle)', fontFamily: 'var(--font-mono)' }}>
                          {hourLabels[hourIdx]}
                        </div>
                        {row.map((intensity, dayIdx) => (
                          <div key={dayIdx} className="flex-1 px-0.5">
                            <div
                              className="rounded-sm aspect-[2/1]"
                              style={{
                                background: `rgba(39, 133, 117, ${intensity})`,
                                transition: 'background 0.3s ease',
                              }}
                              title={`${dayLabels[dayIdx]} ${hourLabels[hourIdx]} — ${Math.round(intensity * 100)}%`}
                            />
                          </div>
                        ))}
                      </div>
                    ))}

                    {/* Legend */}
                    <div className="flex items-center justify-end gap-1.5 mt-4">
                      <span className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>Mniej</span>
                      {[0.1, 0.3, 0.5, 0.7, 0.9].map((v) => (
                        <div
                          key={v}
                          className="w-4 h-3 rounded-sm"
                          style={{ background: `rgba(39, 133, 117, ${v})` }}
                        />
                      ))}
                      <span className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>Więcej</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Peak time cards */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { label: 'Szczyt dzienny', value: '12:00–14:00', icon: '☀️' },
                  { label: 'Najaktywniejszy dzień', value: 'Środa', icon: '📅' },
                  { label: 'Skany / godzinę (szczyt)', value: '847', icon: '⚡' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4"
                    style={{
                      background: 'white',
                      boxShadow: 'var(--shadow-lg)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div className="text-xl mb-1">{item.icon}</div>
                    <div className="font-display font-bold text-base sm:text-lg" style={{ color: '#278575' }}>
                      {item.value}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--foreground-muted)' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 3: Devices */}
            <div
              className="absolute inset-0"
              style={{
                opacity: activeTab === 'devices' ? 1 : 0,
                transform: activeTab === 'devices' ? 'translateX(0)' : 'translateX(30px)',
                transition: 'opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)',
                pointerEvents: activeTab === 'devices' ? 'auto' : 'none',
              }}
            >
              {/* Device cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { icon: '📱', label: 'Smartphone', percent: 68, color: '#278575' },
                  { icon: '💻', label: 'Desktop', percent: 27, color: '#667eea' },
                  { icon: '📱', label: 'Tablet', percent: 5, color: '#764ba2' },
                ].map((device, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-5 text-center"
                    style={{
                      background: 'white',
                      boxShadow: 'var(--shadow-lg)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div className="text-3xl mb-2">{device.icon}</div>
                    <div className="font-display text-3xl sm:text-4xl font-bold" style={{ color: device.color }}>
                      {device.percent}%
                    </div>
                    <div className="text-sm mt-1 font-medium" style={{ color: 'var(--foreground-muted)' }}>
                      {device.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Browser bars */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'white',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border)',
                }}
              >
                <h3 className="font-display text-lg font-semibold mb-5" style={{ color: 'var(--foreground)' }}>
                  Przeglądarki
                </h3>
                {[
                  { name: 'Chrome', percent: 52, color: '#278575' },
                  { name: 'Safari', percent: 28, color: '#667eea' },
                  { name: 'Firefox', percent: 12, color: '#764ba2' },
                  { name: 'Edge', percent: 8, color: '#0891b2' },
                ].map((browser, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{browser.name}</span>
                      <span className="text-sm font-mono font-medium" style={{ color: 'var(--foreground-muted)' }}>{browser.percent}%</span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--background-elevated)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: activeTab === 'devices' && barsAnimated ? `${browser.percent}%` : '0%',
                          background: browser.color,
                          transition: `width 1s cubic-bezier(0.4,0,0.2,1) ${i * 150}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 4: Rankings */}
            <div
              className="absolute inset-0"
              style={{
                opacity: activeTab === 'rankings' ? 1 : 0,
                transform: activeTab === 'rankings' ? 'translateX(0)' : 'translateX(30px)',
                transition: 'opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)',
                pointerEvents: activeTab === 'rankings' ? 'auto' : 'none',
              }}
            >
              <div className="space-y-4">
                {rankingItems.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-5 flex items-center gap-5"
                    style={{
                      background: 'white',
                      boxShadow: 'var(--shadow-lg)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {/* Rank number */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{
                        background: i < 3 ? medalGradients[i] : 'var(--background-elevated)',
                        color: i < 3 ? 'white' : 'var(--foreground-muted)',
                        boxShadow: i < 3 ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                      }}
                    >
                      {i + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm sm:text-base mb-1" style={{ color: 'var(--foreground)' }}>
                        {item.name}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--foreground-muted)' }}>
                        <span>📊 {item.scans} skanów</span>
                        <span>🎯 {item.conversion} konwersja</span>
                        <span>⏱️ śr. {item.avgTime}</span>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-2.5 h-2 rounded-full overflow-hidden" style={{ background: 'var(--background-elevated)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: activeTab === 'rankings' && barsAnimated ? `${item.percent}%` : '0%',
                            background: i < 3 ? medalGradients[i] : 'var(--background-elevated)',
                            transition: `width 1s cubic-bezier(0.4,0,0.2,1) ${i * 100}ms`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
