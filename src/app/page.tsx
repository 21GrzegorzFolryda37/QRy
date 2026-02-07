import dynamic from 'next/dynamic'
import { Hero } from '@/components/landing'
import { Header } from '@/components/landing'

const HowItWorks = dynamic(() => import('@/components/landing/how-it-works').then(m => m.HowItWorks))
const QRComparison = dynamic(() => import('@/components/landing/qr-comparison').then(m => m.QRComparison))
const Pricing = dynamic(() => import('@/components/landing/pricing').then(m => m.Pricing))
const Analytics = dynamic(() => import('@/components/landing/analytics').then(m => m.Analytics))
const FAQ = dynamic(() => import('@/components/landing/faq').then(m => m.FAQ))
const Footer = dynamic(() => import('@/components/landing/footer').then(m => m.Footer))

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        <Hero />
        <HowItWorks />
        <QRComparison />
        <Pricing />
        <Analytics />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
