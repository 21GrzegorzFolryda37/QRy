'use client'

import { useEffect, useRef } from 'react'

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      color: string

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.5 + 0.1
        this.color = Math.random() > 0.5 ? '#8b5cf6' : '#06b6d4'
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas!.width) this.x = 0
        if (this.x < 0) this.x = canvas!.width
        if (this.y > canvas!.height) this.y = 0
        if (this.y < 0) this.y = canvas!.height
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    // Create particles
    const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 20000))
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient orbs
      drawGradientOrb(ctx, canvas.width * 0.2, canvas.height * 0.3, 300, '#8b5cf6', 0.08)
      drawGradientOrb(ctx, canvas.width * 0.8, canvas.height * 0.6, 250, '#06b6d4', 0.08)
      drawGradientOrb(ctx, canvas.width * 0.5, canvas.height * 0.8, 200, '#8b5cf6', 0.05)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      // Draw connections between close particles
      particles.forEach((a, index) => {
        particles.slice(index + 1).forEach((b) => {
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.strokeStyle = '#8b5cf6'
            ctx.globalAlpha = 0.1 * (1 - distance / 150)
            ctx.lineWidth = 0.5
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        })
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    function drawGradientOrb(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      color: string,
      opacity: number
    ) {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, 'transparent')
      ctx.globalAlpha = opacity
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 opacity-60"
      style={{ pointerEvents: 'none' }}
    />
  )
}

// Simpler CSS-based animated background (alternative, lighter on performance)
export function AnimatedBackgroundCSS() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Gradient orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#8b5cf6] rounded-full filter blur-[150px] opacity-25 animate-blob" />
      <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-[#06b6d4] rounded-full filter blur-[150px] opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[20%] left-[30%] w-[350px] h-[350px] bg-[#8b5cf6] rounded-full filter blur-[150px] opacity-15 animate-blob animation-delay-4000" />
      <div className="absolute bottom-[-5%] right-[20%] w-[300px] h-[300px] bg-[#06b6d4] rounded-full filter blur-[130px] opacity-20 animate-blob animation-delay-3000" />

      {/* Floating shapes */}
      <div className="absolute top-[15%] left-[10%] w-2 h-2 bg-[#8b5cf6] rounded-full opacity-50 animate-float" />
      <div className="absolute top-[25%] right-[15%] w-3 h-3 bg-[#06b6d4] rounded-full opacity-40 animate-float animation-delay-1000" />
      <div className="absolute top-[45%] left-[5%] w-2 h-2 bg-[#06b6d4] rounded-full opacity-35 animate-float animation-delay-2000" />
      <div className="absolute top-[35%] right-[8%] w-1.5 h-1.5 bg-[#8b5cf6] rounded-full opacity-45 animate-float animation-delay-3000" />
      <div className="absolute top-[55%] left-[85%] w-2.5 h-2.5 bg-[#8b5cf6] rounded-full opacity-30 animate-float animation-delay-4000" />
      <div className="absolute top-[70%] left-[15%] w-2 h-2 bg-[#06b6d4] rounded-full opacity-35 animate-float animation-delay-1000" />
      <div className="absolute top-[80%] right-[25%] w-1.5 h-1.5 bg-[#8b5cf6] rounded-full opacity-40 animate-float animation-delay-2000" />
    </div>
  )
}
