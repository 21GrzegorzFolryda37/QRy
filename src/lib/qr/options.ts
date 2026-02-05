import type QRCodeStylingType from 'qr-code-styling'
import { QrStyle, GradientOptions, FrameOptions, FrameStyle } from '@/types/database'
import { DEFAULT_QR_STYLE } from '@/types/qr'
import {
  mapDotsTypeForPreview,
  mapCornersSquareTypeForPreview,
  mapCornersDotTypeForPreview,
} from './shape-mapping'
import { requiresCustomRenderer } from './custom-shapes'
import { renderCustomQRCodeToDataURL, type CustomQROptions } from './custom-renderer'

/**
 * Convert gradient options for qr-code-styling
 */
function convertGradient(gradient: GradientOptions | null | undefined) {
  if (!gradient) return undefined
  return {
    type: gradient.type,
    rotation: (gradient.rotation * Math.PI) / 180,
    colorStops: gradient.colorStops,
  }
}

export interface QrCodeOptions {
  url: string
  style: QrStyle
  size: number
  logoUrl?: string
  logoSize?: number
}

/**
 * Create base QR code options
 * This is shared between preview and generation
 */
function createBaseOptions(
  opts: QrCodeOptions
): ConstructorParameters<typeof QRCodeStylingType>[0] {
  const { url, style, size, logoUrl, logoSize } = opts
  const finalStyle = { ...DEFAULT_QR_STYLE, ...style }
  const frameShape = finalStyle.frameShape || 'square'

  const options: ConstructorParameters<typeof QRCodeStylingType>[0] = {
    width: size,
    height: size,
    data: url || 'https://example.com',
    margin: Math.round(finalStyle.margin * (size / 40)),

    qrOptions: {
      errorCorrectionLevel: finalStyle.errorCorrectionLevel,
    },

    dotsOptions: {
      type: mapDotsTypeForPreview(finalStyle.dotsType),
      color: finalStyle.foregroundColor,
      gradient: convertGradient(finalStyle.dotsGradient),
    },

    cornersSquareOptions: {
      type: mapCornersSquareTypeForPreview(finalStyle.cornersSquareType),
      color: finalStyle.cornersSquareColor || finalStyle.foregroundColor,
      gradient: convertGradient(finalStyle.cornersSquareGradient),
    },

    cornersDotOptions: {
      type: mapCornersDotTypeForPreview(finalStyle.cornersDotType),
      color: finalStyle.cornersDotColor || finalStyle.foregroundColor,
      gradient: convertGradient(finalStyle.cornersDotGradient),
    },

    backgroundOptions: {
      // Make background transparent if there's a decorative frame OR non-square QR shape
      // The frame's white "decoration" area will serve as the visible background
      color: (frameShape !== 'square' || (finalStyle.frame && finalStyle.frame.style !== 'none'))
        ? 'transparent'
        : finalStyle.backgroundColor,
      gradient: (frameShape !== 'square' || (finalStyle.frame && finalStyle.frame.style !== 'none'))
        ? undefined
        : convertGradient(finalStyle.backgroundGradient),
    },
  }

  // Add logo if provided
  if (logoUrl) {
    // Auto-force error correction to H when logo is present
    options.qrOptions = { ...options.qrOptions, errorCorrectionLevel: 'H' }

    const isDataUrl = logoUrl.startsWith('data:')
    const effectiveLogoSize = logoSize || Math.round(size * 0.2)
    options.image = logoUrl
    options.imageOptions = {
      imageSize: effectiveLogoSize / size,
      margin: 5,
      ...(isDataUrl ? {} : { crossOrigin: 'anonymous' }),
    }
  }

  return options
}

/**
 * Create QR code options for preview (SVG for smooth display)
 */
export function createQrCodeStylingOptions(
  opts: QrCodeOptions
): ConstructorParameters<typeof QRCodeStylingType>[0] {
  return createBaseOptions(opts)
}

/**
 * Create QR code options for export
 */
export function createQrCodeExportOptions(
  opts: QrCodeOptions
): ConstructorParameters<typeof QRCodeStylingType>[0] {
  return createBaseOptions(opts)
}

// Frame dimensions
const FRAME_PADDING_RATIO = 0.08
const TEXT_AREA_HEIGHT_RATIO = 0.12

/**
 * Calculate frame dimensions
 */
