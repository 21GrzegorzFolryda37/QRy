'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PhoneMockupProps {
  children?: ReactNode
  className?: string
  variant?: 'default' | 'highlighted'
  glowColor?: string
}

export function PhoneMockup({
  children,
  className,
  variant = 'default',
  glowColor = '#6d28d9'
}: PhoneMockupProps) {
  const isHighlighted = variant === 'highlighted'

  return (
    <div className={cn('relative', className)}>
      {/* Glow effect for highlighted variant */}
      {isHighlighted && (
        <div
          className="absolute -inset-6 rounded-[60px] blur-3xl opacity-40 animate-pulse"
          style={{ backgroundColor: glowColor }}
        />
      )}

      {/* Phone frame */}
      <div
        className={cn(
          'relative bg-[#0f0f23] rounded-[50px] p-3 shadow-2xl',
          isHighlighted && 'ring-1 ring-violet-500/30'
        )}
        style={{
          boxShadow: isHighlighted
            ? `0 25px 50px -12px rgba(109, 40, 217, 0.4), 0 0 0 1px rgba(109, 40, 217, 0.1)`
            : '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
      >
        {/* Side buttons - left */}
        <div className="absolute -left-[2px] top-[80px] w-[2px] h-[25px] bg-[#1a1a2e] rounded-l-sm" />
        <div className="absolute -left-[2px] top-[120px] w-[2px] h-[50px] bg-[#1a1a2e] rounded-l-sm" />
        <div className="absolute -left-[2px] top-[180px] w-[2px] h-[50px] bg-[#1a1a2e] rounded-l-sm" />

        {/* Side button - right (power) */}
        <div className="absolute -right-[2px] top-[140px] w-[2px] h-[70px] bg-[#1a1a2e] rounded-r-sm" />

        {/* Inner bezel */}
        <div className="relative bg-black rounded-[42px] p-[2px]">
          {/* Screen */}
          <div className="relative bg-white rounded-[40px] overflow-hidden" style={{ aspectRatio: '9/19.5' }}>
            {/* Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
              <div className="w-[100px] h-[32px] bg-black rounded-full flex items-center justify-center">
                {/* Camera lens */}
                <div className="absolute right-4 w-[10px] h-[10px] rounded-full bg-[#1a1a2e] ring-1 ring-[#2a2a3e]">
                  <div className="absolute inset-[2px] rounded-full bg-[#0a0a15]" />
                  <div className="absolute top-[2px] left-[2px] w-[2px] h-[2px] rounded-full bg-[#3a3a5e]/50" />
                </div>
              </div>
            </div>

            {/* Screen content area */}
            <div className="relative w-full h-full">
              {children || <PhonePlaceholder />}
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-black/20 rounded-full z-20" />

            {/* Screen reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent pointer-events-none z-10 rounded-[40px]" />
          </div>
        </div>
      </div>

      {/* Phone shadow on surface */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[70%] h-[30px] rounded-full blur-2xl"
        style={{
          backgroundColor: isHighlighted ? glowColor : '#000',
          opacity: isHighlighted ? 0.3 : 0.2
        }}
      />
    </div>
  )
}

function PhonePlaceholder() {
  return (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-8">
      {/* Placeholder icon */}
      <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4" />

      {/* Placeholder text lines */}
      <div className="space-y-2 w-full max-w-[140px]">
        <div className="h-3 bg-gray-200 rounded-full w-full" />
        <div className="h-3 bg-gray-200 rounded-full w-3/4 mx-auto" />
        <div className="h-3 bg-gray-200 rounded-full w-1/2 mx-auto" />
      </div>
    </div>
  )
}
