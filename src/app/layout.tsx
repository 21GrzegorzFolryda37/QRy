import type { Metadata } from 'next'
import { Space_Grotesk, Outfit, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { CookieConsent } from '@/components/cookie-consent'
import { ToastProvider } from '@/components/ui/toast'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'QRenixy - Dynamiczne kody QR z analityką',
  description:
    'Twórz markowe, śledzalne kody QR, które pomogą Ci zrozumieć odbiorców. Aktualizuj cele w dowolnym momencie bez ponownego drukowania. Uzyskaj wgląd w skany, lokalizacje i urządzenia w czasie rzeczywistym.',
  keywords: ['kod QR', 'generator kodów QR', 'dynamiczny kod QR', 'analityka QR', 'markowy kod QR'],
  icons: {
    icon: [
      { url: '/logo.webp', sizes: '32x32', type: 'image/webp' },
      { url: '/logo.webp', sizes: '192x192', type: 'image/webp' },
    ],
    shortcut: '/logo.webp',
    apple: { url: '/logo.webp', sizes: '180x180' },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <head>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KVM4SQRH');`}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PGC2KXGNNQ"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PGC2KXGNNQ');
            gtag('config', 'AW-11001323592');
          `}
        </Script>
      </head>
      <body className={`${spaceGrotesk.variable} ${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[var(--background)] text-[var(--foreground)]`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KVM4SQRH"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <ToastProvider>
          {children}
          <CookieConsent />
        </ToastProvider>
      </body>
    </html>
  )
}
