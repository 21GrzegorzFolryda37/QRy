/**
 * Custom QR Code Canvas Renderer
 * Uses qrcode library for matrix generation + custom canvas rendering
 * Supports all 31 shape types defined in custom-shapes.ts
 */

import QRCode from 'qrcode'
import type { DotsType, CornersSquareType, CornersDotType, GradientOptions } from '@/types/database'
import { renderDot, renderCornerSquare, renderCornerDot, type CornerPosition } from './custom-shapes'

export interface CustomQROptions {
  data: string
  width: number
  height: number
  margin?: number
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'

  // Colors
  foregroundColor?: string
  backgroundColor?: string

  // Shapes
  dotsType?: DotsType
  cornersSquareType?: CornersSquareType
  cornersDotType?: CornersDotType

  // Corner colors (optional, defaults to foregroundColor)
  cornersSquareColor?: string
  cornersDotColor?: string

  // Gradients
  dotsGradient?: GradientOptions | null
  cornersSquareGradient?: GradientOptions | null
  cornersDotGradient?: GradientOptions | null
  backgroundGradient?: GradientOptions | null

  // Logo
  logoUrl?: string
  logoSize?: number
  logoMargin?: number
}

interface QRMatrix {
  modules: { data: Uint8Array; size: number }
}

/**
 * Create a canvas gradient from GradientOptions
 */
function createGradient(
  ctx: CanvasRenderingContext2D,
  config: GradientOptions,
  x: number,
  y: number,
  width: number,
  height: number
): CanvasGradient {
  let gradient: CanvasGradient

  if (config.type === 'radial') {
    const centerX = x + width / 2
    const centerY = y + height / 2
    const radius = Math.max(width, height) / 2
    gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
  } else {
    // Linear gradient with rotation
    const angle = ((config.rotation || 0) * Math.PI) / 180
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const x1 = x + width / 2 - (cos * width) / 2
    const y1 = y + height / 2 - (sin * height) / 2
    const x2 = x + width / 2 + (cos * width) / 2
    const y2 = y + height / 2 + (sin * height) / 2
    gradient = ctx.createLinearGradient(x1, y1, x2, y2)
  }

  for (const stop of config.colorStops) {
    gradient.addColorStop(stop.offset, stop.color)
  }

  return gradient
}

/**
 * Get color or gradient for rendering
 */
function getColorOrGradient(
  ctx: CanvasRenderingContext2D,
  color: string,
  gradient: GradientOptions | null | undefined,
  x: number,
  y: number,
  width: number,
  height: number
): string | CanvasGradient {
  if (gradient) {
    return createGradient(ctx, gradient, x, y, width, height)
  }
  return color
}

/**
 * Check if a position is part of a finder pattern
 */
function isFinderPattern(row: number, col: number, size: number): boolean {
  // Top-left finder pattern (7x7)
  if (row < 7 && col < 7) return true
  // Top-right finder pattern (7x7)
  if (row < 7 && col >= size - 7) return true
  // Bottom-left finder pattern (7x7)
  if (row >= size - 7 && col < 7) return true
  return false
}

/**
 * Logo area for module exclusion
 */
