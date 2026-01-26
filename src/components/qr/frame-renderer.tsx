'use client'

import { FrameOptions, FrameStyle } from '@/types/database'

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
  if (!frame || frame.style === 'none') {
    return <div className={className}>{children}</div>
  }

  const padding = Math.round(size * FRAME_PADDING)
  const textHeight = frame.showText ? Math.round(size * TEXT_AREA_HEIGHT) : 0
  const totalWidth = size + padding * 2
  const totalHeight = size + padding * 2 + textHeight

  const frameStyle = getFrameStyle(frame.style, frame.color, totalWidth, totalHeight, padding)

  return (
    <div className={className} style={{ width: totalWidth, height: totalHeight }}>
      <svg
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="absolute inset-0"
      >
        {frameStyle.background}
        {frameStyle.decoration}
        {frame.showText && frame.text && (
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
  color: string,
  width: number,
  height: number,
  padding: number
): FrameStyleResult {
  const qrSize = width - padding * 2

  switch (style) {
    case 'simple':
      return {
        background: (
          <rect x={0} y={0} width={width} height={height} fill={color} rx={8} />
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
          <rect x={0} y={0} width={width} height={height} fill={color} rx={24} />
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
            <rect x={0} y={0} width={width} height={height} fill={color} rx={8} />
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
            fill={color}
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
            fill={color}
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
            <circle cx={width / 2} cy={width / 2} r={width / 2 - 2} fill={color} />
            {/* Ribbon */}
            <rect
              x={(width - ribbonWidth) / 2}
              y={height - ribbonHeight - 4}
              width={ribbonWidth}
              height={ribbonHeight}
              fill={color}
            />
            <polygon
              points={`
                ${(width - ribbonWidth) / 2},${height - ribbonHeight - 4}
                ${width / 2},${height - ribbonHeight / 2 - 4}
                ${(width + ribbonWidth) / 2},${height - ribbonHeight - 4}
              `}
              fill={color}
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
            <rect x={0} y={foldSize} width={width} height={height - foldSize} fill={color} />
            {/* Shadow folds */}
            <polygon
              points={`0,${height} ${foldSize},${height - foldSize} 0,${height - foldSize}`}
              fill={adjustColor(color, -30)}
            />
            <polygon
              points={`${width},${height} ${width - foldSize},${height - foldSize} ${width},${height - foldSize}`}
              fill={adjustColor(color, -30)}
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
              stroke={color}
              strokeWidth={cornerWidth}
              strokeLinecap="round"
              fill="none"
            />
            {/* Top-right corner */}
            <path
              d={`M ${width - padding + 8} ${padding - 8} L ${width - padding + 8} ${padding - 8 + cornerLength} M ${width - padding + 8} ${padding - 8} L ${width - padding + 8 - cornerLength} ${padding - 8}`}
              stroke={color}
              strokeWidth={cornerWidth}
              strokeLinecap="round"
              fill="none"
            />
            {/* Bottom-left corner */}
            <path
              d={`M ${padding - 8} ${padding + qrSize + 8} L ${padding - 8} ${padding + qrSize + 8 - cornerLength} M ${padding - 8} ${padding + qrSize + 8} L ${padding - 8 + cornerLength} ${padding + qrSize + 8}`}
              stroke={color}
              strokeWidth={cornerWidth}
              strokeLinecap="round"
              fill="none"
            />
            {/* Bottom-right corner */}
            <path
              d={`M ${width - padding + 8} ${padding + qrSize + 8} L ${width - padding + 8} ${padding + qrSize + 8 - cornerLength} M ${width - padding + 8} ${padding + qrSize + 8} L ${width - padding + 8 - cornerLength} ${padding + qrSize + 8}`}
              stroke={color}
              strokeWidth={cornerWidth}
              strokeLinecap="round"
              fill="none"
            />
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
