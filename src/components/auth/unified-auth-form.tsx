'use client'

import { useState, useTransition } from 'react'
import { useActionState } from 'react'
import { login, signupInstant, sendMagicLink } from '@/actions/auth'
import { Button, Input } from '@/components/ui'
import Link from 'next/link'

type Step = 'email' | 'password' | 'magic-link-sent'

interface UnifiedAuthFormProps {
  redirectTo?: string
  signupToken?: string
  disabled?: boolean
}

export function UnifiedAuthForm({ redirectTo, signupToken, disabled }: UnifiedAuthFormProps) {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [magicLinkCooldown, setMagicLinkCooldown] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Login action state (Step 2a)
  const [loginState, loginAction, isLoginPending] = useActionState(login, null)

  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEmailError('')

    const formEmail = (new FormData(e.currentTarget).get('email') as string).trim().toLowerCase()
    if (!formEmail) return

    startTransition(async () => {
      try {
        const res = await fetch('/api/auth/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formEmail }),
        })
        const data = await res.json()

        if (!res.ok) {
          setEmailError(data.error || 'Błąd serwera')
          return
        }

        setEmail(formEmail)

        if (!data.exists) {
          // New user — instant signup
          await signupInstant(formEmail, signupToken)
        } else if (data.hasPassword) {
          setStep('password')
        } else {
          // Existing user without password — send magic link
          const result = await sendMagicLink(formEmail, redirectTo)
          if (result?.error) {
            setEmailError(result.error)
          } else {
            setStep('magic-link-sent')
          }
        }
      } catch {
        setEmailError('Wystąpił błąd. Spróbuj ponownie.')
      }
    })
  }

  async function handleResendMagicLink() {
    if (magicLinkCooldown) return
    setMagicLinkCooldown(true)
    await sendMagicLink(email, redirectTo)
    setTimeout(() => setMagicLinkCooldown(false), 30000)
  }

  if (step === 'magic-link-sent') {
    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-[var(--background-surface)] border border-[var(--border)] p-6 text-center space-y-2">
          <div className="text-3xl">✉️</div>
          <h3 className="font-semibold text-[var(--foreground)]">Sprawdź swoją skrzynkę!</h3>
          <p className="text-sm text-[var(--foreground-muted)]">
            Wysłaliśmy link logowania na{' '}
            <span className="font-medium text-[var(--foreground)]">{email}</span>
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResendMagicLink}
            disabled={magicLinkCooldown}
          >
            {magicLinkCooldown ? 'Wysłano — odczekaj chwilę' : 'Wyślij ponownie'}
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => { setStep('email'); setEmail('') }}
          >
            Zmień email
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'password') {
    return (
      <form action={loginAction} className="space-y-4">
        {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}
        <input type="hidden" name="email" value={email} />

        <div className="flex items-center gap-2 rounded-lg bg-[var(--background-surface)] border border-[var(--border)] px-3 py-2">
          <span className="text-sm text-[var(--foreground)] flex-1 truncate">{email}</span>
          <button
            type="button"
            onClick={() => setStep('email')}
            className="text-xs text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium shrink-0"
          >
            zmień
          </button>
        </div>

        <Input
          name="password"
          type="password"
          label="Hasło"
          placeholder="Wpisz hasło"
          required
          autoComplete="current-password"
          autoFocus
        />

        {loginState?.error && (
          <div className="rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30 p-3">
            <p className="text-sm text-[var(--error)]">{loginState.error}</p>
          </div>
        )}

        <Button type="submit" variant="gradient" className="w-full" isLoading={isLoginPending} disabled={disabled}>
          Zaloguj się
        </Button>

        <div className="text-center text-sm">
          <Link
            href="/forgot-password"
            className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
          >
            Nie pamiętasz hasła?
          </Link>
        </div>
      </form>
    )
  }

  // Step 1 — email
  return (
    <form onSubmit={handleEmailSubmit} className="space-y-4">
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="twoj@email.com"
        required
        autoComplete="email"
        autoFocus
        defaultValue={email}
      />

      {emailError && (
        <div className="rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30 p-3">
          <p className="text-sm text-[var(--error)]">{emailError}</p>
        </div>
      )}

      <Button type="submit" variant="gradient" className="w-full" isLoading={isPending} disabled={disabled}>
        Kontynuuj →
      </Button>
    </form>
  )
}
