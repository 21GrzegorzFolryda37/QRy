'use client'

import { useId } from 'react'
import { FrameOptions, FrameStyle, GradientOptions } from '@/types/database'

interface FrameRendererProps {
  children: React.ReactNode
  frame: FrameOptions | null
  size: number
  className?: string
}

// Frame dimensions relative to QR code size
const FRAME_PADDING = 0.08 // 8% padding around QR
const TEXT_AREA_HEIGHT = 0.12 // 12% for text area

export function FrameRenderer({ children, frame, size, className }: FrameRendererProps) {
  const gradientId = useId()

  // Always calculate dimensions (use minimal padding for 'none' to keep children stable)
  const hasFrame = frame && frame.style !== 'none'
  const padding = hasFrame ? Math.round(size * FRAME_PADDING) : 0
  const textHeight = hasFrame && frame.showText ? Math.round(size * TEXT_AREA_HEIGHT) : 0
  const totalWidth = size + padding * 2
  const totalHeight = size + padding * 2 + textHeight

  const fillValue = hasFrame && frame.gradient ? `url(#${gradientId})` : (frame?.color || '#000000')
  const frameStyleResult = hasFrame ? getFrameStyle(frame.style, fillValue, frame.color, totalWidth, totalHeight, padding) : null

  // Always render the same structure - children always at the same DOM position
  return (
    <div className={className} style={{ width: totalWidth, height: totalHeight, position: 'relative' }}>
      {/* SVG frame - always rendered, just empty when no frame */}
      <svg
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="absolute inset-0"
        style={{ opacity: hasFrame ? 1 : 0, pointerEvents: hasFrame ? 'auto' : 'none' }}
      >
        {/* Gradient definition - always rendered */}
        <defs>
          {frame?.gradient && frame.gradient.type === 'linear' ? (
            <linearGradient
              id={gradientId}
              gradientTransform={`rotate(${frame.gradient.rotation}, 0.5, 0.5)`}
            >
              {frame.gradient.colorStops.map((stop, i) => (
                <stop key={i} offset={`${stop.offset * 100}%`} stopColor={stop.color} />
              ))}
            </linearGradient>
          ) : frame?.gradient ? (
            <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
              {frame.gradient.colorStops.map((stop, i) => (
                <stop key={i} offset={`${stop.offset * 100}%`} stopColor={stop.color} />
              ))}
            </radialGradient>
          ) : null}
        </defs>
        {frameStyleResult?.background}
        {frameStyleResult?.decoration}
        {hasFrame && frame.showText && frame.text && (
          <text
            x={totalWidth / 2}
            y={size + padding * 2 + textHeight / 2 + 4}
            textAnchor="middle"
            fill={frame.textColor}
            fontSize={Math.round(textHeight * 0.5)}
            fontWeight="bold"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {frame.text}
          </text>
        )}
      </svg>
      {/* Children container - ALWAYS at the same position in the DOM */}
      <div
        className="absolute"
        style={{
          left: padding,
          top: padding,
          width: size,
          height: size,
        }}
      >
        {children}
      </div>
    </div>
  )
}

interface FrameStyleResult {
  background: React.ReactNode
  decoration: React.ReactNode
}