function getFrameDimensions(qrSize: number, frame: FrameOptions | null) {
  if (!frame || frame.style === 'none') {
    return { width: qrSize, height: qrSize, padding: 0, textHeight: 0 }
  }

  const padding = Math.round(qrSize * FRAME_PADDING_RATIO)
  const textHeight = frame.showText ? Math.round(qrSize * TEXT_AREA_HEIGHT_RATIO) : 0

  return {
    width: qrSize + padding * 2,
    height: qrSize + padding * 2 + textHeight,
    padding,
    textHeight,
  }
}

/**
 * Create canvas gradient from GradientOptions
 */
function createCanvasGradient(
  ctx: CanvasRenderingContext2D,
  gradient: GradientOptions,
  x: number,
  y: number,
  width: number,
  height: number
): CanvasGradient {
  let canvasGradient: CanvasGradient

  if (gradient.type === 'linear') {
    // Calculate gradient endpoints based on rotation
    const angle = (gradient.rotation * Math.PI) / 180
    const centerX = x + width / 2
    const centerY = y + height / 2
    const length = Math.sqrt(width * width + height * height) / 2

    const x1 = centerX - Math.cos(angle) * length
    const y1 = centerY - Math.sin(angle) * length
    const x2 = centerX + Math.cos(angle) * length
    const y2 = centerY + Math.sin(angle) * length

    canvasGradient = ctx.createLinearGradient(x1, y1, x2, y2)
  } else {
    // Radial gradient
    const centerX = x + width / 2
    const centerY = y + height / 2
    const radius = Math.max(width, height) / 2

    canvasGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
  }

  // Add color stops
  for (const stop of gradient.colorStops) {
    canvasGradient.addColorStop(stop.offset, stop.color)
  }

  return canvasGradient
}

/**
 * Get fill style (color or gradient) for frame
 */
function getFrameFillStyle(
  ctx: CanvasRenderingContext2D,
  frame: FrameOptions,
  width: number,
  height: number
): string | CanvasGradient {
  if (frame.gradient) {
    return createCanvasGradient(ctx, frame.gradient, 0, 0, width, height)
  }
  return frame.color
}

/**
 * Draw decorative frame on canvas
 */
