import { NextRequest, NextResponse } from 'next/server'

/**
 * Server-side QR code generation using @qr-platform/qr-code.js
 * Uses dynamic import to avoid Turbopack bundling issues
 */

interface GenerateRequest {
  url: string
  style: Record<string, unknown>
  size: number
  logoUrl?: string
  logoSize?: number
}

interface GradientInput {
  type: string
  rotation: number
  colorStops: Array<{ offset: number; color: string }>
}

function convertGradient(gradient: GradientInput | null | undefined) {
  if (!gradient) return undefined
  return {
    type: gradient.type,
    rotation: (gradient.rotation * Math.PI) / 180,
    colorStops: gradient.colorStops,
  }
}

function mapDotsType(type: string): string {
  const mapping: Record<string, string> = {
    'square': 'square', 'dots': 'dot', 'rounded': 'rounded',
    'extra-rounded': 'extra-rounded', 'classy': 'classy', 'classy-rounded': 'classy-rounded',
    'diamond': 'diamond', 'star': 'star', 'vertical-line': 'vertical-line',
    'horizontal-line': 'horizontal-line', 'random-dot': 'random-dot',
    'small-square': 'small-square', 'tiny-square': 'tiny-square',
  }
  return mapping[type] || 'square'
}

function mapCornersSquareType(type: string): string {
  const mapping: Record<string, string> = {
    'square': 'square', 'dot': 'dot', 'extra-rounded': 'rounded',
    'rounded': 'rounded', 'classy': 'classy', 'classy-rounded': 'rounded',
    'dotted': 'dot', 'outpoint': 'outpoint', 'inpoint': 'inpoint',
  }
  return mapping[type] || 'square'
}

function mapCornersDotType(type: string): string {
  const mapping: Record<string, string> = {
    'square': 'square', 'dot': 'dot', 'heart': 'heart',
    'star': 'dot', 'diamond': 'square', 'rounded': 'rounded',
    'classy': 'classy', 'outpoint': 'outpoint', 'inpoint': 'inpoint',
  }
  return mapping[type] || 'square'
}

const DEFAULT_QR_STYLE: Record<string, unknown> = {
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  errorCorrectionLevel: 'H',
  margin: 2,
  dotsType: 'square',
  cornersSquareType: 'square',
  cornersDotType: 'square',
}

async function generateQR(input: GenerateRequest): Promise<{ dataUrl: string; svg: string }> {
  const { url, style, size, logoUrl, logoSize } = input

  if (!url) throw new Error('URL is required')

  const finalStyle: Record<string, unknown> = { ...DEFAULT_QR_STYLE, ...style }

  // Auto-force error correction to H when logo is present
  if (logoUrl) finalStyle.errorCorrectionLevel = 'H'

  const options: Record<string, unknown> = {
    width: size || 300,
    height: size || 300,
    data: url,
    margin: Math.round((finalStyle.margin as number) * (size / 40)),
    qrOptions: { errorCorrectionLevel: finalStyle.errorCorrectionLevel },
    dotsOptions: {
      type: mapDotsType(finalStyle.dotsType as string),
      color: finalStyle.foregroundColor as string,
      gradient: convertGradient(finalStyle.dotsGradient as GradientInput | null),
    },
    cornersSquareOptions: {
      type: mapCornersSquareType(finalStyle.cornersSquareType as string),
      color: (finalStyle.cornersSquareColor as string) || (finalStyle.foregroundColor as string),
      gradient: convertGradient(finalStyle.cornersSquareGradient as GradientInput | null),
    },
    cornersDotOptions: {
      type: mapCornersDotType(finalStyle.cornersDotType as string),
      color: (finalStyle.cornersDotColor as string) || (finalStyle.foregroundColor as string),
      gradient: convertGradient(finalStyle.cornersDotGradient as GradientInput | null),
    },
    backgroundOptions: { color: finalStyle.backgroundColor as string },
  }

  if (logoUrl) {
    const effectiveLogoSize = logoSize || Math.round(size * 0.2)
    options.image = logoUrl
    options.imageOptions = {
      imageSize: effectiveLogoSize / size,
      margin: 5,
      ...(logoUrl.startsWith('data:') ? {} : { crossOrigin: 'anonymous' }),
    }
  }

  // Dynamic import with variable path to prevent Turbopack from bundling
  const pkgName = '@qr-platform/qr-code.js'
  const { QRCodeJs } = await import(/* webpackIgnore: true */ pkgName)
  const qrCode = new QRCodeJs(options)
  const svgString = await qrCode.serialize()
  if (!svgString) throw new Error('Failed to generate QR code')

  const base64 = Buffer.from(svgString).toString('base64')
  return { dataUrl: 'data:image/svg+xml;base64,' + base64, svg: svgString }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    const { url, style, size, logoUrl, logoSize } = body

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const result = await generateQR({
      url,
      style: style || {},
      size: size || 300,
      logoUrl,
      logoSize,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generating QR code:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
