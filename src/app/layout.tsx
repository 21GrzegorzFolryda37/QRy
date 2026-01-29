import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CookieConsent } from '@/components/cookie-consent'
import { ToastProvider } from '@/components/ui/toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'QRapple - Dynamiczne kody QR z analityką',
  description:
    'Twórz markowe, śledzalne kody QR, które pomogą Ci zrozumieć odbiorców. Aktualizuj cele w dowolnym momencie bez ponownego drukowania. Uzyskaj wgląd w skany, lokalizacje i urządzenia w czasie rzeczywistym.',
  keywords: ['kod QR', 'generator kodów QR', 'dynamiczny kod QR', 'analityka QR', 'markowy kod QR'],
  icons: {
    icon: '/logo.webp',
    shortcut: '/logo.webp',
    apple: '/logo.webp',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <body className={`${inter.variable} font-sans antialiased bg-[var(--background)] text-[var(--foreground)]`}>
        <ToastProvider>
          {children}
          <CookieConsent />
        </ToastProvider>
      </body>
    </html>
  )
}
