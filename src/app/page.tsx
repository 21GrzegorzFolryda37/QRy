import { Hero, Analytics, Pricing, FAQ, HowItWorks, QRComparison, CTA } from '@/components/landing'
import { Header, Footer } from '@/components/landing'

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
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
