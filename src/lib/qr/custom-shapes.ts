/**
 * Custom QR Code Shape Renderers
 * Renders all 31 shapes: 13 dots, 9 corner squares, 9 corner dots
 * Works client-side with Canvas API
 */

import type { DotsType, CornersSquareType, CornersDotType } from '@/types/database'

// Position of corner in QR code (for rotation)
export type CornerPosition = 'top-left' | 'top-right' | 'bottom-left'

// Color type that supports both solid colors and gradients
type FillColor = string | CanvasGradient

// Shape renderer function type
type ShapeRenderer = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: FillColor
) => void

// ============================================================================
// D-SHAPE HELPERS
// ============================================================================

/**
 * Draw a D-shape path: left edge straight, right edge semicircular
 * The "D" opens to the right
 */
function pathDRight(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  const r = size / 2
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + r, y)
  ctx.arc(x + r, y + r, r, -Math.PI / 2, Math.PI / 2)
  ctx.lineTo(x, y + size)
  ctx.closePath()
}

/**
 * Draw an inverted D-shape path: right edge straight, left edge semicircular
 * The "D" opens to the left (mirrored)
 */
function pathDLeft(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  const r = size / 2
  ctx.beginPath()
  ctx.moveTo(x + size, y)
  ctx.lineTo(x + r, y)
  ctx.arc(x + r, y + r, r, -Math.PI / 2, Math.PI / 2, true)
  ctx.lineTo(x + size, y + size)
  ctx.closePath()
}

/**
 * Draw a ring (frame) using a D-shape path function.
 * Uses lineWidth = size/7 to match other corner square shapes.
 */
function drawRing(
  ctx: CanvasRenderingContext2D,
  pathFn: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => void,
  x: number,
  y: number,
  size: number,
  color: FillColor
): void {
  const lineWidth = size / 7
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.save()
  pathFn(ctx, x + lineWidth / 2, y + lineWidth / 2, size - lineWidth)
  ctx.stroke()
  ctx.restore()
}

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

  // Classy frame - D-shape ring (flat left, semicircular right) — positioned version handles rotation
  classy: (ctx, x, y, size, color) => {
    drawRing(ctx, pathDRight, x, y, size, color)
  },

  // Classy rounded frame (positioned version handles rotation)
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
      [0, radius, radius, radius]
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

  // Outpoint - inverted D-shape ring (flat right, semicircular left) — positioned version handles rotation
  outpoint: (ctx, x, y, size, color) => {
    drawRing(ctx, pathDLeft, x, y, size, color)
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

  // Classy dot - filled D-shape (flat left, semicircular right) — positioned version handles rotation
  classy: (ctx, x, y, size, color) => {
    ctx.fillStyle = color
    pathDRight(ctx, x, y, size)
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
  color: FillColor
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
  color: FillColor,
  position: CornerPosition = 'top-left'
): void {
  // Handle positioned shapes that need rotation based on corner position
  if (type === 'classy' || type === 'outpoint') {
    renderPositionedDShape(ctx, type, x, y, size, color, position)
    return
  }

  if (type === 'classy-rounded') {
    renderPositionedClassyRounded(ctx, x, y, size, color, position)
    return
  }

  const renderer = cornerSquareShapes[type] || cornerSquareShapes.square
  renderer(ctx, x, y, size, color)
}

/**
 * Rotation angles for D-shapes by corner position.
 * The base D-shape has its flat edge on the left (pathDRight) or right (pathDLeft).
 * Rotation ensures the flat edge always faces the outer edge of the QR code.
 *
 * top-left:    180° — semicircle points toward bottom-right (QR center)
 * top-right:   -90° — semicircle points toward bottom-left (QR center)
 * bottom-left:  90° — semicircle points toward top-right (QR center)
 */
function getCornerRotation(position: CornerPosition): number {
  switch (position) {
    case 'top-left': return Math.PI
    case 'top-right': return -Math.PI / 2
    case 'bottom-left': return Math.PI / 2
  }
}

/**
 * Render D-shape (classy or outpoint) with rotation based on corner position.
 * classy = pathDRight (flat left, round right)
 * outpoint = pathDLeft (flat right, round left)
 */
function renderPositionedDShape(
  ctx: CanvasRenderingContext2D,
  type: 'classy' | 'outpoint',
  x: number,
  y: number,
  size: number,
  color: FillColor,
  position: CornerPosition
): void {
  const cx = x + size / 2
  const cy = y + size / 2
  const angle = getCornerRotation(position)

  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(angle)
  ctx.translate(-cx, -cy)

  const renderer = cornerSquareShapes[type]
  renderer(ctx, x, y, size, color)

  ctx.restore()
}

/**
 * Render classy-rounded shape with correct corner orientation.
 * Three rounded corners, one sharp (the outer corner of QR).
 */
function renderPositionedClassyRounded(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: FillColor,
  position: CornerPosition
): void {
  const lineWidth = size / 7
  const radius = size / 3

  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.beginPath()

  // roundRect radii order: [top-left, top-right, bottom-right, bottom-left]
  let radii: [number, number, number, number]

  switch (position) {
    case 'top-left':
      radii = [0, radius, radius, radius]
      break
    case 'top-right':
      radii = [radius, 0, radius, radius]
      break
    case 'bottom-left':
      radii = [radius, radius, radius, 0]
      break
  }

  ctx.roundRect(
    x + lineWidth / 2,
    y + lineWidth / 2,
    size - lineWidth,
    size - lineWidth,
    radii
  )
  ctx.stroke()
}

export function renderCornerDot(
  ctx: CanvasRenderingContext2D,
  type: CornersDotType,
  x: number,
  y: number,
  size: number,
  color: FillColor,
  position: CornerPosition = 'top-left'
): void {
  // Classy corner dot uses D-shape with rotation
  if (type === 'classy') {
    const cx = x + size / 2
    const cy = y + size / 2
    const angle = getCornerRotation(position)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(angle)
    ctx.translate(-cx, -cy)

    const renderer = cornerDotShapes.classy
    renderer(ctx, x, y, size, color)

    ctx.restore()
    return
  }

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
