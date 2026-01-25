'use client'

import { useActionState } from 'react'
import { updatePassword } from '@/actions/auth'
import { Button, Input } from '@/components/ui'

export function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePassword, null)

  return (
    <form action={formAction} className="space-y-4">
      <p className="text-sm text-gray-600">Enter your new password below.</p>

      <Input
        name="password"
        type="password"
        label="New password"
        placeholder="Enter new password"
        required
        autoComplete="new-password"
      />

      <Input
        name="confirmPassword"
        type="password"
        label="Confirm password"
        placeholder="Confirm new password"
        required
        autoComplete="new-password"
      />
      <p className="text-xs text-gray-500 -mt-2">Must be at least 8 characters</p>

      {state?.error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}

      <Button type="submit" className="w-full" isLoading={isPending}>
        Reset password
      </Button>
    </form>
  )
}
