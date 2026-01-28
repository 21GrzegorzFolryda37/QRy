import { Hero, Features, Analytics, Pricing, FAQ, CTA } from '@/components/landing'
import { Header, Footer } from '@/components/landing'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col landing-canvas">
      <Header />
      <main className="flex-1">
        <Hero />
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
