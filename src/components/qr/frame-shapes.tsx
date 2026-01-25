'use client'

import { FrameShape } from '@/types/database'

/**
 * Definicje ścieżek SVG dla różnych kształtów ramki QR
 * Wszystkie ścieżki są zdefiniowane dla viewBox 0 0 100 100
 */
export const frameShapePaths: Record<FrameShape, string> = {
  square: 'M 0 0 L 100 0 L 100 100 L 0 100 Z',

  circle: 'M 50 0 A 50 50 0 1 1 50 100 A 50 50 0 1 1 50 0',

  rounded: 'M 15 0 L 85 0 Q 100 0 100 15 L 100 85 Q 100 100 85 100 L 15 100 Q 0 100 0 85 L 0 15 Q 0 0 15 0',

  heart: 'M 50 88 C 20 65 0 50 0 30 C 0 12 15 0 33 0 C 42 0 50 8 50 8 C 50 8 58 0 67 0 C 85 0 100 12 100 30 C 100 50 80 65 50 88 Z',

  hexagon: 'M 50 0 L 93.3 25 L 93.3 75 L 50 100 L 6.7 75 L 6.7 25 Z',

  star: 'M 50 0 L 61 35 L 98 35 L 68 57 L 79 91 L 50 70 L 21 91 L 32 57 L 2 35 L 39 35 Z',

  diamond: 'M 50 0 L 100 50 L 50 100 L 0 50 Z',
}

/**
 * Etykiety dla kształtów ramki
 */
export const frameShapeLabels: Record<FrameShape, string> = {
  square: 'Kwadrat',
  circle: 'Koło',
  rounded: 'Zaokrąglony',
  heart: 'Serce',
  hexagon: 'Sześciokąt',
  star: 'Gwiazda',
  diamond: 'Romb',
}

interface FrameShapeSelectorProps {
  value: FrameShape
  onChange: (value: FrameShape) => void
}

/**
 * Komponent do wyboru kształtu ramki QR
 */
export function FrameShapeSelector({ value, onChange }: FrameShapeSelectorProps) {
  const shapes: FrameShape[] = ['square', 'circle', 'rounded', 'heart', 'hexagon', 'star', 'diamond']

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">QR Code Shape</label>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {shapes.map((shape) => (
          <button
            key={shape}
            type="button"
            onClick={() => onChange(shape)}
            className={`flex flex-col items-center gap-1 rounded-lg border-2 p-2 transition-all ${
              value === shape
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <svg viewBox="0 0 100 100" className="h-8 w-8">
              <path d={frameShapePaths[shape]} fill="currentColor" />
            </svg>
            <span className="text-[10px] text-gray-600">{frameShapeLabels[shape]}</span>
          </button>
        ))}
      </div>
      {value !== 'square' && (
        <p className="text-xs text-amber-600">
          Tip: Non-square shapes may affect scannability. Use high error correction (H) for best results.
        </p>
      )}
    </div>
  )
}

/**
 * Komponent SVG z definicją clipPath dla danego kształtu
 * Używany w podglądzie i generatorze
 */
export function FrameShapeClipDef({ shape, id }: { shape: FrameShape; id: string }) {
  return (
    <defs>
      <clipPath id={id}>
        <path d={frameShapePaths[shape]} />
      </clipPath>
    </defs>
  )
}

/**
 * Wrapper komponent, który aplikuje maskę kształtu
 */
export function ShapedQrWrapper({
  shape,
  size,
  backgroundColor,
  children,
}: {
  shape: FrameShape
  size: number
  backgroundColor: string
  children: React.ReactNode
}) {
  const clipId = `qr-clip-${shape}-${Math.random().toString(36).substr(2, 9)}`

  if (shape === 'square') {
    return <div style={{ width: size, height: size }}>{children}</div>
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="absolute inset-0"
        style={{ zIndex: 0 }}
      >
        <FrameShapeClipDef shape={shape} id={clipId} />
        {/* Tło w kształcie */}
        <path d={frameShapePaths[shape]} fill={backgroundColor} />
      </svg>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: `url(#${clipId})`,
          WebkitClipPath: `url(#${clipId})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
