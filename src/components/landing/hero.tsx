'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui'
import QRCodeStyling, { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling'

type TabType = 'content' | 'style' | 'colors' | 'logo'

const dotTypes: { value: DotType; label: string }[] = [
  { value: 'rounded', label: 'Zaokrąglone' },
  { value: 'dots', label: 'Kropki' },
  { value: 'classy', label: 'Klasyczne' },
  { value: 'classy-rounded', label: 'Klasyczne zaokr.' },
  { value: 'square', label: 'Kwadratowe' },
  { value: 'extra-rounded', label: 'Bardzo zaokr.' },
]

const cornerTypes: { value: CornerSquareType; label: string }[] = [
  { value: 'extra-rounded', label: 'Bardzo zaokr.' },
  { value: 'dot', label: 'Kropka' },
  { value: 'square', label: 'Kwadrat' },
]

const cornerDotTypes: { value: CornerDotType; label: string }[] = [
  { value: 'dot', label: 'Kropka' },
  { value: 'square', label: 'Kwadrat' },
]

export function Hero() {
  const [activeTab, setActiveTab] = useState<TabType>('content')
  const [url, setUrl] = useState('https://twoja-strona.pl')
  const [dotColor, setDotColor] = useState('#8b5cf6')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [cornerSquareColor, setCornerSquareColor] = useState('#06b6d4')
  const [cornerDotColor, setCornerDotColor] = useState('#8b5cf6')
  const [dotType, setDotType] = useState<DotType>('rounded')
  const [cornerSquareType, setCornerSquareType] = useState<CornerSquareType>('extra-rounded')
  const [cornerDotType, setCornerDotType] = useState<CornerDotType>('dot')
  const [logo, setLogo] = useState<string | null>(null)
  const [logoSize, setLogoSize] = useState(0.4)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const qrRef = useRef<HTMLDivElement>(null)
  const qrCodeRef = useRef<QRCodeStyling | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize QR code
  useEffect(() => {
    qrCodeRef.current = new QRCodeStyling({
      width: 220,
      height: 220,
      type: 'svg',
      data: url,
      dotsOptions: {
        color: dotColor,
        type: dotType,
      },
      cornersSquareOptions: {
        color: cornerSquareColor,
        type: cornerSquareType,
      },
      cornersDotOptions: {
        color: cornerDotColor,
        type: cornerDotType,
      },
      backgroundOptions: {
        color: backgroundColor,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 10,
        imageSize: logoSize,
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
        data: url || 'https://twoja-strona.pl',
        dotsOptions: {
          color: dotColor,
          type: dotType,
        },
        cornersSquareOptions: {
          color: cornerSquareColor,
          type: cornerSquareType,
        },
        cornersDotOptions: {
          color: cornerDotColor,
          type: cornerDotType,
        },
        backgroundOptions: {
          color: backgroundColor,
        },
        image: logo || undefined,
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 10,
          imageSize: logoSize,
        },
      })
    }
  }, [url, dotColor, backgroundColor, cornerSquareColor, cornerDotColor, dotType, cornerSquareType, cornerDotType, logo, logoSize])

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

  const removeLogo = () => {
    setLogo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDownloadClick = () => {
    setShowEmailForm(true)
    setSendStatus('idle')
  }

  const handleSendEmail = async () => {
    if (!email.trim() || !email.includes('@')) return

    setIsSending(true)
    setSendStatus('idle')

    try {
      // Get QR code as base64
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
          email,
          qrCodeBase64: base64,
          url,
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

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'content', label: 'Treść', icon: <LinkIcon className="w-4 h-4" /> },
    { id: 'style', label: 'Styl', icon: <StyleIcon className="w-4 h-4" /> },
    { id: 'colors', label: 'Kolory', icon: <ColorIcon className="w-4 h-4" /> },
    { id: 'logo', label: 'Logo', icon: <ImageIcon className="w-4 h-4" /> },
  ]

  return (
    <section className="pt-28 pb-16 sm:pt-32 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl animate-fade-in-up">
            <span className="text-[var(--foreground)]">Stwórz </span>
            <span className="gradient-text">swój kod QR</span>
          </h1>
          <p className="mt-3 text-base text-[var(--foreground-muted)] max-w-xl mx-auto animate-fade-in-up animate-delay-100">
            Dostosuj wygląd, dodaj logo i pobierz w wysokiej jakości
          </p>
        </div>

        {/* Generator */}
        <div className="max-w-5xl mx-auto animate-fade-in-up animate-delay-200">
          <div className="bg-white rounded-2xl shadow-xl border border-[var(--border)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              {/* Left - Options */}
              <div className="lg:col-span-3 p-6 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-[var(--background-surface)] rounded-xl mb-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-white text-[var(--foreground)] shadow-sm'
                          : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[280px]">
                  {activeTab === 'content' && (
                    <div className="space-y-4 animate-fade-in-up">
                      <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                          Adres URL
                        </label>
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://twoja-strona.pl"
                          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background-surface)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                        />
                      </div>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        Wprowadź link do strony, który ma być zakodowany w kodzie QR.
                      </p>
                    </div>
                  )}

                  {activeTab === 'style' && (
                    <div className="space-y-5 animate-fade-in-up">
                      <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                          Styl kropek
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {dotTypes.map((type) => (
                            <button
                              key={type.value}
                              onClick={() => setDotType(type.value)}
                              className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                                dotType === type.value
                                  ? 'border-[var(--primary)] bg-[var(--primary-muted)] text-[var(--primary)]'
                                  : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                              }`}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                          Styl narożników
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {cornerTypes.map((type) => (
                            <button
                              key={type.value}
                              onClick={() => setCornerSquareType(type.value)}
                              className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                                cornerSquareType === type.value
                                  ? 'border-[var(--primary)] bg-[var(--primary-muted)] text-[var(--primary)]'
                                  : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                              }`}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                          Styl środka narożników
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {cornerDotTypes.map((type) => (
                            <button
                              key={type.value}
                              onClick={() => setCornerDotType(type.value)}
                              className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                                cornerDotType === type.value
                                  ? 'border-[var(--primary)] bg-[var(--primary-muted)] text-[var(--primary)]'
                                  : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                              }`}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'colors' && (
                    <div className="space-y-5 animate-fade-in-up">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                            Kolor kropek
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={dotColor}
                              onChange={(e) => setDotColor(e.target.value)}
                              className="w-12 h-12 rounded-lg border border-[var(--border)] cursor-pointer"
                            />
                            <input
                              type="text"
                              value={dotColor}
                              onChange={(e) => setDotColor(e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background-surface)] text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                            Kolor tła
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="w-12 h-12 rounded-lg border border-[var(--border)] cursor-pointer"
                            />
                            <input
                              type="text"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background-surface)] text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                            Kolor narożników
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={cornerSquareColor}
                              onChange={(e) => setCornerSquareColor(e.target.value)}
                              className="w-12 h-12 rounded-lg border border-[var(--border)] cursor-pointer"
                            />
                            <input
                              type="text"
                              value={cornerSquareColor}
                              onChange={(e) => setCornerSquareColor(e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background-surface)] text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                            Kolor środka narożników
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={cornerDotColor}
                              onChange={(e) => setCornerDotColor(e.target.value)}
                              className="w-12 h-12 rounded-lg border border-[var(--border)] cursor-pointer"
                            />
                            <input
                              type="text"
                              value={cornerDotColor}
                              onChange={(e) => setCornerDotColor(e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background-surface)] text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'logo' && (
                    <div className="space-y-5 animate-fade-in-up">
                      <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                          Logo w środku kodu QR
                        </label>
                        {!logo ? (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--border)] rounded-xl cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--primary-muted)] transition-all">
                            <UploadIcon className="w-8 h-8 text-[var(--foreground-muted)] mb-2" />
                            <span className="text-sm text-[var(--foreground-muted)]">Kliknij, aby dodać logo</span>
                            <span className="text-xs text-[var(--foreground-subtle)] mt-1">PNG, JPG, SVG</span>
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
                            <img src={logo} alt="Logo" className="w-16 h-16 object-contain rounded-lg" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[var(--foreground)]">Logo dodane</p>
                              <button
                                onClick={removeLogo}
                                className="text-sm text-[var(--error)] hover:underline mt-1"
                              >
                                Usuń logo
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      {logo && (
                        <div>
                          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                            Rozmiar logo: {Math.round(logoSize * 100)}%
                          </label>
                          <input
                            type="range"
                            min="0.2"
                            max="0.5"
                            step="0.05"
                            value={logoSize}
                            onChange={(e) => setLogoSize(parseFloat(e.target.value))}
                            className="w-full accent-[var(--primary)]"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right - Preview */}
              <div className="lg:col-span-2 p-6 bg-[var(--background-surface)] flex flex-col items-center justify-center">
                <div className="bg-white rounded-2xl p-5 shadow-lg border border-[var(--border)]">
                  <div
                    ref={qrRef}
                    className="w-[220px] h-[220px] flex items-center justify-center"
                  />
                </div>
                <p className="mt-4 text-sm text-[var(--foreground-muted)]">Podgląd kodu QR</p>

                {!showEmailForm ? (
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full mt-6 shadow-lg shadow-[var(--primary)]/25"
                    onClick={handleDownloadClick}
                  >
                    Pobierz kod QR
                  </Button>
                ) : (
                  <div className="w-full mt-6 space-y-3 animate-fade-in-up">
                    {sendStatus === 'success' ? (
                      <div className="text-center p-4 bg-[var(--success)]/10 rounded-xl">
                        <CheckIcon className="w-8 h-8 text-[var(--success)] mx-auto mb-2" />
                        <p className="text-sm font-medium text-[var(--success)]">
                          Kod QR został wysłany na {email}
                        </p>
                      </div>
                    ) : (
                      <>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Twój adres email"
                          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                        />
                        <Button
                          variant="gradient"
                          size="lg"
                          className="w-full shadow-lg shadow-[var(--primary)]/25"
                          onClick={handleSendEmail}
                          disabled={isSending || !email.includes('@')}
                        >
                          {isSending ? 'Wysyłanie...' : 'Wyślij na email'}
                        </Button>
                        {sendStatus === 'error' && (
                          <p className="text-sm text-[var(--error)] text-center">
                            Wystąpił błąd. Spróbuj ponownie.
                          </p>
                        )}
                        <p className="text-xs text-center text-[var(--foreground-muted)]">
                          Otrzymasz kod QR w wysokiej jakości na swoją skrzynkę
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features hint */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-[var(--foreground-muted)] animate-fade-in-up animate-delay-300">
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-[var(--success)]" />
            <span>Darmowe kody QR</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-[var(--success)]" />
            <span>Wysoka jakość PNG</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-[var(--success)]" />
            <span>Bez znaków wodnych</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
  )
}

function StyleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
    </svg>
  )
}

function ColorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
    </svg>
  )
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
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
