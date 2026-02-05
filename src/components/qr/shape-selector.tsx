'use client'

import { cn } from '@/lib/utils'
import { DotsType, CornersSquareType, CornersDotType } from '@/types/database'

interface ShapeOption<T extends string> {
  id: T
  label: string
  icon: React.ReactNode
}

interface ShapeSelectorProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: ShapeOption<T>[]
  label: string
}

export function ShapeSelector<T extends string>({
  value,
  onChange,
  options,
  label,
}: ShapeSelectorProps<T>) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all',
              value === option.id
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            <div className="h-12 w-12 flex items-center justify-center">{option.icon}</div>
            <span className="text-xs text-gray-600">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Ikony dla kształtów modułów (dots)
const DotsSquareIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <rect x="2" y="2" width="6" height="6" />
    <rect x="10" y="2" width="6" height="6" />
    <rect x="2" y="10" width="6" height="6" />
    <rect x="10" y="10" width="6" height="6" />
  </svg>
)

const DotsRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <rect x="2" y="2" width="6" height="6" rx="1" />
    <rect x="10" y="2" width="6" height="6" rx="1" />
    <rect x="2" y="10" width="6" height="6" rx="1" />
    <rect x="10" y="10" width="6" height="6" rx="1" />
  </svg>
)

const DotsCircleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <circle cx="5" cy="5" r="3" />
    <circle cx="13" cy="5" r="3" />
    <circle cx="5" cy="13" r="3" />
    <circle cx="13" cy="13" r="3" />
  </svg>
)

const DotsClassyIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <path d="M2 5 L8 5 L8 8 L2 8 Z" />
    <path d="M10 2 L16 2 L16 8 L13 8 L13 5 L10 5 Z" />
    <path d="M2 10 L5 10 L5 16 L2 16 Z" />
    <path d="M10 10 L16 10 L16 16 L10 16 Z" />
  </svg>
)

const DotsClassyRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <path d="M2 5 Q2 2 5 2 L8 2 L8 8 L2 8 Z" />
    <path d="M10 2 L16 2 L16 8 L13 8 L13 5 Q13 2 10 2 Z" />
    <path d="M2 10 L5 10 L5 16 Q2 16 2 13 Z" />
    <rect x="10" y="10" width="6" height="6" rx="1" />
  </svg>
)

const DotsExtraRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <rect x="2" y="2" width="6" height="6" rx="2" />
    <rect x="10" y="2" width="6" height="6" rx="2" />
    <rect x="2" y="10" width="6" height="6" rx="2" />
    <rect x="10" y="10" width="6" height="6" rx="2" />
  </svg>
)

// Nowe ikony dla rozszerzonych kształtów (@qr-platform)
const DotsDiamondIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <path d="M5 2 L8 5 L5 8 L2 5 Z" />
    <path d="M13 2 L16 5 L13 8 L10 5 Z" />
    <path d="M5 10 L8 13 L5 16 L2 13 Z" />
    <path d="M13 10 L16 13 L13 16 L10 13 Z" />
  </svg>
)

const DotsStarIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <path d="M5 1 L6 4 L9 4 L6.5 6 L7.5 9 L5 7 L2.5 9 L3.5 6 L1 4 L4 4 Z" />
    <path d="M13 1 L14 4 L17 4 L14.5 6 L15.5 9 L13 7 L10.5 9 L11.5 6 L9 4 L12 4 Z" />
    <path d="M5 10 L6 13 L9 13 L6.5 15 L7.5 18 L5 16 L2.5 18 L3.5 15 L1 13 L4 13 Z" />
    <path d="M13 10 L14 13 L17 13 L14.5 15 L15.5 18 L13 16 L10.5 18 L11.5 15 L9 13 L12 13 Z" />
  </svg>
)

const DotsVerticalLineIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <rect x="3" y="2" width="2" height="6" />
    <rect x="7" y="2" width="2" height="6" />
    <rect x="11" y="2" width="2" height="6" />
    <rect x="3" y="10" width="2" height="6" />
    <rect x="7" y="10" width="2" height="6" />
    <rect x="11" y="10" width="2" height="6" />
  </svg>
)

const DotsHorizontalLineIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <rect x="2" y="3" width="6" height="2" />
    <rect x="10" y="3" width="6" height="2" />
    <rect x="2" y="7" width="6" height="2" />
    <rect x="10" y="7" width="6" height="2" />
    <rect x="2" y="11" width="6" height="2" />
    <rect x="10" y="11" width="6" height="2" />
  </svg>
)

const DotsRandomIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <circle cx="4" cy="4" r="2.5" />
    <circle cx="12" cy="5" r="3" />
    <circle cx="5" cy="12" r="2" />
    <circle cx="13" cy="13" r="2.5" />
  </svg>
)

const DotsSmallSquareIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <rect x="3" y="3" width="4" height="4" />
    <rect x="10" y="3" width="4" height="4" />
    <rect x="3" y="10" width="4" height="4" />
    <rect x="10" y="10" width="4" height="4" />
  </svg>
)

const DotsTinySquareIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <rect x="4" y="4" width="3" height="3" />
    <rect x="10" y="4" width="3" height="3" />
    <rect x="4" y="10" width="3" height="3" />
    <rect x="10" y="10" width="3" height="3" />
  </svg>
)

// Opcje dla kształtów modułów (rozszerzone)
export const dotsTypeOptions: ShapeOption<DotsType>[] = [
  { id: 'square', label: '', icon: <DotsSquareIcon /> },
  { id: 'rounded', label: '', icon: <DotsRoundedIcon /> },
  { id: 'dots', label: '', icon: <DotsCircleIcon /> },
  { id: 'classy', label: '', icon: <DotsClassyIcon /> },
  { id: 'classy-rounded', label: '', icon: <DotsClassyRoundedIcon /> },
  { id: 'extra-rounded', label: '', icon: <DotsExtraRoundedIcon /> },
  { id: 'diamond', label: '', icon: <DotsDiamondIcon /> },
  { id: 'star', label: '', icon: <DotsStarIcon /> },
  { id: 'vertical-line', label: '', icon: <DotsVerticalLineIcon /> },
  { id: 'horizontal-line', label: '', icon: <DotsHorizontalLineIcon /> },
  { id: 'random-dot', label: '', icon: <DotsRandomIcon /> },
  { id: 'small-square', label: '', icon: <DotsSmallSquareIcon /> },
  { id: 'tiny-square', label: '', icon: <DotsTinySquareIcon /> },
]

// ============================================
// Ikony dla narożników zewnętrznych (corners square)
// Wzorowane na qr.io - pokazują pełny finder pattern (ramka + wypełnienie)
// ============================================

// 1. Kwadrat ostry — samo obramowanie
const CornerSquareIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <path d="M2 2 H22 V22 H2 Z M5 5 H19 V19 H5 Z" fillRule="evenodd" />
  </svg>
)

// 2. Kwadrat zaokrąglony — samo obramowanie
const CornerRoundedCircleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <path
      d="M7 2 H17 Q22 2 22 7 V17 Q22 22 17 22 H7 Q2 22 2 17 V7 Q2 2 7 2 Z
         M8 5 Q5 5 5 8 V16 Q5 19 8 19 H16 Q19 19 19 16 V8 Q19 5 16 5 Z"
      fillRule="evenodd"
    />
  </svg>
)

// 3. Koło — samo obramowanie
const CornerDotIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <path
      d="M12 1 A11 11 0 1 1 12 23 A11 11 0 1 1 12 1 Z M12 4 A8 8 0 1 0 12 20 A8 8 0 1 0 12 4 Z"
      fillRule="evenodd"
    />
  </svg>
)

// 4. Kształt "D" — samo obramowanie
const CornerClassyIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <path
      d="M2 2 L14 2 Q22 2 22 12 Q22 22 14 22 L2 22 Z
         M5 5 L5 19 L13 19 Q19 19 19 12 Q19 5 13 5 Z"
      fillRule="evenodd"
    />
  </svg>
)

