import Link from 'next/link'
import { Button } from '@/components/ui'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">Strona nie znaleziona</h2>
        <p className="mt-2 text-gray-500">
          Strona, której szukasz, nie istnieje lub została usunięta.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button>Wróć na stronę główną</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
