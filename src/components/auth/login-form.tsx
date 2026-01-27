'use client'

import { useActionState } from 'react'
import { login } from '@/actions/auth'
import { Button, Input } from '@/components/ui'
import Link from 'next/link'

interface LoginFormProps {
  redirectTo?: string
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <form action={formAction} className="space-y-4">
      {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

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
        placeholder="Enter your password"
        required
        autoComplete="current-password"
      />

      {state?.error && (
        <div className="rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30 p-3">
          <p className="text-sm text-[var(--error)]">{state.error}</p>
        </div>
      )}

      <Button type="submit" variant="gradient" className="w-full" isLoading={isPending}>
        Sign in
      </Button>

      <div className="text-center text-sm">
        <Link
          href="/forgot-password"
          className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
        >
          Forgot your password?
        </Link>
      </div>

      <div className="text-center text-sm text-[var(--foreground-muted)]">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[var(--primary)] font-medium hover:text-[var(--primary-hover)] transition-colors">
          Sign up
        </Link>
      </div>
    </form>
  )
}