function drawFrameOnCanvas(
  ctx: CanvasRenderingContext2D,
  frame: FrameOptions,
  width: number,
  height: number,
  padding: number,
  textHeight: number
) {
  const qrSize = width - padding * 2
  const fillStyle = getFrameFillStyle(ctx, frame, width, height)

  ctx.save()

  switch (frame.style) {
    case 'simple':
      // Background
      ctx.fillStyle = fillStyle
      roundRect(ctx, 0, 0, width, height, 8)
      ctx.fill()
      // QR area
      ctx.fillStyle = 'white'
      roundRect(ctx, padding - 4, padding - 4, qrSize + 8, qrSize + 8, 4)
      ctx.fill()
      break

    case 'rounded':
      ctx.fillStyle = fillStyle
      roundRect(ctx, 0, 0, width, height, 24)
      ctx.fill()
      ctx.fillStyle = 'white'
      roundRect(ctx, padding - 4, padding - 4, qrSize + 8, qrSize + 8, 16)
      ctx.fill()
      break

    case 'fancy':
      ctx.fillStyle = fillStyle
      roundRect(ctx, 0, 0, width, height, 8)
      ctx.fill()
      // Dashed border
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.setLineDash([6, 4])
      roundRect(ctx, 4, 4, width - 8, height - 8, 6)
      ctx.stroke()
      ctx.setLineDash([])
      // QR area
      ctx.fillStyle = 'white'
      roundRect(ctx, padding - 2, padding - 2, qrSize + 4, qrSize + 4, 4)
      ctx.fill()
      break

    case 'ticket':
      drawTicketFrame(ctx, fillStyle, width, height)
      ctx.fillStyle = 'white'
      roundRect(ctx, padding - 2, padding - 2, qrSize + 4, qrSize + 4, 4)
      ctx.fill()
      break

    case 'badge':
      // Circle background
      ctx.fillStyle = fillStyle
      ctx.beginPath()
      ctx.arc(width / 2, width / 2, width / 2 - 2, 0, Math.PI * 2)
      ctx.fill()
      // Ribbon
      const ribbonWidth = width * 0.45
      const ribbonHeight = height * 0.15
      ctx.fillRect((width - ribbonWidth) / 2, height - ribbonHeight - 4, ribbonWidth, ribbonHeight)
      ctx.beginPath()
      ctx.moveTo((width - ribbonWidth) / 2, height - ribbonHeight - 4)
      ctx.lineTo(width / 2, height - ribbonHeight / 2 - 4)
      ctx.lineTo((width + ribbonWidth) / 2, height - ribbonHeight - 4)
      ctx.fill()
      // White circle for QR
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(width / 2, width / 2, qrSize / 2 + 4, 0, Math.PI * 2)
      ctx.fill()
      break

    case 'minimal':
      const cornerLength = 20
      const cornerWidth = 4
      ctx.strokeStyle = fillStyle
      ctx.lineWidth = cornerWidth
      ctx.lineCap = 'round'
      // Top-left
      ctx.beginPath()
      ctx.moveTo(padding - 8, padding - 8 + cornerLength)
      ctx.lineTo(padding - 8, padding - 8)
      ctx.lineTo(padding - 8 + cornerLength, padding - 8)
      ctx.stroke()
      // Top-right
      ctx.beginPath()
      ctx.moveTo(width - padding + 8 - cornerLength, padding - 8)
      ctx.lineTo(width - padding + 8, padding - 8)
      ctx.lineTo(width - padding + 8, padding - 8 + cornerLength)
      ctx.stroke()
      // Bottom-left
      ctx.beginPath()
      ctx.moveTo(padding - 8, padding + qrSize + 8 - cornerLength)
      ctx.lineTo(padding - 8, padding + qrSize + 8)
      ctx.lineTo(padding - 8 + cornerLength, padding + qrSize + 8)
      ctx.stroke()
      // Bottom-right
      ctx.beginPath()
      ctx.moveTo(width - padding + 8 - cornerLength, padding + qrSize + 8)
      ctx.lineTo(width - padding + 8, padding + qrSize + 8)
      ctx.lineTo(width - padding + 8, padding + qrSize + 8 - cornerLength)
      ctx.stroke()
      break
  }

  // Draw text
  if (frame.showText && frame.text && textHeight > 0) {
    const fontSize = Math.round(textHeight * 0.5)
    ctx.fillStyle = frame.textColor
    ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(frame.text, width / 2, qrSize + padding * 2 + textHeight / 2)
  }

  ctx.restore()
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawTicketFrame(ctx: CanvasRenderingContext2D, fillStyle: string | CanvasGradient, width: number, height: number) {
  const notchSize = 12
  ctx.fillStyle = fillStyle
  ctx.beginPath()
  ctx.moveTo(notchSize, 0)
  ctx.lineTo(width - notchSize, 0)
  ctx.quadraticCurveTo(width, 0, width, notchSize)
  ctx.lineTo(width, height * 0.4 - notchSize)
  ctx.quadraticCurveTo(width - notchSize, height * 0.4 - notchSize, width - notchSize, height * 0.4)
  ctx.quadraticCurveTo(width - notchSize, height * 0.4 + notchSize, width, height * 0.4 + notchSize)
  ctx.lineTo(width, height - notchSize)
  ctx.quadraticCurveTo(width, height, width - notchSize, height)
  ctx.lineTo(notchSize, height)
  ctx.quadraticCurveTo(0, height, 0, height - notchSize)
  ctx.lineTo(0, height * 0.4 + notchSize)
  ctx.quadraticCurveTo(notchSize, height * 0.4 + notchSize, notchSize, height * 0.4)
  ctx.quadraticCurveTo(notchSize, height * 0.4 - notchSize, 0, height * 0.4 - notchSize)
  ctx.lineTo(0, notchSize)
  ctx.quadraticCurveTo(0, 0, notchSize, 0)
  ctx.closePath()
  ctx.fill()
}

/**
 * Generate QR code as data URL
 * Includes decorative frame if set in style
 */
export async function generateQrDataUrl(
  QRCodeStyling: typeof QRCodeStylingType,
  opts: QrCodeOptions
): Promise<string | null> {
  try {
    const finalStyle = { ...DEFAULT_QR_STYLE, ...opts.style }
    const frame = finalStyle.frame

    // Generate QR code
    const options = createQrCodeExportOptions(opts)
    const qrCode = new QRCodeStyling(options)
    const rawData = await qrCode.getRawData('png')

    if (!rawData) return null

    // Convert Blob/Buffer to data URL
    const qrDataUrl = await new Promise<string>((resolve, reject) => {
      // Handle both Blob and Buffer types
      let blob: Blob
      if (rawData instanceof Blob) {
        blob = rawData
      } else {
        // For Buffer/ArrayBuffer, create a new Uint8Array and then Blob
        const uint8Array = new Uint8Array(rawData)
        blob = new Blob([uint8Array], { type: 'image/png' })
      }
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })

    // If no decorative frame, return QR code directly
    if (!frame || frame.style === 'none') {
      return qrDataUrl
    }

    // Create canvas with frame
    const { width, height, padding, textHeight } = getFrameDimensions(opts.size, frame)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    if (!ctx) return null

    // Draw white background for non-minimal frames
    if (frame.style !== 'minimal') {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, width, height)
    }

    // Draw frame
    drawFrameOnCanvas(ctx, frame, width, height, padding, textHeight)

    // Load and draw QR code image
    const qrImage = new Image()

    return new Promise((resolve) => {
      qrImage.onload = () => {
        ctx.drawImage(qrImage, padding, padding, opts.size, opts.size)
        resolve(canvas.toDataURL('image/png'))
      }
      qrImage.onerror = () => resolve(null)
      qrImage.src = qrDataUrl
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    return null
  }
}

/**
 * Convert QrStyle to CustomQROptions for the custom renderer
 */
function styleToCustomOptions(opts: QrCodeOptions): CustomQROptions {
  const { url, style, size, logoUrl, logoSize } = opts
  const finalStyle = { ...DEFAULT_QR_STYLE, ...style }

  return {
    data: url || 'https://example.com',
    width: size,
    height: size,
    margin: Math.round(finalStyle.margin * (size / 40)),
    errorCorrectionLevel: finalStyle.errorCorrectionLevel,
    foregroundColor: finalStyle.foregroundColor,
    backgroundColor: finalStyle.backgroundColor,
    dotsType: finalStyle.dotsType,
    cornersSquareType: finalStyle.cornersSquareType,
    cornersDotType: finalStyle.cornersDotType,
    cornersSquareColor: finalStyle.cornersSquareColor || undefined,
    cornersDotColor: finalStyle.cornersDotColor || undefined,
    dotsGradient: finalStyle.dotsGradient,
    cornersSquareGradient: finalStyle.cornersSquareGradient,
    cornersDotGradient: finalStyle.cornersDotGradient,
    backgroundGradient: finalStyle.backgroundGradient,
    logoUrl,
    logoSize,
    logoMargin: 5,
  }
}

/**
 * Check if the style requires the custom renderer
 */
export function needsCustomRenderer(style: QrStyle): boolean {
  const finalStyle = { ...DEFAULT_QR_STYLE, ...style }
  return requiresCustomRenderer({
    dotsType: finalStyle.dotsType,
    cornersSquareType: finalStyle.cornersSquareType,
    cornersDotType: finalStyle.cornersDotType,
  })
}

/**
 * Generate QR code using the custom canvas renderer
 * Use this for extended shapes not supported by qr-code-styling
 */
export async function generateQrWithCustomRenderer(
  opts: QrCodeOptions
): Promise<string | null> {
  try {
    const finalStyle = { ...DEFAULT_QR_STYLE, ...opts.style }
    const frame = finalStyle.frame
    const customOptions = styleToCustomOptions(opts)

    // Generate QR code with custom renderer
    const qrDataUrl = await renderCustomQRCodeToDataURL(customOptions)

    // If no decorative frame, return QR code directly
    if (!frame || frame.style === 'none') {
      return qrDataUrl
    }

    // Create canvas with frame
    const { width, height, padding, textHeight } = getFrameDimensions(opts.size, frame)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    if (!ctx) return null

    // Draw white background for non-minimal frames
    if (frame.style !== 'minimal') {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, width, height)
    }

    // Draw frame
    drawFrameOnCanvas(ctx, frame, width, height, padding, textHeight)

    // Load and draw QR code image
    const qrImage = new Image()

    return new Promise((resolve) => {
      qrImage.onload = () => {
        ctx.drawImage(qrImage, padding, padding, opts.size, opts.size)
        resolve(canvas.toDataURL('image/png'))
      }
      qrImage.onerror = () => resolve(null)
      qrImage.src = qrDataUrl
    })
  } catch (error) {
    console.error('Error generating QR code with custom renderer:', error)
    return null
  }
}

/**
 * Generate QR code using the appropriate renderer based on style
 * Automatically chooses between qr-code-styling and custom renderer
 */
export async function generateQrCodeImage(
  QRCodeStyling: typeof QRCodeStylingType | null,
  opts: QrCodeOptions
): Promise<string | null> {
  // Use custom renderer for extended shapes
  if (needsCustomRenderer(opts.style)) {
    return generateQrWithCustomRenderer(opts)
  }

  // Use qr-code-styling for native shapes
  if (QRCodeStyling) {
    return generateQrDataUrl(QRCodeStyling, opts)
  }

  // Fallback to custom renderer if qr-code-styling not available
  return generateQrWithCustomRenderer(opts)
}
