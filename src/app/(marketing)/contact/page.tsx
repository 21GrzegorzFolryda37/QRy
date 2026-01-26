'use client'

import { useState } from 'react'
import { Button, Input } from '@/components/ui'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    // For now, just simulate sending - you can integrate with an email service later
    // Options: SendGrid, Resend, Mailgun, or simple mailto link
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create mailto link as fallback
      const mailtoLink = `mailto:contact@engageqr.com?subject=${encodeURIComponent(
        formData.subject
      )}&body=${encodeURIComponent(
        `Od: ${formData.name} (${formData.email})\n\n${formData.message}`
      )}`
      window.location.href = mailtoLink

      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Kontakt
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Masz pytania? Chcesz zglosic problem? Skontaktuj sie z nami.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Informacje kontaktowe</h2>
            <dl className="mt-6 space-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-gray-900">
                  <a href="mailto:contact@engageqr.com" className="hover:underline">
                    contact@engageqr.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Czas odpowiedzi</dt>
                <dd className="mt-1 text-gray-900">Zazwyczaj do 24 godzin w dni robocze</dd>
              </div>
            </dl>

            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-500">Popularne tematy</h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">-</span>
                  <span>Pytania dotyczace planow i cen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">-</span>
                  <span>Problemy techniczne z kodami QR</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">-</span>
                  <span>Zglaszanie naduzyc</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">-</span>
                  <span>Propozycje nowych funkcji</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">-</span>
                  <span>Wspolpraca biznesowa</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900">Wyslij wiadomosc</h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Imie i nazwisko
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1"
                  placeholder="Jan Kowalski"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1"
                  placeholder="jan@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Temat
                </label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="mt-1"
                  placeholder="W czym mozemy pomoc?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Wiadomosc
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="Opisz swoje pytanie lub problem..."
                />
              </div>

              <Button
                type="submit"
                disabled={status === 'sending'}
                className="w-full"
              >
                {status === 'sending' ? 'Wysylanie...' : 'Wyslij wiadomosc'}
              </Button>

              {status === 'success' && (
                <p className="text-sm text-green-600 text-center">
                  Dziekujemy! Twoja wiadomosc zostala wyslana.
                </p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-600 text-center">
                  Wystapil blad. Sprobuj ponownie lub napisz bezposrednio na email.
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-900 text-center">FAQ</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-medium text-gray-900">Jak usunac konto?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Przejdz do Ustawienia &gt; Konto i kliknij &quot;Usun konto&quot;. Wszystkie Twoje dane zostana trwale usuniete.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Jak zmienic plan?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Przejdz do Ustawienia &gt; Subskrypcja i wybierz nowy plan. Zmiana jest natychmiastowa.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Czy moge anulowac subskrypcje?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Tak, mozesz anulowac w kazdej chwili. Bedziesz miec dostep do konca oplaconego okresu.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Jak zglosic naduzyce?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Jesli napotkales kod QR prowadzacy do szkodliwych tresci, zglos to poprzez formularz powyzej.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
