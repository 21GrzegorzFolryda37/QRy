'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PhoneMockupProps {
  children?: ReactNode
  className?: string
  variant?: 'default' | 'highlighted'
  glowColor?: string
  statusBarColor?: string
}

export function PhoneMockup({
  children,
  className,
  variant = 'default',
  glowColor = '#6d28d9',
  statusBarColor = '#000000'
}: PhoneMockupProps) {
  const isHighlighted = variant === 'highlighted'

  return (
    <div className={cn('relative', className)}>
      {/* Glow effect for highlighted variant */}
      {isHighlighted && (
        <div
          className="absolute -inset-6 rounded-[64px] blur-3xl opacity-30"
          style={{ backgroundColor: glowColor }}
        />
      )}

      {/* Phone frame - dark bezel with gradient depth */}
      <div
        className="relative rounded-[55px] p-[13px]"
        style={{
          background: 'linear-gradient(135deg, #2a2a2a 0%, #0a0a0a 50%, #1a1a1a 100%)',
          boxShadow: isHighlighted
            ? `
              0 20px 60px rgba(0,0,0,0.3),
              0 8px 20px rgba(0,0,0,0.2),
              0 0 0 1px rgba(255,255,255,0.06),
              inset 0 1px 0 rgba(255,255,255,0.08),
              inset 0 -1px 0 rgba(0,0,0,0.3),
              0 0 80px ${glowColor}20
            `
            : `
              0 20px 60px rgba(0,0,0,0.3),
              0 8px 20px rgba(0,0,0,0.2),
              0 0 0 1px rgba(255,255,255,0.06),
              inset 0 1px 0 rgba(255,255,255,0.08),
              inset 0 -1px 0 rgba(0,0,0,0.3)
            `
        }}
      >
        {/* Subtle metallic edge highlight */}
        <div
          className="absolute inset-0 rounded-[55px] pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.03) 100%)',
          }}
        />

        {/* Side buttons - left (silent switch) */}
        <div
          className="absolute -left-[2px] top-[85px] w-[4px] h-[22px] rounded-l-sm"
          style={{
            background: 'linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
            boxShadow: '-1px 0 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
          }}
        />
        {/* Volume up */}
        <div
          className="absolute -left-[2px] top-[120px] w-[4px] h-[42px] rounded-l-sm"
          style={{
            background: 'linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
            boxShadow: '-1px 0 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
          }}
        />
        {/* Volume down */}
        <div
          className="absolute -left-[2px] top-[172px] w-[4px] h-[42px] rounded-l-sm"
          style={{
            background: 'linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
            boxShadow: '-1px 0 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
          }}
        />

        {/* Power button - right */}
        <div
          className="absolute -right-[2px] top-[135px] w-[4px] h-[58px] rounded-r-sm"
          style={{
            background: 'linear-gradient(270deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
            boxShadow: '1px 0 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
          }}
        />

        {/* Screen */}
        <div
          className="relative rounded-[47px] overflow-hidden"
          style={{
            aspectRatio: '9/19.5',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05), inset 0 0 8px rgba(0,0,0,0.03)'
          }}
        >
          {/* Dynamic Island */}
          <div className="absolute top-[11px] left-1/2 -translate-x-1/2 z-20">
            <div
              className="relative flex items-center justify-center"
              style={{
                width: '79px',
                height: '23px',
                borderRadius: '12px',
                background: '#000000',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.3)'
              }}
            >
              {/* Camera lens */}
              <div
                className="absolute left-[14px] w-[8px] h-[8px] rounded-full"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #3a3a4a 0%, #1a1a2a 60%, #0a0a15 100%)',
                  boxShadow: 'inset 0 0 3px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1)'
                }}
              >
                <div
                  className="absolute top-[1.5px] left-[1.5px] w-[2.5px] h-[2.5px] rounded-full"
                  style={{ background: 'rgba(255,255,255,0.35)' }}
                />
              </div>
              {/* Face ID sensor */}
              <div
                className="absolute right-[16px] w-[5px] h-[5px] rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #2a2a35 0%, #0f0f15 100%)',
                  boxShadow: 'inset 0 0 2px rgba(0,0,0,0.4)'
                }}
              />
            </div>
          </div>

          {/* Status bar */}
          <div
            className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
            style={{ height: '34px' }}
          >
            {/* Time */}
            <span
              className="absolute"
              style={{
                left: '21px',
                top: '14px',
                fontFamily: '-apple-system, "SF Pro Text", "Helvetica Neue", sans-serif',
                fontSize: '10px',
                fontWeight: 600,
                lineHeight: 1,
                color: statusBarColor,
                letterSpacing: '0.2px'
              }}
            >
              9:41
            </span>

            {/* Icons */}
            <div
              className="absolute flex items-center"
              style={{
                right: '21px',
                top: '14px',
                gap: '3px'
              }}
            >
              {/* Cellular signal */}
              <svg width="11" height="8" viewBox="0 0 17 11" fill="none">
                <rect x="0" y="7" width="3" height="4" rx="0.5" fill={statusBarColor} />
                <rect x="4.5" y="5" width="3" height="6" rx="0.5" fill={statusBarColor} />
                <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" fill={statusBarColor} />
                <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill={statusBarColor} />
              </svg>

              {/* WiFi */}
              <svg width="10" height="8" viewBox="0 0 16 12" fill={statusBarColor}>
                <path d="M8 9.6a1.8 1.8 0 0 1 1.3.55l-1.3 1.45-1.3-1.45A1.8 1.8 0 0 1 8 9.6zm-3.1-2.5a5.1 5.1 0 0 1 6.2 0l-1 1.15a3.5 3.5 0 0 0-4.2 0l-1-1.15zm-2.65-2.6a8.5 8.5 0 0 1 11.5 0l-1 1.1a7 7 0 0 0-9.5 0l-1-1.1zM.08 2.4a11.7 11.7 0 0 1 15.84 0l-1 1.1A10.2 10.2 0 0 0 1.08 3.5l-1-1.1z" />
              </svg>

              {/* Battery */}
              <div className="flex items-center" style={{ gap: '1.5px' }}>
                <div
                  style={{
                    width: '16px',
                    height: '8px',
                    border: `1px solid ${statusBarColor}`,
                    borderRadius: '2px',
                    padding: '1px',
                    opacity: 0.9
                  }}
                >
                  <div
                    style={{
                      width: '70%',
                      height: '100%',
                      background: statusBarColor,
                      borderRadius: '1px'
                    }}
                  />
                </div>
                <div
                  style={{
                    width: '1px',
                    height: '3px',
                    background: statusBarColor,
                    borderRadius: '0 1px 1px 0',
                    opacity: 0.5
                  }}
                />
              </div>
            </div>
          </div>

          {/* Screen content */}
          <div className="relative w-full h-full">
            {children || <PhonePlaceholder />}
          </div>

          {/* Home indicator */}
          <div
            className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[96px] h-[4px] rounded-full z-20"
            style={{
              background: 'linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.15) 100%)'
            }}
          />

          {/* Screen reflection */}
          <div
            className="absolute inset-0 pointer-events-none z-10 rounded-[47px]"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 35%, transparent 55%)'
            }}
          />
        </div>
      </div>

      {/* Drop shadow */}
      <div
        className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[70%] h-[24px] rounded-[50%] blur-xl"
        style={{
          background: isHighlighted
            ? `radial-gradient(ellipse, ${glowColor}50 0%, transparent 70%)`
            : 'radial-gradient(ellipse, rgba(0,0,0,0.25) 0%, transparent 70%)'
        }}
      />
    </div>
  )
}

function PhonePlaceholder() {
  return (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4" />
      <div className="space-y-2 w-full max-w-[140px]">
        <div className="h-3 bg-gray-200 rounded-full w-full" />
        <div className="h-3 bg-gray-200 rounded-full w-3/4 mx-auto" />
        <div className="h-3 bg-gray-200 rounded-full w-1/2 mx-auto" />
      </div>
    </div>
  )
}
