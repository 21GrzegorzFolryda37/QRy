/**
 * Custom QR Code Shape Renderers
 * Renders all 31 shapes: 13 dots, 9 corner squares, 9 corner dots
 * Works client-side with Canvas API
 */

import type { DotsType, CornersSquareType, CornersDotType } from '@/types/database'

// Shape renderer function type
type ShapeRenderer = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) => void

// ============================================================================
// DOT SHAPES (13 types)
// ============================================================================

const dotShapes: Record<DotsType, ShapeRenderer> = {
  // Basic square
  square: (ctx, x, y, size, color) => {
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
  },

  // Circular dot
  dots: (ctx, x, y, size, color) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
    ctx.fill()
  },

  // Rounded corners
  rounded: (ctx, x, y, size, color) => {
    const radius = size / 4
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.roundRect(x, y, size, size, radius)
    ctx.fill()
  },

  // Extra rounded (more circular)
  'extra-rounded': (ctx, x, y, size, color) => {
    const radius = size / 2
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.roundRect(x, y, size, size, radius)
    ctx.fill()
  },

  // Classy - square with one rounded corner
  classy: (ctx, x, y, size, color) => {
    const radius = size / 2
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.roundRect(x, y, size, size, [0, 0, radius, 0])
    ctx.fill()
  },

  // Classy rounded - all corners rounded except one
  'classy-rounded': (ctx, x, y, size, color) => {
    const radius = size / 2
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.roundRect(x, y, size, size, [radius, radius, radius, 0])
    ctx.fill()
  },

  // Diamond shape
  diamond: (ctx, x, y, size, color) => {
    const center = size / 2
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x + center, y)
    ctx.lineTo(x + size, y + center)
    ctx.lineTo(x + center, y + size)
    ctx.lineTo(x, y + center)
    ctx.closePath()
    ctx.fill()
  },

  // Star shape (4-point)
  star: (ctx, x, y, size, color) => {
    const center = size / 2
    const outerRadius = size / 2
    const innerRadius = size / 4
    ctx.fillStyle = color
    ctx.beginPath()
    for (let i = 0; i < 8; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (i * Math.PI) / 4 - Math.PI / 2
      const px = x + center + Math.cos(angle) * radius
      const py = y + center + Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  },

  // Vertical line
  'vertical-line': (ctx, x, y, size, color) => {
    const width = size / 3
    const offset = (size - width) / 2
    ctx.fillStyle = color
    ctx.fillRect(x + offset, y, width, size)
  },

  // Horizontal line
  'horizontal-line': (ctx, x, y, size, color) => {
    const height = size / 3
    const offset = (size - height) / 2
    ctx.fillStyle = color
    ctx.fillRect(x, y + offset, size, height)
  },

  // Random dot (slightly offset circle)
  'random-dot': (ctx, x, y, size, color) => {
    const offset = (Math.random() - 0.5) * size * 0.2
    const sizeVariation = size * (0.8 + Math.random() * 0.4)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(
      x + size / 2 + offset,
      y + size / 2 + offset,
      sizeVariation / 2.5,
      0,
      Math.PI * 2
    )
    ctx.fill()
  },

  // Small square (centered)
  'small-square': (ctx, x, y, size, color) => {
    const smallSize = size * 0.7
    const offset = (size - smallSize) / 2
    ctx.fillStyle = color
    ctx.fillRect(x + offset, y + offset, smallSize, smallSize)
  },

  // Tiny square (more centered, smaller)
  'tiny-square': (ctx, x, y, size, color) => {
    const tinySize = size * 0.5
    const offset = (size - tinySize) / 2
    ctx.fillStyle = color
    ctx.fillRect(x + offset, y + offset, tinySize, tinySize)
  },
}

// ============================================================================
// CORNER SQUARE SHAPES (9 types) - Outer frame of finder patterns
// ============================================================================

