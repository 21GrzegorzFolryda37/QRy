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
            <div className="h-8 w-8 flex items-center justify-center">{option.icon}</div>
            <span className="text-xs text-gray-600">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Ikony dla kształtów modułów (dots)
const DotsSquareIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <rect x="2" y="2" width="6" height="6" />
    <rect x="10" y="2" width="6" height="6" />
    <rect x="2" y="10" width="6" height="6" />
    <rect x="10" y="10" width="6" height="6" />
  </svg>
)

const DotsRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <rect x="2" y="2" width="6" height="6" rx="1" />
    <rect x="10" y="2" width="6" height="6" rx="1" />
    <rect x="2" y="10" width="6" height="6" rx="1" />
    <rect x="10" y="10" width="6" height="6" rx="1" />
  </svg>
)

const DotsCircleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <circle cx="5" cy="5" r="3" />
    <circle cx="13" cy="5" r="3" />
    <circle cx="5" cy="13" r="3" />
    <circle cx="13" cy="13" r="3" />
  </svg>
)

const DotsClassyIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M2 5 L8 5 L8 8 L2 8 Z" />
    <path d="M10 2 L16 2 L16 8 L13 8 L13 5 L10 5 Z" />
    <path d="M2 10 L5 10 L5 16 L2 16 Z" />
    <path d="M10 10 L16 10 L16 16 L10 16 Z" />
  </svg>
)

const DotsClassyRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M2 5 Q2 2 5 2 L8 2 L8 8 L2 8 Z" />
    <path d="M10 2 L16 2 L16 8 L13 8 L13 5 Q13 2 10 2 Z" />
    <path d="M2 10 L5 10 L5 16 Q2 16 2 13 Z" />
    <rect x="10" y="10" width="6" height="6" rx="1" />
  </svg>
)

const DotsExtraRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <rect x="2" y="2" width="6" height="6" rx="2" />
    <rect x="10" y="2" width="6" height="6" rx="2" />
    <rect x="2" y="10" width="6" height="6" rx="2" />
    <rect x="10" y="10" width="6" height="6" rx="2" />
  </svg>
)

// Nowe ikony dla rozszerzonych kształtów (@qr-platform)
const DotsDiamondIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M5 2 L8 5 L5 8 L2 5 Z" />
    <path d="M13 2 L16 5 L13 8 L10 5 Z" />
    <path d="M5 10 L8 13 L5 16 L2 13 Z" />
    <path d="M13 10 L16 13 L13 16 L10 13 Z" />
  </svg>
)

const DotsStarIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M5 1 L6 4 L9 4 L6.5 6 L7.5 9 L5 7 L2.5 9 L3.5 6 L1 4 L4 4 Z" />
    <path d="M13 1 L14 4 L17 4 L14.5 6 L15.5 9 L13 7 L10.5 9 L11.5 6 L9 4 L12 4 Z" />
    <path d="M5 10 L6 13 L9 13 L6.5 15 L7.5 18 L5 16 L2.5 18 L3.5 15 L1 13 L4 13 Z" />
    <path d="M13 10 L14 13 L17 13 L14.5 15 L15.5 18 L13 16 L10.5 18 L11.5 15 L9 13 L12 13 Z" />
  </svg>
)

const DotsVerticalLineIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <rect x="3" y="2" width="2" height="6" />
    <rect x="7" y="2" width="2" height="6" />
    <rect x="11" y="2" width="2" height="6" />
    <rect x="3" y="10" width="2" height="6" />
    <rect x="7" y="10" width="2" height="6" />
    <rect x="11" y="10" width="2" height="6" />
  </svg>
)

const DotsHorizontalLineIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <rect x="2" y="3" width="6" height="2" />
    <rect x="10" y="3" width="6" height="2" />
    <rect x="2" y="7" width="6" height="2" />
    <rect x="10" y="7" width="6" height="2" />
    <rect x="2" y="11" width="6" height="2" />
    <rect x="10" y="11" width="6" height="2" />
  </svg>
)

const DotsRandomIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <circle cx="4" cy="4" r="2.5" />
    <circle cx="12" cy="5" r="3" />
    <circle cx="5" cy="12" r="2" />
    <circle cx="13" cy="13" r="2.5" />
  </svg>
)

const DotsSmallSquareIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <rect x="3" y="3" width="4" height="4" />
    <rect x="10" y="3" width="4" height="4" />
    <rect x="3" y="10" width="4" height="4" />
    <rect x="10" y="10" width="4" height="4" />
  </svg>
)

const DotsTinySquareIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <rect x="4" y="4" width="3" height="3" />
    <rect x="10" y="4" width="3" height="3" />
    <rect x="4" y="10" width="3" height="3" />
    <rect x="10" y="10" width="3" height="3" />
  </svg>
)

// Opcje dla kształtów modułów (rozszerzone)
export const dotsTypeOptions: ShapeOption<DotsType>[] = [
  { id: 'square', label: 'Kwadrat', icon: <DotsSquareIcon /> },
  { id: 'rounded', label: 'Zaokraglony', icon: <DotsRoundedIcon /> },
  { id: 'dots', label: 'Kropki', icon: <DotsCircleIcon /> },
  { id: 'classy', label: 'Classy', icon: <DotsClassyIcon /> },
  { id: 'classy-rounded', label: 'Classy Round', icon: <DotsClassyRoundedIcon /> },
  { id: 'extra-rounded', label: 'Extra Round', icon: <DotsExtraRoundedIcon /> },
  // Rozszerzone kształty (@qr-platform)
  { id: 'diamond', label: 'Diament', icon: <DotsDiamondIcon /> },
  { id: 'star', label: 'Gwiazda', icon: <DotsStarIcon /> },
  { id: 'vertical-line', label: 'Pionowe', icon: <DotsVerticalLineIcon /> },
  { id: 'horizontal-line', label: 'Poziome', icon: <DotsHorizontalLineIcon /> },
  { id: 'random-dot', label: 'Losowe', icon: <DotsRandomIcon /> },
  { id: 'small-square', label: 'Male kwadr.', icon: <DotsSmallSquareIcon /> },
  { id: 'tiny-square', label: 'Mini kwadr.', icon: <DotsTinySquareIcon /> },
]

