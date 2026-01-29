import { Hero, Features, Analytics, Pricing, FAQ, CTA, HowItWorks, AnimatedBackgroundCSS } from '@/components/landing'
import { Header, Footer } from '@/components/landing'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <AnimatedBackgroundCSS />
      <div className="relative z-10 flex flex-col min-h-screen">
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
    </div>
  )
}
