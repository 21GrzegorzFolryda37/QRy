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

  return (
    <form
      action={(formData) => {
        signupStarted('email', source)
        formAction(formData)
      }}
      className="space-y-4"
    >
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
