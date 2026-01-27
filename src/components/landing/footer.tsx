import Link from 'next/link'

const navigation = {
  product: [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
  ],
  support: [
    { name: 'Documentation', href: '#' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[var(--background-surface)] border-t border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold gradient-text">
              EngageQR
            </Link>
            <p className="mt-4 text-sm text-[var(--foreground-muted)]">
              Dynamic QR codes with powerful analytics for modern marketing.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Product</h3>
            <ul className="mt-4 space-y-2">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Support</h3>
            <ul className="mt-4 space-y-2">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Legal</h3>
            <ul className="mt-4 space-y-2">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-[var(--border)] pt-8">
          <p className="text-sm text-[var(--foreground-subtle)] text-center">
            &copy; {new Date().getFullYear()} EngageQR. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
