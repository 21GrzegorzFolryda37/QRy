import { Hero, Features, Pricing, CTA } from '@/components/landing'
import { Header, Footer } from '@/components/landing'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col landing-canvas">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
