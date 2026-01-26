'use client'

import { useEffect, useRef, useState, useId, useMemo } from 'react'
import type QRCodeStylingType from 'qr-code-styling'
import { QrStyle } from '@/types/database'
import { DEFAULT_QR_STYLE } from '@/types/qr'
import { createQrCodeStylingOptions } from '@/lib/qr/options'
import { frameShapePaths } from './frame-shapes'
import { FrameRenderer, getFrameDimensions } from './frame-renderer'

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
  const frame = finalStyle.frame
  const qrSize = 280

  // Calculate total dimensions including frame
  const dimensions = useMemo(() => getFrameDimensions(qrSize, frame), [qrSize, frame])

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

    // Use SVG for smooth preview without grid artifacts
    const options = createQrCodeStylingOptions({
      url,
      style: finalStyle,
      size: qrSize,
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
  }, [QRCodeStyling, url, finalStyle, logoUrl, logoSize, frameShape, qrSize])

  // QR code content (used in both cases)
  const qrContent = frameShape === 'square' ? (
    <div
      ref={containerRef}
      className="rounded-lg overflow-hidden bg-white"
      style={{ width: qrSize, height: qrSize }}
    />
  ) : (
    <div className="relative" style={{ width: qrSize, height: qrSize }}>
      <svg
        width={qrSize}
        height={qrSize}
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
        width={qrSize}
        height={qrSize}
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
  )

  // Wrap with decorative frame if enabled
  if (frame && frame.style !== 'none') {
    return (
      <div className="flex justify-center">
        <FrameRenderer frame={frame} size={qrSize} className="relative">
          {qrContent}
        </FrameRenderer>
      </div>
    )
  }

  // No decorative frame
  return (
    <div className="flex justify-center">
      {qrContent}
    </div>
  )
}
