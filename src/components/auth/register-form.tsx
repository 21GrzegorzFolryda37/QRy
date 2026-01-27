'use client'

import { useActionState } from 'react'
import { register } from '@/actions/auth'
import { Button, Input } from '@/components/ui'
import Link from 'next/link'

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, null)

  return (
    <form action={formAction} className="space-y-4">
      <Input
        name="fullName"
        type="text"
        label="Full name"
        placeholder="John Doe"
        required
        autoComplete="name"
      />

      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        required
        autoComplete="email"
      />

      <Input
        name="password"
        type="password"
        label="Password"
        placeholder="Create a password"
        required
        autoComplete="new-password"
      />
      <p className="text-xs text-[var(--foreground-subtle)] -mt-2">Must be at least 8 characters</p>

      {state?.error && (
        <div className="rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30 p-3">
          <p className="text-sm text-[var(--error)]">{state.error}</p>
        </div>
      )}

      <Button type="submit" variant="gradient" className="w-full" isLoading={isPending}>
        Create account
      </Button>

      <div className="text-center text-sm text-[var(--foreground-muted)]">
        Already have an account?{' '}
        <Link href="/login" className="text-[var(--primary)] font-medium hover:text-[var(--primary-hover)] transition-colors">
          Sign in
        </Link>
      </div>
    </form>
  )
}
