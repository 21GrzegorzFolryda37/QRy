'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui'
import QRCodeStyling, { DotType, CornerSquareType } from 'qr-code-styling'

type TabType = 'sticker' | 'color' | 'shapes' | 'logo'

const stickerTemplates = [
  { id: 'none', label: 'Brak', frame: false },
  { id: 'scan-me-1', label: 'Scan Me', frame: true, text: 'SCAN ME', icon: 'phone' },
  { id: 'scan-me-2', label: 'Scan Me Arrow', frame: true, text: 'SCAN ME', icon: 'arrow' },
  { id: 'scan-here', label: 'Scan Here', frame: true, text: 'SKANUJ TUTAJ', icon: 'qr' },
  { id: 'follow-us', label: 'Follow Us', frame: true, text: 'OBSERWUJ NAS', icon: 'heart' },
  { id: 'visit-us', label: 'Visit Us', frame: true, text: 'ODWIEDŹ NAS', icon: 'globe' },
  { id: 'contact', label: 'Contact', frame: true, text: 'KONTAKT', icon: 'mail' },
  { id: 'menu', label: 'Menu', frame: true, text: 'MENU', icon: 'utensils' },
  { id: 'wifi', label: 'WiFi', frame: true, text: 'WIFI', icon: 'wifi' },
]

const colorPresets = [
  { dots: '#000000', bg: '#ffffff', corners: '#000000' },
  { dots: '#8b5cf6', bg: '#ffffff', corners: '#06b6d4' },
  { dots: '#1e40af', bg: '#ffffff', corners: '#3b82f6' },
  { dots: '#059669', bg: '#ffffff', corners: '#10b981' },
  { dots: '#dc2626', bg: '#ffffff', corners: '#f87171' },
  { dots: '#ea580c', bg: '#ffffff', corners: '#fb923c' },
  { dots: '#7c3aed', bg: '#faf5ff', corners: '#a855f7' },
  { dots: '#0891b2', bg: '#ecfeff', corners: '#22d3ee' },
]

const shapePresets: { dots: DotType; corners: CornerSquareType; label: string }[] = [
  { dots: 'square', corners: 'square', label: 'Kwadrat' },
  { dots: 'rounded', corners: 'extra-rounded', label: 'Zaokrąglone' },
  { dots: 'dots', corners: 'dot', label: 'Kropki' },
  { dots: 'classy', corners: 'square', label: 'Klasyczne' },
  { dots: 'classy-rounded', corners: 'extra-rounded', label: 'Eleganckie' },
  { dots: 'extra-rounded', corners: 'extra-rounded', label: 'Okrągłe' },
]