const cornerSquareShapes: Record<CornersSquareType, ShapeRenderer> = {
  // Square frame
  square: (ctx, x, y, size, color) => {
    const lineWidth = size / 7
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.strokeRect(x + lineWidth / 2, y + lineWidth / 2, size - lineWidth, size - lineWidth)
  },

  // Circular frame
  dot: (ctx, x, y, size, color) => {
    const lineWidth = size / 7
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.arc(x + size / 2, y + size / 2, (size - lineWidth) / 2, 0, Math.PI * 2)
    ctx.stroke()
  },

  // Extra rounded frame
  'extra-rounded': (ctx, x, y, size, color) => {
    const lineWidth = size / 7
    const radius = size / 2
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.roundRect(
      x + lineWidth / 2,
      y + lineWidth / 2,
      size - lineWidth,
      size - lineWidth,
      radius
    )
    ctx.stroke()
  },

  // Rounded frame
  rounded: (ctx, x, y, size, color) => {
    const lineWidth = size / 7
    const radius = size / 4
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.roundRect(
      x + lineWidth / 2,
      y + lineWidth / 2,
      size - lineWidth,
      size - lineWidth,
      radius
    )
    ctx.stroke()
  },

  // Classy frame - square with one rounded corner
  classy: (ctx, x, y, size, color) => {
    const lineWidth = size / 7
    const radius = size / 3
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.roundRect(
      x + lineWidth / 2,
      y + lineWidth / 2,
      size - lineWidth,
      size - lineWidth,
      [0, 0, radius, 0]
    )
    ctx.stroke()
  },

  // Classy rounded frame
  'classy-rounded': (ctx, x, y, size, color) => {
    const lineWidth = size / 7
    const radius = size / 3
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.roundRect(
      x + lineWidth / 2,
      y + lineWidth / 2,
      size - lineWidth,
      size - lineWidth,
      [radius, radius, radius, 0]
    )
    ctx.stroke()
  },

  // Dotted frame (dashed circle)
  dotted: (ctx, x, y, size, color) => {
    const lineWidth = size / 7
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.setLineDash([size / 10, size / 10])
    ctx.beginPath()
    ctx.arc(x + size / 2, y + size / 2, (size - lineWidth) / 2, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])
  },

  // Outpoint - square with pointed outer corners
  outpoint: (ctx, x, y, size, color) => {
    const lineWidth = size / 7
    const pointSize = size / 5
    ctx.fillStyle = color

    // Draw main frame
    ctx.fillRect(x, y + pointSize, size, lineWidth)
    ctx.fillRect(x, y + size - pointSize - lineWidth, size, lineWidth)
    ctx.fillRect(x + pointSize, y, lineWidth, size)
    ctx.fillRect(x + size - pointSize - lineWidth, y, lineWidth, size)

    // Draw corner points
    ctx.beginPath()
    ctx.moveTo(x, y + pointSize)
    ctx.lineTo(x + pointSize, y)
    ctx.lineTo(x + pointSize, y + pointSize)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(x + size, y + pointSize)
    ctx.lineTo(x + size - pointSize, y)
    ctx.lineTo(x + size - pointSize, y + pointSize)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(x, y + size - pointSize)
    ctx.lineTo(x + pointSize, y + size)
    ctx.lineTo(x + pointSize, y + size - pointSize)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(x + size, y + size - pointSize)
    ctx.lineTo(x + size - pointSize, y + size)
    ctx.lineTo(x + size - pointSize, y + size - pointSize)
    ctx.fill()
  },

  // Inpoint - square with pointed inner corners
  inpoint: (ctx, x, y, size, color) => {
    const lineWidth = size / 7
    const innerSize = size - lineWidth * 2
    const pointSize = innerSize / 4

    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.strokeRect(x + lineWidth / 2, y + lineWidth / 2, size - lineWidth, size - lineWidth)

    // Draw inward points at corners
    ctx.fillStyle = color
    const inner = lineWidth
    const inX = x + inner
    const inY = y + inner
    const inS = size - inner * 2

    ctx.beginPath()
    ctx.moveTo(inX, inY)
    ctx.lineTo(inX + pointSize, inY)
    ctx.lineTo(inX, inY + pointSize)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(inX + inS, inY)
    ctx.lineTo(inX + inS - pointSize, inY)
    ctx.lineTo(inX + inS, inY + pointSize)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(inX, inY + inS)
    ctx.lineTo(inX + pointSize, inY + inS)
    ctx.lineTo(inX, inY + inS - pointSize)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(inX + inS, inY + inS)
    ctx.lineTo(inX + inS - pointSize, inY + inS)
    ctx.lineTo(inX + inS, inY + inS - pointSize)
    ctx.fill()
  },
}

// ============================================================================
// CORNER DOT SHAPES (9 types) - Inner dot of finder patterns
// ============================================================================

