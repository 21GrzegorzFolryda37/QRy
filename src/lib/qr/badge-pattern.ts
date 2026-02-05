/** Badge frame: shared constants + random decorative QR pattern */

export const BADGE_OUTER_STROKE_RATIO = 0.02 // 2% stroke width
export const BADGE_MODULE_COUNT = 37 // typical QR module grid
export const BADGE_WHITE_PADDING_RATIO = 0.08 // 8% padding around QR

/** Simple seeded PRNG (deterministic, avoids hydration mismatch) */
function createSeededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

/** Cached decorative pattern — generated once, stable across renders */
let cachedPattern: boolean[][] | null = null

export function getDecorativePattern(): boolean[][] {
  if (cachedPattern) return cachedPattern

  const size = BADGE_MODULE_COUNT
  const random = createSeededRandom(42)
  const pattern: boolean[][] = []

  for (let y = 0; y < size; y++) {
    pattern[y] = []
    for (let x = 0; x < size; x++) {
      pattern[y][x] = random() > 0.5
    }
  }

  cachedPattern = pattern
  return pattern
}
