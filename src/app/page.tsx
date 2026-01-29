import { Hero, Features, Analytics, Pricing, FAQ, CTA, HowItWorks } from '@/components/landing'
import { Header, Footer } from '@/components/landing'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero z własnym animowanym tłem */}
        <Hero />
        {/* Reszta strony z landing-canvas */}
        <div className="landing-canvas">
          <HowItWorks />
          <Features />
          <Pricing />
          <Analytics />
          <FAQ />
          <CTA />
        </div>
      </main>
      <Footer />
    </div>
  )
}
