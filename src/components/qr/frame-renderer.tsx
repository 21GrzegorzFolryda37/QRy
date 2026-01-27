'use client'

import { useId } from 'react'
import { FrameOptions, FrameStyle } from '@/types/database'

interface FrameRendererProps {
  children: React.ReactNode
  frame: FrameOptions | null
  size: number
  className?: string
}

const TEXT_AREA_HEIGHT = 32

// Different frame types need different amounts of space
function getFrameBorder(style: FrameStyle, qrSize: number): number {
  switch (style) {
    // Rectangular frames - thin border
    case 'simple':
    case 'rounded':
    case 'fancy':
    case 'ticket':
    case 'balloon':
    case 'chat':
    case 'stamp':
    case 'phone':
      return 12

    // Frames with decorations on top
    case 'arrow':
    case 'ribbon':
    case 'banner':
    case 'tag':
      return 16

    // Round/irregular shapes need more space
    case 'circle':
    case 'badge':
      return Math.round(qrSize * 0.08) + 10

    case 'hexagon':
      // Hexagon needs extra space because corners extend beyond rectangle
      return Math.round(qrSize * 0.1) + 8

    case 'shield':
    case 'heart':
      return Math.round(qrSize * 0.12) + 8

    case 'minimal':
      return 12

    default:
      return 12
  }
}

