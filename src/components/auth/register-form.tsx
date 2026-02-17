'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { register } from '@/actions/auth'
import { Button, Input } from '@/components/ui'
import { signupStarted } from '@/lib/analytics'
import Link from 'next/link'

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, null)
  const searchParams = useSearchParams()
  const source = searchParams.get('source') || 'direct'
  const signupToken = searchParams.get('token') || ''

  if (state?.success) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          Sprawdź swoją skrzynkę email
        </h2>
        <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
          Wysłaliśmy link potwierdzający na Twój adres email. Kliknij przycisk w wiadomości, aby aktywować konto i przejść do panelu.
        </p>
        <Link
          href="/login"
          className="inline-block text-sm text-[var(--primary)] font-medium hover:text-[var(--primary-hover)] transition-colors"
        >
          Wróć do logowania
        </Link>
      </div>
    )
  }

  return (
    <form
      action={(formData) => {
        signupStarted('email', source)
        formAction(formData)
      }}
      className="space-y-4"
    >
      {signupToken && <input type="hidden" name="signupToken" value={signupToken} />}

      <Input
        name="fullName"
        type="text"
        label="Imię i nazwisko"
        placeholder="Jan Kowalski"
        required
        autoComplete="name"
      />

      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="twoj@email.com"
        required
        autoComplete="email"
      />

      <Input
        name="password"
        type="password"
        label="Hasło"
        placeholder="Utwórz hasło"
        required
        autoComplete="new-password"
      />
      <p className="text-xs text-[var(--foreground-subtle)] -mt-2">Minimum 8 znaków</p>

      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          name="newsletterConsent"
          className="mt-0.5 h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]/50 cursor-pointer"
        />
        <span className="text-xs text-[var(--foreground-muted)] leading-relaxed group-hover:text-[var(--foreground)] transition-colors">
          Chcę otrzymywać porady i nowości od QRenixy które pomogą mi poprawić wyniki kodów.
        </span>
      </label>

      {state?.error && (
        <div className="rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30 p-3">
          <p className="text-sm text-[var(--error)]">{state.error}</p>
        </div>
      )}

      <Button type="submit" variant="gradient" className="w-full" isLoading={isPending}>
        Utwórz konto
      </Button>

      <div className="text-center text-sm text-[var(--foreground-muted)]">
        Masz już konto?{' '}
        <Link href="/login" className="text-[var(--primary)] font-medium hover:text-[var(--primary-hover)] transition-colors">
          Zaloguj się
        </Link>
      </div>
    </form>
  )
}
