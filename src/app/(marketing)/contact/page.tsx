'use client'

import { useState } from 'react'
import { Button, Input } from '@/components/ui'
import { useToast } from '@/components/ui/toast'

export default function ContactPage() {
  const { success, error: showError } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Imie jest wymagane'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Nieprawidlowy adres email'
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Temat jest wymagany'
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Wiadomosc jest wymagana'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Wiadomosc musi miec minimum 10 znakow'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          showError(`Przekroczono limit wiadomosci. Sprobuj ponownie za ${data.resetIn || 60} minut.`)
        } else {
          showError(data.error || 'Wystapil blad. Sprobuj ponownie.')
        }
        setStatus('idle')
        return
      }

      success('Dziekujemy! Twoja wiadomosc zostala wyslana. Sprawdz skrzynke email.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setStatus('idle')
    } catch {
      showError('Wystapil blad sieci. Sprawdz polaczenie i sprobuj ponownie.')
      setStatus('idle')
    }
  }

  return (
    <div className="bg-[#f0f0fd] py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Kontakt
          </h1>
          <p className="mt-4 text-lg text-[var(--foreground-muted)]">
            Masz pytania? Chcesz zglosic problem? Skontaktuj sie z nami.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Informacje kontaktowe</h2>
            <dl className="mt-6 space-y-6">
              <div>
                <dt className="text-sm font-medium text-[var(--foreground-muted)]">Email</dt>
                <dd className="mt-1 text-[var(--foreground)]">
                  <a href="mailto:contact@qrenixy.com" className="hover:underline hover:text-[var(--primary)]">
                    contact@qrenixy.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-[var(--foreground-muted)]">Czas odpowiedzi</dt>
                <dd className="mt-1 text-[var(--foreground)]">Zazwyczaj do 24 godzin w dni robocze</dd>
              </div>
            </dl>

            <div className="mt-8">
              <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Popularne tematy</h3>
              <ul className="mt-4 space-y-3 text-sm text-[var(--foreground-muted)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--foreground-subtle)]">-</span>
                  <span>Pytania dotyczace planow i cen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--foreground-subtle)]">-</span>
                  <span>Problemy techniczne z kodami QR</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--foreground-subtle)]">-</span>
                  <span>Zglaszanie naduzyc</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--foreground-subtle)]">-</span>
                  <span>Propozycje nowych funkcji</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--foreground-subtle)]">-</span>
                  <span>Wspolpraca biznesowa</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-[var(--background-surface)] rounded-xl p-6 border border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Wyslij wiadomosc</h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)]">
                  Imie i nazwisko
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    if (errors.name) setErrors({ ...errors, name: '' })
                  }}
                  error={errors.name}
                  className="mt-1"
                  placeholder="Jan Kowalski"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)]">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    if (errors.email) setErrors({ ...errors, email: '' })
                  }}
                  error={errors.email}
                  className="mt-1"
                  placeholder="jan@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[var(--foreground)]">
                  Temat
                </label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData({ ...formData, subject: e.target.value })
                    if (errors.subject) setErrors({ ...errors, subject: '' })
                  }}
                  error={errors.subject}
                  className="mt-1"
                  placeholder="W czym mozemy pomoc?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[var(--foreground)]">
                  Wiadomosc
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value })
                    if (errors.message) setErrors({ ...errors, message: '' })
                  }}
                  className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm transition-colors
                    bg-[var(--background)] text-[var(--foreground)]
                    focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]
                    ${errors.message ? 'border-[var(--error)]' : 'border-[var(--border)]'}`}
                  placeholder="Opisz swoje pytanie lub problem..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-[var(--error)]">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={status === 'sending'}
                isLoading={status === 'sending'}
                className="w-full"
              >
                {status === 'sending' ? 'Wysylanie...' : 'Wyslij wiadomosc'}
              </Button>

              <p className="text-xs text-[var(--foreground-subtle)] text-center">
                Mozesz wyslac maksymalnie 3 wiadomosci na godzine.
              </p>
            </form>
          </div>
        </div>

        <div className="mt-16 border-t border-[var(--border)] pt-8">
          <h2 className="text-lg font-semibold text-[var(--foreground)] text-center">FAQ</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="p-4 rounded-lg bg-[var(--background-surface)] border border-[var(--border)]">
              <h3 className="font-medium text-[var(--foreground)]">Jak usunac konto?</h3>
              <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                Przejdz do Ustawienia i kliknij &quot;Usun konto&quot; w sekcji Strefa niebezpieczna.
                Wszystkie Twoje dane zostana trwale usuniete.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[var(--background-surface)] border border-[var(--border)]">
              <h3 className="font-medium text-[var(--foreground)]">Jak zmienic plan?</h3>
              <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                Przejdz do Platnosci i wybierz nowy plan. Zmiana jest natychmiastowa.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[var(--background-surface)] border border-[var(--border)]">
              <h3 className="font-medium text-[var(--foreground)]">Czy moge anulowac subskrypcje?</h3>
              <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                Tak, mozesz anulowac w kazdej chwili. Bedziesz miec dostep do konca oplaconego okresu.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[var(--background-surface)] border border-[var(--border)]">
              <h3 className="font-medium text-[var(--foreground)]">Jak zglosic naduzyce?</h3>
              <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                Jesli napotkales kod QR prowadzacy do szkodliwych tresci, zglos to poprzez formularz powyzej.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
