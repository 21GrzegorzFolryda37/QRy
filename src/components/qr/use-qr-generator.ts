'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type QRCodeStylingType from 'qr-code-styling'
import { QrStyle, GradientOptions } from '@/types/database'
import { DEFAULT_QR_STYLE } from '@/types/qr'

interface UseQrGeneratorOptions {
  url: string
  style?: Partial<QrStyle>
  logoUrl?: string
  logoSize?: number
  size?: number
}

/**
 * Konwertuje GradientOptions na format wymagany przez qr-code-styling
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
 * Hook do generowania QR kodów client-side
 */
export function useQrGenerator(options: UseQrGeneratorOptions) {
  const { url, style, logoUrl, logoSize, size = 280 } = options
  const [QRCodeStyling, setQRCodeStyling] = useState<typeof QRCodeStylingType | null>(null)
  const [isReady, setIsReady] = useState(false)

  const finalStyle = { ...DEFAULT_QR_STYLE, ...style }
  const frameShape = finalStyle.frameShape || 'square'

  // Load qr-code-styling library
  useEffect(() => {
    import('qr-code-styling').then((module) => {
      setQRCodeStyling(() => module.default)
      setIsReady(true)
    })
  }, [])

  // Build QR code options
  const buildOptions = useCallback((targetSize: number, targetUrl: string) => {
    const qrOptions: ConstructorParameters<typeof QRCodeStylingType>[0] = {
      width: targetSize,
      height: targetSize,
      type: 'canvas',
      data: targetUrl || 'https://example.com',
      margin: finalStyle.margin * (targetSize / 28), // scale margin proportionally

      qrOptions: {
        errorCorrectionLevel: finalStyle.errorCorrectionLevel,
      },

      dotsOptions: {
        type: finalStyle.dotsType,
        color: finalStyle.foregroundColor,
        gradient: convertGradient(finalStyle.dotsGradient),
      },

      cornersSquareOptions: {
        type: finalStyle.cornersSquareType === 'rounded' ? 'extra-rounded' : finalStyle.cornersSquareType,
        color: finalStyle.cornersSquareColor || finalStyle.foregroundColor,
        gradient: convertGradient(finalStyle.cornersSquareGradient),
      },

      cornersDotOptions: {
        type: finalStyle.cornersDotType,
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
      qrOptions.image = logoUrl
      qrOptions.imageOptions = {
        hideBackgroundDots: true,
        imageSize: logoSize ? logoSize / targetSize : 0.2,
        margin: 5,
        ...(isDataUrl ? {} : { crossOrigin: 'anonymous' }),
      }
    }

    return qrOptions
  }, [finalStyle, frameShape, logoUrl, logoSize])

  // Generate QR code as data URL (PNG)
  const generateDataUrl = useCallback(async (targetUrl: string, targetSize?: number): Promise<string | null> => {
    if (!QRCodeStyling) return null

    const outputSize = targetSize || finalStyle.width
    const qrOptions = buildOptions(outputSize, targetUrl)

    const qrCode = new QRCodeStyling(qrOptions)

    try {
      const blob = await qrCode.getRawData('png')
      if (!blob) return null

      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.error('Error generating QR code:', error)
      return null
    }
  }, [QRCodeStyling, buildOptions, finalStyle.width])

  // Generate QR code as Blob
  const generateBlob = useCallback(async (targetUrl: string, targetSize?: number): Promise<Blob | null> => {
    if (!QRCodeStyling) return null

    const outputSize = targetSize || finalStyle.width
    const qrOptions = buildOptions(outputSize, targetUrl)

    const qrCode = new QRCodeStyling(qrOptions)

    try {
      const blob = await qrCode.getRawData('png')
      return blob || null
    } catch (error) {
      console.error('Error generating QR code:', error)
      return null
    }
  }, [QRCodeStyling, buildOptions, finalStyle.width])

  return {
    isReady,
    generateDataUrl,
    generateBlob,
    QRCodeStyling,
    buildOptions,
  }
}
