import { QrStyle } from './database'

export interface QrCodeFormData {
  name: string
  destinationUrl: string
  style?: Partial<QrStyle>
  logoUrl?: string | null
  logoSize?: number
}

export interface QrGeneratorOptions {
  url: string
  style: QrStyle
  logoUrl?: string | null
  logoSize?: number
}

export const DEFAULT_QR_STYLE: QrStyle = {
  // Podstawowe kolory
  foregroundColor: '#000000',
  backgroundColor: '#FFFFFF',

  // Ustawienia generowania
  errorCorrectionLevel: 'M',
  margin: 4,
  width: 400,

  // Kształt całego kodu QR
  frameShape: 'square',

  // Styl modułów
  dotsType: 'square',
  dotsGradient: null,

  // Styl narożników
  cornersSquareType: 'square',
  cornersSquareColor: null,
  cornersSquareGradient: null,

  // Styl wewnętrznych kropek narożników
  cornersDotType: 'square',
  cornersDotColor: null,
  cornersDotGradient: null,

  // Gradient tła
  backgroundGradient: null,
}
