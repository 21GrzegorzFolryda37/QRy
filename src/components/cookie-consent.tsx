'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui'
import Link from 'next/link'

const COOKIE_CONSENT_KEY = 'engageqr-cookie-consent'

type ConsentStatus = 'pending' | 'accepted' | 'rejected'

export function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (savedConsent) {
      setStatus(savedConsent as ConsentStatus)
    } else {
      setStatus('pending')
      // Delay showing the banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setStatus('accepted')
    setIsVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected')
    setStatus('rejected')
    setIsVisible(false)
  }

  // Don't render anything if consent is already given or status not loaded
  if (status !== 'pending' || !isVisible) {
    return null
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      role="dialog"
      aria-label="Zgoda na cookies"
    >
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl bg-white shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="font-semibold text-gray-900">
                  Ta strona uzywa cookies
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Uzywamy plikow cookies, aby zapewnic prawidlowe dzialanie strony,
                analizowac ruch i personalizowac tresci. Klikajac &quot;Akceptuje&quot;,
                wyrazasz zgode na uzycie wszystkich plikow cookies.{' '}
                <Link href="/privacy" className="underline hover:text-gray-900">
                  Dowiedz sie wiecej
                </Link>
              </p>
            </div>
            <div className="flex gap-3 sm:flex-shrink-0">
              <Button
                variant="outline"
                onClick={handleReject}
                className="flex-1 sm:flex-none"
              >
                Odrzuc
              </Button>
              <Button
                onClick={handleAccept}
                className="flex-1 sm:flex-none"
              >
                Akceptuje
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
