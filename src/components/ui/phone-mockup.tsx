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
          className="absolute -inset-4 rounded-[52px] blur-2xl opacity-25"
          style={{ backgroundColor: glowColor }}
        />
      )}

      {/* Phone frame - realistic titanium-style iPhone */}
      <div
        className={cn(
          'relative rounded-[44px] p-[5px]',
          isHighlighted && 'ring-1 ring-violet-400/20'
        )}
        style={{
          // Metallic frame gradient
          background: isHighlighted
            ? 'linear-gradient(165deg, #fafafa 0%, #f0f0f5 40%, #e8e8ed 100%)'
            : 'linear-gradient(165deg, #f8f8fa 0%, #ececf0 40%, #e0e0e5 100%)',
          boxShadow: isHighlighted
            ? `
              0 2px 4px rgba(0,0,0,0.04),
              0 8px 16px rgba(109, 40, 217, 0.12),
              0 24px 48px rgba(109, 40, 217, 0.16),
              inset 0 1px 0 rgba(255,255,255,0.9),
              inset 0 -1px 0 rgba(0,0,0,0.04)
            `
            : `
              0 2px 4px rgba(0,0,0,0.03),
              0 8px 16px rgba(0,0,0,0.06),
              0 24px 48px rgba(0,0,0,0.1),
              inset 0 1px 0 rgba(255,255,255,0.9),
              inset 0 -1px 0 rgba(0,0,0,0.04)
            `
        }}
      >
        {/* Frame border for depth */}
        <div
          className="absolute inset-0 rounded-[44px] pointer-events-none"
          style={{
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5)'
          }}
        />

        {/* Side buttons - left (with 3D effect) */}
        <div
          className="absolute -left-[1.5px] top-[80px] w-[3px] h-[24px] rounded-l-sm"
          style={{
            background: 'linear-gradient(90deg, #c8c8cd 0%, #d8d8dd 50%, #e0e0e5 100%)',
            boxShadow: '-1px 0 2px rgba(0,0,0,0.1)'
          }}
        />
        <div
          className="absolute -left-[1.5px] top-[116px] w-[3px] h-[46px] rounded-l-sm"
          style={{
            background: 'linear-gradient(90deg, #c8c8cd 0%, #d8d8dd 50%, #e0e0e5 100%)',
            boxShadow: '-1px 0 2px rgba(0,0,0,0.1)'
          }}
        />
        <div
          className="absolute -left-[1.5px] top-[172px] w-[3px] h-[46px] rounded-l-sm"
          style={{
            background: 'linear-gradient(90deg, #c8c8cd 0%, #d8d8dd 50%, #e0e0e5 100%)',
            boxShadow: '-1px 0 2px rgba(0,0,0,0.1)'
          }}
        />

        {/* Side button - right (power) */}
        <div
          className="absolute -right-[1.5px] top-[130px] w-[3px] h-[64px] rounded-r-sm"
          style={{
            background: 'linear-gradient(270deg, #c8c8cd 0%, #d8d8dd 50%, #e0e0e5 100%)',
            boxShadow: '1px 0 2px rgba(0,0,0,0.1)'
          }}
        />

        {/* Inner bezel - sharp black edge */}
        <div
          className="relative rounded-[39px] p-[2px]"
          style={{
            background: '#1a1a1a',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)'
          }}
        >
          {/* Screen */}
          <div
            className="relative bg-white rounded-[37px] overflow-hidden"
            style={{
              aspectRatio: '9/19.5',
              boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.1)'
            }}
          >
            {/* Dynamic Island with camera details */}
            <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-20">
              <div
                className="relative w-[90px] h-[26px] rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
              >
                {/* Camera lens */}
                <div
                  className="absolute left-[18px] w-[10px] h-[10px] rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, #3a3a4a 0%, #1a1a2a 60%, #0a0a15 100%)',
                    boxShadow: 'inset 0 0 2px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1)'
                  }}
                >
                  {/* Lens reflection */}
                  <div
                    className="absolute top-[2px] left-[2px] w-[3px] h-[3px] rounded-full"
                    style={{ background: 'rgba(255,255,255,0.3)' }}
                  />
                </div>
                {/* Proximity sensor / Face ID */}
                <div
                  className="absolute right-[20px] w-[6px] h-[6px] rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #2a2a35 0%, #15151a 100%)'
                  }}
                />
              </div>
            </div>

            {/* Screen content area */}
            <div className="relative w-full h-full">
              {children || <PhonePlaceholder />}
            </div>

            {/* Home indicator */}
            <div
              className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[96px] h-[4px] rounded-full z-20"
              style={{
                background: 'linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.15) 100%)'
              }}
            />

            {/* Screen reflection overlay - subtle glass effect */}
            <div
              className="absolute inset-0 pointer-events-none z-10 rounded-[37px]"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 40%, transparent 60%)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Realistic drop shadow */}
      <div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[75%] h-[20px] rounded-[50%] blur-xl"
        style={{
          background: isHighlighted
            ? `radial-gradient(ellipse, ${glowColor}40 0%, transparent 70%)`
            : 'radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, transparent 70%)'
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
