'use client'

import { useId } from 'react'
import { FrameOptions, FrameStyle, GradientOptions } from '@/types/database'

interface FrameRendererProps {
  children: React.ReactNode
  frame: FrameOptions | null
  size: number
  className?: string
}

// Frame dimensions - thin border around QR
const FRAME_BORDER = 8 // Fixed 8px border around QR
const TEXT_AREA_HEIGHT = 28 // Fixed height for text

export function FrameRenderer({ children, frame, size, className }: FrameRendererProps) {
  const gradientId = useId()

  const hasFrame = frame && frame.style !== 'none'
  const border = hasFrame ? FRAME_BORDER : 0
  const textHeight = hasFrame && frame.showText ? TEXT_AREA_HEIGHT : 0
  const totalWidth = size + border * 2
  const totalHeight = size + border * 2 + textHeight

  const fillValue = hasFrame && frame.gradient ? `url(#${gradientId})` : (frame?.color || '#000000')
  const frameStyleResult = hasFrame ? getFrameStyle(frame.style, fillValue, frame.color, totalWidth, totalHeight, border, size) : null

  return (
    <div className={className} style={{ width: totalWidth, height: totalHeight, position: 'relative' }}>
      {/* SVG frame */}
      <svg
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="absolute inset-0"
        style={{ opacity: hasFrame ? 1 : 0, pointerEvents: hasFrame ? 'auto' : 'none' }}
      >
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
            y={size + border * 2 + textHeight / 2 + 5}
            textAnchor="middle"
            fill={frame.textColor}
            fontSize={14}
            fontWeight="bold"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {frame.text}
          </text>
        )}
      </svg>
      {/* QR code container */}
      <div
        className="absolute"
        style={{
          left: border,
          top: border,
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
  border: number,
  qrSize: number
): FrameStyleResult {
  // QR positioned at (border, border) with size qrSize
  const qrLeft = border
  const qrTop = border
  const qrRight = border + qrSize
  const qrBottom = border + qrSize
  const cx = width / 2
  const cy = border + qrSize / 2

  switch (style) {
    case 'simple':
      return {
        background: (
          <rect x={0} y={0} width={width} height={height} fill={fill} rx={4} />
        ),
        decoration: (
          <rect x={qrLeft - 2} y={qrTop - 2} width={qrSize + 4} height={qrSize + 4} fill="white" rx={2} />
        ),
      }

    case 'rounded':
      return {
        background: (
          <rect x={0} y={0} width={width} height={height} fill={fill} rx={16} />
        ),
        decoration: (
          <rect x={qrLeft - 2} y={qrTop - 2} width={qrSize + 4} height={qrSize + 4} fill="white" rx={8} />
        ),
      }

    case 'fancy':
      return {
        background: (
          <>
            <rect x={0} y={0} width={width} height={height} fill={fill} rx={4} />
            <rect x={3} y={3} width={width - 6} height={height - 6} fill="none" stroke="white" strokeWidth={1.5} rx={3} strokeDasharray="4,3" />
          </>
        ),
        decoration: (
          <rect x={qrLeft - 1} y={qrTop - 1} width={qrSize + 2} height={qrSize + 2} fill="white" rx={2} />
        ),
      }

    case 'ticket': {
      const notchSize = 8
      const notchY = height * 0.42
      return {
        background: (
          <path
            d={`
              M ${notchSize} 0 L ${width - notchSize} 0 Q ${width} 0 ${width} ${notchSize}
              L ${width} ${notchY - notchSize} Q ${width - notchSize} ${notchY - notchSize} ${width - notchSize} ${notchY}
              Q ${width - notchSize} ${notchY + notchSize} ${width} ${notchY + notchSize}
              L ${width} ${height - notchSize} Q ${width} ${height} ${width - notchSize} ${height}
              L ${notchSize} ${height} Q 0 ${height} 0 ${height - notchSize}
              L 0 ${notchY + notchSize} Q ${notchSize} ${notchY + notchSize} ${notchSize} ${notchY}
              Q ${notchSize} ${notchY - notchSize} 0 ${notchY - notchSize}
              L 0 ${notchSize} Q 0 0 ${notchSize} 0 Z
            `}
            fill={fill}
          />
        ),
        decoration: (
          <rect x={qrLeft - 1} y={qrTop - 1} width={qrSize + 2} height={qrSize + 2} fill="white" rx={2} />
        ),
      }
    }

    case 'balloon': {
      const arrowH = 12
      const bodyHeight = height - arrowH
      return {
        background: (
          <path
            d={`
              M 8 0 L ${width - 8} 0 Q ${width} 0 ${width} 8
              L ${width} ${bodyHeight - 8} Q ${width} ${bodyHeight} ${width - 8} ${bodyHeight}
              L ${cx + 12} ${bodyHeight} L ${cx} ${height} L ${cx - 12} ${bodyHeight}
              L 8 ${bodyHeight} Q 0 ${bodyHeight} 0 ${bodyHeight - 8}
              L 0 8 Q 0 0 8 0 Z
            `}
            fill={fill}
          />
        ),
        decoration: (
          <rect x={qrLeft - 1} y={qrTop - 1} width={qrSize + 2} height={qrSize + 2} fill="white" rx={2} />
        ),
      }
    }

    case 'badge': {
      const circleR = (qrSize / 2) + border + 2
      const ribbonW = qrSize * 0.4
      const ribbonH = 20
      return {
        background: (
          <>
            <circle cx={cx} cy={cy} r={circleR} fill={fill} />
            <rect x={cx - ribbonW / 2} y={height - ribbonH - 2} width={ribbonW} height={ribbonH} fill={fill} />
            <polygon points={`${cx - ribbonW / 2},${height - ribbonH - 2} ${cx},${height - ribbonH / 2 - 2} ${cx + ribbonW / 2},${height - ribbonH - 2}`} fill={fill} />
          </>
        ),
        decoration: (
          <circle cx={cx} cy={cy} r={qrSize / 2 + 2} fill="white" />
        ),
      }
    }

    case 'banner': {
      const foldSize = 6
      return {
        background: (
          <>
            <rect x={0} y={foldSize} width={width} height={height - foldSize} fill={fill} />
            <polygon points={`0,${height} ${foldSize},${height - foldSize} 0,${height - foldSize}`} fill={adjustColor(solidColor, -30)} />
            <polygon points={`${width},${height} ${width - foldSize},${height - foldSize} ${width},${height - foldSize}`} fill={adjustColor(solidColor, -30)} />
          </>
        ),
        decoration: (
          <rect x={qrLeft - 1} y={qrTop + foldSize - 1} width={qrSize + 2} height={qrSize + 2} fill="white" rx={2} />
        ),
      }
    }

    case 'minimal': {
      const cornerLen = 16
      const cornerW = 3
      const offset = 4
      return {
        background: <></>,
        decoration: (
          <>
            <path d={`M ${qrLeft - offset} ${qrTop - offset} L ${qrLeft - offset} ${qrTop - offset + cornerLen} M ${qrLeft - offset} ${qrTop - offset} L ${qrLeft - offset + cornerLen} ${qrTop - offset}`} stroke={fill} strokeWidth={cornerW} strokeLinecap="round" fill="none" />
            <path d={`M ${qrRight + offset} ${qrTop - offset} L ${qrRight + offset} ${qrTop - offset + cornerLen} M ${qrRight + offset} ${qrTop - offset} L ${qrRight + offset - cornerLen} ${qrTop - offset}`} stroke={fill} strokeWidth={cornerW} strokeLinecap="round" fill="none" />
            <path d={`M ${qrLeft - offset} ${qrBottom + offset} L ${qrLeft - offset} ${qrBottom + offset - cornerLen} M ${qrLeft - offset} ${qrBottom + offset} L ${qrLeft - offset + cornerLen} ${qrBottom + offset}`} stroke={fill} strokeWidth={cornerW} strokeLinecap="round" fill="none" />
            <path d={`M ${qrRight + offset} ${qrBottom + offset} L ${qrRight + offset} ${qrBottom + offset - cornerLen} M ${qrRight + offset} ${qrBottom + offset} L ${qrRight + offset - cornerLen} ${qrBottom + offset}`} stroke={fill} strokeWidth={cornerW} strokeLinecap="round" fill="none" />
          </>
        ),
      }
    }

    case 'arrow': {
      const arrowH = 12
      return {
        background: (
          <>
            <polygon points={`${cx},0 ${cx + 16},${arrowH} ${cx - 16},${arrowH}`} fill={fill} />
            <rect x={0} y={arrowH} width={width} height={height - arrowH} fill={fill} rx={4} />
          </>
        ),
        decoration: (
          <rect x={qrLeft - 2} y={qrTop + arrowH - 2} width={qrSize + 4} height={qrSize + 4} fill="white" rx={2} />
        ),
      }
    }

    case 'chat': {
      const tailSize = 12
      const bodyHeight = height - tailSize
      return {
        background: (
          <path
            d={`
              M 8 0 L ${width - 8} 0 Q ${width} 0 ${width} 8
              L ${width} ${bodyHeight - 8} Q ${width} ${bodyHeight} ${width - 8} ${bodyHeight}
              L ${tailSize + 8} ${bodyHeight} L 0 ${height}
              L 0 8 Q 0 0 8 0 Z
            `}
            fill={fill}
          />
        ),
        decoration: (
          <rect x={qrLeft - 1} y={qrTop - 1} width={qrSize + 2} height={qrSize + 2} fill="white" rx={2} />
        ),
      }
    }

    case 'ribbon': {
      const ribbonH = 14
      return {
        background: (
          <>
            <rect x={0} y={ribbonH} width={width} height={height - ribbonH} fill={fill} rx={4} />
            <path d={`M -6 ${ribbonH / 2} L ${width + 6} ${ribbonH / 2} L ${width + 6} ${ribbonH} L ${cx} ${ribbonH - 4} L -6 ${ribbonH} Z`} fill={fill} />
          </>
        ),
        decoration: (
          <rect x={qrLeft - 2} y={qrTop + ribbonH - 2} width={qrSize + 4} height={qrSize + 4} fill="white" rx={2} />
        ),
      }
    }

    case 'stamp': {
      const stampB = 4
      return {
        background: (
          <>
            <rect x={0} y={0} width={width} height={height} fill={fill} rx={2} />
            <rect x={stampB} y={stampB} width={width - stampB * 2} height={height - stampB * 2} fill="white" rx={1} />
            <rect x={stampB + 2} y={stampB + 2} width={width - stampB * 2 - 4} height={height - stampB * 2 - 4} fill={fill} rx={1} stroke="white" strokeWidth={2} strokeDasharray="6,3" />
          </>
        ),
        decoration: (
          <rect x={qrLeft} y={qrTop} width={qrSize} height={qrSize} fill="white" rx={2} />
        ),
      }
    }

    case 'circle': {
      const r = qrSize / 2 + border + 2
      return {
        background: (
          <circle cx={cx} cy={cy} r={r} fill={fill} />
        ),
        decoration: (
          <circle cx={cx} cy={cy} r={qrSize / 2 + 2} fill="white" />
        ),
      }
    }

    case 'hexagon': {
      // Hexagon that tightly wraps the QR code
      const hexR = qrSize / 2 + border + 2 // outer radius
      const innerR = qrSize / 2 + 2 // inner white radius
      // Hexagon points for outer shape
      const outerPoints = hexagonPoints(cx, cy, hexR)
      const innerPoints = hexagonPoints(cx, cy, innerR)
      return {
        background: (
          <polygon points={outerPoints} fill={fill} />
        ),
        decoration: (
          <polygon points={innerPoints} fill="white" />
        ),
      }
    }

    case 'shield': {
      const shieldH = qrSize + border * 2 + 10
      return {
        background: (
          <path
            d={`M ${cx} 0 L ${width} ${shieldH * 0.1} L ${width} ${shieldH * 0.55} Q ${width} ${shieldH * 0.85} ${cx} ${shieldH} Q 0 ${shieldH * 0.85} 0 ${shieldH * 0.55} L 0 ${shieldH * 0.1} Z`}
            fill={fill}
          />
        ),
        decoration: (
          <path
            d={`M ${cx} ${border - 2} L ${width - border + 2} ${shieldH * 0.1 + 2} L ${width - border + 2} ${shieldH * 0.55 - 2} Q ${width - border + 2} ${shieldH * 0.78} ${cx} ${shieldH - border - 4} Q ${border - 2} ${shieldH * 0.78} ${border - 2} ${shieldH * 0.55 - 2} L ${border - 2} ${shieldH * 0.1 + 2} Z`}
            fill="white"
          />
        ),
      }
    }

    case 'tag': {
      const holeR = 5
      const pointH = 14
      return {
        background: (
          <path d={`M 8 0 L ${width - 8} 0 Q ${width} 0 ${width} 8 L ${width} ${height - pointH} L ${cx} ${height} L 0 ${height - pointH} L 0 8 Q 0 0 8 0`} fill={fill} />
        ),
        decoration: (
          <>
            <circle cx={border + 2} cy={border + 2} r={holeR} fill="white" />
            <rect x={qrLeft - 2} y={qrTop + holeR + 2} width={qrSize + 4} height={qrSize + 4} fill="white" rx={2} />
          </>
        ),
      }
    }

    case 'heart': {
      // Heart shape centered on QR
      const heartH = qrSize + border * 2 + 8
      const heartW = width
      return {
        background: (
          <path
            d={`M ${cx} ${heartH * 0.88} C ${heartW * 0.12} ${heartH * 0.6} 0 ${heartH * 0.4} 0 ${heartH * 0.25} C 0 ${heartH * 0.1} ${heartW * 0.18} 0 ${heartW * 0.35} 0 C ${heartW * 0.44} 0 ${cx} ${heartH * 0.12} ${cx} ${heartH * 0.12} C ${cx} ${heartH * 0.12} ${heartW * 0.56} 0 ${heartW * 0.65} 0 C ${heartW * 0.82} 0 ${heartW} ${heartH * 0.1} ${heartW} ${heartH * 0.25} C ${heartW} ${heartH * 0.4} ${heartW * 0.88} ${heartH * 0.6} ${cx} ${heartH * 0.88}`}
            fill={fill}
          />
        ),
        decoration: (
          <ellipse cx={cx} cy={heartH * 0.42} rx={qrSize / 2 + 2} ry={qrSize / 2.1} fill="white" />
        ),
      }
    }

    case 'phone': {
      const phoneR = 8
      const speakerY = 8
      const speakerH = 4
      const screenTop = speakerY + speakerH + 6
      const buttonR = 8
      const buttonY = height - 14
      return {
        background: (
          <rect x={0} y={0} width={width} height={height} fill={fill} rx={phoneR} />
        ),
        decoration: (
          <>
            <rect x={cx - 16} y={speakerY} width={32} height={speakerH} fill="white" rx={2} />
            <rect x={qrLeft - 4} y={screenTop} width={qrSize + 8} height={buttonY - screenTop - 8} fill="white" rx={3} />
            <circle cx={cx} cy={buttonY} r={buttonR} fill="white" fillOpacity={0.3} stroke="white" strokeWidth={1.5} />
          </>
        ),
      }
    }

    default:
      return { background: <></>, decoration: <></> }
  }
}

// Generate hexagon points centered at (cx, cy) with radius r
function hexagonPoints(cx: number, cy: number, r: number): string {
  const points = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2 // Start from top
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    points.push(`${x},${y}`)
  }
  return points.join(' ')
}

function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export function getFrameDimensions(qrSize: number, frame: FrameOptions | null) {
  if (!frame || frame.style === 'none') {
    return { width: qrSize, height: qrSize, padding: 0, textHeight: 0 }
  }

  const border = FRAME_BORDER
  const textHeight = frame.showText ? TEXT_AREA_HEIGHT : 0

  return {
    width: qrSize + border * 2,
    height: qrSize + border * 2 + textHeight,
    padding: border,
    textHeight,
  }
}
