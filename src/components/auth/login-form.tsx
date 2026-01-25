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
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}

      <Button type="submit" className="w-full" isLoading={isPending}>
        Sign in
      </Button>

      <div className="text-center text-sm">
        <Link
          href="/forgot-password"
          className="text-gray-600 hover:text-gray-900 underline underline-offset-2"
        >
          Forgot your password?
        </Link>
      </div>

      <div className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-gray-900 font-medium hover:underline">
          Sign up
        </Link>
      </div>
    </form>
  )
}