interface LogoArea {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Check if a module position overlaps with the logo area
 * Modules in this area won't be rendered - the logo will occupy this space
 */
function isInLogoArea(
  row: number,
  col: number,
  moduleSize: number,
  offset: number,
  logoArea: LogoArea | null
): boolean {
  if (!logoArea) return false

  // Module position in pixels
  const moduleX = offset + col * moduleSize
  const moduleY = offset + row * moduleSize

  // Check if module overlaps with logo area
  return (
    moduleX + moduleSize > logoArea.x &&
    moduleX < logoArea.x + logoArea.width &&
    moduleY + moduleSize > logoArea.y &&
    moduleY < logoArea.y + logoArea.height
  )
}

/**
 * Render the QR code to a canvas element
 */
export async function renderCustomQRCode(options: CustomQROptions): Promise<HTMLCanvasElement> {
  const {
    data,
    width,
    height,
    margin = 4,
    errorCorrectionLevel = 'H',
    foregroundColor = '#000000',
    backgroundColor = '#ffffff',
    dotsType = 'square',
    cornersSquareType = 'square',
    cornersDotType = 'square',
    cornersSquareColor,
    cornersDotColor,
    dotsGradient,
    cornersSquareGradient,
    cornersDotGradient,
    backgroundGradient,
    logoUrl,
    logoSize,
    logoMargin = 5,
  } = options

  // Auto-force error correction to H when logo is present
  const effectiveErrorCorrectionLevel = logoUrl ? 'H' : errorCorrectionLevel

  // Generate QR matrix
  const qr = QRCode.create(data, { errorCorrectionLevel: effectiveErrorCorrectionLevel }) as QRMatrix
  const modules = qr.modules
  const moduleCount = modules.size
  const moduleData = modules.data

  // Calculate dimensions
  const size = Math.min(width, height)
  const moduleSize = (size - margin * 2) / moduleCount
  const offset = margin

  // Create canvas
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Draw background
  if (backgroundGradient) {
    ctx.fillStyle = createGradient(ctx, backgroundGradient, 0, 0, width, height)
  } else {
    ctx.fillStyle = backgroundColor
  }
  ctx.fillRect(0, 0, width, height)

  // Calculate logo area BEFORE rendering modules (so we can exclude modules in logo area)
  let logoArea: LogoArea | null = null
  if (logoUrl) {
    const logoSizeValue = logoSize || Math.min(width, height) * 0.25
    const logoX = (width - logoSizeValue) / 2 - logoMargin
    const logoY = (height - logoSizeValue) / 2 - logoMargin
    logoArea = {
      x: logoX,
      y: logoY,
      width: logoSizeValue + logoMargin * 2,
      height: logoSizeValue + logoMargin * 2,
    }
  }

  // Prepare colors/gradients for dots
  const dotsColorOrGradient = getColorOrGradient(
    ctx,
    foregroundColor,
    dotsGradient,
    offset,
    offset,
    size - margin * 2,
    size - margin * 2
  )

  // Draw data modules (excluding finder patterns and logo area)
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      // Skip finder pattern areas
      if (isFinderPattern(row, col, moduleCount)) continue
      // Skip logo area - modules won't be rendered where logo sits
      if (isInLogoArea(row, col, moduleSize, offset, logoArea)) continue

      const idx = row * moduleCount + col
      if (moduleData[idx]) {
        const x = offset + col * moduleSize
        const y = offset + row * moduleSize

        renderDot(ctx, dotsType, x, y, moduleSize, dotsColorOrGradient)
      }
    }
  }

  // Draw finder patterns with position info for rotatable shapes
  const finderPositions: Array<{ row: number; col: number; position: CornerPosition }> = [
    { row: 0, col: 0, position: 'top-left' },
    { row: 0, col: moduleCount - 7, position: 'top-right' },
    { row: moduleCount - 7, col: 0, position: 'bottom-left' },
  ]

  const cornerSquareColor = cornersSquareColor || foregroundColor
  const cornerDotColor = cornersDotColor || foregroundColor

  for (const pos of finderPositions) {
    const x = offset + pos.col * moduleSize
    const y = offset + pos.row * moduleSize
    const finderSize = 7 * moduleSize

    // Draw corner square (outer frame) - size is 7 modules
    const squareColorOrGradient = getColorOrGradient(
      ctx,
      cornerSquareColor,
      cornersSquareGradient,
      x,
      y,
      finderSize,
      finderSize
    )

    renderCornerSquare(ctx, cornersSquareType, x, y, finderSize, squareColorOrGradient, pos.position)

    // Draw corner dot (inner dot) - centered, 3 modules
    const dotSize = 3 * moduleSize
    const dotX = x + 2 * moduleSize
    const dotY = y + 2 * moduleSize

    const dotColorOrGradient = getColorOrGradient(
      ctx,
      cornerDotColor,
      cornersDotGradient,
      dotX,
      dotY,
      dotSize,
      dotSize
    )

    renderCornerDot(ctx, cornersDotType, dotX, dotY, dotSize, dotColorOrGradient)
  }

  // Draw logo if provided
  if (logoUrl) {
    await drawLogo(ctx, logoUrl, width, height, logoSize, logoMargin, backgroundColor)
  }

  return canvas
}

/**
 * Draw logo on the QR code
 */
async function drawLogo(
  ctx: CanvasRenderingContext2D,
  logoUrl: string,
  canvasWidth: number,
  canvasHeight: number,
  logoSize?: number,
  logoMargin: number = 5,
  backgroundColor: string = '#ffffff'
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const size = logoSize || Math.min(canvasWidth, canvasHeight) * 0.25
      const x = (canvasWidth - size) / 2
      const y = (canvasHeight - size) / 2

      // Draw background for logo area
      ctx.fillStyle = backgroundColor
      ctx.fillRect(x - logoMargin, y - logoMargin, size + logoMargin * 2, size + logoMargin * 2)

      // Draw logo
      ctx.drawImage(img, x, y, size, size)
      resolve()
    }

    img.onerror = () => {
      console.warn('Failed to load logo:', logoUrl)
      resolve() // Don't fail the whole render
    }

    img.src = logoUrl
  })
}

/**
 * Render QR code and return as data URL
 */
export async function renderCustomQRCodeToDataURL(
  options: CustomQROptions,
  format: 'image/png' | 'image/jpeg' = 'image/png',
  quality?: number
): Promise<string> {
  const canvas = await renderCustomQRCode(options)
  return canvas.toDataURL(format, quality)
}

/**
 * Render QR code and return as Blob
 */
export async function renderCustomQRCodeToBlob(
  options: CustomQROptions,
  format: 'image/png' | 'image/jpeg' = 'image/png',
  quality?: number
): Promise<Blob> {
  const canvas = await renderCustomQRCode(options)
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to create blob'))
        }
      },
      format,
      quality
    )
  })
}