export function Hero() {
  const [activeTab, setActiveTab] = useState<TabType>('sticker')

  // Form fields
  const [emailTo, setEmailTo] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')

  // QR customization
  const [selectedSticker, setSelectedSticker] = useState('scan-me-1')
  const [dotColor, setDotColor] = useState('#8b5cf6')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [cornerColor, setCornerColor] = useState('#06b6d4')
  const [dotType, setDotType] = useState<DotType>('rounded')
  const [cornerType, setCornerType] = useState<CornerSquareType>('extra-rounded')
  const [logo, setLogo] = useState<string | null>(null)

  // Download state
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const qrRef = useRef<HTMLDivElement>(null)
  const qrCodeRef = useRef<QRCodeStyling | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Generate mailto link
  const getMailtoLink = () => {
    const subject = encodeURIComponent(emailSubject)
    const body = encodeURIComponent(emailBody)
    return `mailto:${emailTo}?subject=${subject}&body=${body}`
  }

  // Initialize QR code
  useEffect(() => {
    qrCodeRef.current = new QRCodeStyling({
      width: 200,
      height: 200,
      type: 'svg',
      data: 'mailto:example@email.com',
      dotsOptions: {
        color: dotColor,
        type: dotType,
      },
      cornersSquareOptions: {
        color: cornerColor,
        type: cornerType,
      },
      cornersDotOptions: {
        color: cornerColor,
        type: 'dot',
      },
      backgroundOptions: {
        color: backgroundColor,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 8,
        imageSize: 0.35,
      },
    })

    if (qrRef.current) {
      qrRef.current.innerHTML = ''
      qrCodeRef.current.append(qrRef.current)
    }
  }, [])

  // Update QR code when options change
  useEffect(() => {
    if (qrCodeRef.current) {
      qrCodeRef.current.update({
        data: emailTo ? getMailtoLink() : 'mailto:example@email.com',
        dotsOptions: {
          color: dotColor,
          type: dotType,
        },
        cornersSquareOptions: {
          color: cornerColor,
          type: cornerType,
        },
        cornersDotOptions: {
          color: cornerColor,
          type: 'dot',
        },
        backgroundOptions: {
          color: backgroundColor,
        },
        image: logo || undefined,
      })
    }
  }, [emailTo, emailSubject, emailBody, dotColor, backgroundColor, cornerColor, dotType, cornerType, logo])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogo(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleColorPreset = (preset: typeof colorPresets[0]) => {
    setDotColor(preset.dots)
    setBackgroundColor(preset.bg)
    setCornerColor(preset.corners)
  }

  const handleShapePreset = (preset: typeof shapePresets[0]) => {
    setDotType(preset.dots)
    setCornerType(preset.corners)
  }

  const handleDownloadClick = () => {
    if (!emailTo) {
      alert('Wprowadź adres e-mail do zakodowania')
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
        body: JSON.stringify({
          email: userEmail,
          qrCodeBase64: base64,
          url: getMailtoLink(),
        }),
      })

      if (response.ok) {
        setSendStatus('success')
      } else {
        setSendStatus('error')
      }
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

  return (
    <section className="pt-28 pb-16 sm:pt-32 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl animate-fade-in-up">
            <span className="text-[var(--foreground)]">Darmowy generator </span>
            <span className="gradient-text">kodów QR</span>
          </h1>
          <p className="mt-3 text-base text-[var(--foreground-muted)] max-w-xl mx-auto animate-fade-in-up animate-delay-100">
            Stwórz profesjonalny kod QR w kilka sekund
          </p>
        </div>

        {/* Generator Card */}
        <div className="max-w-6xl mx-auto animate-fade-in-up animate-delay-200">
          <div className="bg-white rounded-2xl shadow-xl border border-[var(--border)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">

              {/* Left Column - Form & Customization (65%) */}
              <div className="lg:col-span-8 p-6 lg:p-8 space-y-8">

                {/* Section 1: Email Form */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--warning)] text-white text-sm font-bold">1</span>
                    <h2 className="text-lg font-semibold text-[var(--foreground)]">Przekształć swój adres e-mail w kod QR</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Adres e-mail</label>
                        <input
                          type="email"
                          value={emailTo}
                          onChange={(e) => setEmailTo(e.target.value)}
                          placeholder="twojadres@email.com"
                          className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-white text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Temat wiadomości</label>
                        <input
                          type="text"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          placeholder="Temat e-maila"
                          className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-white text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-sm font-medium text-[var(--foreground-muted)]">Treść wiadomości</label>
                        <span className="text-xs text-[var(--foreground-subtle)]">{emailBody.length}/500</span>
                      </div>
                      <textarea
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value.slice(0, 500))}
                        placeholder="Wpisz domyślną treść wiadomości..."
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-white text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: QR Customization */}
                <div>
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
                            ? 'border-[var(--primary)] text-[var(--primary)]'
                            : 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-[180px]">
                    {activeTab === 'sticker' && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2">
                        {stickerTemplates.map((sticker) => (
                          <button
                            key={sticker.id}
                            onClick={() => setSelectedSticker(sticker.id)}
                            className={`aspect-square rounded-lg border-2 p-1.5 transition-all flex items-center justify-center ${
                              selectedSticker === sticker.id
                                ? 'border-[var(--success)] bg-[var(--success)]/5'
                                : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                            }`}
                            title={sticker.label}
                          >
                            <div className="w-full h-full bg-[var(--background-surface)] rounded flex items-center justify-center text-[8px] font-bold text-[var(--foreground-muted)]">
                              {sticker.frame ? (
                                <div className="text-center">
                                  <StickerIcon icon={sticker.icon} className="w-4 h-4 mx-auto mb-0.5" />
                                  <span className="block truncate px-0.5">{sticker.text}</span>
                                </div>
                              ) : (
                                <QrMiniIcon className="w-6 h-6" />
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
                              onClick={() => handleColorPreset(preset)}
                              className={`aspect-square rounded-lg border-2 p-1 transition-all ${
                                dotColor === preset.dots && cornerColor === preset.corners
                                  ? 'border-[var(--success)]'
                                  : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                              }`}
                            >
                              <div
                                className="w-full h-full rounded"
                                style={{ background: `linear-gradient(135deg, ${preset.dots} 50%, ${preset.corners} 50%)` }}
                              />
                            </button>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-2">
                          <div>
                            <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">Kropki</label>
                            <div className="flex items-center gap-2">
                              <input type="color" value={dotColor} onChange={(e) => setDotColor(e.target.value)} className="w-8 h-8 rounded border border-[var(--border)] cursor-pointer" />
                              <input type="text" value={dotColor} onChange={(e) => setDotColor(e.target.value)} className="flex-1 px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--background-surface)]" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">Narożniki</label>
                            <div className="flex items-center gap-2">
                              <input type="color" value={cornerColor} onChange={(e) => setCornerColor(e.target.value)} className="w-8 h-8 rounded border border-[var(--border)] cursor-pointer" />
                              <input type="text" value={cornerColor} onChange={(e) => setCornerColor(e.target.value)} className="flex-1 px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--background-surface)]" />
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
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {shapePresets.map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleShapePreset(preset)}
                            className={`aspect-square rounded-lg border-2 p-2 transition-all flex flex-col items-center justify-center gap-1 ${
                              dotType === preset.dots && cornerType === preset.corners
                                ? 'border-[var(--success)] bg-[var(--success)]/5'
                                : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                            }`}
                          >
                            <ShapePreviewIcon dots={preset.dots} className="w-8 h-8" />
                            <span className="text-[10px] text-[var(--foreground-muted)]">{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {activeTab === 'logo' && (
                      <div>
                        {!logo ? (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--border)] rounded-xl cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--primary-muted)] transition-all">
                            <UploadIcon className="w-8 h-8 text-[var(--foreground-muted)] mb-2" />
                            <span className="text-sm text-[var(--foreground-muted)]">Kliknij, aby dodać logo</span>
                            <span className="text-xs text-[var(--foreground-subtle)] mt-1">PNG, JPG, SVG (max 2MB)</span>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                          </label>
                        ) : (
                          <div className="flex items-center gap-4 p-4 bg-[var(--background-surface)] rounded-xl">
                            <img src={logo} alt="Logo" className="w-16 h-16 object-contain rounded-lg border border-[var(--border)]" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[var(--foreground)]">Logo dodane</p>
                              <button
                                onClick={() => { setLogo(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                                className="text-sm text-[var(--error)] hover:underline mt-1"
                              >
                                Usuń logo
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Preview (35%) */}
              <div className="lg:col-span-4 p-6 lg:p-8 bg-[var(--background-surface)] border-t lg:border-t-0 lg:border-l border-[var(--border)] flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--warning)] text-white text-sm font-bold">3</span>
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">Pobierz swój kod QR</h2>
                </div>

                {/* QR Preview with Sticker */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative">
                    {/* Sticker Frame */}
                    {currentSticker?.frame && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                        <div className="bg-black text-white px-4 py-1.5 rounded-t-lg text-xs font-bold flex items-center gap-2">
                          <StickerIcon icon={currentSticker.icon} className="w-4 h-4" />
                          {currentSticker.text}
                        </div>
                        <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[8px] border-l-transparent border-r-transparent border-t-black mx-auto" />
                      </div>
                    )}

                    {/* QR Code */}
                    <div className={`bg-white rounded-xl p-4 shadow-lg border border-[var(--border)] ${currentSticker?.frame ? 'mt-4' : ''}`}>
                      <div
                        ref={qrRef}
                        className="w-[200px] h-[200px] flex items-center justify-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Download Section */}
                <div className="mt-6">
                  {!showEmailCapture ? (
                    <Button
                      variant="gradient"
                      size="lg"
                      className="w-full shadow-lg shadow-[var(--success)]/25 bg-[var(--success)] hover:bg-[var(--success)]/90"
                      style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                      onClick={handleDownloadClick}
                    >
                      Pobierz QR
                    </Button>
                  ) : (
                    <div className="space-y-3 animate-fade-in-up">
                      {sendStatus === 'success' ? (
                        <div className="text-center p-4 bg-[var(--success)]/10 rounded-xl">
                          <CheckIcon className="w-8 h-8 text-[var(--success)] mx-auto mb-2" />
                          <p className="text-sm font-medium text-[var(--success)]">
                            Kod QR wysłany na {userEmail}!
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-[var(--foreground-muted)] text-center">
                            Podaj swój e-mail, aby otrzymać kod QR
                          </p>
                          <input
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            placeholder="twoj@email.com"
                            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-white text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--success)] focus:border-transparent transition-all"
                          />
                          <Button
                            variant="gradient"
                            size="lg"
                            className="w-full"
                            style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                            onClick={handleSendToEmail}
                            disabled={isSending || !userEmail.includes('@')}
                          >
                            {isSending ? 'Wysyłanie...' : 'Wyślij na e-mail'}
                          </Button>
                          {sendStatus === 'error' && (
                            <p className="text-xs text-[var(--error)] text-center">Błąd wysyłki. Spróbuj ponownie.</p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features hint */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-[var(--foreground-muted)] animate-fade-in-up animate-delay-300">
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-[var(--success)]" />
            <span>100% darmowe</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-[var(--success)]" />
            <span>Wysoka jakość PNG</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-[var(--success)]" />
            <span>Bez znaków wodnych</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-[var(--success)]" />
            <span>Bez rejestracji</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// Icons
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
  )
}

function QrMiniIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v3h-3v-3zm-3 3h3v3h-3v-3zm3 3h3v3h-3v-3z"/>
    </svg>
  )
}

function StickerIcon({ icon, className }: { icon?: string; className?: string }) {
  switch (icon) {
    case 'phone':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      )
    case 'arrow':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    case 'qr':
      return <QrMiniIcon className={className} />
    case 'heart':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      )
    case 'globe':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      )
    case 'mail':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      )
    case 'utensils':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m18-4.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    case 'wifi':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
        </svg>
      )
    default:
      return null
  }
}

function ShapePreviewIcon({ dots, className }: { dots: DotType; className?: string }) {
  const getPath = () => {
    switch (dots) {
      case 'square':
        return <><rect x="2" y="2" width="6" height="6" fill="currentColor"/><rect x="10" y="2" width="6" height="6" fill="currentColor"/><rect x="2" y="10" width="6" height="6" fill="currentColor"/><rect x="10" y="10" width="6" height="6" fill="currentColor"/></>
      case 'dots':
        return <><circle cx="5" cy="5" r="3" fill="currentColor"/><circle cx="13" cy="5" r="3" fill="currentColor"/><circle cx="5" cy="13" r="3" fill="currentColor"/><circle cx="13" cy="13" r="3" fill="currentColor"/></>
      case 'rounded':
        return <><rect x="2" y="2" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="10" y="2" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="2" y="10" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="10" y="10" width="6" height="6" rx="1.5" fill="currentColor"/></>
      case 'extra-rounded':
        return <><rect x="2" y="2" width="6" height="6" rx="3" fill="currentColor"/><rect x="10" y="2" width="6" height="6" rx="3" fill="currentColor"/><rect x="2" y="10" width="6" height="6" rx="3" fill="currentColor"/><rect x="10" y="10" width="6" height="6" rx="3" fill="currentColor"/></>
      case 'classy':
        return <><path d="M2 2h6v6H2z" fill="currentColor"/><path d="M10 2h6v6h-6z" fill="currentColor"/><path d="M2 10h6v6H2z" fill="currentColor"/><path d="M10 10h6v6h-6z" fill="currentColor"/></>
      case 'classy-rounded':
        return <><rect x="2" y="2" width="6" height="6" rx="2" fill="currentColor"/><rect x="10" y="2" width="6" height="6" rx="2" fill="currentColor"/><rect x="2" y="10" width="6" height="6" rx="2" fill="currentColor"/><rect x="10" y="10" width="6" height="6" rx="2" fill="currentColor"/></>
      default:
        return <><rect x="2" y="2" width="6" height="6" fill="currentColor"/><rect x="10" y="2" width="6" height="6" fill="currentColor"/><rect x="2" y="10" width="6" height="6" fill="currentColor"/><rect x="10" y="10" width="6" height="6" fill="currentColor"/></>
    }
  }

  return (
    <svg className={className} viewBox="0 0 18 18" fill="none">
      {getPath()}
    </svg>
  )
}
