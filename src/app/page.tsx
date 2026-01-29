import { Hero, Features, Analytics, Pricing, FAQ, CTA, HowItWorks } from '@/components/landing'
import { Header, Footer } from '@/components/landing'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
        <Analytics />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
