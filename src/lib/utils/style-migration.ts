import { QrStyle } from '@/types/database'
import { DEFAULT_QR_STYLE } from '@/types/qr'

/**
 * Stary format stylu QR (przed migracją)
 */
interface LegacyQrStyle {
  foregroundColor: string
  backgroundColor: string
  cornerRadius: number
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  margin: number
  width: number
}

/**
 * Sprawdza czy styl jest w nowym formacie (z frameShape)
 */
function isNewStyle(style: unknown): style is QrStyle {
  return typeof style === 'object' && style !== null && 'dotsType' in style && 'frameShape' in style
}

/**
 * Migruje stary format stylu QR do nowego z rozszerzonymi opcjami
 * Zachowuje kompatybilność wsteczną - istniejące kody QR będą działać
 */
export function migrateQrStyle(style: LegacyQrStyle | QrStyle | unknown): QrStyle {
  // Jeśli już w nowym formacie, zastosuj poprawki i zwróć
  if (isNewStyle(style)) {
    // Migrate any 'rounded' cornersDotType to 'dot' (not supported by qr-code-styling)
    // Use string comparison for backward compatibility with old database values
    const rawCornersDotType = style.cornersDotType as string
    const cornersDotType = rawCornersDotType === 'rounded' ? 'dot' : style.cornersDotType
    return {
      ...style,
      cornersDotType,
    }
  }

  // Jeśli styl jest pusty lub nieprawidłowy, zwróć domyślny
  if (!style || typeof style !== 'object') {
    return { ...DEFAULT_QR_STYLE }
  }

  const legacyStyle = style as LegacyQrStyle

  // Migruj stary format do nowego
  return {
    foregroundColor: legacyStyle.foregroundColor || DEFAULT_QR_STYLE.foregroundColor,
    backgroundColor: legacyStyle.backgroundColor || DEFAULT_QR_STYLE.backgroundColor,
    errorCorrectionLevel: legacyStyle.errorCorrectionLevel || DEFAULT_QR_STYLE.errorCorrectionLevel,
    margin: legacyStyle.margin ?? DEFAULT_QR_STYLE.margin,
    width: legacyStyle.width || DEFAULT_QR_STYLE.width,

    // Kształt ramki
    frameShape: DEFAULT_QR_STYLE.frameShape,

    // Nowe pola z domyślnymi wartościami
    dotsType: DEFAULT_QR_STYLE.dotsType,
    dotsGradient: null,
    cornersSquareType: DEFAULT_QR_STYLE.cornersSquareType,
    cornersSquareColor: null,
    cornersSquareGradient: null,
    cornersDotType: DEFAULT_QR_STYLE.cornersDotType,
    cornersDotColor: null,
    cornersDotGradient: null,
    backgroundGradient: null,
  }
}

/**
 * Łączy częściowy styl z domyślnymi wartościami
 */
export function mergeWithDefaults(partialStyle?: Partial<QrStyle>): QrStyle {
  if (!partialStyle) {
    return { ...DEFAULT_QR_STYLE }
  }

  return {
    ...DEFAULT_QR_STYLE,
    ...partialStyle,
  }
}
