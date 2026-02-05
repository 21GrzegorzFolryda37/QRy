/** Badge frame: shared constants + deterministic pattern */

export const BADGE_OUTER_STROKE_RATIO = 0.025 // 2.5% of qrSize → thin outer ring
export const BADGE_INNER_CIRCLE_RATIO = 0.82 // inner white circle as fraction of outer radius

/** Deterministic ~60% fill for the decorative ring pattern */
export function isBadgeCellFilled(row: number, col: number): boolean {
  return ((row * 7 + col * 13 + row * col * 3) % 5) < 3
}

/** Cell size for the decorative grid filling the ring */
export function getBadgeCellSize(outerRadius: number): number {
  const ringWidth = outerRadius * (1 - BADGE_INNER_CIRCLE_RATIO)
  return Math.max(2, Math.round(ringWidth / 8))
}
