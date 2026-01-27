'use client'

import { useActionState } from 'react'
import { resetPassword } from '@/actions/auth'
import { Button, Input } from '@/components/ui'
import Link from 'next/link'

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(resetPassword, null)

  if (state?.success) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-700">
            Sprawdź swoją skrzynkę e-mail, aby znaleźć link do resetowania hasła.
          </p>
        </div>
        <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 underline">
          Powrót do logowania
        </Link>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <p className="text-sm text-gray-600">
        Podaj swój adres e-mail, a wyślemy Ci link do resetowania hasła.
      </p>

      <Input
        name="email"
        type="email"
        label="E-mail"
        placeholder="twoj@email.pl"
        required
        autoComplete="email"
      />

      {state?.error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}

      <Button type="submit" className="w-full" isLoading={isPending}>
        Wyślij link resetujący
      </Button>

      <div className="text-center text-sm">
        <Link href="/login" className="text-gray-600 hover:text-gray-900 underline">
          Powrót do logowania
        </Link>
      </div>
    </form>
  )
}
