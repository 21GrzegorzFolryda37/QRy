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
            Check your email for a link to reset your password.
          </p>
        </div>
        <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 underline">
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <p className="text-sm text-gray-600">
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>

      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        required
        autoComplete="email"
      />

      {state?.error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}

      <Button type="submit" className="w-full" isLoading={isPending}>
        Send reset link
      </Button>

      <div className="text-center text-sm">
        <Link href="/login" className="text-gray-600 hover:text-gray-900 underline">
          Back to login
        </Link>
      </div>
    </form>
  )
}
