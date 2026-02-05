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

// Standard finder pattern hole proportions
const HOLE_RATIO = 5 / 7        // ~0.7143
const HOLE_OFFSET_RATIO = 1 / 7 // ~0.1429

// Shape renderer function type
type ShapeRenderer = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: FillColor
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

// Helper: draw a square with selectively rounded corners using quadraticCurveTo
function pathRoundedSquareSelective(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, size: number, r: number,
  roundTL: boolean, roundTR: boolean, roundBR: boolean, roundBL: boolean
): void {
  const right = x + size
  const bottom = y + size

  ctx.moveTo(roundTL ? x + r : x, y)
  ctx.lineTo(roundTR ? right - r : right, y)
  if (roundTR) ctx.quadraticCurveTo(right, y, right, y + r)
  ctx.lineTo(right, roundBR ? bottom - r : bottom)
  if (roundBR) ctx.quadraticCurveTo(right, bottom, right - r, bottom)
  ctx.lineTo(roundBL ? x + r : x, bottom)
  if (roundBL) ctx.quadraticCurveTo(x, bottom, x, bottom - r)
  ctx.lineTo(x, roundTL ? y + r : y)
  if (roundTL) ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// Helper: draw a square with 3 rounded corners and 1 sharp corner (clockwise)
type SharpCorner = 'TL' | 'TR' | 'BR' | 'BL'

function pathThreeRoundedSquare(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, size: number, r: number,
  sharp: SharpCorner
): void {
  const right = x + size
  const bottom = y + size

  const rTL = sharp === 'TL' ? 0 : r
  const rTR = sharp === 'TR' ? 0 : r
  const rBR = sharp === 'BR' ? 0 : r
  const rBL = sharp === 'BL' ? 0 : r

  ctx.moveTo(rTL ? x + rTL : x, y)
  ctx.lineTo(rTR ? right - rTR : right, y)
  if (rTR) ctx.quadraticCurveTo(right, y, right, y + rTR)
  ctx.lineTo(right, rBR ? bottom - rBR : bottom)
  if (rBR) ctx.quadraticCurveTo(right, bottom, right - rBR, bottom)
  ctx.lineTo(rBL ? x + rBL : x, bottom)
  if (rBL) ctx.quadraticCurveTo(x, bottom, x, bottom - rBL)
  ctx.lineTo(x, rTL ? y + rTL : y)
  if (rTL) ctx.quadraticCurveTo(x, y, x + rTL, y)
  ctx.closePath()
}

/**
 * Rysuje ścieżkę kwadratu z:
 * - 1 ostrym rogiem (90°)
 * - 1 okrągłym rogiem (ćwiartka koła) - przeciwległy do ostrego
 * - 2 zaokrąglonymi rogami
 */
function pathMixedCornersSquare(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  r: number,
  sharpCorner: SharpCorner
) {
  const s = size
  const arcRadius = s * 0.35

  // Determine corner types
  const types: Record<SharpCorner, 'sharp' | 'arc' | 'rounded'> = {
    TL: 'rounded', TR: 'rounded', BR: 'rounded', BL: 'rounded',
  }
  types[sharpCorner] = 'sharp'
  const opposite: Record<SharpCorner, SharpCorner> = {
    TL: 'BR', TR: 'BL', BR: 'TL', BL: 'TR',
  }
  types[opposite[sharpCorner]] = 'arc'

  // Start: top-left corner
  if (types.TL === 'sharp') {
    ctx.moveTo(x, y)
  } else if (types.TL === 'arc') {
    ctx.moveTo(x + arcRadius, y)
  } else {
    ctx.moveTo(x + r, y)
  }

  // Top edge -> top-right corner
  if (types.TR === 'sharp') {
    ctx.lineTo(x + s, y)
  } else if (types.TR === 'arc') {
    ctx.lineTo(x + s - arcRadius, y)
    ctx.arc(x + s - arcRadius, y + arcRadius, arcRadius, -Math.PI / 2, 0)
  } else {
    ctx.lineTo(x + s - r, y)
    ctx.quadraticCurveTo(x + s, y, x + s, y + r)
  }

  // Right edge -> bottom-right corner
  if (types.BR === 'sharp') {
    ctx.lineTo(x + s, y + s)
  } else if (types.BR === 'arc') {
    ctx.lineTo(x + s, y + s - arcRadius)
    ctx.arc(x + s - arcRadius, y + s - arcRadius, arcRadius, 0, Math.PI / 2)
  } else {
    ctx.lineTo(x + s, y + s - r)
    ctx.quadraticCurveTo(x + s, y + s, x + s - r, y + s)
  }

  // Bottom edge -> bottom-left corner
  if (types.BL === 'sharp') {
    ctx.lineTo(x, y + s)
  } else if (types.BL === 'arc') {
    ctx.lineTo(x + arcRadius, y + s)
    ctx.arc(x + arcRadius, y + s - arcRadius, arcRadius, Math.PI / 2, Math.PI)
  } else {
    ctx.lineTo(x + r, y + s)
    ctx.quadraticCurveTo(x, y + s, x, y + s - r)
  }

  // Left edge -> top-left corner
  if (types.TL === 'sharp') {
    ctx.lineTo(x, y)
  } else if (types.TL === 'arc') {
    ctx.lineTo(x, y + arcRadius)
    ctx.arc(x + arcRadius, y + arcRadius, arcRadius, Math.PI, -Math.PI / 2)
  } else {
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
  }

  ctx.closePath()
}

// ============================================================================
// CORNER SQUARE SHAPES (11 types) - Outer frame of finder patterns
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

  // Classy frame - square with one rounded corner (positioned version handles rotation)
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

  // Inpoint - square with circular hole (evenodd)
  inpoint: (ctx, x, y, size, color) => {
    const holeRadius = (size * 0.75) / 2
    const cx = x + size / 2
    const cy = y + size / 2

    ctx.fillStyle = color
    ctx.beginPath()
    // Outer square
    ctx.rect(x, y, size, size)
    // Inner hole (circle) — counterclockwise for evenodd
    ctx.moveTo(cx + holeRadius, cy)
    ctx.arc(cx, cy, holeRadius, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fill("evenodd")
  },

  // ThreeRounded - square with 3 rounded corners and 1 sharp (default: top-left sharp)
  threeRounded: (ctx, x, y, size, color) => {
    const r = size * 0.35
    const innerSize = size * HOLE_RATIO
    const innerOffset = size * HOLE_OFFSET_RATIO
    const ri = innerSize * 0.3

    ctx.fillStyle = color
    ctx.beginPath()
    // Outer (clockwise)
    pathThreeRoundedSquare(ctx, x, y, size, r, 'TL')

    // Inner hole (counter-clockwise) — sharp TL
    const ix = x + innerOffset, iy = y + innerOffset
    const iRight = ix + innerSize, iBottom = iy + innerSize
    ctx.moveTo(ix, iy)
    ctx.lineTo(ix, iy + innerSize - ri)
    ctx.quadraticCurveTo(ix, iBottom, ix + ri, iBottom)
    ctx.lineTo(iRight - ri, iBottom)
    ctx.quadraticCurveTo(iRight, iBottom, iRight, iBottom - ri)
    ctx.lineTo(iRight, iy + ri)
    ctx.quadraticCurveTo(iRight, iy, iRight - ri, iy)
    ctx.lineTo(ix, iy)
    ctx.closePath()
    ctx.fill("evenodd")
  },

  // DiagonalRounded - square with circular hole + two diagonally rounded corners
  diagonalRounded: (ctx, x, y, size, color) => {
    // Default version (top-left) — renderCornerSquare handles position
    const holeRadius = (size * 0.75) / 2
    const cornerRadius = size * 0.45
    const cx = x + size / 2
    const cy = y + size / 2

    ctx.fillStyle = color
    ctx.beginPath()
    pathRoundedSquareSelective(ctx, x, y, size, cornerRadius, true, false, true, false)
    ctx.moveTo(cx + holeRadius, cy)
    ctx.arc(cx, cy, holeRadius, 0, Math.PI * 2, true)
    ctx.fill("evenodd")
  },

  // MixedCorners - 1 sharp corner, 1 arc (quarter circle) opposite, 2 rounded
  mixedCorners: (ctx, x, y, size, color) => {
    const outerR = size * 0.2
    const holeSize = size * HOLE_RATIO
    const holeOffset = size * HOLE_OFFSET_RATIO
    const innerR = holeSize * 0.2

    ctx.fillStyle = color
    ctx.beginPath()
    pathMixedCornersSquare(ctx, x, y, size, outerR, 'TL')
    pathMixedCornersSquare(ctx, x + holeOffset, y + holeOffset, holeSize, innerR, 'TL')
    ctx.fill("evenodd")
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
  if (type === 'classy' || type === 'classy-rounded') {
    renderPositionedClassySquare(ctx, type, x, y, size, color, position)
    return
  }

  if (type === 'diagonalRounded') {
    renderPositionedDiagonalRounded(ctx, x, y, size, color, position)
    return
  }

  if (type === 'threeRounded') {
    renderPositionedThreeRounded(ctx, x, y, size, color, position)
    return
  }

  if (type === 'mixedCorners') {
    renderPositionedMixedCorners(ctx, x, y, size, color, position)
    return
  }

  const renderer = cornerSquareShapes[type] || cornerSquareShapes.square
  renderer(ctx, x, y, size, color)
}

/**
 * Render classy/classy-rounded shapes with correct corner orientation
 * The sharp corner should point to the outer corner of the QR code
 */
function renderPositionedClassySquare(
  ctx: CanvasRenderingContext2D,
  type: 'classy' | 'classy-rounded',
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

  if (type === 'classy') {
    // One rounded corner - the one pointing toward center of QR code
    switch (position) {
      case 'top-left':
        // Sharp: top-left, top-right, bottom-left. Rounded: bottom-right
        radii = [0, 0, radius, 0]
        break
      case 'top-right':
        // Sharp: top-left, top-right, bottom-right. Rounded: bottom-left
        radii = [0, 0, 0, radius]
        break
      case 'bottom-left':
        // Sharp: top-left, bottom-right, bottom-left. Rounded: top-right
        radii = [0, radius, 0, 0]
        break
    }
  } else {
    // classy-rounded: Three rounded corners, one sharp (the outer corner)
    switch (position) {
      case 'top-left':
        // Sharp: top-left. Rounded: top-right, bottom-right, bottom-left
        radii = [0, radius, radius, radius]
        break
      case 'top-right':
        // Sharp: top-right. Rounded: top-left, bottom-right, bottom-left
        radii = [radius, 0, radius, radius]
        break
      case 'bottom-left':
        // Sharp: bottom-left. Rounded: top-left, top-right, bottom-right
        radii = [radius, radius, radius, 0]
        break
    }
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

/**
 * Render diagonalRounded shape with correct corner orientation
 * Rounds two diagonal corners based on finder pattern position
 */
function renderPositionedDiagonalRounded(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, size: number,
  color: FillColor, position: CornerPosition
): void {
  const holeRadius = (size * 0.75) / 2
  const cornerRadius = size * 0.45
  const cx = x + size / 2
  const cy = y + size / 2

  let roundTL = false, roundTR = false, roundBR = false, roundBL = false
  switch (position) {
    case 'top-left':     roundTL = true; roundBR = true; break
    case 'top-right':    roundTR = true; roundBL = true; break
    case 'bottom-left':  roundBL = true; roundTR = true; break
  }

  ctx.fillStyle = color
  ctx.beginPath()
  pathRoundedSquareSelective(ctx, x, y, size, cornerRadius, roundTL, roundTR, roundBR, roundBL)
  ctx.moveTo(cx + holeRadius, cy)
  ctx.arc(cx, cy, holeRadius, 0, Math.PI * 2, true)
  ctx.fill("evenodd")
}

/**
 * Render threeRounded shape with correct corner orientation
 * 3 rounded corners + 1 sharp corner pointing to the outer edge of QR code
 */
function renderPositionedThreeRounded(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, size: number,
  color: FillColor, position: CornerPosition
): void {
  const outerR = size * 0.35
  const innerSize = size * HOLE_RATIO
  const innerOffset = size * HOLE_OFFSET_RATIO
  const innerR = innerSize * 0.3

  // Map position to sharp corner
  const sharpCorner: SharpCorner = position === 'top-left' ? 'TL'
    : position === 'top-right' ? 'TR' : 'BL'

  ctx.fillStyle = color
  ctx.beginPath()

  // Outer (clockwise)
  pathThreeRoundedSquare(ctx, x, y, size, outerR, sharpCorner)

  // Inner hole (counter-clockwise) — same sharp corner
  // CCW order: TL → left edge down → BL → bottom right → BR → right edge up → TR → top left → TL
  const ix = x + innerOffset, iy = y + innerOffset
  const iRight = ix + innerSize, iBottom = iy + innerSize
  const sharp = sharpCorner as SharpCorner
  const rTL = sharp === 'TL' ? 0 : innerR
  const rTR = sharp === 'TR' ? 0 : innerR
  const rBR = sharp === 'BR' ? 0 : innerR
  const rBL = sharp === 'BL' ? 0 : innerR

  ctx.moveTo(rTL ? ix + rTL : ix, iy)
  // TL corner (CCW: curve goes left-down)
  if (rTL) ctx.quadraticCurveTo(ix, iy, ix, iy + rTL)
  // Left edge down
  ctx.lineTo(ix, rBL ? iBottom - rBL : iBottom)
  // BL corner (CCW: curve goes down-right)
  if (rBL) ctx.quadraticCurveTo(ix, iBottom, ix + rBL, iBottom)
  // Bottom edge right
  ctx.lineTo(rBR ? iRight - rBR : iRight, iBottom)
  // BR corner (CCW: curve goes right-up)
  if (rBR) ctx.quadraticCurveTo(iRight, iBottom, iRight, iBottom - rBR)
  // Right edge up
  ctx.lineTo(iRight, rTR ? iy + rTR : iy)
  // TR corner (CCW: curve goes up-left)
  if (rTR) ctx.quadraticCurveTo(iRight, iy, iRight - rTR, iy)
  // Top edge left back to start
  ctx.lineTo(rTL ? ix + rTL : ix, iy)
  ctx.closePath()

  ctx.fill("evenodd")
}

/**
 * Render mixedCorners shape with correct corner orientation
 * 1 sharp corner (outer) + 1 arc (opposite diagonal) + 2 rounded
 */
function renderPositionedMixedCorners(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, size: number,
  color: FillColor, position: CornerPosition
): void {
  const outerR = size * 0.2
  const holeSize = size * HOLE_RATIO
  const holeOffset = size * HOLE_OFFSET_RATIO
  const innerR = holeSize * 0.2

  const sharpCorner: SharpCorner = position === 'top-left' ? 'TL'
    : position === 'top-right' ? 'TR' : 'BL'

  ctx.fillStyle = color
  ctx.beginPath()
  pathMixedCornersSquare(ctx, x, y, size, outerR, sharpCorner)
  pathMixedCornersSquare(ctx, x + holeOffset, y + holeOffset, holeSize, innerR, sharpCorner)
  ctx.fill("evenodd")
}

export function renderCornerDot(
  ctx: CanvasRenderingContext2D,
  type: CornersDotType,
  x: number,
  y: number,
  size: number,
  color: FillColor
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
