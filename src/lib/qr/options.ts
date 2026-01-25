import type QRCodeStylingType from 'qr-code-styling'
import { QrStyle, GradientOptions } from '@/types/database'
import { DEFAULT_QR_STYLE } from '@/types/qr'

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

/**
 * Map cornersDotType to valid qr-code-styling values
 * qr-code-styling only accepts: 'dot' | 'square' | undefined
 */
function mapCornersDotType(type: string): 'dot' | 'square' | undefined {
  if (type === 'dot') return 'dot'
  if (type === 'square') return 'square'
  return 'dot'
}

/**
 * Map cornersSquareType to valid qr-code-styling values
 * qr-code-styling only accepts: 'dot' | 'square' | 'extra-rounded' | undefined
 */
function mapCornersSquareType(type: string): 'dot' | 'square' | 'extra-rounded' | undefined {
  if (type === 'dot') return 'dot'
  if (type === 'square') return 'square'
  if (type === 'extra-rounded') return 'extra-rounded'
  if (type === 'rounded') return 'extra-rounded'
  return 'square'
}

export interface QrCodeOptions {
  url: string
  style: QrStyle
  size: number
  logoUrl?: string
  logoSize?: number
}

/**
 * Create base qr-code-styling options (without type)
 * This is shared between preview (SVG) and generation (canvas)
 */
function createBaseOptions(
  opts: QrCodeOptions
): Omit<ConstructorParameters<typeof QRCodeStylingType>[0], 'type'> {
  const { url, style, size, logoUrl, logoSize } = opts
  const finalStyle = { ...DEFAULT_QR_STYLE, ...style }
  const frameShape = finalStyle.frameShape || 'square'

  const options: Omit<ConstructorParameters<typeof QRCodeStylingType>[0], 'type'> = {
    width: size,
    height: size,
    data: url || 'https://example.com',
    margin: Math.round(finalStyle.margin * (size / 40)),

    qrOptions: {
      errorCorrectionLevel: finalStyle.errorCorrectionLevel,
    },

    dotsOptions: {
      type: finalStyle.dotsType,
      color: finalStyle.foregroundColor,
      gradient: convertGradient(finalStyle.dotsGradient),
    },

    cornersSquareOptions: {
      type: mapCornersSquareType(finalStyle.cornersSquareType),
      color: finalStyle.cornersSquareColor || finalStyle.foregroundColor,
      gradient: convertGradient(finalStyle.cornersSquareGradient),
    },

    cornersDotOptions: {
      type: mapCornersDotType(finalStyle.cornersDotType),
      color: finalStyle.cornersDotColor || finalStyle.foregroundColor,
      gradient: convertGradient(finalStyle.cornersDotGradient),
    },

    backgroundOptions: {
      color: frameShape === 'square' ? finalStyle.backgroundColor : 'transparent',
      gradient: frameShape === 'square' ? convertGradient(finalStyle.backgroundGradient) : undefined,
    },
  }

  // Add logo if provided
  if (logoUrl) {
    const isDataUrl = logoUrl.startsWith('data:')
    const effectiveLogoSize = logoSize || Math.round(size * 0.2)
    options.image = logoUrl
    options.imageOptions = {
      hideBackgroundDots: true,
      imageSize: effectiveLogoSize / size,
      margin: 5,
      ...(isDataUrl ? {} : { crossOrigin: 'anonymous' }),
    }
  }

  return options
}

/**
 * Create qr-code-styling options for preview (SVG for smooth display)
 */
export function createQrCodeStylingOptions(
  opts: QrCodeOptions
): ConstructorParameters<typeof QRCodeStylingType>[0] {
  return {
    ...createBaseOptions(opts),
    type: 'svg',
  }
}

/**
 * Create qr-code-styling options for export (canvas for proper PNG)
 */
export function createQrCodeExportOptions(
  opts: QrCodeOptions
): ConstructorParameters<typeof QRCodeStylingType>[0] {
  return {
    ...createBaseOptions(opts),
    type: 'canvas',
  }
}

/**
 * Generate QR code as data URL (uses canvas for proper PNG export)
 */
export async function generateQrDataUrl(
  QRCodeStyling: typeof QRCodeStylingType,
  opts: QrCodeOptions
): Promise<string | null> {
  try {
    // Use canvas type for proper PNG export
    const options = createQrCodeExportOptions(opts)
    const qrCode = new QRCodeStyling(options)
    const blob = await qrCode.getRawData('png')

    if (!blob) return null

    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob as Blob)
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    return null
  }
}