const cornerDotShapes: Record<CornersDotType, ShapeRenderer> = {
  // Square dot
  square: (ctx, x, y, size, color) => {
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
  },

  // Circular dot
  dot: (ctx, x, y, size, color) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
    ctx.fill()
  },

  // Rounded square dot
  rounded: (ctx, x, y, size, color) => {
    const radius = size / 4
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.roundRect(x, y, size, size, radius)
    ctx.fill()
  },

  // Classy dot - square with one rounded corner
  classy: (ctx, x, y, size, color) => {
    const radius = size / 2
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.roundRect(x, y, size, size, [0, 0, radius, 0])
    ctx.fill()
  },

  // Heart shape
  heart: (ctx, x, y, size, color) => {
    const center = size / 2
    ctx.fillStyle = color
    ctx.beginPath()

    // Heart shape using bezier curves
    ctx.moveTo(x + center, y + size * 0.85)
    ctx.bezierCurveTo(
      x + center, y + size * 0.7,
      x, y + size * 0.4,
      x, y + size * 0.3
    )
    ctx.bezierCurveTo(
      x, y,
      x + center, y,
      x + center, y + size * 0.3
    )
    ctx.bezierCurveTo(
      x + center, y,
      x + size, y,
      x + size, y + size * 0.3
    )
    ctx.bezierCurveTo(
      x + size, y + size * 0.4,
      x + center, y + size * 0.7,
      x + center, y + size * 0.85
    )
    ctx.fill()
  },

  // Star shape
  star: (ctx, x, y, size, color) => {
    const center = size / 2
    const outerRadius = size / 2
    const innerRadius = size / 4
    ctx.fillStyle = color
    ctx.beginPath()
    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (i * Math.PI) / 5 - Math.PI / 2
      const px = x + center + Math.cos(angle) * radius
      const py = y + center + Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  },

  // Diamond shape
  diamond: (ctx, x, y, size, color) => {
    const center = size / 2
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x + center, y)
    ctx.lineTo(x + size, y + center)
    ctx.lineTo(x + center, y + size)
    ctx.lineTo(x, y + center)
    ctx.closePath()
    ctx.fill()
  },

  // Outpoint - square with pointed corners
  outpoint: (ctx, x, y, size, color) => {
    const pointSize = size / 4
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x + pointSize, y)
    ctx.lineTo(x + size - pointSize, y)
    ctx.lineTo(x + size, y + pointSize)
    ctx.lineTo(x + size, y + size - pointSize)
    ctx.lineTo(x + size - pointSize, y + size)
    ctx.lineTo(x + pointSize, y + size)
    ctx.lineTo(x, y + size - pointSize)
    ctx.lineTo(x, y + pointSize)
    ctx.closePath()
    ctx.fill()
  },

  // Inpoint - square with inward pointed corners
  inpoint: (ctx, x, y, size, color) => {
    const pointSize = size / 5
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + pointSize, y + pointSize)
    ctx.lineTo(x + size / 2, y)
    ctx.lineTo(x + size - pointSize, y + pointSize)
    ctx.lineTo(x + size, y)
    ctx.lineTo(x + size - pointSize, y + pointSize)
    ctx.lineTo(x + size, y + size / 2)
    ctx.lineTo(x + size - pointSize, y + size - pointSize)
    ctx.lineTo(x + size, y + size)
    ctx.lineTo(x + size - pointSize, y + size - pointSize)
    ctx.lineTo(x + size / 2, y + size)
    ctx.lineTo(x + pointSize, y + size - pointSize)
    ctx.lineTo(x, y + size)
    ctx.lineTo(x + pointSize, y + size - pointSize)
    ctx.lineTo(x, y + size / 2)
    ctx.lineTo(x + pointSize, y + pointSize)
    ctx.closePath()
    ctx.fill()
  },
}

// ============================================================================
// EXPORTS
// ============================================================================

export function renderDot(
  ctx: CanvasRenderingContext2D,
  type: DotsType,
  x: number,
  y: number,
  size: number,
  color: string
): void {
  const renderer = dotShapes[type] || dotShapes.square
  renderer(ctx, x, y, size, color)
}

export function renderCornerSquare(
  ctx: CanvasRenderingContext2D,
  type: CornersSquareType,
  x: number,
  y: number,
  size: number,
  color: string
): void {
  const renderer = cornerSquareShapes[type] || cornerSquareShapes.square
  renderer(ctx, x, y, size, color)
}

export function renderCornerDot(
  ctx: CanvasRenderingContext2D,
  type: CornersDotType,
  x: number,
  y: number,
  size: number,
  color: string
): void {
  const renderer = cornerDotShapes[type] || cornerDotShapes.square
  renderer(ctx, x, y, size, color)
}

// Native shapes supported by qr-code-styling
const NATIVE_DOT_SHAPES: DotsType[] = [
  'square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'
]

const NATIVE_CORNER_SQUARE_SHAPES: CornersSquareType[] = [
  'square', 'dot', 'extra-rounded'
]

const NATIVE_CORNER_DOT_SHAPES: CornersDotType[] = [
  'square', 'dot'
]

/**
 * Check if any of the shapes require the custom renderer
 */
export function requiresCustomRenderer(shapes: {
  dotsType?: DotsType
  cornersSquareType?: CornersSquareType
  cornersDotType?: CornersDotType
}): boolean {
  const { dotsType, cornersSquareType, cornersDotType } = shapes

  if (dotsType && !NATIVE_DOT_SHAPES.includes(dotsType)) {
    return true
  }
  if (cornersSquareType && !NATIVE_CORNER_SQUARE_SHAPES.includes(cornersSquareType)) {
    return true
  }
  if (cornersDotType && !NATIVE_CORNER_DOT_SHAPES.includes(cornersDotType)) {
    return true
  }

  return false
}

export { dotShapes, cornerSquareShapes, cornerDotShapes }
