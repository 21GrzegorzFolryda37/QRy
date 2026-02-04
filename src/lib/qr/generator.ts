import sharp from 'sharp'
import QRCode from 'qrcode'
import { QrStyle, FrameShape } from '@/types/database'
import { DEFAULT_QR_STYLE } from '@/types/qr'

export interface GenerateQrOptions {
  url: string
  style?: Partial<QrStyle>
  logoUrl?: string | null
  logoSize?: number
}

/**
 * Definicje ścieżek SVG dla różnych kształtów ramki
 */
const frameShapePaths: Record<FrameShape, string> = {
  square: 'M 0 0 L 100 0 L 100 100 L 0 100 Z',
  circle: 'M 50 0 A 50 50 0 1 1 50 100 A 50 50 0 1 1 50 0',
  rounded: 'M 15 0 L 85 0 Q 100 0 100 15 L 100 85 Q 100 100 85 100 L 15 100 Q 0 100 0 85 L 0 15 Q 0 0 15 0',
  heart: 'M 50 88 C 20 65 0 50 0 30 C 0 12 15 0 33 0 C 42 0 50 8 50 8 C 50 8 58 0 67 0 C 85 0 100 12 100 30 C 100 50 80 65 50 88 Z',
  hexagon: 'M 50 0 L 93.3 25 L 93.3 75 L 50 100 L 6.7 75 L 6.7 25 Z',
  star: 'M 50 0 L 61 35 L 98 35 L 68 57 L 79 91 L 50 70 L 21 91 L 32 57 L 2 35 L 39 35 Z',
  diamond: 'M 50 0 L 100 50 L 50 100 L 0 50 Z',
}

/**
 * Tworzy maskę SVG dla danego kształtu
 */
function createShapeMask(shape: FrameShape, size: number, bgColor: string): Buffer {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="${frameShapePaths[shape]}" fill="${bgColor}"/>
    </svg>
  `
  return Buffer.from(svg)
}

/**
 * Tworzy maskę alfa dla przycinania obrazu do kształtu
 */
function createAlphaMask(shape: FrameShape, size: number): Buffer {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="black"/>
      <path d="${frameShapePaths[shape]}" fill="white"/>
    </svg>
  `
  return Buffer.from(svg)
}

/**
 * Konwertuje data URL na Buffer
 */
function dataUrlToBuffer(dataUrl: string): Buffer {
  const base64Data = dataUrl.split(',')[1]
  return Buffer.from(base64Data, 'base64')
}

/**
 * Generuje kod QR jako PNG buffer
 */
async function generateBasicQr(
  url: string,
  size: number,
  margin: number,
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H',
  fgColor: string,
  bgColor: string
): Promise<Buffer> {
  return QRCode.toBuffer(url, {
    type: 'png',
    width: size,
    margin,
    errorCorrectionLevel,
    color: {
      dark: fgColor,
      light: bgColor,
    },
  })
}

/**
 * Dodaje logo do obrazu QR code
 */
async function addLogoToQr(
  qrBuffer: Buffer,
  logoUrl: string,
  size: number,
  logoSize: number
): Promise<Buffer> {
  const logoSizePixels = logoSize || Math.round(size * 0.3)
  const logoPosition = Math.round((size - logoSizePixels) / 2)

  let logoBuffer: Buffer

  if (logoUrl.startsWith('data:')) {
    logoBuffer = dataUrlToBuffer(logoUrl)
  } else {
    const response = await fetch(logoUrl)
    const arrayBuffer = await response.arrayBuffer()
    logoBuffer = Buffer.from(arrayBuffer)
  }

  // Resize logo
  const resizedLogo = await sharp(logoBuffer)
    .resize(logoSizePixels, logoSizePixels, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toBuffer()

  // Create white background for logo
  const logoBgSize = logoSizePixels + 10
  const logoBgPosition = Math.round((size - logoBgSize) / 2)
  const logoBg = await sharp({
    create: {
      width: logoBgSize,
      height: logoBgSize,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .png()
    .toBuffer()

  // Composite logo onto QR code
  return sharp(qrBuffer)
    .composite([
      { input: logoBg, top: logoBgPosition, left: logoBgPosition },
      { input: resizedLogo, top: logoPosition, left: logoPosition },
    ])
    .png()
    .toBuffer()
}

/**
 * Generuje kod QR z opcjami stylizacji
 * Używa prostego pakietu 'qrcode' dla szybkiego generowania server-side
 */
export async function generateQrCode(options: GenerateQrOptions): Promise<Buffer> {
  const style: QrStyle = {
    ...DEFAULT_QR_STYLE,
    ...options.style,
  }

  const frameShape = style.frameShape || 'square'
  const isNonSquare = frameShape !== 'square'
  const size = style.width

  // Generate basic QR code
  let qrBuffer = await generateBasicQr(
    options.url,
    size,
    style.margin,
    style.errorCorrectionLevel,
    style.foregroundColor,
    isNonSquare ? '#FFFFFF00' : style.backgroundColor // transparent for non-square
  )

  // Add logo if provided
  if (options.logoUrl) {
    qrBuffer = await addLogoToQr(
      qrBuffer,
      options.logoUrl,
      size,
      options.logoSize || Math.round(size * 0.3)
    )
  }

  // For square - return as is
  if (!isNonSquare) {
    return qrBuffer
  }

  // For other shapes - apply mask
  const shapeBg = await sharp(createShapeMask(frameShape, size, style.backgroundColor))
    .resize(size, size)
    .png()
    .toBuffer()

  const alphaMask = await sharp(createAlphaMask(frameShape, size))
    .resize(size, size)
    .extractChannel('red')
    .toBuffer()

  const maskedQr = await sharp(qrBuffer)
    .resize(size, size)
    .ensureAlpha()
    .joinChannel(alphaMask)
    .png()
    .toBuffer()

  return sharp(shapeBg)
    .composite([{ input: maskedQr, blend: 'over' }])
    .png()
    .toBuffer()
}

/**
 * Generuje nazwę pliku dla obrazu QR
 */
export function getQrImageFileName(shortCode: string): string {
  return `qr-${shortCode}-${Date.now()}.png`
}
