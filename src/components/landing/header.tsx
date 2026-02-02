'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Check initial auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-[var(--border)] shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <Image
                src="/logo.webp"
                alt="QRapple logo"
                width={44}
                height={44}
                className="relative w-11 h-11 rounded-xl"
              />
            </div>
            <span className="text-xl font-bold font-display gradient-text-static">QRapple</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="relative p-2.5 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-surface)] transition-all"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Otwórz menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-1">
          {[
            { href: '/features', label: 'Funkcje' },
            { href: '/pricing', label: 'Cennik' },
            { href: '/contact', label: 'Kontakt' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors group"
            >
              {item.label}
              <span className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-3">
          {!isLoading && (
            isLoggedIn ? (
              <Link href="/dashboard">
                <Button variant="gradient" className="shadow-lg shadow-[var(--primary)]/25">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    Mój profil
                  </span>
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  Zaloguj się
                </Link>
                <Link href="/register">
                  <Button variant="gradient" className="shadow-lg shadow-[var(--primary)]/25">
                    Rozpocznij za darmo
                  </Button>
                </Link>
              </>
            )
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden fixed inset-0 z-[1001] transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu panel */}
        <div
          className={`absolute inset-y-0 right-0 w-full max-w-sm bg-white border-l border-[var(--border)] shadow-2xl transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Image src="/logo.webp" alt="QRapple logo" width={40} height={40} className="w-10 h-10 rounded-xl" />
              <span className="text-lg font-bold font-display gradient-text-static">QRapple</span>
            </Link>
            <button
              type="button"
              className="p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-elevated)] transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Zamknij menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4 space-y-2">
            {[
              { href: '/features', label: 'Funkcje', icon: '✨' },
              { href: '/pricing', label: 'Cennik', icon: '💎' },
              { href: '/contact', label: 'Kontakt', icon: '📬' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--foreground)] hover:bg-[var(--background-elevated)] transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border)] bg-white">
            {isLoggedIn ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="gradient" className="w-full">
                  Mój profil
                </Button>
              </Link>
            ) : (
              <div className="space-y-3">
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="gradient" className="w-full">
                    Rozpocznij za darmo
                  </Button>
                </Link>
                <Link
                  href="/login"
                  className="block text-center py-2 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Masz już konto? Zaloguj się
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
