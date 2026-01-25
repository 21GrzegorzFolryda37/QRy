import Link from 'next/link'
import { Button } from '@/components/ui'

export function Header() {
  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-bold text-gray-900">EngageQR</span>
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          <Link
            href="/features"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600"
          >
            Pricing
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-4">
          <Link
            href="/login"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600"
          >
            Log in
          </Link>
          <Link href="/register">
            <Button>Get started</Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