function getFrameStyle(
  style: FrameStyle,
  fill: string,
  solidColor: string,
  width: number,
  height: number,
  padding: number
): FrameStyleResult {
  const qrSize = width - padding * 2

  switch (style) {
    case 'simple':
      return {
        background: (
          <rect x={0} y={0} width={width} height={height} fill={fill} rx={8} />
        ),
        decoration: (
          <rect
            x={padding - 4}
            y={padding - 4}
            width={qrSize + 8}
            height={qrSize + 8}
            fill="white"
            rx={4}
          />
        ),
      }

    case 'rounded':
      return {
        background: (
          <rect x={0} y={0} width={width} height={height} fill={fill} rx={24} />
        ),
        decoration: (
          <rect
            x={padding - 4}
            y={padding - 4}
            width={qrSize + 8}
            height={qrSize + 8}
            fill="white"
            rx={16}
          />
        ),
      }

    case 'fancy':
      return {
        background: (
          <>
            <rect x={0} y={0} width={width} height={height} fill={fill} rx={8} />
            <rect
              x={4}
              y={4}
              width={width - 8}
              height={height - 8}
              fill="none"
              stroke="white"
              strokeWidth={2}
              strokeDasharray="6,4"
              rx={6}
            />
          </>
        ),
        decoration: (
          <rect
            x={padding - 2}
            y={padding - 2}
            width={qrSize + 4}
            height={qrSize + 4}
            fill="white"
            rx={4}
          />
        ),
      }

    case 'ticket':
      const notchSize = 12
      return {
        background: (
          <path
            d={`
              M ${notchSize} 0
              L ${width - notchSize} 0
              Q ${width} 0 ${width} ${notchSize}
              L ${width} ${height * 0.4 - notchSize}
              Q ${width - notchSize} ${height * 0.4 - notchSize} ${width - notchSize} ${height * 0.4}
              Q ${width - notchSize} ${height * 0.4 + notchSize} ${width} ${height * 0.4 + notchSize}
              L ${width} ${height - notchSize}
              Q ${width} ${height} ${width - notchSize} ${height}
              L ${notchSize} ${height}
              Q 0 ${height} 0 ${height - notchSize}
              L 0 ${height * 0.4 + notchSize}
              Q ${notchSize} ${height * 0.4 + notchSize} ${notchSize} ${height * 0.4}
              Q ${notchSize} ${height * 0.4 - notchSize} 0 ${height * 0.4 - notchSize}
              L 0 ${notchSize}
              Q 0 0 ${notchSize} 0
              Z
            `}
            fill={fill}
          />
        ),
        decoration: (
          <rect
            x={padding - 2}
            y={padding - 2}
            width={qrSize + 4}
            height={qrSize + 4}
            fill="white"
            rx={4}
          />
        ),
      }

    case 'balloon':
      const arrowSize = 16
      return {
        background: (
          <path
            d={`
              M 12 0
              L ${width - 12} 0
              Q ${width} 0 ${width} 12
              L ${width} ${height - arrowSize - 12}
              Q ${width} ${height - arrowSize} ${width - 12} ${height - arrowSize}
              L ${width / 2 + arrowSize} ${height - arrowSize}
              L ${width / 2} ${height}
              L ${width / 2 - arrowSize} ${height - arrowSize}
              L 12 ${height - arrowSize}
              Q 0 ${height - arrowSize} 0 ${height - arrowSize - 12}
              L 0 12
              Q 0 0 12 0
              Z
            `}
            fill={fill}
          />
        ),
        decoration: (
          <rect
            x={padding - 2}
            y={padding - 2}
            width={qrSize + 4}
            height={qrSize + 4}
            fill="white"
            rx={4}
          />
        ),
      }

    case 'badge':
      const ribbonWidth = width * 0.35
      const ribbonHeight = height * 0.15
      return {
        background: (
          <>
            <circle cx={width / 2} cy={width / 2} r={width / 2 - 2} fill={fill} />
            {/* Ribbon */}
            <rect
              x={(width - ribbonWidth) / 2}
              y={height - ribbonHeight - 4}
              width={ribbonWidth}
              height={ribbonHeight}
              fill={fill}
            />
            <polygon
              points={`
                ${(width - ribbonWidth) / 2},${height - ribbonHeight - 4}
                ${width / 2},${height - ribbonHeight / 2 - 4}
                ${(width + ribbonWidth) / 2},${height - ribbonHeight - 4}
              `}
              fill={fill}
            />
          </>
        ),
        decoration: (
          <circle cx={width / 2} cy={width / 2} r={qrSize / 2 + 4} fill="white" />
        ),
      }

    case 'banner':
      const foldSize = 10
      return {
        background: (
          <>
            <rect x={0} y={foldSize} width={width} height={height - foldSize} fill={fill} />
            {/* Shadow folds */}
            <polygon
              points={`0,${height} ${foldSize},${height - foldSize} 0,${height - foldSize}`}
              fill={adjustColor(solidColor, -30)}
            />
            <polygon
              points={`${width},${height} ${width - foldSize},${height - foldSize} ${width},${height - foldSize}`}
              fill={adjustColor(solidColor, -30)}
            />
          </>
        ),
        decoration: (
          <rect
            x={padding - 2}
            y={padding + foldSize - 2}
            width={qrSize + 4}
            height={qrSize + 4}
            fill="white"
            rx={4}
          />
        ),
      }

    case 'minimal':
      const cornerLength = 20
      const cornerWidth = 4
      return {
        background: <></>,
        decoration: (
          <>
            {/* Top-left corner */}
            <path
              d={`M ${padding - 8} ${padding - 8} L ${padding - 8} ${padding - 8 + cornerLength} M ${padding - 8} ${padding - 8} L ${padding - 8 + cornerLength} ${padding - 8}`}
              stroke={fill}
              strokeWidth={cornerWidth}
              strokeLinecap="round"
              fill="none"
            />
            {/* Top-right corner */}
            <path
              d={`M ${width - padding + 8} ${padding - 8} L ${width - padding + 8} ${padding - 8 + cornerLength} M ${width - padding + 8} ${padding - 8} L ${width - padding + 8 - cornerLength} ${padding - 8}`}
              stroke={fill}
              strokeWidth={cornerWidth}
              strokeLinecap="round"
              fill="none"
            />
            {/* Bottom-left corner */}
            <path
              d={`M ${padding - 8} ${padding + qrSize + 8} L ${padding - 8} ${padding + qrSize + 8 - cornerLength} M ${padding - 8} ${padding + qrSize + 8} L ${padding - 8 + cornerLength} ${padding + qrSize + 8}`}
              stroke={fill}
              strokeWidth={cornerWidth}
              strokeLinecap="round"
              fill="none"
            />
            {/* Bottom-right corner */}
            <path
              d={`M ${width - padding + 8} ${padding + qrSize + 8} L ${width - padding + 8} ${padding + qrSize + 8 - cornerLength} M ${width - padding + 8} ${padding + qrSize + 8} L ${width - padding + 8 - cornerLength} ${padding + qrSize + 8}`}
              stroke={fill}
              strokeWidth={cornerWidth}
              strokeLinecap="round"
              fill="none"
            />
          </>
        ),
      }

    case 'arrow':
      const arrowHeight = 16
      return {
        background: (
          <>
            <polygon points={`${width / 2},0 ${width / 2 + 20},${arrowHeight} ${width / 2 - 20},${arrowHeight}`} fill={fill} />
            <rect x={0} y={arrowHeight} width={width} height={height - arrowHeight} fill={fill} rx={8} />
          </>
        ),
        decoration: (
          <rect
            x={padding - 4}
            y={padding - 4 + arrowHeight}
            width={qrSize + 8}
            height={qrSize + 8}
            fill="white"
            rx={4}
          />
        ),
      }

    case 'chat':
      const tailSize = 16
      return {
        background: (
          <path
            d={`
              M 12 0
              L ${width - 12} 0
              Q ${width} 0 ${width} 12
              L ${width} ${height - tailSize - 12}
              Q ${width} ${height - tailSize} ${width - 12} ${height - tailSize}
              L ${tailSize + 12} ${height - tailSize}
              L 0 ${height}
              L 0 12
              Q 0 0 12 0
              Z
            `}
            fill={fill}
          />
        ),
        decoration: (
          <rect
            x={padding - 2}
            y={padding - 2}
            width={qrSize + 4}
            height={qrSize + 4}
            fill="white"
            rx={4}
          />
        ),
      }

    case 'ribbon': {
      const ribbonBannerHeight = 20
      return {
        background: (
          <>
            <rect x={0} y={ribbonBannerHeight} width={width} height={height - ribbonBannerHeight} fill={fill} rx={8} />
            {/* Ribbon banner */}
            <path d={`M -10 ${ribbonBannerHeight / 2} L ${width + 10} ${ribbonBannerHeight / 2} L ${width + 10} ${ribbonBannerHeight} L ${width / 2} ${ribbonBannerHeight - 6} L -10 ${ribbonBannerHeight} Z`} fill={fill} />
          </>
        ),
        decoration: (
          <rect
            x={padding - 4}
            y={padding - 4 + ribbonBannerHeight}
            width={qrSize + 8}
            height={qrSize + 8}
            fill="white"
            rx={4}
          />
        ),
      }
    }

    case 'stamp':
      const stampBorder = 6
      return {
        background: (
          <>
            <rect x={0} y={0} width={width} height={height} fill={fill} rx={4} />
            <rect x={stampBorder} y={stampBorder} width={width - stampBorder * 2} height={height - stampBorder * 2} fill="white" rx={2} />
            <rect x={stampBorder + 2} y={stampBorder + 2} width={width - stampBorder * 2 - 4} height={height - stampBorder * 2 - 4} fill={fill} rx={2} stroke="white" strokeWidth="3" strokeDasharray="8,4" />
          </>
        ),
        decoration: (
          <rect
            x={padding}
            y={padding}
            width={qrSize}
            height={qrSize}
            fill="white"
            rx={4}
          />
        ),
      }

    case 'circle':
      const radius = Math.min(width, qrSize + padding * 2) / 2
      return {
        background: (
          <circle cx={width / 2} cy={radius} r={radius} fill={fill} />
        ),
        decoration: (
          <circle cx={width / 2} cy={radius} r={qrSize / 2 + 8} fill="white" />
        ),
      }

    case 'hexagon':
      const hexH = qrSize + padding * 2
      const hexW = width
      return {
        background: (
          <polygon
            points={`${hexW / 2},0 ${hexW},${hexH * 0.25} ${hexW},${hexH * 0.75} ${hexW / 2},${hexH} 0,${hexH * 0.75} 0,${hexH * 0.25}`}
            fill={fill}
          />
        ),
        decoration: (
          <polygon
            points={`${hexW / 2},${padding - 4} ${hexW - padding + 4},${hexH * 0.25} ${hexW - padding + 4},${hexH * 0.75} ${hexW / 2},${hexH - padding + 4} ${padding - 4},${hexH * 0.75} ${padding - 4},${hexH * 0.25}`}
            fill="white"
          />
        ),
      }

    case 'shield':
      return {
        background: (
          <path
            d={`M ${width / 2} 0 L ${width} ${height * 0.12} L ${width} ${height * 0.55} Q ${width} ${height * 0.85} ${width / 2} ${height} Q 0 ${height * 0.85} 0 ${height * 0.55} L 0 ${height * 0.12} Z`}
            fill={fill}
          />
        ),
        decoration: (
          <path
            d={`M ${width / 2} ${padding - 4} L ${width - padding + 4} ${height * 0.12 + 4} L ${width - padding + 4} ${height * 0.55 - 4} Q ${width - padding + 4} ${height * 0.78} ${width / 2} ${height - padding - 8} Q ${padding - 4} ${height * 0.78} ${padding - 4} ${height * 0.55 - 4} L ${padding - 4} ${height * 0.12 + 4} Z`}
            fill="white"
          />
        ),
      }

    case 'tag':
      const holeRadius = 8
      return {
        background: (
          <path
            d={`M 12 0 L ${width - 12} 0 Q ${width} 0 ${width} 12 L ${width} ${height - 20} L ${width / 2} ${height} L 0 ${height - 20} L 0 12 Q 0 0 12 0`}
            fill={fill}
          />
        ),
        decoration: (
          <>
            <circle cx={padding} cy={padding} r={holeRadius} fill="white" />
            <rect
              x={padding - 4}
              y={padding + holeRadius + 4}
              width={qrSize + 8}
              height={qrSize + 8}
              fill="white"
              rx={4}
            />
          </>
        ),
      }

    case 'heart':
      const heartScale = width / 60
      return {
        background: (
          <path
            d={`M ${width / 2} ${height * 0.85} C ${width * 0.15} ${height * 0.6} 0 ${height * 0.4} 0 ${height * 0.25} C 0 ${height * 0.1} ${width * 0.18} 0 ${width * 0.33} 0 C ${width * 0.43} 0 ${width / 2} ${height * 0.1} ${width / 2} ${height * 0.1} C ${width / 2} ${height * 0.1} ${width * 0.57} 0 ${width * 0.67} 0 C ${width * 0.82} 0 ${width} ${height * 0.1} ${width} ${height * 0.25} C ${width} ${height * 0.4} ${width * 0.85} ${height * 0.6} ${width / 2} ${height * 0.85}`}
            fill={fill}
          />
        ),
        decoration: (
          <ellipse cx={width / 2} cy={height * 0.4} rx={qrSize / 2 + 4} ry={qrSize / 2.2} fill="white" />
        ),
      }

    case 'phone':
      const phoneRadius = 12
      const screenTop = 24
      const screenBottom = height - 32
      const buttonY = height - 18
      return {
        background: (
          <rect x={0} y={0} width={width} height={height} fill={fill} rx={phoneRadius} />
        ),
        decoration: (
          <>
            {/* Speaker */}
            <rect x={width / 2 - 20} y={10} width={40} height={6} fill="white" rx={3} />
            {/* Screen */}
            <rect x={padding - 6} y={screenTop} width={qrSize + 12} height={screenBottom - screenTop} fill="white" rx={4} />
            {/* Home button */}
            <circle cx={width / 2} cy={buttonY} r={10} fill="white" fillOpacity={0.3} stroke="white" strokeWidth={2} />
          </>
        ),
      }

    default:
      return { background: <></>, decoration: <></> }
  }
}

// Helper to darken/lighten color
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// Export frame dimensions calculator for use in export
export function getFrameDimensions(qrSize: number, frame: FrameOptions | null) {
  if (!frame || frame.style === 'none') {
    return { width: qrSize, height: qrSize, padding: 0, textHeight: 0 }
  }

  const padding = Math.round(qrSize * FRAME_PADDING)
  const textHeight = frame.showText ? Math.round(qrSize * TEXT_AREA_HEIGHT) : 0

  return {
    width: qrSize + padding * 2,
    height: qrSize + padding * 2 + textHeight,
    padding,
    textHeight,
  }
}
