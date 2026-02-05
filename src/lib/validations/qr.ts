import { z } from 'zod'

// Walidacja koloru hex
const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')

// Walidacja gradientu
const gradientColorStopSchema = z.object({
  offset: z.number().min(0).max(1),
  color: hexColorSchema,
})

const gradientOptionsSchema = z
  .object({
    type: z.enum(['linear', 'radial']),
    rotation: z.number().min(0).max(360),
    colorStops: z.array(gradientColorStopSchema).min(2).max(5),
  })
  .nullable()

// Schema for decorative frame options
const frameOptionsSchema = z
  .object({
    style: z.enum(['none', 'simple', 'rounded', 'fancy', 'ticket', 'badge', 'minimal']),
    color: hexColorSchema,
    gradient: gradientOptionsSchema,
    textColor: hexColorSchema,
    text: z.string().max(30),
    showText: z.boolean(),
  })
  .nullable()

// Główny schemat stylu QR
export const qrStyleSchema = z.object({
  // Podstawowe kolory
  foregroundColor: hexColorSchema,
  backgroundColor: hexColorSchema,

  // Ustawienia generowania
  errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']),
  margin: z.number().min(0).max(10),
  width: z.number().min(100).max(1000),

  // Kształt całego kodu QR
  frameShape: z.enum(['square', 'circle', 'rounded', 'heart', 'hexagon', 'star', 'diamond']),

  // Styl modułów (dots)
  dotsType: z.enum(['square', 'rounded', 'dots', 'classy', 'classy-rounded', 'extra-rounded', 'diamond', 'star', 'vertical-line', 'horizontal-line', 'random-dot', 'small-square', 'tiny-square']),
  dotsGradient: gradientOptionsSchema,

  // Styl narożników
  cornersSquareType: z.enum(['square', 'dot', 'extra-rounded', 'classy', 'classy-rounded', 'dotted', 'rounded', 'outpoint', 'inpoint', 'diagonalRounded', 'threeRounded', 'mixedCorners']),
  cornersSquareColor: hexColorSchema.nullable(),
  cornersSquareGradient: gradientOptionsSchema,

  // Styl wewnętrznych kropek narożników
  cornersDotType: z.enum(['square', 'dot', 'heart', 'star', 'diamond', 'rounded', 'classy', 'outpoint', 'inpoint']),
  cornersDotColor: hexColorSchema.nullable(),
  cornersDotGradient: gradientOptionsSchema,

  // Gradient tła
  backgroundGradient: gradientOptionsSchema,

  // Ramka dekoracyjna
  frame: frameOptionsSchema,
})

// Logo URL can be a valid URL, empty string, or null
const logoUrlSchema = z.union([
  z.string().url(),
  z.string().length(0), // empty string
  z.null(),
]).optional().transform(val => val === '' ? null : val)

export const createQrSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  destinationUrl: z.string().url('Please enter a valid URL'),
  style: qrStyleSchema.partial().optional(),
  logoUrl: logoUrlSchema,
  logoSize: z.number().min(20).max(100).optional(),
})

export const updateQrSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long').optional(),
  destinationUrl: z.string().url('Please enter a valid URL').optional(),
  style: qrStyleSchema.partial().optional(),
  logoUrl: logoUrlSchema,
  logoSize: z.number().min(20).max(100).optional(),
  isActive: z.boolean().optional(),
})

export type CreateQrInput = z.infer<typeof createQrSchema>
export type UpdateQrInput = z.infer<typeof updateQrSchema>
