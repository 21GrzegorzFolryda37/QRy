'use client'

import { useEffect, useRef, useState, useId, useMemo } from 'react'
import type QRCodeStylingType from 'qr-code-styling'
import { QrStyle } from '@/types/database'
import { DEFAULT_QR_STYLE } from '@/types/qr'
import { createQrCodeStylingOptions, needsCustomRenderer } from '@/lib/qr/options'
import { renderCustomQRCodeToDataURL } from '@/lib/qr/custom-renderer'
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
  const [customQrDataUrl, setCustomQrDataUrl] = useState<string | null>(null)
  const clipId = useId()

  // Create stable style string for comparison
  const styleString = useMemo(() => JSON.stringify(style), [style])
  const finalStyle: QrStyle = useMemo(() => ({ ...DEFAULT_QR_STYLE, ...style }), [styleString, style])
  const frameShape = finalStyle.frameShape || 'square'
  const frame = finalStyle.frame
  const qrSize = 260 // Smaller QR to leave room for frames

  // Check if custom renderer is needed for extended shapes
  const useCustomRenderer = useMemo(() => needsCustomRenderer(finalStyle), [finalStyle])

  // Calculate total dimensions including frame
  const dimensions = useMemo(() => getFrameDimensions(qrSize, frame), [qrSize, frame])

  // Reset QR code instance when frameShape or frame changes (affects background transparency)
  const prevFrameShapeRef = useRef(frameShape)
  const prevHasLogoRef = useRef(!!logoUrl)
  const prevFrameStyleRef = useRef(frame?.style)
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
    // Reset when decorative frame changes (background transparency changes)
    if (prevFrameStyleRef.current !== frame?.style) {
      qrCodeRef.current = null
      prevFrameStyleRef.current = frame?.style
    }
  }, [frameShape, logoUrl, frame?.style])

  // Dynamic import of library (client-side only)
  useEffect(() => {
    import('qr-code-styling').then((module) => {
      setQRCodeStyling(() => module.default)
    })
  }, [])

  // Generate QR code using custom renderer for extended shapes
  useEffect(() => {
    if (!useCustomRenderer) {
      setCustomQrDataUrl(null)
      return
    }

    const generateCustomQR = async () => {
      try {
        const dataUrl = await renderCustomQRCodeToDataURL({
          data: url || 'https://example.com',
          width: qrSize,
          height: qrSize,
          margin: Math.round(finalStyle.margin * (qrSize / 40)),
          errorCorrectionLevel: finalStyle.errorCorrectionLevel,
          foregroundColor: finalStyle.foregroundColor,
          backgroundColor: (frameShape !== 'square' || (frame && frame.style !== 'none'))
            ? 'transparent'
            : finalStyle.backgroundColor,
          dotsType: finalStyle.dotsType,
          cornersSquareType: finalStyle.cornersSquareType,
          cornersDotType: finalStyle.cornersDotType,
          cornersSquareColor: finalStyle.cornersSquareColor || undefined,
          cornersDotColor: finalStyle.cornersDotColor || undefined,
          dotsGradient: finalStyle.dotsGradient,
          cornersSquareGradient: finalStyle.cornersSquareGradient,
          cornersDotGradient: finalStyle.cornersDotGradient,
          backgroundGradient: (frameShape !== 'square' || (frame && frame.style !== 'none'))
            ? undefined
            : finalStyle.backgroundGradient,
          logoUrl,
          logoSize,
        })
        setCustomQrDataUrl(dataUrl)
      } catch (error) {
        console.error('Error generating custom QR:', error)
        setCustomQrDataUrl(null)
      }
    }

    generateCustomQR()
  }, [useCustomRenderer, url, finalStyle, logoUrl, logoSize, frameShape, frame, qrSize])

  // Generate/update QR code using qr-code-styling for native shapes
  useEffect(() => {
    if (useCustomRenderer || !QRCodeStyling || !containerRef.current) return

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
  }, [useCustomRenderer, QRCodeStyling, url, finalStyle, logoUrl, logoSize, frameShape, qrSize])

  // Always use a stable structure - containerRef must stay in same DOM position
  // Use FrameRenderer always (it handles 'none' case by just returning children)
  const hasCustomShape = frameShape !== 'square'

  // Render QR code content - either custom renderer image or qr-code-styling container
  const renderQrContent = () => {
    if (useCustomRenderer && customQrDataUrl) {
      return (
        <img
          src={customQrDataUrl}
          alt="QR Code"
          width={qrSize}
          height={qrSize}
          style={{ display: 'block' }}
        />
      )
    }
    // Container for qr-code-styling (also used as loading state for custom renderer)
    return (
      <div
        ref={containerRef}
        style={{
          width: qrSize,
          height: qrSize,
          backgroundColor: (frame && frame.style !== 'none') ? 'transparent' : 'white'
        }}
      />
    )
  }

  return (
    <div className="flex justify-center">
      <FrameRenderer frame={frame} size={qrSize} className="relative">
        {hasCustomShape ? (
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
              className="absolute inset-0"
              style={{
                clipPath: `url(#${clipId})`,
                WebkitClipPath: `url(#${clipId})`,
                zIndex: 2,
              }}
            >
              {renderQrContent()}
            </div>
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden">
            {renderQrContent()}
          </div>
        )}
      </FrameRenderer>
    </div>
  )
}
