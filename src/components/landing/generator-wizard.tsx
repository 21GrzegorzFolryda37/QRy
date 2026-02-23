'use client'

import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import { createPortal } from 'react-dom'
import { Input } from '@/components/ui'
import Link from 'next/link'
import { QrPreview } from '@/components/qr/qr-preview'
import { UnifiedAuthForm } from '@/components/auth'
import { ShapeSelector, dotsTypeOptions, cornersSquareTypeOptions, cornersDotTypeOptions } from '@/components/qr/shape-selector'
import { FrameSelector } from '@/components/qr/frame-selector'
import { GradientEditor } from '@/components/qr/gradient-editor'
import { LogoUploader, brandLogos } from '@/components/qr/logo-uploader'
import { QrStyle, DotsType, CornersSquareType, CornersDotType } from '@/types/database'
import { DEFAULT_QR_STYLE } from '@/types/qr'
import { generateQrCodeImage } from '@/lib/qr/options'
import { heroQRStarted, heroQRUrlEntered, heroQREmailSubmitted, heroQRSent, gtagReportConversion, trackHeroTypeSelected, trackHeroStep1DataEntered, trackHeroStep1Completed, trackHeroTemplateApplied, trackHeroCustomizationChanged, trackHeroStep2Completed, trackHeroDownloadClicked, trackHeroDownloadAbandoned, trackHeroEmailSubmitted, trackHeroAuthCompleted } from '@/lib/analytics'
import type QRCodeStylingType from 'qr-code-styling'

type QRType = 'website' | 'text' | 'email' | 'phone' | 'sms' | 'whatsapp' | 'vcard' | 'wifi' | 'social' | 'pdf' | 'video' | 'facebook' | 'instagram' | 'twitter' | 'bitcoin' | 'mp3' | 'appstore'
type PersonalizationTab = 'templates' | 'color' | 'shape' | 'corners' | 'frame' | 'logo' | 'more'

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

const typeContent: Record<QRType, { title: string; subtitle: string }> = {
  website: { title: 'Przekształć link do strony w kod QR', subtitle: 'Udostępniaj swoją stronę internetową w prosty sposób' },
  text: { title: 'Przekształć tekst w kod QR', subtitle: 'Udostępniaj dowolny tekst po zeskanowaniu' },
  email: { title: 'Przekształć adres e-mail w kod QR', subtitle: 'Pozwól klientom szybko się z Tobą skontaktować' },
  phone: { title: 'Numer telefonu w kodzie QR', subtitle: 'Jeden skan i połączenie gotowe' },
  sms: { title: 'Wiadomość SMS w kodzie QR', subtitle: 'Wypełniona wiadomość SMS po zeskanowaniu' },
  whatsapp: { title: 'WhatsApp w kodzie QR', subtitle: 'Rozpocznij rozmowę na WhatsApp jednym skanem' },
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

const personalizationTabs: { id: PersonalizationTab; label: string }[] = [
  { id: 'templates', label: 'Szablony' },
  { id: 'color', label: 'Kolor' },
  { id: 'shape', label: 'Kształt' },
  { id: 'corners', label: 'Rogi' },
  { id: 'frame', label: 'Ramka' },
  { id: 'logo', label: 'Logo' },
  { id: 'more', label: 'Więcej' },
]

interface BrandTemplate {
  id: string
  name: string
  logoId: string
  color: string
  style: Partial<QrStyle>
}

const brandTemplates: BrandTemplate[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    logoId: 'instagram',
    color: '#E1306C',
    style: {
      foregroundColor: '#E1306C',
      dotsType: 'random-dot',
      dotsGradient: { type: 'linear', rotation: 225, colorStops: [{ offset: 0, color: '#f77737' }, { offset: 0.4, color: '#fd5949' }, { offset: 0.7, color: '#d6249f' }, { offset: 1, color: '#405de6' }] },
      cornersSquareType: 'extra-rounded',
      cornersSquareColor: '#d6249f',
      cornersDotType: 'dot',
      cornersDotColor: '#fd5949',
    },
  },
  {
    id: 'spotify',
    name: 'Spotify',
    logoId: 'spotify',
    color: '#1DB954',
    style: {
      foregroundColor: '#1DB954',
      dotsType: 'dots',
      dotsGradient: { type: 'linear', rotation: 180, colorStops: [{ offset: 0, color: '#1DB954' }, { offset: 1, color: '#191414' }] },
      cornersSquareType: 'dot',
      cornersSquareColor: '#1DB954',
      cornersDotType: 'dot',
      cornersDotColor: '#191414',
    },
  },
  {
    id: 'facebook',
    name: 'Facebook',
    logoId: 'facebook',
    color: '#1877F2',
    style: {
      foregroundColor: '#1877F2',
      dotsType: 'rounded',
      dotsGradient: null,
      cornersSquareType: 'extra-rounded',
      cornersSquareColor: '#1877F2',
      cornersDotType: 'dot',
      cornersDotColor: '#1877F2',
    },
  },
  {
    id: 'youtube',
    name: 'YouTube',
    logoId: 'youtube',
    color: '#FF0000',
    style: {
      foregroundColor: '#FF0000',
      dotsType: 'dots',
      dotsGradient: { type: 'linear', rotation: 180, colorStops: [{ offset: 0, color: '#FF0000' }, { offset: 1, color: '#282828' }] },
      cornersSquareType: 'extra-rounded',
      cornersSquareColor: '#FF0000',
      cornersDotType: 'dot',
      cornersDotColor: '#FF0000',
    },
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    logoId: 'tiktok',
    color: '#00f2ea',
    style: {
      foregroundColor: '#000000',
      dotsType: 'rounded',
      dotsGradient: { type: 'linear', rotation: 135, colorStops: [{ offset: 0, color: '#4de8e0' }, { offset: 0.4, color: '#2b2b2b' }, { offset: 0.6, color: '#2b2b2b' }, { offset: 1, color: '#e0345b' }] },
      cornersSquareType: 'classy-rounded',
      cornersSquareColor: '#000000',
      cornersDotType: 'dot',
      cornersDotColor: '#000000',
    },
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    logoId: 'whatsapp',
    color: '#25D366',
    style: {
      foregroundColor: '#25D366',
      dotsType: 'rounded',
      dotsGradient: { type: 'linear', rotation: 180, colorStops: [{ offset: 0, color: '#25D366' }, { offset: 1, color: '#128C7E' }] },
      cornersSquareType: 'extra-rounded',
      cornersSquareColor: '#25D366',
      cornersDotType: 'dot',
      cornersDotColor: '#128C7E',
    },
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    logoId: 'linkedin',
    color: '#0A66C2',
    style: {
      foregroundColor: '#0A66C2',
      dotsType: 'square',
      dotsGradient: null,
      cornersSquareType: 'square',
      cornersSquareColor: '#0A66C2',
      cornersDotType: 'square',
      cornersDotColor: '#0A66C2',
    },
  },
  {
    id: 'x',
    name: 'X',
    logoId: 'x',
    color: '#000000',
    style: {
      foregroundColor: '#000000',
      dotsType: 'square',
      dotsGradient: null,
      cornersSquareType: 'square',
      cornersSquareColor: '#000000',
      cornersDotType: 'square',
      cornersDotColor: '#000000',
    },
  },
]

