import { Hero, Analytics, Pricing, FAQ, HowItWorks, QRComparison } from '@/components/landing'
import { Header, Footer } from '@/components/landing'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
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
