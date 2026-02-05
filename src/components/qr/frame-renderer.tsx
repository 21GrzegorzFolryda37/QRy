'use client'

import { useId } from 'react'
import { FrameOptions, FrameStyle } from '@/types/database'
import {
  BADGE_OUTER_STROKE_RATIO,
  BADGE_INNER_CIRCLE_RATIO,
  isBadgeCellFilled,
  getBadgeCellSize,
} from '@/lib/qr/badge-pattern'

interface FrameRendererProps {
  children: React.ReactNode
  frame: FrameOptions | null
  size: number
  className?: string
}

const TEXT_AREA_HEIGHT = 56

// Different frame types need different amounts of space
function getFrameBorder(style: FrameStyle, qrSize: number): number {
  switch (style) {
    case 'simple':
    case 'rounded':
    case 'fancy':
    case 'ticket':
    case 'minimal':
      return 12

    case 'badge':
      return Math.round(qrSize * 0.2)

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
  const frameStyleResult = hasFrame ? getFrameStyle(frame.style, fillValue, totalWidth, totalHeight, border, size, gradientId) : null

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
          {frameStyleResult?.defs}
        </defs>
        {frameStyleResult?.background}
        {frameStyleResult?.decoration}
        {hasFrame && frame.showText && frame.text && (
          <text
            x={totalWidth / 2}
            y={size + border * 2 + textHeight / 2 - 3}
            textAnchor="middle"
            dominantBaseline="central"
            fill={frame.textColor}
            fontSize={22}
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
  defs?: React.ReactNode
}

function getFrameStyle(
  style: FrameStyle,
  fill: string,
  width: number,
  height: number,
  border: number,
  qrSize: number,
  uniqueId: string
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

    case 'badge': {
      const outerR = qrSize / 2 + border - 2
      const innerR = outerR * BADGE_INNER_CIRCLE_RATIO
      const strokeW = Math.max(2, Math.round(qrSize * BADGE_OUTER_STROKE_RATIO))
      const cellSize = getBadgeCellSize(outerR)
      const badgeH = qrSize + border * 2
      const ribbonW = qrSize * 0.5
      const ribbonH = 24

      const patternId = `badge-pat-${uniqueId}`
      const clipId = `badge-clip-${uniqueId}`
      const maskId = `badge-mask-${uniqueId}`

      // Build pattern cells (4×4 tile)
      const tileSize = cellSize * 4
      const patternCells: React.ReactNode[] = []
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (isBadgeCellFilled(r, c)) {
            patternCells.push(
              <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize} />
            )
          }
        }
      }

      // Donut path (outer CW, inner CCW via even-odd)
      const donutPath = [
        `M ${cx - outerR + strokeW} ${cy}`,
        `A ${outerR - strokeW} ${outerR - strokeW} 0 1 1 ${cx + outerR - strokeW} ${cy}`,
        `A ${outerR - strokeW} ${outerR - strokeW} 0 1 1 ${cx - outerR + strokeW} ${cy}`,
        `Z`,
        `M ${cx - innerR} ${cy}`,
        `A ${innerR} ${innerR} 0 1 0 ${cx + innerR} ${cy}`,
        `A ${innerR} ${innerR} 0 1 0 ${cx - innerR} ${cy}`,
        `Z`,
      ].join(' ')

      const isGradient = fill.startsWith('url(')

      const defs = (
        <>
          {/* Clip path: donut between outer stroke and inner circle */}
          <clipPath id={clipId}>
            <path d={donutPath} fillRule="evenodd" />
          </clipPath>
          {isGradient ? (
            // Mask approach for gradient fills
            <mask id={maskId}>
              <rect x={0} y={0} width={width} height={height} fill="black" />
              <pattern id={patternId} x={cx - outerR} y={cy - outerR} width={tileSize} height={tileSize} patternUnits="userSpaceOnUse">
                {patternCells.map((cell, i) => (
                  <g key={i} fill="white">{cell}</g>
                ))}
              </pattern>
              <rect x={0} y={0} width={width} height={height} fill={`url(#${patternId})`} clipPath={`url(#${clipId})`} />
            </mask>
          ) : (
            // Simple pattern for solid fills
            <pattern id={patternId} x={cx - outerR} y={cy - outerR} width={tileSize} height={tileSize} patternUnits="userSpaceOnUse">
              {patternCells.map((cell, i) => (
                <g key={i} fill={fill}>{cell}</g>
              ))}
            </pattern>
          )}
        </>
      )

      return {
        defs,
        background: (
          <>
            {/* White ring background */}
            <circle cx={cx} cy={cy} r={outerR} fill="white" />
            {/* Decorative pattern in donut area */}
            {isGradient ? (
              <rect x={0} y={0} width={width} height={height} fill={fill} mask={`url(#${maskId})`} />
            ) : (
              <rect x={0} y={0} width={width} height={height} fill={`url(#${patternId})`} clipPath={`url(#${clipId})`} />
            )}
            {/* Thin outer stroke */}
            <circle cx={cx} cy={cy} r={outerR - strokeW / 2} fill="none" stroke={fill} strokeWidth={strokeW} />
            {/* Ribbon */}
            <rect x={cx - ribbonW / 2} y={badgeH - ribbonH - 4} width={ribbonW} height={ribbonH} fill={fill} />
            <polygon points={`${cx - ribbonW / 2},${badgeH - ribbonH - 4} ${cx},${badgeH - ribbonH / 2 - 2} ${cx + ribbonW / 2},${badgeH - ribbonH - 4}`} fill={fill} />
          </>
        ),
        decoration: <circle cx={cx} cy={cy} r={innerR} fill="white" />,
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

    default:
      return { background: <></>, decoration: <></> }
  }
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
