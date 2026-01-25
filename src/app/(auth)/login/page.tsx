import { LoginForm } from '@/components/auth'

interface LoginPageProps {
  searchParams: Promise<{ redirectTo?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Sign in to your account</h2>
      <LoginForm redirectTo={params.redirectTo} />
    </div>
  )
}
