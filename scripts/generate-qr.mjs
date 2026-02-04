#!/usr/bin/env node
/**
 * Standalone QR code generation script
 * Uses @qr-platform/qr-code.js with extended shape support
 * Called via child_process from the API route
 *
 * Input: JSON on stdin
 * Output: JSON on stdout with dataUrl
 */

import { QRCodeJs } from '@qr-platform/qr-code.js'

function convertGradient(gradient) {
  if (!gradient) return undefined
  return {
    type: gradient.type,
    rotation: (gradient.rotation * Math.PI) / 180,
    colorStops: gradient.colorStops,
  }
}

function mapDotsType(type) {
  const mapping = {
    'square': 'square',
    'dots': 'dot',
    'rounded': 'rounded',
    'extra-rounded': 'extra-rounded',
    'classy': 'classy',
    'classy-rounded': 'classy-rounded',
    'diamond': 'diamond',
    'star': 'star',
    'vertical-line': 'vertical-line',
    'horizontal-line': 'horizontal-line',
    'random-dot': 'random-dot',
    'small-square': 'small-square',
    'tiny-square': 'tiny-square',
  }
  return mapping[type] || 'square'
}

function mapCornersSquareType(type) {
  const mapping = {
    'square': 'square',
    'dot': 'dot',
    'extra-rounded': 'rounded',
    'rounded': 'rounded',
    'classy': 'classy',
    'classy-rounded': 'rounded',
    'dotted': 'dot',
    'outpoint': 'outpoint',
    'inpoint': 'inpoint',
  }
  return mapping[type] || 'square'
}

function mapCornersDotType(type) {
  const mapping = {
    'square': 'square',
    'dot': 'dot',
    'heart': 'heart',
    'star': 'dot',
    'diamond': 'square',
    'rounded': 'rounded',
    'classy': 'classy',
    'outpoint': 'outpoint',
    'inpoint': 'inpoint',
  }
  return mapping[type] || 'square'
}

const DEFAULT_QR_STYLE = {
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  errorCorrectionLevel: 'H',
  margin: 2,
  width: 300,
  frameShape: 'square',
  dotsType: 'square',
  dotsGradient: null,
  cornersSquareType: 'square',
  cornersSquareColor: null,
  cornersSquareGradient: null,
  cornersDotType: 'square',
  cornersDotColor: null,
  cornersDotGradient: null,
  backgroundGradient: null,
  frame: null,
}

async function generateQR(input) {
  const { url, style, size, logoUrl, logoSize } = input

  if (!url) {
    throw new Error('URL is required')
  }

  const finalStyle = { ...DEFAULT_QR_STYLE, ...style }
  if (logoUrl) finalStyle.errorCorrectionLevel = 'H'
  const frameShape = finalStyle.frameShape || 'square'

  const options = {
    width: size || 300,
    height: size || 300,
    data: url,
    margin: Math.round(finalStyle.margin * (size / 40)),

    qrOptions: {
      errorCorrectionLevel: finalStyle.errorCorrectionLevel,
    },

    dotsOptions: {
      type: mapDotsType(finalStyle.dotsType),
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
    const isDataUrl = logoUrl.startsWith('data:')
    const effectiveLogoSize = logoSize || Math.round(size * 0.2)
    options.image = logoUrl
    options.imageOptions = {
      imageSize: effectiveLogoSize / size,
      margin: 5,
      ...(isDataUrl ? {} : { crossOrigin: 'anonymous' }),
    }
  }

  const qrCode = new QRCodeJs(options)
  const svgString = await qrCode.serialize()

  if (!svgString) {
    throw new Error('Failed to generate QR code')
  }

  const base64 = Buffer.from(svgString).toString('base64')
  const dataUrl = `data:image/svg+xml;base64,${base64}`

  return { dataUrl, svg: svgString }
}

// Read input from stdin
let inputData = ''
process.stdin.setEncoding('utf8')

process.stdin.on('data', (chunk) => {
  inputData += chunk
})

process.stdin.on('end', async () => {
  try {
    const input = JSON.parse(inputData)
    const result = await generateQR(input)
    console.log(JSON.stringify(result))
    process.exit(0)
  } catch (error) {
    console.error(JSON.stringify({ error: error.message }))
    process.exit(1)
  }
})
