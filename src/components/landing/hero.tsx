'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import Link from 'next/link'

type QRType = 'website' | 'text' | 'email' | 'phone' | 'sms' | 'whatsapp' | 'vcard' | 'wifi' | 'event' | 'social' | 'pdf' | 'video' | 'facebook' | 'instagram' | 'twitter' | 'bitcoin' | 'mp3' | 'appstore'

const qrTypes: { id: QRType; label: string; icon: string }[] = [
  { id: 'website', label: 'Strona www', icon: 'globe' },
  { id: 'text', label: 'Tekst', icon: 'text' },
  { id: 'email', label: 'E-mail', icon: 'mail' },
  { id: 'phone', label: 'Telefon', icon: 'phone' },
  { id: 'sms', label: 'SMS', icon: 'sms' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp' },
  { id: 'vcard', label: 'Wizytówka', icon: 'user' },
  { id: 'wifi', label: 'WiFi', icon: 'wifi' },
  { id: 'event', label: 'Wydarzenie', icon: 'calendar' },
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
  event: { title: 'Wydarzenie w kodzie QR', subtitle: 'Dodaj wydarzenie do kalendarza jednym skanem' },
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

export function Hero() {
  const [selectedType, setSelectedType] = useState<QRType>('website')
  const [formData, setFormData] = useState<Record<string, string>>({})

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
      case 'event':
        return !!formData.eventTitle
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
              <input type="url" value={formData.url || ''} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://twoja-strona.pl" className={inputClass} />
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
      case 'event':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Nazwa wydarzenia *</label>
              <input type="text" value={formData.eventTitle || ''} onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })} placeholder="Spotkanie biznesowe" className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Data</label>
                <input type="date" value={formData.eventDate || ''} onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Godzina start</label>
                <input type="time" value={formData.eventTime || ''} onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Godzina koniec</label>
                <input type="time" value={formData.eventEndTime || ''} onChange={(e) => setFormData({ ...formData, eventEndTime: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Lokalizacja</label>
              <input type="text" value={formData.eventLocation || ''} onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })} placeholder="ul. Przykładowa 1, Warszawa" className={inputClass} />
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
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-hidden bg-white">
      {/* Noise texture with violet tint */}
      <div className="absolute inset-0 noise-texture" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl font-display animate-fade-in-up animate-delay-100">
            <span className="text-[var(--foreground)]">Generator Kodów </span>
            <span className="gradient-text">QR</span>
          </h1>
          <p className="mt-4 text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
            Stwórz profesjonalny kod QR w kilka sekund. Personalizuj kolory, kształty i dodaj logo.
          </p>
        </div>

        {/* QR Type Selector - Scrollable on mobile */}
        <div className="mb-8 -mx-4 sm:mx-0 animate-fade-in-up animate-delay-300">
          <div className="flex gap-2 overflow-x-auto px-4 sm:px-0 pb-2 sm:pb-0 sm:flex-wrap sm:justify-center scrollbar-hide">
            {qrTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => { setSelectedType(type.id); setFormData({}) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedType === type.id
                    ? 'bg-[#6d28d9] text-white shadow-md'
                    : 'bg-white border border-[var(--border)] text-[var(--foreground-muted)] hover:border-[#6d28d9]/50 hover:text-[var(--foreground)] shadow-sm'
                }`}
              >
                <TypeIcon type={type.icon} className="w-4 h-4" />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generator Card */}
        <div className="max-w-4xl mx-auto animate-fade-in-up animate-delay-400">
          <div className="bg-white rounded-3xl border border-[var(--border)] shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-5 lg:items-start">
              {/* Left Column - Form */}
              <div className="lg:col-span-3 p-6 lg:p-8 space-y-6 lg:rounded-l-3xl">
                {/* Section 1: Content */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#6d28d9] text-white text-sm font-bold shadow-lg shadow-[#6d28d9]/25">1</span>
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--foreground)] font-display">
                        {typeContent[selectedType].title}
                      </h2>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        {typeContent[selectedType].subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="animate-fade-in-scale">
                    {renderForm()}
                  </div>
                </div>
              </div>

              {/* Right Column - Preview & CTA */}
              <div className="lg:col-span-2 p-6 lg:p-8 bg-gradient-to-br from-[var(--background-surface)] to-[var(--background-elevated)] border-t lg:border-t-0 lg:border-l border-[var(--border)] lg:rounded-r-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--success)] to-[#059669] text-white text-sm font-bold shadow-lg shadow-[var(--success)]/25">2</span>
                  <h2 className="text-lg font-semibold text-[var(--foreground)] font-display">Stwórz kod QR</h2>
                </div>

                {/* Static QR Preview Placeholder */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-2xl blur-xl opacity-20 animate-pulse-glow" />
                  <div className="relative flex items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-[var(--primary-muted)] to-[var(--secondary-muted)] border border-[var(--border)]">
                    <div className="w-[160px] h-[160px] bg-white rounded-xl p-4 shadow-lg flex items-center justify-center">
                      {/* Static QR placeholder SVG */}
                      <svg viewBox="0 0 100 100" className="w-full h-full text-[var(--foreground)]">
                        {/* QR code pattern placeholder */}
                        <rect x="10" y="10" width="25" height="25" fill="currentColor" />
                        <rect x="65" y="10" width="25" height="25" fill="currentColor" />
                        <rect x="10" y="65" width="25" height="25" fill="currentColor" />
                        <rect x="15" y="15" width="15" height="15" fill="white" />
                        <rect x="70" y="15" width="15" height="15" fill="white" />
                        <rect x="15" y="70" width="15" height="15" fill="white" />
                        <rect x="20" y="20" width="5" height="5" fill="currentColor" />
                        <rect x="75" y="20" width="5" height="5" fill="currentColor" />
                        <rect x="20" y="75" width="5" height="5" fill="currentColor" />
                        {/* Data modules */}
                        <rect x="40" y="10" width="5" height="5" fill="currentColor" />
                        <rect x="50" y="10" width="5" height="5" fill="currentColor" />
                        <rect x="40" y="20" width="5" height="5" fill="currentColor" />
                        <rect x="10" y="40" width="5" height="5" fill="currentColor" />
                        <rect x="20" y="45" width="5" height="5" fill="currentColor" />
                        <rect x="40" y="40" width="5" height="5" fill="currentColor" />
                        <rect x="50" y="45" width="5" height="5" fill="currentColor" />
                        <rect x="60" y="40" width="5" height="5" fill="currentColor" />
                        <rect x="70" y="45" width="5" height="5" fill="currentColor" />
                        <rect x="80" y="40" width="5" height="5" fill="currentColor" />
                        <rect x="45" y="55" width="5" height="5" fill="currentColor" />
                        <rect x="55" y="60" width="5" height="5" fill="currentColor" />
                        <rect x="65" y="55" width="5" height="5" fill="currentColor" />
                        <rect x="45" y="70" width="5" height="5" fill="currentColor" />
                        <rect x="55" y="75" width="5" height="5" fill="currentColor" />
                        <rect x="65" y="70" width="5" height="5" fill="currentColor" />
                        <rect x="75" y="65" width="5" height="5" fill="currentColor" />
                        <rect x="85" y="75" width="5" height="5" fill="currentColor" />
                        <rect x="80" y="85" width="5" height="5" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Link href="/qr-codes/new" className="block">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full shadow-lg shadow-[var(--success)]/30 hover:shadow-xl hover:shadow-[var(--success)]/40"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Stwórz swój kod QR
                    </span>
                  </Button>
                </Link>

                <p className="text-xs text-center text-[var(--foreground-subtle)] mt-3">
                  Pełny edytor z podglądem na żywo
                </p>

                {/* Trust badge */}
                <div className="mt-6 pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center justify-center gap-2 text-xs text-[var(--foreground-subtle)]">
                    <svg className="w-4 h-4 text-[var(--success)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    <span>100% darmowe, bez limitu</span>
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
    calendar: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />,
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
