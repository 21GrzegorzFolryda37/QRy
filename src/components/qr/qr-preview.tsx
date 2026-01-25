'use client'

import { useEffect, useRef, useState, useId } from 'react'
import type QRCodeStylingType from 'qr-code-styling'
import { QrStyle, GradientOptions } from '@/types/database'
import { DEFAULT_QR_STYLE } from '@/types/qr'
import { frameShapePaths } from './frame-shapes'

interface QrPreviewProps {
  url: string
  style?: Partial<QrStyle>
  logoUrl?: string
  logoSize?: number
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

export function QrPreview({ url, style, logoUrl, logoSize }: QrPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrCodeRef = useRef<QRCodeStylingType | null>(null)
  const [QRCodeStyling, setQRCodeStyling] = useState<typeof QRCodeStylingType | null>(null)
  const clipId = useId()

  const finalStyle = { ...DEFAULT_QR_STYLE, ...style }
  const frameShape = finalStyle.frameShape || 'square'
  const size = 280

  // Reset QR code instance when frameShape changes
  // to avoid DOM manipulation errors on different JSX structures
  const prevFrameShapeRef = useRef(frameShape)
  const prevHasLogoRef = useRef(!!logoUrl)
  useEffect(() => {
    if (prevFrameShapeRef.current !== frameShape) {
      qrCodeRef.current = null
      prevFrameShapeRef.current = frameShape
    }
    // Also reset when logo is added or removed (not just changed)
    const hasLogo = !!logoUrl
    if (prevHasLogoRef.current !== hasLogo) {
      qrCodeRef.current = null
      prevHasLogoRef.current = hasLogo
    }
  }, [frameShape, logoUrl])

  // Dynamiczny import biblioteki (tylko client-side)
  useEffect(() => {
    import('qr-code-styling').then((module) => {
      setQRCodeStyling(() => module.default)
    })
  }, [])

  // Generowanie/aktualizacja kodu QR
  useEffect(() => {
    if (!QRCodeStyling || !containerRef.current) return

    const options: ConstructorParameters<typeof QRCodeStylingType>[0] = {
      width: size,
      height: size,
      type: 'svg',
      data: url || 'https://example.com',
      margin: finalStyle.margin * 7, // skalowanie dla preview

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

    // Dodaj logo jeśli podane
    if (logoUrl) {
      // Data URLs don't need CORS, only external URLs do
      const isDataUrl = logoUrl.startsWith('data:')
      options.image = logoUrl
      options.imageOptions = {
        hideBackgroundDots: true,
        imageSize: logoSize ? logoSize / size : 0.2,
        margin: 5,
        ...(isDataUrl ? {} : { crossOrigin: 'anonymous' }),
      }
    }

    // Jeśli QR code już istnieje, zaktualizuj opcje
    if (qrCodeRef.current) {
      qrCodeRef.current.update(options)
    } else {
      // Utwórz nowy QR code
      qrCodeRef.current = new QRCodeStyling(options)
      containerRef.current.innerHTML = ''
      qrCodeRef.current.append(containerRef.current)
    }
  }, [QRCodeStyling, url, finalStyle, logoUrl, logoSize, frameShape, size])

  // Dla kwadratu - bez maski
  if (frameShape === 'square') {
    return (
      <div className="flex justify-center">
        <div
          ref={containerRef}
          className="rounded-lg overflow-hidden bg-white"
          style={{ width: size, height: size }}
        />
      </div>
    )
  }

  // Dla innych kształtów - z maską SVG
  return (
    <div className="flex justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG z definicją clipPath */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox" transform="scale(0.01)">
              <path d={frameShapePaths[frameShape]} />
            </clipPath>
          </defs>
        </svg>

        {/* Tło w kształcie */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="absolute inset-0"
          style={{ zIndex: 0 }}
        >
          <path d={frameShapePaths[frameShape]} fill={finalStyle.backgroundColor} />
        </svg>

        {/* QR code z przyciętym kształtem */}
        <div
          ref={containerRef}
          className="absolute inset-0"
          style={{
            clipPath: `url(#${clipId})`,
            WebkitClipPath: `url(#${clipId})`,
            zIndex: 2,
          }}
        />
      </div>
    </div>
  )
}
