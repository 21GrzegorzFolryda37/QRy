import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gray-900">EngageQR</h1>
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8">{children}</div>
      </div>
    </div>
  )
}
