'use client'

import { useEffect, useRef } from 'react'
import { GeneratorWizard, type GeneratorWizardHandle } from '@/components/landing/generator-wizard'

export function Hero() {
  const wizardRef = useRef<GeneratorWizardHandle>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = particlesRef.current
    if (!container) return

    const colors = ['#6d28d9', '#8b5cf6', '#a78bfa', '#7c3aed', '#9333ea']

    const createParticle = () => {
      const particle = document.createElement('div')
      const size = Math.random() * 12 + 3
      const color = colors[Math.floor(Math.random() * colors.length)]
      const duration = Math.random() * 15 + 10
      const topPos = Math.random() * 100
      const isSquare = Math.random() > 0.5
      const hasGlow = Math.random() < 0.2

      particle.style.cssText = `
        position: absolute;
        left: -20px;
        top: ${topPos}%;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${isSquare ? '2px' : '50%'};
        opacity: 0;
        pointer-events: none;
        animation: particle-flow ${duration}s linear forwards;
        ${hasGlow ? `box-shadow: 0 0 ${size * 2}px ${size}px ${color}40;` : ''}
      `

      container.appendChild(particle)
      setTimeout(() => { particle.remove() }, duration * 1000)
    }

    for (let i = 0; i < 25; i++) {
      setTimeout(() => createParticle(), Math.random() * 10000)
    }

    const interval = setInterval(createParticle, 400)

    return () => {
      clearInterval(interval)
      container.innerHTML = ''
    }
  }, [])

  return (
    <section className="hero-section relative flex flex-col justify-start pt-24 pb-16 overflow-x-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%)' }} />

      {/* Ambient glow */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full" style={{ background: 'rgba(109, 40, 217, 0.15)', filter: 'blur(100px)' }} />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full" style={{ background: 'rgba(109, 40, 217, 0.15)', filter: 'blur(100px)' }} />

      {/* Particles */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" />

      {/* Content wrapper */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl font-display animate-fade-in-up animate-delay-100">
            <span className="text-white">Generator Kodów </span>
            <span className="text-[#a78bfa] drop-shadow-lg">QR</span>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
            Stwórz profesjonalny kod QR w kilka sekund. Personalizuj kolory, kształty i dodaj logo.
          </p>
        </div>

        {/* Wizard Card */}
        <div className="max-w-6xl mx-auto animate-fade-in-up animate-delay-400">
          <div className="bg-white rounded-3xl border border-[var(--border)] shadow-xl">
            <div className="p-5 sm:p-6 lg:p-8">
              <GeneratorWizard ref={wizardRef} />
            </div>
          </div>

          {/* CTA below card */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              onClick={() => wizardRef.current?.openSaveModal()}
              className="px-8 py-4 rounded-2xl text-base font-bold text-white bg-[#6d28d9] hover:bg-[#5b21b6] active:bg-[#4c1d95] transition-all shadow-xl shadow-[#6d28d9]/40 flex items-center gap-2.5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Pobierz swój kod QR
            </button>
            <p className="text-white/50 text-xs">Darmowe konto — bez karty kredytowej</p>
          </div>
        </div>
      </div>
    </section>
  )
}