// 5. Kwadrat zaokrąglony (classy-rounded) — samo obramowanie
const CornerExtraRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <path
      d="M6 2 H18 Q22 2 22 6 V18 Q22 22 18 22 H6 Q2 22 2 18 V6 Q2 2 6 2 Z
         M7 5 Q5 5 5 7 V17 Q5 19 7 19 H17 Q19 19 19 17 V7 Q19 5 17 5 Z"
      fillRule="evenodd"
    />
  </svg>
)

// 6. Kwadrat z okrągłą dziurą
const CornerSquareCircleHoleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <path
      d="M2 2 H22 V22 H2 Z M12 6 A6 6 0 1 0 12 18 A6 6 0 1 0 12 6 Z"
      fillRule="evenodd"
    />
  </svg>
)

// 7. Kwadrat z okrągłą dziurą + zaokrąglone rogi na przekątnej
const CornerDiagonalRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <path
      d="M5 2 H22 V19 A3 3 0 0 1 19 22 H2 V5 A3 3 0 0 1 5 2 Z M12 6 A6 6 0 1 0 12 18 A6 6 0 1 0 12 6 Z"
      fillRule="evenodd"
    />
  </svg>
)

// 8. Kwadrat z 3 zaokrąglonymi rogami i 1 ostrym (lewy-górny ostry)
const CornerThreeRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <path
      d="M2 2 H18 Q22 2 22 6 V18 Q22 22 18 22 H6 Q2 22 2 18 Z
         M5 5 V17 Q5 19 7 19 H17 Q19 19 19 17 V7 Q19 5 17 5 H5 Z"
      fillRule="evenodd"
    />
  </svg>
)

// 9. Kwadrat z 1 ostrym rogiem, 1 okrągłym (ćwiartka koła) i 2 zaokrąglonymi
const CornerMixedCornersIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <path
      d="M2 2 H18 Q22 2 22 6 V14 A8 8 0 0 1 14 22 H6 Q2 22 2 18 Z
         M5 5 V17 Q5 19 7 19 H13 A5 5 0 0 0 19 13 V7 Q19 5 17 5 H5 Z"
      fillRule="evenodd"
    />
  </svg>
)

// Opcje dla narożników zewnętrznych (wzorowane na qr.io)
export const cornersSquareTypeOptions: ShapeOption<CornersSquareType>[] = [
  { id: 'square', label: '', icon: <CornerSquareIcon /> },
  { id: 'extra-rounded', label: '', icon: <CornerRoundedCircleIcon /> },
  { id: 'dot', label: '', icon: <CornerDotIcon /> },
  { id: 'inpoint', label: '', icon: <CornerSquareCircleHoleIcon /> },
  { id: 'diagonalRounded', label: '', icon: <CornerDiagonalRoundedIcon /> },
  { id: 'threeRounded', label: '', icon: <CornerThreeRoundedIcon /> },
  { id: 'mixedCorners', label: '', icon: <CornerMixedCornersIcon /> },
]

// ============================================
// Ikony dla wewnętrznych kropek narożników (corners dot)
// ============================================

const InnerSquareIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <rect x="6" y="6" width="12" height="12" />
  </svg>
)

const InnerDotIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <circle cx="12" cy="12" r="6" />
  </svg>
)

const InnerStarIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const InnerDiamondIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <path d="M12 2 L22 12 L12 22 L2 12 Z" />
  </svg>
)

const InnerRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <rect x="6" y="6" width="12" height="12" rx="3" />
  </svg>
)

// Kształt "D" - lewa ostra, prawa zaokrąglona
const InnerClassyIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <path d="M6 6 L14 6 Q18 6 18 12 Q18 18 14 18 L6 18 L6 6 Z" />
  </svg>
)

const InnerOutpointIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <path d="M6 6 L18 12 L6 18 Z" />
  </svg>
)

const InnerInpointIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
    <path d="M18 6 L6 12 L18 18 Z" />
  </svg>
)

// Opcje dla wewnętrznych kropek narożników
export const cornersDotTypeOptions: ShapeOption<CornersDotType>[] = [
  { id: 'square', label: '', icon: <InnerSquareIcon /> },
  { id: 'dot', label: '', icon: <InnerDotIcon /> },
  { id: 'diamond', label: '', icon: <InnerDiamondIcon /> },
  { id: 'rounded', label: '', icon: <InnerRoundedIcon /> },
]
