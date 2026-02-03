'use client'

import { useEffect, useState } from 'react'

interface ScanLineOverlayProps {
  isActive: boolean
  size?: number
  delay?: number
  onComplete?: () => void
}

/**
 * Animated scan line overlay for QR codes.
 * Creates a subtle glowing line that sweeps from top to bottom.
 */
export function ScanLineOverlay({
  isActive,
  size = 140,
  delay = 0,
  onComplete,
}: ScanLineOverlayProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setIsAnimating(false)
      return
    }

    const timer = setTimeout(() => {
      setIsAnimating(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [isActive, delay])

  useEffect(() => {
    if (!isAnimating) return

    const completeTimer = setTimeout(() => {
      onComplete?.()
    }, 1500) // Match animation duration

    return () => clearTimeout(completeTimer)
  }, [isAnimating, onComplete])

  if (!isAnimating) return null

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ width: size, height: size }}
    >
      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-[2px] animate-qr-scan"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(124, 58, 237, 0.8) 20%, rgba(8, 145, 178, 0.9) 50%, rgba(124, 58, 237, 0.8) 80%, transparent 100%)',
          boxShadow: '0 0 12px 2px rgba(124, 58, 237, 0.4), 0 0 24px 4px rgba(8, 145, 178, 0.2)',
        }}
      />

      {/* Subtle glow trail above the line */}
      <div
        className="absolute left-0 right-0 h-8 animate-qr-scan opacity-30"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(124, 58, 237, 0.15))',
          transform: 'translateY(-100%)',
        }}
      />
    </div>
  )
}

interface QRRevealWrapperProps {
  children: React.ReactNode
  isVisible: boolean
  delay?: number
  className?: string
}

/**
 * Wrapper that adds a subtle glow pulse effect to QR codes
 * when they become visible.
 */
export function QRRevealWrapper({
  children,
  isVisible,
  delay = 0,
  className = '',
}: QRRevealWrapperProps) {
  const [showGlow, setShowGlow] = useState(false)

  useEffect(() => {
    if (!isVisible) {
      setShowGlow(false)
      return
    }

    const timer = setTimeout(() => {
      setShowGlow(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [isVisible, delay])

  return (
    <div
      className={`relative transition-all duration-700 ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        transitionTimingFunction: 'var(--ease-smooth)',
      }}
    >
      {/* Glow effect behind QR */}
      {showGlow && (
        <div
          className="absolute inset-0 -z-10 rounded-xl animate-qr-glow"
          style={{
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
          }}
        />
      )}
      {children}
    </div>
  )
}

interface CornerAccentsProps {
  isVisible: boolean
  delay?: number
}

/**
 * Animated corner accents that appear around QR codes.
 * Creates a scanning/targeting effect.
 */
export function CornerAccents({ isVisible, delay = 0 }: CornerAccentsProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!isVisible) {
      setShow(false)
      return
    }

    const timer = setTimeout(() => {
      setShow(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [isVisible, delay])

  const cornerClass = `
    absolute w-4 h-4
    transition-all duration-500
    ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
  `

  const borderStyle = 'border-[#6d28d9]'

  return (
    <>
      <div
        className={`${cornerClass} -top-1 -left-1 border-t-2 border-l-2 ${borderStyle} rounded-tl-lg`}
        style={{
          transitionDelay: `${delay}ms`,
          transitionTimingFunction: 'var(--ease-smooth)',
        }}
      />
      <div
        className={`${cornerClass} -top-1 -right-1 border-t-2 border-r-2 ${borderStyle} rounded-tr-lg`}
        style={{
          transitionDelay: `${delay + 50}ms`,
          transitionTimingFunction: 'var(--ease-smooth)',
        }}
      />
      <div
        className={`${cornerClass} -bottom-1 -left-1 border-b-2 border-l-2 ${borderStyle} rounded-bl-lg`}
        style={{
          transitionDelay: `${delay + 100}ms`,
          transitionTimingFunction: 'var(--ease-smooth)',
        }}
      />
      <div
        className={`${cornerClass} -bottom-1 -right-1 border-b-2 border-r-2 ${borderStyle} rounded-br-lg`}
        style={{
          transitionDelay: `${delay + 150}ms`,
          transitionTimingFunction: 'var(--ease-smooth)',
        }}
      />
    </>
  )
}
