import { Suspense } from 'react'
import { UnifiedAuthForm } from '@/components/auth'

interface RegisterPageProps {
  searchParams: Promise<{ token?: string; redirectTo?: string }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Utwórz konto</h2>
      <Suspense>
        <UnifiedAuthForm signupToken={params.token} redirectTo={params.redirectTo} />
      </Suspense>
    </div>
  )
}
