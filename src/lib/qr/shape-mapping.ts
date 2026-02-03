/**
 * Shape mapping for preview vs final generation
 *
 * Preview uses qr-code-styling (limited shapes)
 * Final generation uses @qr-platform/qr-code.js (full shapes)
 */

import { DotsType, CornersSquareType, CornersDotType } from '@/types/database'

// Types available in qr-code-styling (preview)
type PreviewDotsType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'
type PreviewCornersSquareType = 'dot' | 'square' | 'extra-rounded'
type PreviewCornersDotType = 'dot' | 'square'

/**
 * Map extended DotsType to qr-code-styling compatible type for preview
 */
export function mapDotsTypeForPreview(type: DotsType): PreviewDotsType {
  const mapping: Record<DotsType, PreviewDotsType> = {
    // Direct mappings (available in both)
    'square': 'square',
    'dots': 'dots',
    'rounded': 'rounded',
    'extra-rounded': 'extra-rounded',
    'classy': 'classy',
    'classy-rounded': 'classy-rounded',
    // Extended types -> closest preview equivalent
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
 * Map extended CornersSquareType to qr-code-styling compatible type for preview
 */
export function mapCornersSquareTypeForPreview(type: CornersSquareType): PreviewCornersSquareType {
  const mapping: Record<CornersSquareType, PreviewCornersSquareType> = {
    // Direct mappings
    'square': 'square',
    'dot': 'dot',
    'extra-rounded': 'extra-rounded',
    // Extended types -> closest preview equivalent
    'classy': 'square',
    'classy-rounded': 'extra-rounded',
    'dotted': 'dot',
    'rounded': 'extra-rounded',
    'outpoint': 'square',
    'inpoint': 'square',
  }
  return mapping[type] || 'square'
}

/**
 * Map extended CornersDotType to qr-code-styling compatible type for preview
 */
export function mapCornersDotTypeForPreview(type: CornersDotType): PreviewCornersDotType {
  const mapping: Record<CornersDotType, PreviewCornersDotType> = {
    // Direct mappings
    'square': 'square',
    'dot': 'dot',
    // Extended types -> closest preview equivalent
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

/**
 * Check if a shape requires server-side rendering
 * (not available in qr-code-styling)
 */
export function requiresServerRendering(style: {
  dotsType?: DotsType
  cornersSquareType?: CornersSquareType
  cornersDotType?: CornersDotType
}): boolean {
  const extendedDotsTypes: DotsType[] = ['diamond', 'star', 'vertical-line', 'horizontal-line', 'random-dot', 'small-square', 'tiny-square']
  const extendedCornersSquareTypes: CornersSquareType[] = ['outpoint', 'inpoint', 'rounded']
  const extendedCornersDotTypes: CornersDotType[] = ['heart', 'star', 'diamond', 'rounded', 'classy', 'outpoint', 'inpoint']

  if (style.dotsType && extendedDotsTypes.includes(style.dotsType)) return true
  if (style.cornersSquareType && extendedCornersSquareTypes.includes(style.cornersSquareType)) return true
  if (style.cornersDotType && extendedCornersDotTypes.includes(style.cornersDotType)) return true

  return false
}