interface GeneratorWizardProps {
  initialType?: QRType
  initialUrl?: string
  initialFormData?: Record<string, string>
  initialName?: string
  onStepChange?: (step: 1 | 2 | 3) => void
}

export interface GeneratorWizardHandle {
  openSaveModal: () => void
}

export const GeneratorWizard = forwardRef<GeneratorWizardHandle, GeneratorWizardProps>(
function GeneratorWizard({ initialType, initialUrl, initialFormData, initialName, onStepChange }, ref) {
  const [selectedType, setSelectedType] = useState<QRType>(initialType ?? 'website')
  const [formData, setFormData] = useState<Record<string, string>>(initialFormData ?? (initialUrl ? { url: initialUrl } : {}))
  const [codeName, setCodeName] = useState(initialName ?? '')

  // QR Style state
  const [style, setStyle] = useState<QrStyle>(DEFAULT_QR_STYLE)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoSize, setLogoSize] = useState(45)

  // Active accordion section (one open at a time)
  const [activeAccordion, setActiveAccordion] = useState<PersonalizationTab | null>('logo')

  // Wizard step
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const wizardContainerRef = useRef<HTMLDivElement>(null)
  const accordionRef = useRef<HTMLDivElement>(null)

  // On mobile: chain accordion scroll to page when reaching top/bottom boundary
  useEffect(() => {
    const el = accordionRef.current
    if (!el) return
    let startY = 0
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY }
    const onTouchMove = (e: TouchEvent) => {
      const dy = startY - e.touches[0].clientY
      const atTop = el.scrollTop === 0
      const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 1
      if ((dy < 0 && atTop) || (dy > 0 && atBottom)) {
        // boundary reached — let page handle this scroll
        e.preventDefault()
        window.scrollBy({ top: dy, behavior: 'auto' })
      }
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
    }
  }, [step])
  const getMainInputValue = () => {
    switch (selectedType) {
      case 'website': return formData.url || ''
      case 'email': return formData.email || ''
      case 'phone': case 'sms': case 'whatsapp': return formData.phone || ''
      case 'wifi': return formData.ssid || ''
      case 'vcard': return formData.name || ''
      case 'facebook': case 'instagram': case 'twitter': return formData.username || ''
      case 'bitcoin': return formData.address || ''
      case 'text': return formData.text || ''
      default: return formData.url || ''
    }
  }

  const goToStep = (s: 1 | 2 | 3) => {
    if (s === 2 && step === 1) {
      trackHeroStep1Completed(selectedType, getMainInputValue(), startTime ?? 0)
      setStep2StartTime(Date.now())
    } else if (s === 3 && step === 2) {
      trackHeroStep2Completed({
        qrType: selectedType,
        selectedTemplate,
        hasLogo: !!logoUrl,
        qrColor: style.foregroundColor,
        bgColor: style.backgroundColor,
        dotShape: style.dotsType,
        cornerShape: style.cornersSquareType,
        hasGradient: !!style.dotsGradient,
        customizationClicks,
        step2StartTime,
        startTime: startTime ?? 0,
      })
    }
    setStep(s)
    onStepChange?.(s)
    // Scroll to top of generator on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        wizardContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }

  // QRCodeStyling library for generating QR
  const [QRCodeStyling, setQRCodeStyling] = useState<typeof QRCodeStylingType | null>(null)

  // Save state — token auto-created with debounce, modal opened via ref
  const [saveToken, setSaveToken] = useState<string | undefined>()
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string | null>(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [consents, setConsents] = useState({ terms: false, marketing: false })

  const allChecked = consents.terms && consents.marketing
  function toggleAll() {
    const next = !allChecked
    setConsents({ terms: next, marketing: next })
  }

  useImperativeHandle(ref, () => ({
    openSaveModal: () => {
      trackHeroDownloadClicked({ qrType: selectedType, codeName, startTime: startTime ?? 0 })
      setShowSaveModal(true)
      uploadQrImageForPending()
    },
  }))

  // Analytics timing
  const [startTime, setStartTime] = useState<number | null>(null)
  const hasTrackedStart = useRef(false)

  // Personalization tracking
  const [selectedTemplate, setSelectedTemplate] = useState<string>('none')
  const [customizationClicks, setCustomizationClicks] = useState(0)
  const [step2StartTime, setStep2StartTime] = useState(0)

  const getCustomizationData = () => ({
    selectedTemplate,
    hasFrame: !!style.frame,
    hasLogo: !!logoUrl,
    qrColor: style.foregroundColor,
    bgColor: style.backgroundColor,
    frameStyle: style.frame?.style || 'none',
  })

  const hasTrackedTypeSelected = useRef(false)
  const trackStart = useCallback(() => {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true
      setStartTime(Date.now())
      heroQRStarted()
    }
    // Fire type_selected on first interaction (covers default type — no click)
    if (!hasTrackedTypeSelected.current) {
      hasTrackedTypeSelected.current = true
      trackHeroTypeSelected(selectedType)
    }
  }, [selectedType])

  // Load QRCodeStyling library
  useEffect(() => {
    import('qr-code-styling').then((module) => {
      setQRCodeStyling(() => module.default)
    })
  }, [])

  // Helper to update style
  const updateStyle = (updates: Partial<QrStyle>) => {
    const key = Object.keys(updates)[0]
    const value = Object.values(updates)[0]
    if (key) {
      const valueStr = typeof value === 'object' ? (value ? 'custom' : 'none') : String(value)
      trackHeroCustomizationChanged(key, valueStr)
    }
    setStyle(prev => ({ ...prev, ...updates }))
    setCustomizationClicks(prev => prev + 1)
  }

  // Generate QR data based on selected type
  const getQRData = () => {
    switch (selectedType) {
      case 'website':
        return formData.url || 'https://example.com'
      case 'text':
        return formData.text || 'Przykładowy tekst'
      case 'email':
        return `mailto:${formData.email || ''}?subject=${encodeURIComponent(formData.subject || '')}&body=${encodeURIComponent(formData.body || '')}`
      case 'phone':
        return `tel:${formData.phone || ''}`
      case 'sms':
        return `sms:${formData.phone || ''}${formData.message ? `?body=${encodeURIComponent(formData.message)}` : ''}`
      case 'whatsapp':
        return `https://wa.me/${formData.phone || ''}${formData.message ? `?text=${encodeURIComponent(formData.message)}` : ''}`
      case 'wifi':
        return `WIFI:T:${formData.encryption || 'WPA'};S:${formData.ssid || ''};P:${formData.password || ''};;`
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${formData.name || ''}\nORG:${formData.company || ''}\nTEL:${formData.phone || ''}\nEMAIL:${formData.email || ''}\nEND:VCARD`
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

  // Upload client-side QR image to pending record (fire & forget)
  const uploadQrImageForPending = async () => {
    if (!saveToken || !QRCodeStyling) return
    try {
      const rawData = getQRData()
      // Use /r/[shortCode] redirect URL for web QR types so scans are tracked.
      // Non-web types (WiFi, vCard, tel:, mailto:, sms:) must encode raw data.
      const isWebUrl = /^https?:\/\//i.test(rawData)
      const qrUrl = isWebUrl && pendingRedirectUrl ? pendingRedirectUrl : rawData

      const dataUrl = await generateQrCodeImage(QRCodeStyling, {
        url: qrUrl,
        style: { ...style, width: 600 },
        size: 600,
        logoUrl: logoUrl || undefined,
        logoSize,
      })
      if (!dataUrl) return
      await fetch('/api/pending-qr/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signupToken: saveToken, qrCodeBase64: dataUrl }),
      })
    } catch {
      // non-blocking — silent fail
    }
  }

  // Auto-create pending QR with debounce whenever data/style changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/pending-qr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destinationUrl: getQRData(),
            qrType: selectedType,
            style,
            logoUrl: logoUrl || null,
            logoSize,
          }),
        })
        if (res.ok) {
          const { signupToken, redirectUrl } = await res.json()
          setSaveToken(signupToken)
          setPendingRedirectUrl(redirectUrl || null)
        }
      } catch {
        // silent fail
      }
    }, 600)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, selectedType, style, logoUrl, logoSize])

  const isFormValid = () => {
    switch (selectedType) {
      case 'website':
        return !!formData.url
      case 'text':
        return !!formData.text
      case 'email':
        return !!formData.email
      case 'phone':
        return !!formData.phone
      case 'sms':
        return !!formData.phone
      case 'whatsapp':
        return !!formData.phone
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

  const renderForm = () => {
    const inputClass = "w-full px-4 py-3 rounded-xl bg-[var(--background-surface)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all shadow-sm"

    switch (selectedType) {
      case 'website':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Adres URL strony</label>
              <input type="url" value={formData.url || ''} onChange={(e) => setFormData({ ...formData, url: e.target.value })} onBlur={(e) => { if (e.target.value) { heroQRUrlEntered(e.target.value, selectedTemplate); trackHeroStep1DataEntered(selectedType, e.target.value) } }} placeholder="https://twoja-strona.pl" className={inputClass} />
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
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Treść wiadomości (opcjonalnie)</label>
              <textarea
                value={formData.message || ''}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Treść SMS..."
                rows={2}
                className={inputClass}
              />
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
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Wiadomość (opcjonalnie)</label>
              <textarea
                value={formData.message || ''}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Cześć! Chciałbym..."
                rows={2}
                className={inputClass}
              />
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

  const applyTemplate = (template: BrandTemplate) => {
    const brandLogo = brandLogos.find(b => b.id === template.logoId)
    setStyle({ ...DEFAULT_QR_STYLE, ...template.style })
    setLogoUrl(brandLogo?.svg || '')
    setSelectedTemplate(template.id)
    setCustomizationClicks(prev => prev + 1)
    trackHeroTemplateApplied(template.id)
  }

  const renderPersonalizationContent = (tab: PersonalizationTab) => {
    switch (tab) {
      case 'templates':
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-2">Wybierz gotowy szablon</p>
            <div className="grid grid-cols-4 gap-2">
              {brandTemplates.map((template) => {
                const brandLogo = brandLogos.find(b => b.id === template.logoId)
                return (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className="group relative flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: template.color + '15' }}
                    >
                      {brandLogo?.svg ? (
                        <img src={brandLogo.svg} alt={template.name} className="w-8 h-8 object-contain" />
                      ) : (
                        <div
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: template.color }}
                        />
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-gray-700 group-hover:text-gray-900 truncate w-full text-center">{template.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 'color':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kolor kropek</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.foregroundColor}
                  onChange={(e) => updateStyle({ foregroundColor: e.target.value })}
                  className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={style.foregroundColor}
                  onChange={(e) => updateStyle({ foregroundColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <GradientEditor
              label="Gradient kropek"
              value={style.dotsGradient}
              onChange={(gradient) => updateStyle({ dotsGradient: gradient })}
              baseColor={style.foregroundColor}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kolor tła</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.backgroundColor}
                  onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                  className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={style.backgroundColor}
                  onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <GradientEditor
              label="Gradient tła"
              value={style.backgroundGradient}
              onChange={(gradient) => updateStyle({ backgroundGradient: gradient })}
              baseColor={style.backgroundColor}
            />
          </div>
        )

      case 'shape':
        return (
          <div className="space-y-4">
            <ShapeSelector
              value={style.dotsType}
              onChange={(value: DotsType) => updateStyle({ dotsType: value })}
              options={dotsTypeOptions}
              label="Kształt kropek"
            />
          </div>
        )

      case 'corners':
        return (
          <div className="space-y-6">
            <ShapeSelector
              value={style.cornersSquareType}
              onChange={(value: CornersSquareType) => updateStyle({ cornersSquareType: value })}
              options={cornersSquareTypeOptions}
              label="Zewnętrzne rogi"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kolor zewnętrznych rogów</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.cornersSquareColor || style.foregroundColor}
                  onChange={(e) => updateStyle({ cornersSquareColor: e.target.value })}
                  className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={style.cornersSquareColor || style.foregroundColor}
                  onChange={(e) => updateStyle({ cornersSquareColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <GradientEditor
              label="Gradient zewnętrznych rogów"
              value={style.cornersSquareGradient}
              onChange={(gradient) => updateStyle({ cornersSquareGradient: gradient })}
              baseColor={style.cornersSquareColor || style.foregroundColor}
            />

            <ShapeSelector
              value={style.cornersDotType}
              onChange={(value: CornersDotType) => updateStyle({ cornersDotType: value })}
              options={cornersDotTypeOptions}
              label="Wewnętrzne rogi"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kolor wewnętrznych rogów</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.cornersDotColor || style.foregroundColor}
                  onChange={(e) => updateStyle({ cornersDotColor: e.target.value })}
                  className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={style.cornersDotColor || style.foregroundColor}
                  onChange={(e) => updateStyle({ cornersDotColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <GradientEditor
              label="Gradient wewnętrznych rogów"
              value={style.cornersDotGradient}
              onChange={(gradient) => updateStyle({ cornersDotGradient: gradient })}
              baseColor={style.cornersDotColor || style.foregroundColor}
            />
          </div>
        )

      case 'frame':
        return (
          <FrameSelector
            value={style.frame}
            onChange={(frame) => updateStyle({ frame })}
          />
        )

      case 'logo':
        return (
          <div className="space-y-4">
            <LogoUploader
              value={logoUrl || ''}
              onChange={(url) => { setLogoUrl(url); setCustomizationClicks(prev => prev + 1) }}
              onClear={() => { setLogoUrl(null); setCustomizationClicks(prev => prev + 1) }}
            />

            {logoUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rozmiar logo: {logoSize}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={logoSize}
                  onChange={(e) => setLogoSize(Number(e.target.value))}
                  className="w-full accent-gray-900"
                />
              </div>
            )}
          </div>
        )

      case 'more':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poziom korekcji błędów</label>
              <select
                value={style.errorCorrectionLevel}
                onChange={(e) => updateStyle({ errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H' })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
              >
                <option value="L">Niski (L) - 7%</option>
                <option value="M">Średni (M) - 15%</option>
                <option value="Q">Wysoki (Q) - 25%</option>
                <option value="H">Najwyższy (H) - 30%</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Wyższy poziom = lepsze skanowanie z logo</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Margines: {style.margin}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={style.margin}
                onChange={(e) => updateStyle({ margin: Number(e.target.value) })}
                className="w-full accent-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rozmiar: {style.width}px
              </label>
              <input
                type="range"
                min="200"
                max="600"
                step="50"
                value={style.width}
                onChange={(e) => updateStyle({ width: Number(e.target.value) })}
                className="w-full accent-gray-900"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
    <div ref={wizardContainerRef} className="lg:grid lg:grid-cols-12 lg:gap-14">

      {/* Left / main: wizard content */}
      <div className="lg:col-span-7 flex flex-col min-h-[600px]">
        <StepIndicator currentStep={step} />

        {/* Step 1: Type & Data */}
        {step === 1 && (
          <div key="step-1" className="animate-fade-in-scale">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#6d28d9] text-white text-sm font-bold shadow-lg shadow-[#6d28d9]/25">1</span>
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)] font-display">Rodzaj i dane kodu</h2>
                <p className="text-sm text-[var(--foreground-muted)]">{typeContent[selectedType].subtitle}</p>
              </div>
            </div>

            {/* QR Type grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 mb-6">
              {qrTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => { setSelectedType(type.id); setFormData({}); trackStart(); trackHeroTypeSelected(type.id) }}
                  className={`flex flex-col items-center gap-2 px-2 py-3.5 rounded-xl text-sm font-medium transition-all ${
                    selectedType === type.id
                      ? 'bg-[#6d28d9] text-white shadow-md ring-2 ring-[#6d28d9]/30'
                      : 'bg-white border border-[var(--border)] text-[var(--foreground-muted)] hover:border-[#6d28d9]/50 shadow-sm'
                  }`}
                >
                  <TypeIcon type={type.icon} className="w-5 h-5" />
                  {type.label}
                </button>
              ))}
            </div>

            {/* Form for selected type */}
            <div className="mb-5" onFocus={trackStart} onBlur={(e) => { const v = (e.target as HTMLInputElement | HTMLTextAreaElement).value; if (v) trackHeroStep1DataEntered(selectedType, v) }}>
              {renderForm()}
            </div>

            {/* Code name input */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">
                Nazwa kodu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={codeName}
                onChange={(e) => setCodeName(e.target.value)}
                placeholder="np. Mój sklep"
                className="w-full px-4 py-3 rounded-xl bg-[var(--background-surface)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all shadow-sm"
              />
            </div>

            <div className="lg:hidden mt-5 pt-4 border-t border-[var(--border)]">
              <button
                onClick={() => goToStep(2)}
                disabled={!isFormValid() || !codeName}
                className="w-full px-4 py-3 rounded-xl text-sm font-bold text-white bg-[#6d28d9] hover:bg-[#5b21b6] active:bg-[#4c1d95] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-[#6d28d9]/25"
              >
                Dalej →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Personalization */}
        {step === 2 && (
          <div key="step-2" className="animate-fade-in-scale flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#6d28d9] text-white text-sm font-bold shadow-lg shadow-[#6d28d9]/25">2</span>
              <h2 className="text-lg font-semibold text-[var(--foreground)] font-display">Personalizuj wygląd</h2>
            </div>

            {/* QR preview — mobile only, static above accordion so it never scrolls away */}
            <div className="lg:hidden flex justify-center mb-3">
              <div className="rounded-xl p-2 border border-[var(--border)] shadow-sm bg-white">
                <QrPreview
                  url={getQRData()}
                  style={{ ...style, width: 160 }}
                  logoUrl={logoUrl || undefined}
                  logoSize={logoSize}
                />
              </div>
            </div>

            {/* Personalization Accordion — only this part scrolls on mobile */}
            <div ref={accordionRef} className="overflow-y-auto max-h-[45vh] lg:max-h-[620px] lg:pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#e5e7eb transparent' }}>
              <div className="border border-[var(--border)] rounded-xl overflow-hidden divide-y divide-[var(--border)]">
                {personalizationTabs.map((tab) => (
                  <div key={tab.id}>
                    <button
                      onClick={() => setActiveAccordion(activeAccordion === tab.id ? null : tab.id)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium text-[var(--foreground)] hover:bg-gray-50 transition-colors text-left"
                    >
                      <span>{tab.label}</span>
                      <svg
                        className={`w-4 h-4 text-[var(--foreground-muted)] transition-transform duration-200 shrink-0 ${activeAccordion === tab.id ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeAccordion === tab.id && (
                      <div className="px-4 pb-5 pt-2 bg-gray-50/50">
                        {renderPersonalizationContent(tab.id)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:hidden mt-4 pt-4 border-t border-[var(--border)] flex gap-3">
              <button
                onClick={() => goToStep(1)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-[var(--foreground-muted)] border border-[var(--border)] hover:bg-gray-50 transition-all"
              >
                ← Wstecz
              </button>
              <button
                onClick={() => goToStep(3)}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white bg-[#6d28d9] hover:bg-[#5b21b6] active:bg-[#4c1d95] transition-all shadow-md shadow-[#6d28d9]/25"
              >
                Dalej →
              </button>
            </div>

          </div>
        )}

        {/* Step 3: Preview — QR ready, button to save is below the card */}
        {step === 3 && (
          <div key="step-3" className="animate-fade-in-scale flex flex-col flex-1">
            {/* QR preview - mobile only (desktop has sticky right panel) */}
            <div className="relative mb-5 lg:hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-2xl blur-xl opacity-20" />
              <div className="relative flex items-center justify-center p-4 rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--primary-muted)] to-[var(--secondary-muted)] border border-[var(--border)]">
                <div className="bg-white rounded-xl p-2 shadow-lg max-w-full overflow-hidden">
                  <QrPreview
                    url={getQRData()}
                    style={style}
                    logoUrl={logoUrl || undefined}
                    logoSize={logoSize}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
              <svg className="w-8 h-8 text-[var(--success)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <p className="text-xl font-semibold text-[var(--foreground)]">Twój kod QR jest gotowy!</p>
            </div>

            <div className="lg:hidden mt-5 pt-4 border-t border-[var(--border)] flex gap-3">
              <button
                onClick={() => goToStep(2)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-[var(--foreground-muted)] border border-[var(--border)] hover:bg-gray-50 transition-all"
              >
                ← Wstecz
              </button>
              <button
                onClick={() => { trackHeroDownloadClicked({ qrType: selectedType, codeName, startTime: startTime ?? 0 }); setShowSaveModal(true); uploadQrImageForPending() }}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white bg-[#6d28d9] hover:bg-[#5b21b6] active:bg-[#4c1d95] transition-all shadow-md shadow-[#6d28d9]/25 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Pobierz swój kod QR
              </button>
            </div>
          </div>
        )}

        {/* Wizard Navigation */}
        <WizardNav
          currentStep={step}
          onGoToStep={goToStep}
          isFormValid={isFormValid() && !!codeName}
          onDownload={() => { trackHeroDownloadClicked({ qrType: selectedType, codeName, startTime: startTime ?? 0 }); setShowSaveModal(true); uploadQrImageForPending() }}
        />
      </div>

      {/* Right: sticky QR preview - desktop only */}
      <div className="hidden lg:flex lg:col-span-5 items-start justify-center pt-4">
        <div className="sticky top-8 w-full">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-2xl blur-xl opacity-20 animate-pulse-glow" />
            <div className="relative flex items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-[var(--primary-muted)] to-[var(--secondary-muted)] border border-[var(--border)]">
              <div className="bg-white rounded-xl p-3 shadow-lg">
                <QrPreview
                  url={getQRData()}
                  style={{ ...style, width: 520 }}
                  logoUrl={logoUrl || undefined}
                  logoSize={logoSize}
                />
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-[var(--foreground-subtle)]">Podgląd na żywo</p>
        </div>
      </div>

    </div>

    {/* Save modal — rendered via portal into document.body so fixed positioning works correctly */}
    {showSaveModal && createPortal(
      <div
        className="fixed inset-0 z-[9999] overflow-y-auto"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      >
        <div
          className="flex min-h-full items-center justify-center p-4 py-8"
          onClick={(e) => { if (e.target === e.currentTarget) { trackHeroDownloadAbandoned({ qrType: selectedType, startTime: startTime ?? 0 }); setShowSaveModal(false); setConsents({ terms: false, marketing: false }) } }}
        >
        <div className="w-full bg-white shadow-2xl overflow-hidden relative" style={{ maxWidth: 940, borderRadius: 20 }}>

          {/* X button */}
          <button
            onClick={() => { trackHeroDownloadAbandoned({ qrType: selectedType, startTime: startTime ?? 0 }); setShowSaveModal(false); setConsents({ terms: false, marketing: false }) }}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[rgba(124,58,237,0.15)]"
            style={{ background: 'rgba(124,58,237,0.08)' }}
          >
            <svg className="w-4 h-4" style={{ color: '#7c3aed' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Left — form + benefits */}
            <div style={{ padding: '44px 40px' }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1e1b2e', marginBottom: 6, lineHeight: 1.3 }}>
                Twój kod QR jest gotowy!
              </h2>
              <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>
                Utwórz darmowe konto aby go odebrać.
              </p>

              <UnifiedAuthForm
                signupToken={saveToken}
                redirectTo="/dashboard"
                disabled={!consents.terms}
                marketingConsent={consents.marketing}
                buttonLabel="Odbierz kod i utwórz konto →"
                onEmailSubmit={(email) => trackHeroEmailSubmitted({ qrType: selectedType, emailDomain: email.split('@')[1] ?? 'unknown', startTime: startTime ?? 0 })}
                onSuccess={(authMethod) => trackHeroAuthCompleted({
                  qrType: selectedType,
                  selectedTemplate,
                  hasLogo: !!logoUrl,
                  qrColor: style.foregroundColor,
                  bgColor: style.backgroundColor,
                  customizationClicks,
                  codeName,
                  startTime: startTime ?? 0,
                  authMethod,
                })}
                consentBlock={
                  <div style={{ marginTop: 16 }} className="rounded-lg border border-[var(--border)] p-3 bg-gray-50/60">
                    {/* Master checkbox */}
                    <label className="flex items-center gap-2 cursor-pointer group" style={{ marginBottom: 8 }}>
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={toggleAll}
                        className="w-3.5 h-3.5 rounded border-gray-300 accent-[#6d28d9] cursor-pointer shrink-0"
                      />
                      <span className="text-xs font-semibold text-[var(--foreground)] group-hover:text-[#6d28d9] transition-colors">
                        Akceptuję wszystkie poniższe zgody
                      </span>
                    </label>

                    <div className="border-t border-[var(--border)] pt-2" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {/* Required — terms */}
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consents.terms}
                          onChange={(e) => setConsents(c => ({ ...c, terms: e.target.checked }))}
                          className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 accent-[#6d28d9] cursor-pointer shrink-0"
                        />
                        <span className="text-[11px] text-[var(--foreground-muted)] leading-relaxed">
                          Akceptuję{' '}
                          <Link href="/terms" target="_blank" className="underline hover:text-[#6d28d9]">Regulamin serwisu QRenixy</Link>
                          {' '}oraz zapoznałem/am się z{' '}
                          <Link href="/privacy" target="_blank" className="underline hover:text-[#6d28d9]">Polityką prywatności</Link>.{' '}
                          <span className="text-[var(--error)] font-medium">*</span>
                        </span>
                      </label>

                      {/* Optional — marketing */}
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consents.marketing}
                          onChange={(e) => setConsents(c => ({ ...c, marketing: e.target.checked }))}
                          className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 accent-[#6d28d9] cursor-pointer shrink-0"
                        />
                        <span className="text-[11px] text-[var(--foreground-muted)] leading-relaxed">
                          Wyrażam zgodę na otrzymywanie od QRenixy informacji marketingowych dotyczących produktów i usług.
                        </span>
                      </label>
                    </div>
                  </div>
                }
              />

              {/* Benefits section */}
              <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 24, paddingTop: 20 }}>
                <p style={{ fontSize: 17, fontWeight: 700, color: '#1e1b2e', marginBottom: 16 }}>
                  Co zyskujesz z darmowym kontem?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { bold: '5 kodów QR', rest: ' — twórz i zarządzaj kodami' },
                    { bold: '1 000 skanów miesięcznie', rest: ' — śledzenie aktywności' },
                    { bold: 'Własne kolory', rest: ' — personalizacja kolorystyki kodu' },
                    { bold: 'Podstawowa analityka', rest: ' — wgląd w statystyki skanowania' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700 }}>
                        ✓
                      </div>
                      <span style={{ fontSize: 14.5 }}>
                        <strong style={{ color: '#1e1b2e' }}>{item.bold}</strong>
                        <span style={{ color: '#6b7280' }}>{item.rest}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — QR preview (hidden on mobile to keep modal compact) */}
            <div
              className="hidden md:flex flex-col items-center justify-center gap-5 md:border-l"
              style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #f0ecff 100%)', borderColor: '#eee8ff', padding: '40px 32px' }}
            >
              <div style={{ background: '#7c3aed', color: 'white', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '5px 14px', borderRadius: 8 }}>
                Twój kod QR:
              </div>
              <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 24px rgba(109,40,217,0.12)' }}>
                <QrPreview
                  url={pendingRedirectUrl || getQRData()}
                  style={{ ...style, width: 280 }}
                  logoUrl={logoUrl || undefined}
                  logoSize={logoSize}
                />
              </div>
              <p style={{ fontSize: 11, fontFamily: 'monospace', color: '#9ca3af', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
                {getQRData().length > 42 ? getQRData().slice(0, 42) + '…' : getQRData()}
              </p>
            </div>

          </div>
        </div>
        </div>
      </div>,
      document.body
    )}

    </>
  )
})

// Step Indicator component
function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const steps = [
    { num: 1, label: 'Rodzaj & dane' },
    { num: 2, label: 'Wygląd' },
    { num: 3, label: 'Wyślij' },
  ] as const

  return (
    <div className="flex items-center justify-between px-2 mb-6">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                currentStep > step.num
                  ? 'bg-[#6d28d9] text-white'
                  : currentStep === step.num
                    ? 'bg-[#6d28d9] text-white shadow-lg shadow-[#6d28d9]/40'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentStep > step.num ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.num
              )}
            </div>
            <span className={`text-xs mt-1.5 font-medium ${
              currentStep >= step.num ? 'text-[#6d28d9]' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>

          {i < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-2 mb-5 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-[#6d28d9] rounded-full transition-all duration-300"
                style={{ width: currentStep > step.num ? '100%' : '0%' }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Wizard Navigation component
function WizardNav({
  currentStep,
  onGoToStep,
  isFormValid,
  onDownload,
}: {
  currentStep: 1 | 2 | 3
  onGoToStep: (step: 1 | 2 | 3) => void
  isFormValid: boolean
  onDownload: () => void
}) {
  return (
    <div className="hidden lg:flex items-center gap-3 mt-auto pt-4 border-t border-[var(--border)]">
      {currentStep === 1 && (
        <button
          onClick={() => onGoToStep(2)}
          disabled={!isFormValid}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#6d28d9] hover:bg-[#5b21b6] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-[#6d28d9]/25"
        >
          Dalej →
        </button>
      )}
      {currentStep === 2 && (
        <>
          <button
            onClick={() => onGoToStep(1)}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--foreground-muted)] border border-[var(--border)] hover:bg-gray-50 transition-all"
          >
            ← Wstecz
          </button>
          <button
            onClick={() => onGoToStep(3)}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#6d28d9] hover:bg-[#5b21b6] transition-all shadow-md shadow-[#6d28d9]/25"
          >
            Dalej →
          </button>
        </>
      )}
      {currentStep === 3 && (
        <>
          <button
            onClick={() => onGoToStep(2)}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--foreground-muted)] border border-[var(--border)] hover:bg-gray-50 transition-all"
          >
            ← Wstecz
          </button>
          <button
            onClick={onDownload}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#6d28d9] hover:bg-[#5b21b6] transition-all shadow-md shadow-[#6d28d9]/25 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Pobierz swój kod QR
          </button>
        </>
      )}
    </div>
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
