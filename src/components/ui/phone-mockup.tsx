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
          className="absolute -inset-4 rounded-[58px] blur-2xl opacity-25"
          style={{ backgroundColor: glowColor }}
        />
      )}

      {/* Phone frame - iPhone 15 Pro titanium */}
      <div
        className={cn(
          'relative rounded-[55px] p-[3px]',
          isHighlighted && 'ring-1 ring-violet-400/20'
        )}
        style={{
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
          className="absolute inset-0 rounded-[55px] pointer-events-none"
          style={{
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5)'
          }}
        />

        {/* Side buttons - left */}
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

        {/* Inner bezel */}
        <div
          className="relative rounded-[52px]"
          style={{
            border: '2.5px solid #1d1d1f',
          }}
        >
          {/* Screen */}
          <div
            className="relative bg-white rounded-[50px] overflow-hidden"
            style={{
              aspectRatio: '9/19.5',
              boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.1)'
            }}
          >
            {/* Dynamic Island */}
            <div className="absolute top-[7px] left-1/2 -translate-x-1/2 z-20">
              <div
                className="relative flex items-center justify-center"
                style={{
                  width: '79px',
                  height: '23px',
                  borderRadius: '12px',
                  background: '#000000',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                {/* Camera lens */}
                <div
                  className="absolute left-[14px] w-[8px] h-[8px] rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, #3a3a4a 0%, #1a1a2a 60%, #0a0a15 100%)',
                    boxShadow: 'inset 0 0 2px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1)'
                  }}
                >
                  <div
                    className="absolute top-[1.5px] left-[1.5px] w-[2.5px] h-[2.5px] rounded-full"
                    style={{ background: 'rgba(255,255,255,0.3)' }}
                  />
                </div>
                {/* Face ID sensor */}
                <div
                  className="absolute right-[16px] w-[5px] h-[5px] rounded-full"
                  style={{ background: 'linear-gradient(135deg, #2a2a35 0%, #15151a 100%)' }}
                />
              </div>
            </div>

            {/* Status bar - pixel-perfect iPhone */}
            <div
              className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
              style={{ height: '34px' }}
            >
              {/* Time - left, vertically centered with Dynamic Island (center at 18.5px) */}
              <span
                className="absolute"
                style={{
                  left: '23px',
                  top: '18.5px',
                  transform: 'translateY(-50%)',
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

              {/* Icons - right, vertically centered with Dynamic Island */}
              <div
                className="absolute flex items-center"
                style={{
                  right: '23px',
                  top: '18.5px',
                  transform: 'translateY(-50%)',
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

            {/* Screen reflection overlay */}
            <div
              className="absolute inset-0 pointer-events-none z-10 rounded-[50px]"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 40%, transparent 60%)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Drop shadow */}
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
      <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4" />
      <div className="space-y-2 w-full max-w-[140px]">
        <div className="h-3 bg-gray-200 rounded-full w-full" />
        <div className="h-3 bg-gray-200 rounded-full w-3/4 mx-auto" />
        <div className="h-3 bg-gray-200 rounded-full w-1/2 mx-auto" />
      </div>
    </div>
  )
}
