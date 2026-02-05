/**
 * Shape mapping for qr-code-styling library
 *
 * qr-code-styling supports only a subset of shapes (6 dots, 3 corner squares, 2 corner dots)
 * Extended shapes are rendered using the custom canvas renderer (custom-renderer.ts)
 *
 * This file provides fallback mappings for qr-code-styling when it's used
 * (e.g., for native shapes that don't need custom rendering)
 */

import { DotsType, CornersSquareType, CornersDotType } from '@/types/database'

// Types available in qr-code-styling
type PreviewDotsType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'
type PreviewCornersSquareType = 'dot' | 'square' | 'extra-rounded'
type PreviewCornersDotType = 'dot' | 'square'

/**
 * Map extended DotsType to qr-code-styling compatible type
 * Used when rendering with qr-code-styling for native shapes
 */
export function mapDotsTypeForPreview(type: DotsType): PreviewDotsType {
  const mapping: Record<DotsType, PreviewDotsType> = {
    // Direct mappings (available in qr-code-styling)
    'square': 'square',
    'dots': 'dots',
    'rounded': 'rounded',
    'extra-rounded': 'extra-rounded',
    'classy': 'classy',
    'classy-rounded': 'classy-rounded',
    // Extended types -> fallback for qr-code-styling
    // (custom renderer handles these natively)
    'diamond': 'square',
    'star': 'dots',
    'vertical-line': 'square',
    'horizontal-line': 'square',
    'random-dot': 'dots',
    'small-square': 'square',
    'tiny-square': 'square',
  }
  return mapping[type] || 'square'
}

/**
 * Map extended CornersSquareType to qr-code-styling compatible type
 * Used when rendering with qr-code-styling for native shapes
 */
export function mapCornersSquareTypeForPreview(type: CornersSquareType): PreviewCornersSquareType {
  const mapping: Record<CornersSquareType, PreviewCornersSquareType> = {
    // Direct mappings (available in qr-code-styling)
    'square': 'square',
    'dot': 'dot',
    'extra-rounded': 'extra-rounded',
    // Extended types -> fallback for qr-code-styling
    // (custom renderer handles these natively)
    'classy': 'square',
    'classy-rounded': 'extra-rounded',
    'dotted': 'dot',
    'rounded': 'extra-rounded',
    'outpoint': 'square',
    'inpoint': 'square',
    'diagonalRounded': 'square',
    'threeRounded': 'square',
  }
  return mapping[type] || 'square'
}

/**
 * Map extended CornersDotType to qr-code-styling compatible type
 * Used when rendering with qr-code-styling for native shapes
 */
export function mapCornersDotTypeForPreview(type: CornersDotType): PreviewCornersDotType {
  const mapping: Record<CornersDotType, PreviewCornersDotType> = {
    // Direct mappings (available in qr-code-styling)
    'square': 'square',
    'dot': 'dot',
    // Extended types -> fallback for qr-code-styling
    // (custom renderer handles these natively)
    'heart': 'dot',
    'star': 'dot',
    'diamond': 'square',
    'rounded': 'dot',
    'classy': 'square',
    'outpoint': 'square',
    'inpoint': 'square',
  }
  return mapping[type] || 'square'
}

// Extended shapes that require custom canvas renderer
const EXTENDED_DOT_TYPES: DotsType[] = [
  'diamond', 'star', 'vertical-line', 'horizontal-line', 'random-dot', 'small-square', 'tiny-square'
]

const EXTENDED_CORNER_SQUARE_TYPES: CornersSquareType[] = [
  'classy', 'classy-rounded', 'dotted', 'rounded', 'outpoint', 'inpoint', 'diagonalRounded', 'threeRounded'
]

const EXTENDED_CORNER_DOT_TYPES: CornersDotType[] = [
  'heart', 'star', 'diamond', 'rounded', 'classy', 'outpoint', 'inpoint'
]

/**
 * Check if a style uses extended shapes that need the custom renderer
 * @deprecated Use requiresCustomRenderer from custom-shapes.ts instead
 */
export function requiresServerRendering(style: {
  dotsType?: DotsType
  cornersSquareType?: CornersSquareType
  cornersDotType?: CornersDotType
}): boolean {
  if (style.dotsType && EXTENDED_DOT_TYPES.includes(style.dotsType)) return true
  if (style.cornersSquareType && EXTENDED_CORNER_SQUARE_TYPES.includes(style.cornersSquareType)) return true
  if (style.cornersDotType && EXTENDED_CORNER_DOT_TYPES.includes(style.cornersDotType)) return true

  return false
}

/**
 * Check if a shape type is natively supported by qr-code-styling
 */
export function isNativeDotsType(type: DotsType): type is PreviewDotsType {
  return !EXTENDED_DOT_TYPES.includes(type)
}

export function isNativeCornersSquareType(type: CornersSquareType): type is PreviewCornersSquareType {
  return !EXTENDED_CORNER_SQUARE_TYPES.includes(type)
}

export function isNativeCornersDotType(type: CornersDotType): type is PreviewCornersDotType {
  return !EXTENDED_CORNER_DOT_TYPES.includes(type)
}
