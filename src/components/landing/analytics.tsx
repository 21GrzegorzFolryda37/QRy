'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

type TabId = 'locations' | 'timing' | 'devices' | 'rankings'

interface Tab {
  id: TabId
  title: string
}

const tabs: Tab[] = [
  { id: 'locations', title: 'Lokalizacje' },
  { id: 'timing', title: 'Wzorce czasowe' },
  { id: 'devices', title: 'Urządzenia' },
  { id: 'rankings', title: 'Czas rzeczywisty' },
]


export function Analytics() {
  const [activeTab, setActiveTab] = useState<TabId>('locations')
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
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
    <section ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden" style={{ background: '#f4f2ff' }}>
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
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Każdy skan to{' '}
            <span style={{ color: '#6d28d9' }}>
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
                    borderLeft: activeTab === tab.id ? '3px solid #6d28d9' : '3px solid transparent',
                    boxShadow: activeTab === tab.id
                      ? '0 4px 20px rgba(109,40,217,0.12), 0 1px 3px rgba(0,0,0,0.06)'
                      : '0 1px 2px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="font-semibold text-base" style={{ color: activeTab === tab.id ? '#6d28d9' : 'var(--foreground)' }}>
                    {tab.title}
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
            {/* Panel 1: Locations / Geofencing */}
            <div
              className="absolute inset-0"
              style={{
                opacity: activeTab === 'locations' ? 1 : 0,
                transform: activeTab === 'locations' ? 'translateX(0)' : 'translateX(30px)',
                transition: 'opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)',
                pointerEvents: activeTab === 'locations' ? 'auto' : 'none',
              }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'white',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left — Map image */}
                  <div
                    className="md:w-1/2 flex items-center justify-center p-4 sm:p-6"
                    style={{ background: '#f8fafb', minHeight: 340 }}
                  >
                    <Image
                      src="/mapa-qry.webp"
                      alt="Mapa skanów QR"
                      width={1082}
                      height={1035}
                      className="rounded-xl"
                      style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }}
                    />
                  </div>

                  {/* Right — Content */}
                  <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
                    <span
                      className="text-xs font-semibold uppercase tracking-wider mb-3 inline-block"
                      style={{ color: '#6366f1' }}
                    >
                      Funkcja
                    </span>
                    <h3
                      className="font-display text-xl sm:text-2xl font-bold leading-snug mb-5"
                      style={{ color: 'var(--foreground)' }}
                    >
                      Wykorzystaj geofencing do marketingu QR opartego na lokalizacji
                    </h3>

                    <div className="space-y-4 mb-6">
                      {[
                        {
                          title: 'Zróżnicuj doświadczenie użytkownika',
                          desc: 'Twórz unikalne treści dopasowane do lokalizacji, które zmieniają się w zależności od miejsca skanowania kodu QR.',
                        },
                        {
                          title: 'Śledzenie wielu kampanii',
                          desc: 'Monitoruj wyniki w różnych lokalizacjach i kampaniach z poziomu jednego panelu.',
                        },
                        {
                          title: 'Kontroluj zasięg dystrybucji',
                          desc: 'Ogranicz działanie kodów QR do wybranych stref geograficznych w celu precyzyjnego marketingu.',
                        },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-3">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: '#ecfdf5' }}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M3 7.5L5.5 10L11 4" stroke="#278575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                              {item.title}
                            </div>
                            <div className="text-sm mt-0.5 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                              {item.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <a
                      href="/qr-codes/new"
                      className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 self-start"
                      style={{
                        background: '#6d28d9',
                        boxShadow: '0 2px 8px rgba(109,40,217,0.3)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#5b21b6' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#6d28d9' }}
                    >
                      Stwórz kod QR
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 2: Timing */}
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
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'white',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left — Bar chart */}
                  <div
                    className="md:w-1/2 flex items-center justify-center p-6 sm:p-8"
                    style={{ background: '#f8fafb', minHeight: 340 }}
                  >
                    <div className="flex items-end justify-center gap-3" style={{ height: 260, width: '100%', maxWidth: 340 }}>
                      {[
                        { h: 30, color: '#B8B5D1' },
                        { h: 50, color: '#8B7FE8' },
                        { h: 65, color: '#8B7FE8' },
                        { h: 45, color: '#B8B5D1' },
                        { h: 55, color: '#B8B5D1' },
                        { h: 85, color: '#5ECDD4' },
                      ].map((bar, i) => (
                        <div
                          key={i}
                          className="flex-1 transition-opacity duration-200 hover:opacity-80"
                          style={{
                            height: `${bar.h}%`,
                            background: bar.color,
                            borderRadius: '6px 6px 2px 2px',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right — Content */}
                  <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
                    <span className="text-xs font-semibold uppercase tracking-wider mb-3 inline-block" style={{ color: '#278575' }}>
                      Funkcja
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug mb-5" style={{ color: 'var(--foreground)' }}>
                      Odkryj najlepszy czas na dotarcie do odbiorców
                    </h3>

                    <div className="space-y-4 mb-6">
                      {[
                        {
                          title: 'Analiza wzorców czasowych',
                          desc: 'Zobacz dokładnie, w jakich godzinach i dniach tygodnia Twoje kody QR są najczęściej skanowane.',
                        },
                        {
                          title: 'Optymalizacja kampanii',
                          desc: 'Planuj publikację kodów QR w oparciu o rzeczywiste dane o aktywności użytkowników.',
                        },
                        {
                          title: 'Szczyty aktywności',
                          desc: 'Identyfikuj godziny szczytu i dostosowuj treści, aby maksymalizować zaangażowanie.',
                        },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#ecfdf5' }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M3 7.5L5.5 10L11 4" stroke="#278575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{item.title}</div>
                            <div className="text-sm mt-0.5 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <a
                      href="/qr-codes/new"
                      className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 self-start"
                      style={{ background: '#6d28d9', boxShadow: '0 2px 8px rgba(109,40,217,0.3)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#5b21b6' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#6d28d9' }}
                    >
                      Stwórz kod QR
                    </a>
                  </div>
                </div>
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
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'white',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left — Platform comparison chart */}
                  <div
                    className="md:w-1/2 flex items-center justify-center p-6 sm:p-8"
                    style={{ background: '#f8fafb', minHeight: 340 }}
                  >
                    <div className="flex justify-around items-end" style={{ width: '100%', maxWidth: 300, height: 280 }}>
                      {/* iOS */}
                      <div className="flex flex-col items-center gap-4">
                        <div
                          className="transition-opacity duration-200 hover:opacity-80"
                          style={{
                            width: 64,
                            height: 200,
                            background: '#8B7FE8',
                            borderRadius: '8px 8px 4px 4px',
                          }}
                        />
                        <div className="flex items-center gap-2">
                          <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                            <path d="M16.52 12.62c-.03-2.85 2.33-4.22 2.44-4.29-1.33-1.94-3.4-2.21-4.14-2.24-1.76-.18-3.43 1.04-4.33 1.04-.9 0-2.28-1.01-3.74-.99-1.93.03-3.7 1.12-4.7 2.85-2 3.47-.51 8.62 1.44 11.44.96 1.38 2.1 2.93 3.6 2.88 1.44-.06 1.99-.93 3.73-.93s2.24.93 3.76.9c1.56-.03 2.54-1.41 3.48-2.8 1.1-1.6 1.55-3.15 1.58-3.23-.04-.01-3.02-1.16-3.05-4.6zM13.69 4.15c.79-.96 1.33-2.3 1.18-3.63-1.14.05-2.52.76-3.34 1.72-.73.85-1.37 2.2-1.2 3.5 1.28.1 2.58-.65 3.36-1.59z" fill="#9ca3af" />
                          </svg>
                          <span className="text-sm font-semibold" style={{ color: '#6b7280' }}>iOS</span>
                        </div>
                      </div>

                      {/* Android */}
                      <div className="flex flex-col items-center gap-4" style={{ justifyContent: 'flex-end' }}>
                        <div
                          className="transition-opacity duration-200 hover:opacity-80"
                          style={{
                            width: 64,
                            height: 95,
                            background: '#8B7FE8',
                            borderRadius: '8px 8px 4px 4px',
                          }}
                        />
                        <div className="flex items-center gap-2">
                          <svg width="22" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" fill="#3ddc84" />
                          </svg>
                          <span className="text-sm font-semibold" style={{ color: '#6b7280' }}>Android</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right — Content */}
                  <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
                    <span className="text-xs font-semibold uppercase tracking-wider mb-3 inline-block" style={{ color: '#667eea' }}>
                      Funkcja
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug mb-5" style={{ color: 'var(--foreground)' }}>
                      Dowiedz się, na jakich urządzeniach skanują Twoi użytkownicy
                    </h3>

                    <div className="space-y-4 mb-6">
                      {[
                        {
                          title: 'Podział na urządzenia',
                          desc: 'Sprawdź, jaki procent skanów pochodzi ze smartfonów, tabletów i komputerów.',
                        },
                        {
                          title: 'Analiza przeglądarek',
                          desc: 'Monitoruj, z jakich przeglądarek korzystają użytkownicy skanujący Twoje kody QR.',
                        },
                        {
                          title: 'Optymalizacja treści',
                          desc: 'Dostosuj strony docelowe do urządzeń najczęściej używanych przez Twoich odbiorców.',
                        },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#eef2ff' }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M3 7.5L5.5 10L11 4" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{item.title}</div>
                            <div className="text-sm mt-0.5 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <a
                      href="/qr-codes/new"
                      className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 self-start"
                      style={{ background: '#6d28d9', boxShadow: '0 2px 8px rgba(109,40,217,0.3)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#5b21b6' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#6d28d9' }}
                    >
                      Stwórz kod QR
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 4: Real-time Analytics */}
            <div
              className="absolute inset-0"
              style={{
                opacity: activeTab === 'rankings' ? 1 : 0,
                transform: activeTab === 'rankings' ? 'translateX(0)' : 'translateX(30px)',
                transition: 'opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)',
                pointerEvents: activeTab === 'rankings' ? 'auto' : 'none',
              }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'white',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left — Timeline with location pins */}
                  <div
                    className="md:w-1/2 flex items-center justify-center p-6 sm:p-8"
                    style={{ background: '#f8fafb', minHeight: 340 }}
                  >
                    <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{ maxWidth: 360 }}>
                      <defs>
                        <linearGradient id="pinGrad1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6EE7D6" />
                          <stop offset="100%" stopColor="#4FC3CB" />
                        </linearGradient>
                        <linearGradient id="pinGrad2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7EEADB" />
                          <stop offset="100%" stopColor="#5ECDD4" />
                        </linearGradient>
                        <linearGradient id="timelineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#7C3AED" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>

                      {/* Timeline bar */}
                      <rect x="20" y="147" width="360" height="7" rx="3.5" fill="url(#timelineGrad)" />

                      {/* End caps */}
                      <circle cx="20" cy="150.5" r="5" fill="#7C3AED" />
                      <circle cx="380" cy="150.5" r="5" fill="#8B5CF6" />

                      {/* Pin 1 — 20% */}
                      <g transform="translate(80, 150)">
                        {/* Shadow */}
                        <ellipse cx="0" cy="4" rx="12" ry="4" fill="rgba(0,0,0,0.08)" />
                        {/* Pin body */}
                        <path d="M0-60 C-18-60-30-48-30-32 C-30-12 0 0 0 0 C0 0 30-12 30-32 C30-48 18-60 0-60Z" fill="url(#pinGrad1)" />
                        {/* White circle inside */}
                        <circle cx="0" cy="-34" r="16" fill="white" />
                        {/* QR icon */}
                        <rect x="-9" y="-43" width="7" height="7" rx="1" fill="#4FC3CB" />
                        <rect x="2" y="-43" width="7" height="7" rx="1" fill="#4FC3CB" />
                        <rect x="-9" y="-34" width="7" height="7" rx="1" fill="#4FC3CB" />
                        <rect x="3" y="-33" width="5" height="5" rx="0.5" fill="#4FC3CB" opacity="0.6" />
                      </g>

                      {/* Pin 2 — 50% (center, slightly larger) */}
                      <g transform="translate(200, 150)">
                        <ellipse cx="0" cy="4" rx="14" ry="5" fill="rgba(0,0,0,0.1)" />
                        <path d="M0-68 C-20-68-34-54-34-36 C-34-14 0 0 0 0 C0 0 34-14 34-36 C34-54 20-68 0-68Z" fill="url(#pinGrad2)" />
                        <circle cx="0" cy="-38" r="18" fill="white" />
                        {/* QR icon */}
                        <rect x="-10" y="-48" width="8" height="8" rx="1.5" fill="#5ECDD4" />
                        <rect x="2" y="-48" width="8" height="8" rx="1.5" fill="#5ECDD4" />
                        <rect x="-10" y="-38" width="8" height="8" rx="1.5" fill="#5ECDD4" />
                        <rect x="4" y="-36" width="5" height="5" rx="0.5" fill="#5ECDD4" opacity="0.6" />
                      </g>

                      {/* Pin 3 — 80% */}
                      <g transform="translate(320, 150)">
                        <ellipse cx="0" cy="4" rx="12" ry="4" fill="rgba(0,0,0,0.08)" />
                        <path d="M0-60 C-18-60-30-48-30-32 C-30-12 0 0 0 0 C0 0 30-12 30-32 C30-48 18-60 0-60Z" fill="url(#pinGrad1)" />
                        <circle cx="0" cy="-34" r="16" fill="white" />
                        {/* QR icon */}
                        <rect x="-9" y="-43" width="7" height="7" rx="1" fill="#4FC3CB" />
                        <rect x="2" y="-43" width="7" height="7" rx="1" fill="#4FC3CB" />
                        <rect x="-9" y="-34" width="7" height="7" rx="1" fill="#4FC3CB" />
                        <rect x="3" y="-33" width="5" height="5" rx="0.5" fill="#4FC3CB" opacity="0.6" />
                      </g>
                    </svg>
                  </div>

                  {/* Right — Content */}
                  <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
                    <span className="text-xs font-semibold uppercase tracking-wider mb-3 inline-block" style={{ color: '#278575' }}>
                      Funkcja
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug mb-5" style={{ color: 'var(--foreground)' }}>
                      Analityka w czasie rzeczywistym dla każdego skanu
                    </h3>

                    <div className="space-y-4 mb-6">
                      {[
                        {
                          title: 'Natychmiastowe powiadomienia',
                          desc: 'Otrzymuj dane o każdym skanie w momencie, gdy się wydarzy — lokalizacja, urządzenie i czas.',
                        },
                        {
                          title: 'Dashboard na żywo',
                          desc: 'Obserwuj aktywność swoich kodów QR w czasie rzeczywistym na interaktywnym panelu.',
                        },
                        {
                          title: 'Szybka reakcja',
                          desc: 'Reaguj natychmiast na zmiany w zaangażowaniu i optymalizuj kampanie w locie.',
                        },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#ecfdf5' }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M3 7.5L5.5 10L11 4" stroke="#278575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{item.title}</div>
                            <div className="text-sm mt-0.5 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <a
                      href="/qr-codes/new"
                      className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 self-start"
                      style={{ background: '#6d28d9', boxShadow: '0 2px 8px rgba(109,40,217,0.3)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#5b21b6' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#6d28d9' }}
                    >
                      Stwórz kod QR
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
