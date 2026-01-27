import Link from 'next/link'
import { Button } from '@/components/ui'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-bold gradient-text">EngageQR</span>
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          <Link
            href="/features"
            className="text-sm font-semibold leading-6 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-semibold leading-6 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Pricing
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-4">
          <Link
            href="/login"
            className="text-sm font-semibold leading-6 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Log in
          </Link>
          <Link href="/register">
            <Button variant="gradient">Get started</Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
