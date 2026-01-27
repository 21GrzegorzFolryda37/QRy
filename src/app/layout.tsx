import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CookieConsent } from '@/components/cookie-consent'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'EngageQR - Dynamic QR Codes with Analytics',
  description:
    'Create branded, trackable QR codes that help you understand your audience. Update destinations anytime without reprinting. Get real-time insights on scans, locations, and devices.',
  keywords: ['QR code', 'QR code generator', 'dynamic QR code', 'QR analytics', 'branded QR code'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[var(--background)] text-[var(--foreground)]`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
