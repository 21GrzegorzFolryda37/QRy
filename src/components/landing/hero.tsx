'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { QrPreview } from '@/components/qr/qr-preview'
import { DEFAULT_QR_STYLE } from '@/types/qr'
import { heroQRStarted, heroQRUrlEntered } from '@/lib/analytics'

type QRType = 'website' | 'text' | 'email' | 'phone' | 'sms' | 'whatsapp' | 'vcard' | 'wifi' | 'social' | 'pdf' | 'video' | 'facebook' | 'instagram' | 'twitter' | 'bitcoin' | 'mp3' | 'appstore'

const qrTypes: { id: QRType; label: string; icon: string }[] = [
  { id: 'website', label: 'Strona www', icon: 'globe' },
  { id: 'text', label: 'Tekst', icon: 'text' },
  { id: 'email', label: 'E-mail', icon: 'mail' },
  { id: 'phone', label: 'Telefon', icon: 'phone' },
  { id: 'sms', label: 'SMS', icon: 'sms' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp' },
  { id: 'vcard', label: 'Wizytówka', icon: 'user' },
  { id: 'wifi', label: 'WiFi', icon: 'wifi' },
  { id: 'social', label: 'Social media', icon: 'share' },
  { id: 'pdf', label: 'PDF', icon: 'file' },
  { id: 'video', label: 'Wideo', icon: 'play' },
  { id: 'facebook', label: 'Facebook', icon: 'facebook' },
  { id: 'instagram', label: 'Instagram', icon: 'instagram' },
  { id: 'twitter', label: 'Twitter/X', icon: 'twitter' },
  { id: 'bitcoin', label: 'Bitcoin', icon: 'bitcoin' },
  { id: 'mp3', label: 'MP3', icon: 'music' },
  { id: 'appstore', label: 'Aplikacje', icon: 'download' },
]

const typeContent: Record<QRType, { subtitle: string }> = {
  website: { subtitle: 'Udostępniaj swoją stronę internetową w prosty sposób' },
  text: { subtitle: 'Udostępniaj dowolny tekst po zeskanowaniu' },
  email: { subtitle: 'Pozwól klientom szybko się z Tobą skontaktować' },
  phone: { subtitle: 'Jeden skan i połączenie gotowe' },
  sms: { subtitle: 'Wypełniona wiadomość SMS po zeskanowaniu' },
  whatsapp: { subtitle: 'Rozpocznij rozmowę na WhatsApp jednym skanem' },
  vcard: { subtitle: 'Rozwój Twojej sieci nigdy nie był łatwiejszy' },
  wifi: { subtitle: 'Goście połączą się jednym skanem' },
  social: { subtitle: 'Linki do wszystkich profili w jednym miejscu' },
  pdf: { subtitle: 'Dokumenty dostępne po zeskanowaniu' },
  video: { subtitle: 'Link do YouTube, Vimeo lub własnego wideo' },
  facebook: { subtitle: 'Zwiększ liczbę obserwujących' },
  instagram: { subtitle: 'Rozwijaj swoje konto Instagram' },
  twitter: { subtitle: 'Połącz się ze swoimi obserwatorami' },
  bitcoin: { subtitle: 'Przyjmuj płatności kryptowalutowe' },
  mp3: { subtitle: 'Muzyka i podcasty po zeskanowaniu' },
  appstore: { subtitle: 'App Store i Google Play w jednym kodzie' },
}

export function Hero() {
  const [selectedType, setSelectedType] = useState<QRType>('website')
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [codeName, setCodeName] = useState('')

  // Analytics timing
  const hasTrackedStart = useRef(false)

  const trackStart = useCallback(() => {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true
      heroQRStarted()
    }
  }, [])

  // Particle animation
  const particlesRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = particlesRef.current
    if (!container) return

    const colors = ['#6d28d9', '#8b5cf6', '#a78bfa', '#7c3aed', '#9333ea']

    const createParticle = () => {
      const particle = document.createElement('div')
      const size = Math.random() * 12 + 3
      const color = colors[Math.floor(Math.random() * colors.length)]
      const duration = Math.random() * 15 + 10
      const topPos = Math.random() * 100
      const isSquare = Math.random() > 0.5
      const hasGlow = Math.random() < 0.2

      particle.style.cssText = `
        position: absolute;
        left: -20px;
        top: ${topPos}%;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${isSquare ? '2px' : '50%'};
        opacity: 0;
        pointer-events: none;
        animation: particle-flow ${duration}s linear forwards;
        ${hasGlow ? `box-shadow: 0 0 ${size * 2}px ${size}px ${color}40;` : ''}
      `

      container.appendChild(particle)
      setTimeout(() => { particle.remove() }, duration * 1000)
    }

    for (let i = 0; i < 25; i++) {
      setTimeout(() => createParticle(), Math.random() * 10000)
    }

    const interval = setInterval(createParticle, 400)

    return () => {
      clearInterval(interval)
      container.innerHTML = ''
    }
  }, [])

  // Generate QR data for live preview
  const getQRData = () => {
    switch (selectedType) {
      case 'website':
        return formData.url || 'https://example.com'
      case 'text':
        return formData.text || 'Przykładowy tekst'
      case 'email':
        return `mailto:${formData.email || ''}?subject=${encodeURIComponent(formData.subject || '')}`
      case 'phone':
        return `tel:${formData.phone || ''}`
      case 'sms':
        return `sms:${formData.phone || ''}`
      case 'whatsapp':
        return `https://wa.me/${formData.phone || ''}`
      case 'wifi':
        return `WIFI:T:${formData.encryption || 'WPA'};S:${formData.ssid || ''};P:${formData.password || ''};;`
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${formData.name || ''}\nEND:VCARD`
      case 'facebook':
        return `https://facebook.com/${formData.username || ''}`
      case 'instagram':
        return `https://instagram.com/${formData.username || ''}`
      case 'twitter':
        return `https://twitter.com/${formData.username || ''}`
      case 'bitcoin':
        return `bitcoin:${formData.address || ''}`
      default:
        return formData.url || 'https://example.com'
    }
  }

  // Build URL for /generator page with pre-filled params
  const buildGeneratorUrl = () => {
    const params = new URLSearchParams({ type: selectedType })
    if (formData.url) params.set('url', formData.url)
    if (formData.phone) params.set('phone', formData.phone)
    if (formData.username) params.set('username', formData.username)
    if (formData.text) params.set('text', formData.text)
    if (formData.email) params.set('email', formData.email)
    if (formData.ssid) params.set('ssid', formData.ssid)
    if (formData.address) params.set('address', formData.address)
    if (codeName) params.set('name', codeName)
    return `/generator?${params.toString()}`
  }

  const renderForm = () => {
    const inputClass = "w-full px-4 py-3 rounded-xl bg-[var(--background-surface)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all shadow-sm"

    switch (selectedType) {
      case 'website':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Adres URL strony</label>
              <input type="url" value={formData.url || ''} onChange={(e) => setFormData({ ...formData, url: e.target.value })} onBlur={(e) => { if (e.target.value) heroQRUrlEntered(e.target.value, 'none') }} placeholder="https://twoja-strona.pl" className={inputClass} />
            </div>
          </div>
        )
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Treść tekstu *</label>
              <textarea
                value={formData.text || ''}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Wpisz dowolny tekst..."
                rows={3}
                className={inputClass}
              />
            </div>
          </div>
        )
      case 'phone':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Numer telefonu *</label>
              <input type="tel" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+48 123 456 789" className={inputClass} />
            </div>
          </div>
        )
      case 'sms':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Numer telefonu *</label>
              <input type="tel" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+48 123 456 789" className={inputClass} />
            </div>
          </div>
        )
      case 'whatsapp':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Numer telefonu (z kodem kraju) *</label>
              <input type="tel" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="48123456789" className={inputClass} />
              <p className="text-xs text-[var(--foreground-subtle)] mt-1">Bez + i spacji, np. 48123456789</p>
            </div>
          </div>
        )
      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Adres e-mail</label>
              <input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="kontakt@firma.pl" className={inputClass} />
            </div>
          </div>
        )
      case 'vcard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Imię i nazwisko *</label>
                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Jan Kowalski" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Telefon</label>
                <input type="tel" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+48 123 456 789" className={inputClass} />
              </div>
            </div>
          </div>
        )
      case 'wifi':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Nazwa sieci (SSID) *</label>
                <input type="text" value={formData.ssid || ''} onChange={(e) => setFormData({ ...formData, ssid: e.target.value })} placeholder="MojaSiec" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Hasło</label>
                <input type="text" value={formData.password || ''} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="haslo123" className={inputClass} />
              </div>
            </div>
          </div>
        )
      case 'facebook':
      case 'instagram':
      case 'twitter':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Nazwa użytkownika *</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-[var(--border)] bg-[var(--background-surface)] text-[var(--foreground-muted)] text-sm">@</span>
                <input type="text" value={formData.username || ''} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="twoj_profil" className={`${inputClass} rounded-l-none`} />
              </div>
            </div>
          </div>
        )
      case 'bitcoin':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Adres Bitcoin *</label>
              <input type="text" value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2" className={inputClass} />
            </div>
          </div>
        )
      default:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Link URL *</label>
              <input type="url" value={formData.url || ''} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://..." className={inputClass} />
            </div>
          </div>
        )
    }
  }

  return (
    <section className="hero-section relative flex flex-col justify-start pt-24 pb-16 overflow-x-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%)' }} />

      {/* Ambient glow */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full" style={{ background: 'rgba(109, 40, 217, 0.15)', filter: 'blur(100px)' }} />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full" style={{ background: 'rgba(109, 40, 217, 0.15)', filter: 'blur(100px)' }} />

      {/* Particles */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" />

      {/* Content wrapper */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl font-display animate-fade-in-up animate-delay-100">
            <span className="text-white">Generator Kodów </span>
            <span className="text-[#a78bfa] drop-shadow-lg">QR</span>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
            Stwórz profesjonalny kod QR w kilka sekund. Personalizuj kolory, kształty i dodaj logo.
          </p>
        </div>

        {/* Teaser Card */}
        <div className="max-w-6xl mx-auto animate-fade-in-up animate-delay-400">
          <div className="bg-white rounded-3xl border border-[var(--border)] shadow-xl">
            <div className="p-5 sm:p-6 lg:p-8">

              <div className="lg:grid lg:grid-cols-12 lg:gap-8">

                {/* Left: type selector + form + code name + CTA */}
                <div className="lg:col-span-8 pb-20 lg:pb-0">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#6d28d9] text-white text-sm font-bold shadow-lg shadow-[#6d28d9]/25">1</span>
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--foreground)] font-display">Rodzaj i dane kodu</h2>
                      <p className="text-sm text-[var(--foreground-muted)]">{typeContent[selectedType].subtitle}</p>
                    </div>
                  </div>

                  {/* QR Type grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-2 mb-5">
                    {qrTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => { setSelectedType(type.id); setFormData({}); trackStart() }}
                        className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl text-xs font-medium transition-all ${
                          selectedType === type.id
                            ? 'bg-[#6d28d9] text-white shadow-md ring-2 ring-[#6d28d9]/30'
                            : 'bg-white border border-[var(--border)] text-[var(--foreground-muted)] hover:border-[#6d28d9]/50 shadow-sm'
                        }`}
                      >
                        <TypeIcon type={type.icon} className="w-4 h-4" />
                        {type.label}
                      </button>
                    ))}
                  </div>

                  {/* Form for selected type */}
                  <div className="mb-5" onFocus={trackStart}>
                    {renderForm()}
                  </div>

                  {/* Code name input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">
                      Nazwa kodu <span className="text-[var(--foreground-subtle)] font-normal">(opcjonalnie)</span>
                    </label>
                    <input
                      type="text"
                      value={codeName}
                      onChange={(e) => setCodeName(e.target.value)}
                      placeholder="np. Mój sklep"
                      className="w-full px-4 py-3 rounded-xl bg-[var(--background-surface)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all shadow-sm"
                    />
                  </div>

                  {/* Desktop CTA */}
                  <div className="pt-4 border-t border-[var(--border)] hidden lg:block">
                    <Link href={buildGeneratorUrl()}>
                      <button className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#6d28d9] hover:bg-[#5b21b6] transition-all shadow-md shadow-[#6d28d9]/25">
                        Stwórz kod QR →
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Right: live QR preview - desktop only */}
                <div className="hidden lg:flex lg:col-span-4 items-start justify-center pt-4">
                  <div className="sticky top-8 w-full">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-2xl blur-xl opacity-20 animate-pulse-glow" />
                      <div className="relative flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-[var(--primary-muted)] to-[var(--secondary-muted)] border border-[var(--border)]">
                        <div className="bg-white rounded-xl p-2 shadow-lg">
                          <QrPreview
                            url={getQRData()}
                            style={DEFAULT_QR_STYLE}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-center text-xs text-[var(--foreground-subtle)]">Podgląd na żywo</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fixed bottom bar */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="bg-white/95 backdrop-blur-md border-t border-[var(--border)] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 py-3">
          <Link href={buildGeneratorUrl()}>
            <button className="w-full px-4 py-3 rounded-xl text-sm font-bold text-white bg-[#6d28d9] hover:bg-[#5b21b6] active:bg-[#4c1d95] transition-all shadow-md shadow-[#6d28d9]/25">
              Stwórz kod QR →
            </button>
          </Link>
        </div>
      </div>

    </section>
  )
}

// Type Icon component
function TypeIcon({ type, className }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    globe: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.916 17.916 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />,
    text: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />,
    file: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />,
    mail: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />,
    phone: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />,
    sms: <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />,
    whatsapp: <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.556 0 8.25-3.694 8.25-8.25S16.556 3.75 12 3.75 3.75 7.444 3.75 12c0 1.592.467 3.075 1.27 4.32L3.75 20.25l4.02-1.23A8.212 8.212 0 0 0 12 20.25Z" />,
    share: <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />,
    user: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />,
    wifi: <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />,
    download: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />,
    play: <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />,
    facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    instagram: <><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></>,
    twitter: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />,
    bitcoin: <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />,
    music: <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />,
  }
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">{icons[type]}</svg>
}
