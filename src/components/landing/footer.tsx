import Link from 'next/link'
import Image from 'next/image'

const navigation = {
  product: [
    { name: 'Funkcje', href: '/features' },
    { name: 'Cennik', href: '/pricing' },
  ],
  support: [
    { name: 'Dokumentacja', href: '#' },
    { name: 'Kontakt', href: '/contact' },
  ],
  legal: [
    { name: 'Prywatność', href: '/privacy' },
    { name: 'Regulamin', href: '/terms' },
  ],
}

const socialLinks = [
  {
    name: 'Twitter',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer className="relative bg-white border-t border-[var(--border)]">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-50" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                <Image
                  src="/logo.webp"
                  alt="QRapple logo"
                  width={40}
                  height={40}
                  className="relative w-10 h-10 rounded-xl"
                />
              </div>
              <span className="text-xl font-bold font-display gradient-text-static">QRapple</span>
            </Link>
            <p className="mt-4 text-sm text-[var(--foreground-muted)] leading-relaxed max-w-xs">
              Dynamiczne kody QR z zaawansowaną analityką dla nowoczesnego marketingu.
            </p>

            {/* Social links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="p-2 rounded-lg bg-[var(--background-surface)] text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-muted)] transition-all"
                  aria-label={item.name}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider">
              Produkt
            </h3>
            <ul className="mt-4 space-y-3">
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

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider">
              Wsparcie
            </h3>
            <ul className="mt-4 space-y-3">
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

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider">
              Prawne
            </h3>
            <ul className="mt-4 space-y-3">
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

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--foreground-subtle)]">
              &copy; {new Date().getFullYear()} QRapple. Wszelkie prawa zastrzeżone.
            </p>
            <div className="flex items-center gap-2 text-sm text-[var(--foreground-subtle)]">
              <span>Made with</span>
              <span className="text-[var(--accent)] animate-pulse">♥</span>
              <span>in Poland</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
