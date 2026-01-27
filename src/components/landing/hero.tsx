'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui'
import QRCodeStyling, { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling'

type QRType = 'website' | 'email' | 'vcard' | 'wifi' | 'social' | 'pdf' | 'video' | 'facebook' | 'instagram' | 'twitter' | 'bitcoin' | 'mp3' | 'appstore'
type TabType = 'sticker' | 'color' | 'shapes' | 'logo'

const qrTypes: { id: QRType; label: string; icon: string }[] = [
  { id: 'website', label: 'Website', icon: 'globe' },
  { id: 'pdf', label: 'PDF', icon: 'file' },
  { id: 'email', label: 'Email', icon: 'mail' },
  { id: 'social', label: 'Social media', icon: 'share' },
  { id: 'vcard', label: 'vCard', icon: 'user' },
  { id: 'wifi', label: 'WiFi', icon: 'wifi' },
  { id: 'appstore', label: 'App stores', icon: 'download' },
  { id: 'video', label: 'Video', icon: 'play' },
  { id: 'facebook', label: 'Facebook', icon: 'facebook' },
  { id: 'instagram', label: 'Instagram', icon: 'instagram' },
  { id: 'twitter', label: 'Twitter/X', icon: 'twitter' },
  { id: 'bitcoin', label: 'Bitcoin', icon: 'bitcoin' },
  { id: 'mp3', label: 'MP3', icon: 'music' },
]

const typeContent: Record<QRType, { title: string; subtitle: string }> = {
  website: { title: 'Przekształć link do strony w kod QR', subtitle: 'Udostępniaj swoją stronę internetową w prosty sposób' },
  email: { title: 'Przekształć adres e-mail w kod QR', subtitle: 'Pozwól klientom szybko się z Tobą skontaktować' },
  vcard: { title: 'Przekształć dane kontaktowe w kod QR vCard', subtitle: 'Rozwój Twojej sieci nigdy nie był łatwiejszy' },
  wifi: { title: 'Udostępnij hasło WiFi przez kod QR', subtitle: 'Goście połączą się jednym skanem' },
  social: { title: 'Wszystkie social media w jednym kodzie QR', subtitle: 'Linki do wszystkich profili w jednym miejscu' },
  pdf: { title: 'Udostępnij plik PDF przez kod QR', subtitle: 'Dokumenty dostępne po zeskanowaniu' },
  video: { title: 'Udostępnij wideo przez kod QR', subtitle: 'Link do YouTube, Vimeo lub własnego wideo' },
  facebook: { title: 'Link do Facebooka w kodzie QR', subtitle: 'Zwiększ liczbę obserwujących' },
  instagram: { title: 'Link do Instagrama w kodzie QR', subtitle: 'Rozwijaj swoje konto Instagram' },
  twitter: { title: 'Link do Twitter/X w kodzie QR', subtitle: 'Połącz się ze swoimi obserwatorami' },
  bitcoin: { title: 'Adres Bitcoin w kodzie QR', subtitle: 'Przyjmuj płatności kryptowalutowe' },
  mp3: { title: 'Udostępnij plik audio przez kod QR', subtitle: 'Muzyka i podcasty po zeskanowaniu' },
  appstore: { title: 'Link do aplikacji w kodzie QR', subtitle: 'App Store i Google Play w jednym kodzie' },
}

const stickerTemplates = [
  { id: 'none', label: 'Brak', frame: false },
  { id: 'scan-me-1', label: 'Scan Me', frame: true, text: 'SCAN ME', icon: 'phone' },
  { id: 'scan-me-2', label: 'Scan Me Arrow', frame: true, text: 'SCAN ME', icon: 'arrow' },
  { id: 'scan-here', label: 'Skanuj', frame: true, text: 'SKANUJ', icon: 'qr' },
  { id: 'follow-us', label: 'Obserwuj', frame: true, text: 'OBSERWUJ', icon: 'heart' },
  { id: 'visit-us', label: 'Odwiedź', frame: true, text: 'ODWIEDŹ', icon: 'globe' },
  { id: 'contact', label: 'Kontakt', frame: true, text: 'KONTAKT', icon: 'mail' },
  { id: 'menu', label: 'Menu', frame: true, text: 'MENU', icon: 'utensils' },
  { id: 'wifi', label: 'WiFi', frame: true, text: 'WIFI', icon: 'wifi' },
  { id: 'download', label: 'Pobierz', frame: true, text: 'POBIERZ', icon: 'download' },
  { id: 'shop', label: 'Sklep', frame: true, text: 'SKLEP', icon: 'shop' },
]

const colorPresets = [
  { dots: '#000000', bg: '#ffffff', cornerSquare: '#000000', cornerDot: '#000000' },
  { dots: '#8b5cf6', bg: '#ffffff', cornerSquare: '#06b6d4', cornerDot: '#8b5cf6' },
  { dots: '#1e40af', bg: '#ffffff', cornerSquare: '#3b82f6', cornerDot: '#1e40af' },
  { dots: '#059669', bg: '#ffffff', cornerSquare: '#10b981', cornerDot: '#059669' },
  { dots: '#dc2626', bg: '#ffffff', cornerSquare: '#f87171', cornerDot: '#dc2626' },
  { dots: '#ea580c', bg: '#ffffff', cornerSquare: '#fb923c', cornerDot: '#ea580c' },
  { dots: '#7c3aed', bg: '#faf5ff', cornerSquare: '#a855f7', cornerDot: '#7c3aed' },
  { dots: '#0891b2', bg: '#ecfeff', cornerSquare: '#22d3ee', cornerDot: '#0891b2' },
]

const shapePresets: { dots: DotType; cornerSquare: CornerSquareType; cornerDot: CornerDotType; label: string }[] = [
  { dots: 'square', cornerSquare: 'square', cornerDot: 'square', label: 'Kwadrat' },
  { dots: 'rounded', cornerSquare: 'extra-rounded', cornerDot: 'dot', label: 'Zaokrąglone' },
  { dots: 'dots', cornerSquare: 'dot', cornerDot: 'dot', label: 'Kropki' },
  { dots: 'classy', cornerSquare: 'square', cornerDot: 'square', label: 'Klasyczne' },
  { dots: 'classy-rounded', cornerSquare: 'extra-rounded', cornerDot: 'dot', label: 'Eleganckie' },
  { dots: 'extra-rounded', cornerSquare: 'extra-rounded', cornerDot: 'dot', label: 'Okrągłe' },
]

const cornerSquareTypes: { type: CornerSquareType; label: string }[] = [
  { type: 'square', label: 'Kwadrat' },
  { type: 'extra-rounded', label: 'Zaokrąglone' },
  { type: 'dot', label: 'Okrągłe' },
]

const cornerDotTypes: { type: CornerDotType; label: string }[] = [
  { type: 'square', label: 'Kwadrat' },
  { type: 'dot', label: 'Okrągłe' },
]

const dotTypes: { type: DotType; label: string }[] = [
  { type: 'square', label: 'Kwadrat' },
  { type: 'rounded', label: 'Zaokrąglone' },
  { type: 'dots', label: 'Kropki' },
  { type: 'extra-rounded', label: 'Okrągłe' },
  { type: 'classy', label: 'Klasyczne' },
  { type: 'classy-rounded', label: 'Eleganckie' },
]

export function Hero() {
  const [selectedType, setSelectedType] = useState<QRType>('website')
  const [activeTab, setActiveTab] = useState<TabType>('sticker')

  // Form fields
  const [formData, setFormData] = useState<Record<string, string>>({})

  // QR customization
  const [selectedSticker, setSelectedSticker] = useState('scan-me-1')
  const [dotColor, setDotColor] = useState('#000000')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [cornerSquareColor, setCornerSquareColor] = useState('#000000')
  const [cornerDotColor, setCornerDotColor] = useState('#000000')
  const [dotType, setDotType] = useState<DotType>('rounded')
  const [cornerSquareType, setCornerSquareType] = useState<CornerSquareType>('extra-rounded')
  const [cornerDotType, setCornerDotType] = useState<CornerDotType>('dot')
  const [logo, setLogo] = useState<string | null>(null)

  // Download state
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const qrRef = useRef<HTMLDivElement>(null)
  const qrCodeRef = useRef<QRCodeStyling | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getQRData = () => {
    switch (selectedType) {
      case 'website':
        return formData.url || 'https://example.com'
      case 'email':
        return `mailto:${formData.email || 'example@email.com'}?subject=${encodeURIComponent(formData.subject || '')}&body=${encodeURIComponent(formData.body || '')}`
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${formData.name || 'Jan Kowalski'}\nTEL:${formData.phone || ''}\nEMAIL:${formData.email || ''}\nORG:${formData.company || ''}\nEND:VCARD`
      case 'wifi':
        return `WIFI:T:${formData.encryption || 'WPA'};S:${formData.ssid || 'NetworkName'};P:${formData.password || ''};H:${formData.hidden === 'true' ? 'true' : 'false'};;`
      case 'facebook':
        return `https://facebook.com/${formData.username || ''}`
      case 'instagram':
        return `https://instagram.com/${formData.username || ''}`
      case 'twitter':
        return `https://twitter.com/${formData.username || ''}`
      case 'bitcoin':
        return `bitcoin:${formData.address || ''}${formData.amount ? `?amount=${formData.amount}` : ''}`
      default:
        return formData.url || 'https://example.com'
    }
  }

  const isFormValid = () => {
    switch (selectedType) {
      case 'website':
        return !!formData.url
      case 'email':
        return !!formData.email
      case 'vcard':
        return !!formData.name
      case 'wifi':
        return !!formData.ssid
      case 'facebook':
      case 'instagram':
      case 'twitter':
        return !!formData.username
      case 'bitcoin':
        return !!formData.address
      default:
        return !!formData.url
    }
  }

  // Initialize QR code
  useEffect(() => {
    qrCodeRef.current = new QRCodeStyling({
      width: 200,
      height: 200,
      type: 'svg',
      data: getQRData(),
      dotsOptions: { color: dotColor, type: dotType },
      cornersSquareOptions: { color: cornerSquareColor, type: cornerSquareType },
      cornersDotOptions: { color: cornerDotColor, type: cornerDotType },
      backgroundOptions: { color: backgroundColor },
      imageOptions: { crossOrigin: 'anonymous', margin: 8, imageSize: 0.35 },
    })
    if (qrRef.current) {
      qrRef.current.innerHTML = ''
      qrCodeRef.current.append(qrRef.current)
    }
  }, [])

  // Update QR code
  useEffect(() => {
    if (qrCodeRef.current) {
      qrCodeRef.current.update({
        data: getQRData(),
        dotsOptions: { color: dotColor, type: dotType },
        cornersSquareOptions: { color: cornerSquareColor, type: cornerSquareType },
        cornersDotOptions: { color: cornerDotColor, type: cornerDotType },
        backgroundOptions: { color: backgroundColor },
        image: logo || undefined,
      })
    }
  }, [formData, selectedType, dotColor, backgroundColor, cornerSquareColor, cornerDotColor, dotType, cornerSquareType, cornerDotType, logo])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => setLogo(event.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleDownloadClick = () => {
    if (!isFormValid()) {
      return
    }
    setShowEmailCapture(true)
    setSendStatus('idle')
  }

  const handleSendToEmail = async () => {
    if (!userEmail.trim() || !userEmail.includes('@')) return
    setIsSending(true)
    setSendStatus('idle')
    try {
      const qrBlob = await qrCodeRef.current?.getRawData('png')
      if (!qrBlob) throw new Error('Failed to generate QR')
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(qrBlob as Blob)
      })
      const response = await fetch('/api/send-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, qrCodeBase64: base64, url: getQRData() }),
      })
      setSendStatus(response.ok ? 'success' : 'error')
    } catch {
      setSendStatus('error')
    } finally {
      setIsSending(false)
    }
  }

  const currentSticker = stickerTemplates.find(s => s.id === selectedSticker)
  const tabs: { id: TabType; label: string }[] = [
    { id: 'sticker', label: 'NAKLEJKA' },
    { id: 'color', label: 'KOLOR' },
    { id: 'shapes', label: 'KSZTAŁTY' },
    { id: 'logo', label: 'LOGO' },
  ]

  const renderForm = () => {
    const inputClass = "w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-white text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--success)] focus:border-transparent transition-all"

    switch (selectedType) {
      case 'website':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Adres URL strony</label>
              <input type="url" value={formData.url || ''} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://twoja-strona.pl" className={inputClass} />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Temat (opcjonalnie)</label>
                <input type="text" value={formData.subject || ''} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="Temat wiadomości" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Treść (opcjonalnie)</label>
                <input type="text" value={formData.body || ''} onChange={(e) => setFormData({ ...formData, body: e.target.value })} placeholder="Treść wiadomości" className={inputClass} />
              </div>
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
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Firma</label>
                <input type="text" value={formData.company || ''} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="Nazwa firmy" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Telefon</label>
                <input type="tel" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+48 123 456 789" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">E-mail</label>
                <input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="jan@firma.pl" className={inputClass} />
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
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Szyfrowanie</label>
              <select value={formData.encryption || 'WPA'} onChange={(e) => setFormData({ ...formData, encryption: e.target.value })} className={inputClass}>
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Brak hasła</option>
              </select>
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
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Kwota (opcjonalnie)</label>
              <input type="text" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="0.001" className={inputClass} />
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
    <section className="pt-24 pb-16 sm:pt-28 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
            <span className="text-[var(--foreground)]">Darmowy generator </span>
            <span className="gradient-text">kodów QR</span>
          </h1>
        </div>

        {/* QR Type Selector - Grid */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {qrTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => { setSelectedType(type.id); setFormData({}) }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                  selectedType === type.id
                    ? 'border-[var(--success)] text-[var(--success)] bg-[var(--success)]/5'
                    : 'border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--border-hover)] bg-white'
                }`}
              >
                <TypeIcon type={type.icon} className={`w-4 h-4 ${selectedType === type.id ? 'text-[var(--success)]' : ''}`} />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generator Card */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-[var(--border)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column */}
              <div className="lg:col-span-8 p-6 lg:p-8 space-y-6">
                {/* Section 1: Content */}
                <div>
                  <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                    {typeContent[selectedType].title}
                  </h2>
                  <p className="text-[var(--foreground-muted)] mb-4">
                    {typeContent[selectedType].subtitle}
                  </p>

                  <div className="animate-fade-in-up">
                    {renderForm()}
                  </div>
                </div>

                {/* Section 2: Customization */}
                <div className="pt-6 border-t border-[var(--border)]">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--warning)] text-white text-sm font-bold">2</span>
                    <h2 className="text-lg font-semibold text-[var(--foreground)]">Zaprojektuj kod QR <span className="text-[var(--foreground-muted)] font-normal">(opcjonalnie)</span></h2>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-[var(--border)] mb-4">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
                          activeTab === tab.id
                            ? 'border-[var(--primary)] text-[var(--primary)] font-semibold'
                            : 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-[160px]">
                    {activeTab === 'sticker' && (
                      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-11 gap-2">
                        {stickerTemplates.map((sticker) => (
                          <button
                            key={sticker.id}
                            onClick={() => setSelectedSticker(sticker.id)}
                            className={`aspect-square rounded-lg border-2 p-1 transition-all flex items-center justify-center ${
                              selectedSticker === sticker.id
                                ? 'border-[var(--success)] bg-[var(--success)]/5'
                                : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                            }`}
                            title={sticker.label}
                          >
                            <div className="w-full h-full bg-[var(--background-surface)] rounded flex items-center justify-center text-[7px] font-bold text-[var(--foreground-muted)]">
                              {sticker.id === 'none' ? (
                                <NoStickerIcon className="w-5 h-5" />
                              ) : (
                                <div className="text-center">
                                  <StickerIcon icon={sticker.icon} className="w-3.5 h-3.5 mx-auto mb-0.5" />
                                  <span className="block truncate px-0.5 leading-tight">{sticker.text}</span>
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {activeTab === 'color' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                          {colorPresets.map((preset, idx) => (
                            <button
                              key={idx}
                              onClick={() => { setDotColor(preset.dots); setBackgroundColor(preset.bg); setCornerSquareColor(preset.cornerSquare); setCornerDotColor(preset.cornerDot) }}
                              className={`aspect-square rounded-lg border-2 p-1 transition-all ${
                                dotColor === preset.dots && cornerSquareColor === preset.cornerSquare
                                  ? 'border-[var(--success)]'
                                  : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                              }`}
                            >
                              <div className="w-full h-full rounded" style={{ background: `linear-gradient(135deg, ${preset.dots} 50%, ${preset.cornerSquare} 50%)` }} />
                            </button>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                          <div>
                            <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">Kropki</label>
                            <div className="flex items-center gap-2">
                              <input type="color" value={dotColor} onChange={(e) => setDotColor(e.target.value)} className="w-8 h-8 rounded border border-[var(--border)] cursor-pointer" />
                              <input type="text" value={dotColor} onChange={(e) => setDotColor(e.target.value)} className="flex-1 px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--background-surface)]" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">Ramka narożnika</label>
                            <div className="flex items-center gap-2">
                              <input type="color" value={cornerSquareColor} onChange={(e) => setCornerSquareColor(e.target.value)} className="w-8 h-8 rounded border border-[var(--border)] cursor-pointer" />
                              <input type="text" value={cornerSquareColor} onChange={(e) => setCornerSquareColor(e.target.value)} className="flex-1 px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--background-surface)]" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">Środek narożnika</label>
                            <div className="flex items-center gap-2">
                              <input type="color" value={cornerDotColor} onChange={(e) => setCornerDotColor(e.target.value)} className="w-8 h-8 rounded border border-[var(--border)] cursor-pointer" />
                              <input type="text" value={cornerDotColor} onChange={(e) => setCornerDotColor(e.target.value)} className="flex-1 px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--background-surface)]" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">Tło</label>
                            <div className="flex items-center gap-2">
                              <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-8 h-8 rounded border border-[var(--border)] cursor-pointer" />
                              <input type="text" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="flex-1 px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--background-surface)]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'shapes' && (
                      <div className="space-y-5">
                        {/* Dot shapes (Kropki) */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-[var(--foreground-muted)]">Kropki</label>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg border-2 border-[var(--border)] overflow-hidden shadow-sm" style={{ backgroundColor: dotColor }}>
                                <input type="color" value={dotColor} onChange={(e) => setDotColor(e.target.value)} className="w-12 h-12 -m-2 cursor-pointer" />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-6 gap-2">
                            {dotTypes.map((item) => (
                              <button
                                key={item.type}
                                onClick={() => setDotType(item.type)}
                                className={`aspect-square rounded-lg border-2 p-2 transition-all flex items-center justify-center ${
                                  dotType === item.type
                                    ? 'border-[var(--success)] bg-[var(--success)]/5'
                                    : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                                }`}
                                title={item.label}
                              >
                                <ShapePreviewIcon dots={item.type} className="w-6 h-6" />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Corner Frame (Ramka narożnika) */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-[var(--foreground-muted)]">Ramka narożnika</label>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg border-2 border-[var(--border)] overflow-hidden shadow-sm" style={{ backgroundColor: cornerSquareColor }}>
                                <input type="color" value={cornerSquareColor} onChange={(e) => setCornerSquareColor(e.target.value)} className="w-12 h-12 -m-2 cursor-pointer" />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-6 gap-2">
                            {cornerSquareTypes.map((item) => (
                              <button
                                key={item.type}
                                onClick={() => setCornerSquareType(item.type)}
                                className={`aspect-square rounded-lg border-2 p-2 transition-all flex items-center justify-center ${
                                  cornerSquareType === item.type
                                    ? 'border-[var(--success)] bg-[var(--success)]/5'
                                    : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                                }`}
                                title={item.label}
                              >
                                <CornerSquarePreviewIcon type={item.type} className="w-6 h-6" />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Corner Dot (Środek narożnika) */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-[var(--foreground-muted)]">Środek narożnika</label>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg border-2 border-[var(--border)] overflow-hidden shadow-sm" style={{ backgroundColor: cornerDotColor }}>
                                <input type="color" value={cornerDotColor} onChange={(e) => setCornerDotColor(e.target.value)} className="w-12 h-12 -m-2 cursor-pointer" />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-6 gap-2">
                            {cornerDotTypes.map((item) => (
                              <button
                                key={item.type}
                                onClick={() => setCornerDotType(item.type)}
                                className={`aspect-square rounded-lg border-2 p-2 transition-all flex items-center justify-center ${
                                  cornerDotType === item.type
                                    ? 'border-[var(--success)] bg-[var(--success)]/5'
                                    : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                                }`}
                                title={item.label}
                              >
                                <CornerDotPreviewIcon type={item.type} className="w-6 h-6" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'logo' && (
                      <div>
                        {!logo ? (
                          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[var(--border)] rounded-xl cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--primary-muted)] transition-all">
                            <UploadIcon className="w-7 h-7 text-[var(--foreground-muted)] mb-1" />
                            <span className="text-sm text-[var(--foreground-muted)]">Dodaj logo</span>
                            <span className="text-xs text-[var(--foreground-subtle)]">PNG, JPG, SVG</span>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                          </label>
                        ) : (
                          <div className="flex items-center gap-4 p-4 bg-[var(--background-surface)] rounded-xl">
                            <img src={logo} alt="Logo" className="w-14 h-14 object-contain rounded-lg border border-[var(--border)]" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[var(--foreground)]">Logo dodane</p>
                              <button onClick={() => { setLogo(null); if (fileInputRef.current) fileInputRef.current.value = '' }} className="text-sm text-[var(--error)] hover:underline">Usuń</button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Preview */}
              <div className="lg:col-span-4 p-6 lg:p-8 bg-[var(--background-surface)] border-t lg:border-t-0 lg:border-l border-[var(--border)] lg:sticky lg:top-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--success)] text-white text-sm font-bold">3</span>
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">Pobierz swój kod QR</h2>
                </div>

                {/* QR Preview */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    {currentSticker?.frame && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-10">
                        <div className="bg-black text-white px-3 py-1 rounded-t-lg text-[10px] font-bold flex items-center gap-1.5">
                          <StickerIcon icon={currentSticker.icon} className="w-3 h-3" />
                          {currentSticker.text}
                        </div>
                        <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[6px] border-l-transparent border-r-transparent border-t-black mx-auto" />
                      </div>
                    )}
                    <div className={`bg-white rounded-xl p-4 shadow-lg border border-[var(--border)] ${currentSticker?.frame ? 'mt-3' : ''}`}>
                      <div ref={qrRef} className="w-[180px] h-[180px] flex items-center justify-center" />
                    </div>
                  </div>
                </div>

                {/* Download */}
                {!showEmailCapture ? (
                  <Button
                    variant="gradient"
                    size="lg"
                    className={`w-full ${!isFormValid() ? 'opacity-50' : ''}`}
                    style={{ background: isFormValid() ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : '#9ca3af' }}
                    onClick={handleDownloadClick}
                    disabled={!isFormValid()}
                  >
                    {isFormValid() ? 'Pobierz QR' : 'Wypełnij formularz'}
                  </Button>
                ) : (
                  <div className="space-y-3 animate-fade-in-up">
                    {sendStatus === 'success' ? (
                      <div className="text-center p-4 bg-[var(--success)]/10 rounded-xl">
                        <CheckIcon className="w-8 h-8 text-[var(--success)] mx-auto mb-2" />
                        <p className="text-sm font-medium text-[var(--success)]">Wysłano na {userEmail}!</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-[var(--foreground-muted)] text-center">Podaj e-mail, aby otrzymać kod QR</p>
                        <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="twoj@email.com" className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-white text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--success)]" />
                        <Button variant="gradient" size="lg" className="w-full" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }} onClick={handleSendToEmail} disabled={isSending || !userEmail.includes('@')}>
                          {isSending ? 'Wysyłanie...' : 'Wyślij na e-mail'}
                        </Button>
                        {sendStatus === 'error' && <p className="text-xs text-[var(--error)] text-center">Błąd. Spróbuj ponownie.</p>}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Icons
function CheckIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
}

function UploadIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
}

function NoStickerIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M6 6l12 12" /></svg>
}

function TypeIcon({ type, className }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    globe: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.916 17.916 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />,
    file: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />,
    mail: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />,
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

function StickerIcon({ icon, className }: { icon?: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    phone: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />,
    arrow: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    qr: <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v3h-3v-3zm-3 3h3v3h-3v-3zm3 3h3v3h-3v-3z" />,
    heart: <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />,
    globe: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-18c2.485 0 4.5 4.03 4.5 9s-2.015 9-4.5 9m0-18c-2.485 0-4.5 4.03-4.5 9s2.015 9 4.5 9M3 12h18" />,
    mail: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />,
    utensils: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m18-4.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    wifi: <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />,
    download: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />,
    shop: <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />,
  }
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">{icons[icon || '']}</svg>
}

function ShapePreviewIcon({ dots, className }: { dots: DotType; className?: string }) {
  const shapes: Record<string, React.ReactNode> = {
    square: <><rect x="2" y="2" width="6" height="6" fill="currentColor"/><rect x="10" y="2" width="6" height="6" fill="currentColor"/><rect x="2" y="10" width="6" height="6" fill="currentColor"/><rect x="10" y="10" width="6" height="6" fill="currentColor"/></>,
    dots: <><circle cx="5" cy="5" r="3" fill="currentColor"/><circle cx="13" cy="5" r="3" fill="currentColor"/><circle cx="5" cy="13" r="3" fill="currentColor"/><circle cx="13" cy="13" r="3" fill="currentColor"/></>,
    rounded: <><rect x="2" y="2" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="10" y="2" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="2" y="10" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="10" y="10" width="6" height="6" rx="1.5" fill="currentColor"/></>,
    'extra-rounded': <><rect x="2" y="2" width="6" height="6" rx="3" fill="currentColor"/><rect x="10" y="2" width="6" height="6" rx="3" fill="currentColor"/><rect x="2" y="10" width="6" height="6" rx="3" fill="currentColor"/><rect x="10" y="10" width="6" height="6" rx="3" fill="currentColor"/></>,
    classy: <><path d="M2 2h6v6H2z" fill="currentColor"/><path d="M10 2h6v6h-6z" fill="currentColor"/><path d="M2 10h6v6H2z" fill="currentColor"/><path d="M10 10h6v6h-6z" fill="currentColor"/></>,
    'classy-rounded': <><rect x="2" y="2" width="6" height="6" rx="2" fill="currentColor"/><rect x="10" y="2" width="6" height="6" rx="2" fill="currentColor"/><rect x="2" y="10" width="6" height="6" rx="2" fill="currentColor"/><rect x="10" y="10" width="6" height="6" rx="2" fill="currentColor"/></>,
  }
  return <svg className={className} viewBox="0 0 18 18" fill="none">{shapes[dots] || shapes.square}</svg>
}

function CornerSquarePreviewIcon({ type, className }: { type: CornerSquareType; className?: string }) {
  const shapes: Record<string, React.ReactNode> = {
    square: <rect x="2" y="2" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none"/>,
    'extra-rounded': <rect x="2" y="2" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="3" fill="none"/>,
    dot: <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="3" fill="none"/>,
  }
  return <svg className={className} viewBox="0 0 18 18" fill="none">{shapes[type] || shapes.square}</svg>
}

function CornerDotPreviewIcon({ type, className }: { type: CornerDotType; className?: string }) {
  const shapes: Record<string, React.ReactNode> = {
    square: <rect x="4" y="4" width="10" height="10" fill="currentColor"/>,
    dot: <circle cx="9" cy="9" r="5" fill="currentColor"/>,
  }
  return <svg className={className} viewBox="0 0 18 18" fill="none">{shapes[type] || shapes.square}</svg>
}