export function FrameRenderer({ children, frame, size, className }: FrameRendererProps) {
  const gradientId = useId()

  const hasFrame = frame && frame.style !== 'none'
  const border = hasFrame ? getFrameBorder(frame.style, size) : 0
  const textHeight = hasFrame && frame.showText ? TEXT_AREA_HEIGHT : 0
  const totalWidth = size + border * 2
  const totalHeight = size + border * 2 + textHeight

  const fillValue = hasFrame && frame.gradient ? `url(#${gradientId})` : (frame?.color || '#000000')
  const frameStyleResult = hasFrame ? getFrameStyle(frame.style, fillValue, frame.color, totalWidth, totalHeight, border, size) : null

  return (
    <div className={className} style={{ width: totalWidth, height: totalHeight, position: 'relative' }}>
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
  const qrLeft = border
  const qrTop = border
  const qrRight = border + qrSize
  const qrBottom = border + qrSize
  const cx = width / 2
  const cy = border + qrSize / 2

  switch (style) {
    case 'simple':
      return {
        background: <rect x={0} y={0} width={width} height={height} fill={fill} rx={6} />,
        decoration: <rect x={qrLeft - 4} y={qrTop - 4} width={qrSize + 8} height={qrSize + 8} fill="white" rx={4} />,
      }

    case 'rounded':
      return {
        background: <rect x={0} y={0} width={width} height={height} fill={fill} rx={20} />,
        decoration: <rect x={qrLeft - 4} y={qrTop - 4} width={qrSize + 8} height={qrSize + 8} fill="white" rx={12} />,
      }

    case 'fancy':
      return {
        background: (
          <>
            <rect x={0} y={0} width={width} height={height} fill={fill} rx={6} />
            <rect x={4} y={4} width={width - 8} height={height - 8} fill="none" stroke="white" strokeWidth={2} rx={4} strokeDasharray="6,4" />
          </>
        ),
        decoration: <rect x={qrLeft - 2} y={qrTop - 2} width={qrSize + 4} height={qrSize + 4} fill="white" rx={3} />,
      }

    case 'ticket': {
      const notchSize = 10
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
        decoration: <rect x={qrLeft - 3} y={qrTop - 3} width={qrSize + 6} height={qrSize + 6} fill="white" rx={4} />,
      }
    }

    case 'balloon': {
      const arrowH = 14
      const bodyHeight = height - arrowH
      return {
        background: (
          <path
            d={`
              M 10 0 L ${width - 10} 0 Q ${width} 0 ${width} 10
              L ${width} ${bodyHeight - 10} Q ${width} ${bodyHeight} ${width - 10} ${bodyHeight}
              L ${cx + 14} ${bodyHeight} L ${cx} ${height} L ${cx - 14} ${bodyHeight}
              L 10 ${bodyHeight} Q 0 ${bodyHeight} 0 ${bodyHeight - 10}
              L 0 10 Q 0 0 10 0 Z
            `}
            fill={fill}
          />
        ),
        decoration: <rect x={qrLeft - 3} y={qrTop - 3} width={qrSize + 6} height={qrSize + 6} fill="white" rx={4} />,
      }
    }

    case 'badge': {
      const circleR = qrSize / 2 + border - 2
      const ribbonW = qrSize * 0.5
      const ribbonH = 24
      return {
        background: (
          <>
            <circle cx={cx} cy={cy} r={circleR} fill={fill} />
            <rect x={cx - ribbonW / 2} y={height - ribbonH - 4} width={ribbonW} height={ribbonH} fill={fill} />
            <polygon points={`${cx - ribbonW / 2},${height - ribbonH - 4} ${cx},${height - ribbonH / 2 - 2} ${cx + ribbonW / 2},${height - ribbonH - 4}`} fill={fill} />
          </>
        ),
        decoration: <circle cx={cx} cy={cy} r={qrSize / 2 + 4} fill="white" />,
      }
    }

    case 'banner': {
      const foldSize = 8
      return {
        background: (
          <>
            <rect x={0} y={foldSize} width={width} height={height - foldSize} fill={fill} />
            <polygon points={`0,${height} ${foldSize},${height - foldSize} 0,${height - foldSize}`} fill={adjustColor(solidColor, -30)} />
            <polygon points={`${width},${height} ${width - foldSize},${height - foldSize} ${width},${height - foldSize}`} fill={adjustColor(solidColor, -30)} />
          </>
        ),
        decoration: <rect x={qrLeft - 3} y={qrTop + foldSize - 3} width={qrSize + 6} height={qrSize + 6} fill="white" rx={4} />,
      }
    }

    case 'minimal': {
      const cornerLen = 20
      const cornerW = 4
      const offset = 6
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
      const arrowH = 16
      return {
        background: (
          <>
            <polygon points={`${cx},0 ${cx + 20},${arrowH} ${cx - 20},${arrowH}`} fill={fill} />
            <rect x={0} y={arrowH} width={width} height={height - arrowH} fill={fill} rx={6} />
          </>
        ),
        decoration: <rect x={qrLeft - 4} y={qrTop + arrowH - 4} width={qrSize + 8} height={qrSize + 8} fill="white" rx={4} />,
      }
    }

    case 'chat': {
      const tailSize = 14
      const bodyHeight = height - tailSize
      return {
        background: (
          <path
            d={`
              M 10 0 L ${width - 10} 0 Q ${width} 0 ${width} 10
              L ${width} ${bodyHeight - 10} Q ${width} ${bodyHeight} ${width - 10} ${bodyHeight}
              L ${tailSize + 10} ${bodyHeight} L 0 ${height}
              L 0 10 Q 0 0 10 0 Z
            `}
            fill={fill}
          />
        ),
        decoration: <rect x={qrLeft - 3} y={qrTop - 3} width={qrSize + 6} height={qrSize + 6} fill="white" rx={4} />,
      }
    }

    case 'ribbon': {
      const ribbonH = 18
      return {
        background: (
          <>
            <rect x={0} y={ribbonH} width={width} height={height - ribbonH} fill={fill} rx={6} />
            <path d={`M -8 ${ribbonH / 2} L ${width + 8} ${ribbonH / 2} L ${width + 8} ${ribbonH} L ${cx} ${ribbonH - 6} L -8 ${ribbonH} Z`} fill={fill} />
          </>
        ),
        decoration: <rect x={qrLeft - 4} y={qrTop + ribbonH - 4} width={qrSize + 8} height={qrSize + 8} fill="white" rx={4} />,
      }
    }

    case 'stamp': {
      const stampB = 5
      return {
        background: (
          <>
            <rect x={0} y={0} width={width} height={height} fill={fill} rx={4} />
            <rect x={stampB} y={stampB} width={width - stampB * 2} height={height - stampB * 2} fill="white" rx={2} />
            <rect x={stampB + 3} y={stampB + 3} width={width - stampB * 2 - 6} height={height - stampB * 2 - 6} fill={fill} rx={2} stroke="white" strokeWidth={2.5} strokeDasharray="8,4" />
          </>
        ),
        decoration: <rect x={qrLeft - 2} y={qrTop - 2} width={qrSize + 4} height={qrSize + 4} fill="white" rx={3} />,
      }
    }

    case 'circle': {
      const outerR = qrSize / 2 + border - 4
      const innerR = qrSize / 2 + 4
      return {
        background: <circle cx={cx} cy={cy} r={outerR} fill={fill} />,
        decoration: <circle cx={cx} cy={cy} r={innerR} fill="white" />,
      }
    }

    case 'hexagon': {
      // For a hexagon to contain a square QR code, we need the inradius >= qrSize/2
      // inradius = circumradius * cos(30°) = circumradius * 0.866
      // So circumradius = (qrSize/2) / 0.866 = qrSize * 0.577
      const outerR = qrSize / 2 + border - 4
      const innerR = qrSize / 2 + 4
      return {
        background: <polygon points={hexagonPoints(cx, cy, outerR)} fill={fill} />,
        decoration: <polygon points={hexagonPoints(cx, cy, innerR)} fill="white" />,
      }
    }

    case 'shield': {
      const shieldH = qrSize + border * 2
      return {
        background: (
          <path
            d={`M ${cx} 0 L ${width} ${shieldH * 0.12} L ${width} ${shieldH * 0.5} Q ${width} ${shieldH * 0.82} ${cx} ${shieldH} Q 0 ${shieldH * 0.82} 0 ${shieldH * 0.5} L 0 ${shieldH * 0.12} Z`}
            fill={fill}
          />
        ),
        decoration: (
          <path
            d={`M ${cx} ${border - 2} L ${width - border + 2} ${shieldH * 0.12 + border / 2} L ${width - border + 2} ${shieldH * 0.5 - border / 2} Q ${width - border + 2} ${shieldH * 0.72} ${cx} ${shieldH - border} Q ${border - 2} ${shieldH * 0.72} ${border - 2} ${shieldH * 0.5 - border / 2} L ${border - 2} ${shieldH * 0.12 + border / 2} Z`}
            fill="white"
          />
        ),
      }
    }

    case 'tag': {
      const holeR = 6
      const pointH = 18
      return {
        background: (
          <path d={`M 10 0 L ${width - 10} 0 Q ${width} 0 ${width} 10 L ${width} ${height - pointH} L ${cx} ${height} L 0 ${height - pointH} L 0 10 Q 0 0 10 0`} fill={fill} />
        ),
        decoration: (
          <>
            <circle cx={border + 4} cy={border + 4} r={holeR} fill="white" />
            <rect x={qrLeft - 4} y={qrTop + holeR + 6} width={qrSize + 8} height={qrSize + 8} fill="white" rx={4} />
          </>
        ),
      }
    }

    case 'heart': {
      const heartH = qrSize + border * 2
      const heartW = width
      return {
        background: (
          <path
            d={`M ${cx} ${heartH * 0.9} C ${heartW * 0.1} ${heartH * 0.6} 0 ${heartH * 0.38} 0 ${heartH * 0.24} C 0 ${heartH * 0.08} ${heartW * 0.18} 0 ${heartW * 0.35} 0 C ${heartW * 0.44} 0 ${cx} ${heartH * 0.12} ${cx} ${heartH * 0.12} C ${cx} ${heartH * 0.12} ${heartW * 0.56} 0 ${heartW * 0.65} 0 C ${heartW * 0.82} 0 ${heartW} ${heartH * 0.08} ${heartW} ${heartH * 0.24} C ${heartW} ${heartH * 0.38} ${heartW * 0.9} ${heartH * 0.6} ${cx} ${heartH * 0.9}`}
            fill={fill}
          />
        ),
        decoration: <ellipse cx={cx} cy={heartH * 0.42} rx={qrSize / 2 + 4} ry={qrSize / 2.2 + 2} fill="white" />,
      }
    }

    case 'phone': {
      const phoneR = 10
      const speakerY = 10
      const speakerH = 5
      const screenTop = speakerY + speakerH + 8
      const buttonR = 10
      const buttonY = height - 16
      return {
        background: <rect x={0} y={0} width={width} height={height} fill={fill} rx={phoneR} />,
        decoration: (
          <>
            <rect x={cx - 20} y={speakerY} width={40} height={speakerH} fill="white" rx={2} />
            <rect x={qrLeft - 4} y={screenTop} width={qrSize + 8} height={buttonY - screenTop - 10} fill="white" rx={4} />
            <circle cx={cx} cy={buttonY} r={buttonR} fill="white" fillOpacity={0.3} stroke="white" strokeWidth={2} />
          </>
        ),
      }
    }

    default:
      return { background: <></>, decoration: <></> }
  }
}

function hexagonPoints(cx: number, cy: number, r: number): string {
  const points = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2
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

  const border = getFrameBorder(frame.style, qrSize)
  const textHeight = frame.showText ? TEXT_AREA_HEIGHT : 0

  return {
    width: qrSize + border * 2,
    height: qrSize + border * 2 + textHeight,
    padding: border,
    textHeight,
  }
}