// Ikony dla narożników zewnętrznych (corners square)
const CornerSquareIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <rect x="2" y="2" width="20" height="20" strokeWidth="4" stroke="currentColor" fill="none" />
    <rect x="7" y="7" width="10" height="10" />
  </svg>
)

const CornerDotIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth="3" stroke="currentColor" fill="none" />
    <circle cx="12" cy="12" r="4" />
  </svg>
)

const CornerExtraRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <rect x="2" y="2" width="20" height="20" rx="6" strokeWidth="4" stroke="currentColor" fill="none" />
    <rect x="7" y="7" width="10" height="10" rx="3" />
  </svg>
)

const CornerClassyIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M2 2 L22 2 L22 22 L18 22 L18 6 L2 6 Z" strokeWidth="0" />
    <rect x="7" y="7" width="10" height="10" />
  </svg>
)

const CornerClassyRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M2 6 Q2 2 6 2 L22 2 L22 22 L18 22 Q18 10 10 6 L2 6 Z" strokeWidth="0" />
    <rect x="7" y="7" width="10" height="10" rx="2" />
  </svg>
)

const CornerDottedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <circle cx="4" cy="4" r="2" />
    <circle cx="12" cy="4" r="2" />
    <circle cx="20" cy="4" r="2" />
    <circle cx="4" cy="12" r="2" />
    <circle cx="4" cy="20" r="2" />
    <circle cx="20" cy="12" r="2" />
    <circle cx="12" cy="20" r="2" />
    <circle cx="20" cy="20" r="2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

// Ikony dla rozszerzonych narożników zewnętrznych
const CornerOutpointIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M2 2 L22 2 L22 22 L2 22 L2 2 M6 6 L6 18 L18 18 L18 6 Z" fillRule="evenodd" />
    <path d="M8 8 L16 12 L8 16 Z" />
  </svg>
)

const CornerInpointIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M2 2 L22 2 L22 22 L2 22 L2 2 M6 6 L6 18 L18 18 L18 6 Z" fillRule="evenodd" />
    <path d="M16 8 L8 12 L16 16 Z" />
  </svg>
)

const CornerRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <rect x="2" y="2" width="20" height="20" rx="4" strokeWidth="4" stroke="currentColor" fill="none" />
    <rect x="7" y="7" width="10" height="10" rx="2" />
  </svg>
)

// Opcje dla narożników zewnętrznych (rozszerzone)
export const cornersSquareTypeOptions: ShapeOption<CornersSquareType>[] = [
  { id: 'square', label: 'Kwadrat', icon: <CornerSquareIcon /> },
  { id: 'dot', label: 'Okragly', icon: <CornerDotIcon /> },
  { id: 'extra-rounded', label: 'Extra Round', icon: <CornerExtraRoundedIcon /> },
  { id: 'classy', label: 'Classy', icon: <CornerClassyIcon /> },
  { id: 'classy-rounded', label: 'Classy Round', icon: <CornerClassyRoundedIcon /> },
  // Rozszerzone (@qr-platform)
  { id: 'rounded', label: 'Zaokraglony', icon: <CornerRoundedIcon /> },
  { id: 'inpoint', label: 'Wewnetrzny', icon: <CornerInpointIcon /> },
]

// Ikony dla wewnętrznych kropek narożników
const InnerSquareIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <rect x="6" y="6" width="12" height="12" />
  </svg>
)

const InnerDotIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <circle cx="12" cy="12" r="6" />
  </svg>
)

const InnerHeartIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
)

const InnerStarIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const InnerDiamondIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M12 2 L22 12 L12 22 L2 12 Z" />
  </svg>
)

// Ikony dla rozszerzonych wewnętrznych kropek narożników
const InnerRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <rect x="6" y="6" width="12" height="12" rx="3" />
  </svg>
)

const InnerClassyIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M6 6 L18 6 L18 18 L12 18 L12 12 L6 12 Z" />
  </svg>
)

const InnerOutpointIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M6 12 L18 6 L18 18 Z" />
  </svg>
)

const InnerInpointIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M18 12 L6 6 L6 18 Z" />
  </svg>
)

// Opcje dla wewnętrznych kropek narożników (rozszerzone)
export const cornersDotTypeOptions: ShapeOption<CornersDotType>[] = [
  { id: 'square', label: 'Kwadrat', icon: <InnerSquareIcon /> },
  { id: 'dot', label: 'Kropka', icon: <InnerDotIcon /> },
  { id: 'star', label: 'Gwiazda', icon: <InnerStarIcon /> },
  { id: 'diamond', label: 'Diament', icon: <InnerDiamondIcon /> },
  // Rozszerzone (@qr-platform)
  { id: 'rounded', label: 'Zaokraglony', icon: <InnerRoundedIcon /> },
  { id: 'classy', label: 'Classy', icon: <InnerClassyIcon /> },
  { id: 'outpoint', label: 'Zewnetrzny', icon: <InnerOutpointIcon /> },
  { id: 'inpoint', label: 'Wewnetrzny', icon: <InnerInpointIcon /> },
]
