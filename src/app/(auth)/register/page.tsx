import { Suspense } from 'react'
import { RegisterForm } from '@/components/auth'

export default function RegisterPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Utwórz konto</h2>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
