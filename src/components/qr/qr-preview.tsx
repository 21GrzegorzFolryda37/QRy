'use client'

import { useEffect, useRef, useState, useId, useMemo } from 'react'
import type QRCodeStylingType from 'qr-code-styling'
import { QrStyle } from '@/types/database'
import { DEFAULT_QR_STYLE } from '@/types/qr'
import { createQrCodeExportOptions } from '@/lib/qr/options'
import { frameShapePaths } from './frame-shapes'

interface QrPreviewProps {
  url: string
  style?: Partial<QrStyle>
  logoUrl?: string
  logoSize?: number
}

export function QrPreview({ url, style, logoUrl, logoSize }: QrPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrCodeRef = useRef<QRCodeStylingType | null>(null)
  const [QRCodeStyling, setQRCodeStyling] = useState<typeof QRCodeStylingType | null>(null)
  const clipId = useId()

  // Create stable style string for comparison
  const styleString = useMemo(() => JSON.stringify(style), [style])
  const finalStyle: QrStyle = useMemo(() => ({ ...DEFAULT_QR_STYLE, ...style }), [styleString, style])
  const frameShape = finalStyle.frameShape || 'square'
  const size = 280

  // Reset QR code instance when frameShape changes
  const prevFrameShapeRef = useRef(frameShape)
  const prevHasLogoRef = useRef(!!logoUrl)
  useEffect(() => {
    if (prevFrameShapeRef.current !== frameShape) {
      qrCodeRef.current = null
      prevFrameShapeRef.current = frameShape
    }
    const hasLogo = !!logoUrl
    if (prevHasLogoRef.current !== hasLogo) {
      qrCodeRef.current = null
      prevHasLogoRef.current = hasLogo
    }
  }, [frameShape, logoUrl])

  // Dynamic import of library (client-side only)
  useEffect(() => {
    import('qr-code-styling').then((module) => {
      setQRCodeStyling(() => module.default)
    })
  }, [])

  // Generate/update QR code
  useEffect(() => {
    if (!QRCodeStyling || !containerRef.current) return

    // Use canvas options for consistency with exported PNG
    const options = createQrCodeExportOptions({
      url,
      style: finalStyle,
      size,
      logoUrl,
      logoSize,
    })

    if (qrCodeRef.current) {
      qrCodeRef.current.update(options)
    } else {
      qrCodeRef.current = new QRCodeStyling(options)
      containerRef.current.innerHTML = ''
      qrCodeRef.current.append(containerRef.current)
    }
  }, [QRCodeStyling, url, finalStyle, logoUrl, logoSize, frameShape, size])

  // For square - no mask
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

  // For other shapes - with SVG mask
  return (
    <div className="flex justify-center">
      <div className="relative" style={{ width: size, height: size }}>
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

        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="absolute inset-0"
          style={{ zIndex: 0 }}
        >
          <path d={frameShapePaths[frameShape]} fill={finalStyle.backgroundColor} />
        </svg>

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
