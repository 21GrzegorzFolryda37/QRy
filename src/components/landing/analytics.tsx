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

// German cities positioned on the Europe SVG viewBox (800x600)
const germanCities = [
  { cx: 430, cy: 230, label: 'Berlin', scans: '2,847', delay: '0s' },
  { cx: 395, cy: 275, label: 'Monachium', scans: '1,923', delay: '0.3s' },
  { cx: 370, cy: 250, label: 'Frankfurt', scans: '1,456', delay: '0.6s' },
  { cx: 355, cy: 230, label: 'Kolonia', scans: '1,102', delay: '0.9s' },
  { cx: 410, cy: 240, label: 'Lipsk', scans: '876', delay: '0.4s' },
  { cx: 380, cy: 215, label: 'Hamburg', scans: '1,634', delay: '0.7s' },
  { cx: 400, cy: 260, label: 'Stuttgart', scans: '943', delay: '1.0s' },
  { cx: 345, cy: 245, label: 'Düsseldorf', scans: '712', delay: '1.2s' },
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
              {/* Europe SVG Map */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                {/* Grid overlay */}
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }} />

                <svg
                  viewBox="0 0 800 600"
                  className="w-full"
                  style={{ height: 'auto', minHeight: 300, maxHeight: 440 }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="germanyFill" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
                    </linearGradient>
                  </defs>

                  {/* === EUROPE COUNTRY OUTLINES === */}
                  <g fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8">

                    {/* Iceland */}
                    <path d="M165,68 L175,62 L190,60 L200,65 L205,72 L198,80 L185,82 L172,78 L165,72 Z" />

                    {/* Norway */}
                    <path d="M350,30 L360,28 L375,35 L385,50 L390,70 L385,90 L380,110 L370,130 L365,150 L358,165 L350,175 L345,170 L340,155 L335,140 L330,120 L332,100 L340,80 L345,60 L348,40 Z" />

                    {/* Sweden */}
                    <path d="M380,55 L390,50 L400,55 L408,70 L412,90 L415,110 L412,130 L408,150 L400,170 L395,180 L388,185 L380,175 L375,160 L370,140 L368,120 L370,100 L375,80 L378,65 Z" />

                    {/* Finland */}
                    <path d="M420,50 L432,45 L445,50 L452,65 L455,85 L452,105 L448,125 L442,140 L435,150 L428,155 L420,148 L415,135 L412,115 L415,95 L418,75 L420,60 Z" />

                    {/* UK */}
                    <path d="M280,145 L290,138 L298,140 L305,148 L308,160 L310,175 L308,190 L302,200 L295,208 L288,210 L282,205 L278,195 L275,180 L278,165 L280,150 Z" />
                    {/* Ireland */}
                    <path d="M255,160 L265,155 L272,160 L275,172 L272,185 L265,192 L258,190 L252,180 L253,168 Z" />

                    {/* Scotland */}
                    <path d="M285,120 L295,115 L305,118 L310,128 L305,138 L295,140 L288,138 L283,130 Z" />

                    {/* France */}
                    <path d="M290,225 L305,218 L320,215 L335,218 L350,222 L358,230 L360,242 L358,258 L355,272 L348,285 L338,292 L325,295 L312,292 L300,285 L292,275 L288,260 L286,245 Z" />

                    {/* Spain */}
                    <path d="M260,290 L278,282 L298,278 L318,280 L335,285 L340,295 L338,310 L332,325 L320,338 L305,345 L288,345 L272,340 L260,330 L255,318 L255,305 Z" />

                    {/* Portugal */}
                    <path d="M240,295 L252,290 L258,298 L258,315 L255,330 L248,340 L240,338 L235,325 L235,310 Z" />

                    {/* Italy */}
                    <path d="M370,265 L378,258 L385,260 L390,268 L392,280 L395,295 L398,310 L395,325 L388,335 L380,340 L375,332 L370,318 L368,300 L367,282 Z" />
                    {/* Sicily */}
                    <path d="M380,345 L390,342 L395,348 L392,355 L385,358 L378,352 Z" />
                    {/* Sardinia */}
                    <path d="M355,305 L362,300 L366,308 L364,318 L358,322 L352,315 Z" />

                    {/* Poland */}
                    <path d="M405,195 L420,190 L438,192 L452,198 L458,208 L455,220 L448,232 L438,238 L425,240 L412,238 L402,232 L398,220 L400,208 Z" />

                    {/* Czech Republic */}
                    <path d="M388,228 L400,224 L412,226 L420,232 L418,240 L410,246 L398,248 L390,244 L386,236 Z" />

                    {/* Austria */}
                    <path d="M378,248 L392,244 L408,246 L420,248 L425,255 L420,262 L408,265 L395,266 L382,262 L376,255 Z" />

                    {/* Switzerland */}
                    <path d="M345,250 L358,246 L368,248 L372,255 L368,262 L358,265 L348,262 L342,256 Z" />

                    {/* Belgium */}
                    <path d="M325,210 L338,208 L345,212 L344,220 L338,224 L328,222 L322,216 Z" />

                    {/* Netherlands */}
                    <path d="M330,195 L342,192 L350,198 L348,208 L340,210 L332,208 L328,202 Z" />

                    {/* Denmark */}
                    <path d="M365,175 L375,172 L382,178 L380,188 L375,195 L368,192 L362,185 Z" />

                    {/* Hungary */}
                    <path d="M418,252 L432,248 L445,250 L452,258 L448,268 L440,274 L428,275 L418,270 L415,262 Z" />

                    {/* Romania */}
                    <path d="M448,248 L462,244 L478,248 L488,258 L485,270 L478,280 L465,282 L452,278 L445,268 L445,258 Z" />

                    {/* Bulgaria */}
                    <path d="M465,285 L478,282 L490,285 L495,295 L490,305 L480,308 L468,305 L462,296 Z" />

                    {/* Greece */}
                    <path d="M455,310 L465,305 L478,308 L485,318 L482,332 L475,342 L465,345 L455,340 L450,328 L452,318 Z" />

                    {/* Croatia/Bosnia */}
                    <path d="M408,268 L418,264 L428,268 L432,278 L428,288 L418,292 L410,288 L405,278 Z" />

                    {/* Serbia */}
                    <path d="M438,275 L448,270 L458,275 L462,285 L458,295 L448,298 L440,294 L435,285 Z" />

                    {/* Ukraine */}
                    <path d="M465,195 L485,188 L510,190 L530,195 L545,205 L548,220 L542,235 L530,245 L515,248 L498,245 L482,240 L470,232 L462,220 L462,208 Z" />

                    {/* Belarus */}
                    <path d="M448,178 L462,172 L478,175 L488,185 L485,198 L478,205 L465,208 L455,202 L448,192 Z" />

                    {/* Baltic states */}
                    <path d="M425,155 L435,150 L445,152 L450,162 L448,172 L440,178 L430,175 L425,165 Z" />

                    {/* Russia (western part) */}
                    <path d="M490,60 L530,50 L570,55 L600,70 L620,95 L630,125 L625,160 L615,190 L598,210 L575,220 L555,215 L538,205 L525,190 L518,170 L515,148 L510,125 L505,105 L498,85 Z" />

                    {/* Turkey (European part) */}
                    <path d="M498,305 L512,300 L525,305 L530,315 L525,325 L515,328 L505,325 L498,315 Z" />
                  </g>

                  {/* === GERMANY — highlighted === */}
                  <path
                    d="M355,195 L365,188 L378,185 L392,188 L405,192 L415,200 L420,212 L418,225 L412,235 L405,242 L395,248 L382,250 L370,248 L360,242 L352,232 L348,220 L350,208 Z"
                    fill="url(#germanyFill)"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1.5"
                  />
                  {/* Germany glow */}
                  <path
                    d="M355,195 L365,188 L378,185 L392,188 L405,192 L415,200 L420,212 L418,225 L412,235 L405,242 L395,248 L382,250 L370,248 L360,242 L352,232 L348,220 L350,208 Z"
                    fill="rgba(255,255,255,0.06)"
                    stroke="none"
                    filter="url(#glow)"
                  />

                  {/* === GERMAN CITY PINS === */}
                  {germanCities.map((city, i) => (
                    <g key={i}>
                      {/* Pulse ring */}
                      <circle
                        cx={city.cx}
                        cy={city.cy}
                        r="10"
                        fill="url(#pinGlow)"
                        opacity="0.6"
                      >
                        <animate
                          attributeName="r"
                          values="6;14;6"
                          dur="2.5s"
                          begin={city.delay}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.6;0.1;0.6"
                          dur="2.5s"
                          begin={city.delay}
                          repeatCount="indefinite"
                        />
                      </circle>
                      {/* Pin dot */}
                      <circle
                        cx={city.cx}
                        cy={city.cy}
                        r="4"
                        fill="white"
                        filter="url(#glow)"
                      />
                      {/* City label */}
                      <text
                        x={city.cx + 8}
                        y={city.cy - 8}
                        fill="rgba(255,255,255,0.9)"
                        fontSize="9"
                        fontFamily="Outfit, sans-serif"
                        fontWeight="600"
                      >
                        {city.label}
                      </text>
                      <text
                        x={city.cx + 8}
                        y={city.cy + 2}
                        fill="rgba(255,255,255,0.55)"
                        fontSize="7"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {city.scans}
                      </text>
                    </g>
                  ))}

                  {/* Connection lines between cities */}
                  <g stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="3 3">
                    <line x1="380" y1="215" x2="430" y2="230" />
                    <line x1="430" y1="230" x2="410" y2="240" />
                    <line x1="380" y1="215" x2="355" y2="230" />
                    <line x1="370" y1="250" x2="395" y2="275" />
                    <line x1="355" y1="230" x2="345" y2="245" />
                    <line x1="410" y1="240" x2="400" y2="260" />
                  </g>
                </svg>

                {/* Map label */}
                <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-sm font-medium">
                  🇩🇪 Niemcy — 8 miast aktywnych
                </div>
                <div className="absolute top-4 right-4 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white/80 text-xs font-mono">
                  LIVE
                  <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full ml-1.5 animate-pulse-soft" />
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
