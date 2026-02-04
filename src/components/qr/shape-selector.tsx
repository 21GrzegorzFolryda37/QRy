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

// Ikony dla narożników zewnętrznych (corners square) - styl qr.io
const CornerSquareIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6">
    <rect x="3" y="3" width="18" height="18" rx="0" stroke="currentColor" strokeWidth="3" fill="none" />
    <rect x="8" y="8" width="8" height="8" rx="0" fill="currentColor" />
  </svg>
)

const CornerDotIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" fill="none" />
    <circle cx="12" cy="12" r="4" fill="currentColor" />
  </svg>
)

const CornerExtraRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6">
    <rect x="3" y="3" width="18" height="18" rx="9" stroke="currentColor" strokeWidth="3" fill="none" />
    <circle cx="12" cy="12" r="4" fill="currentColor" />
  </svg>
)

const CornerClassyIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6">
    <path d="M3 3 L21 3 L21 12 Q21 21 12 21 L3 21 Z" stroke="currentColor" strokeWidth="3" fill="none" />
    <path d="M8 8 L16 8 L16 12 Q16 16 12 16 L8 16 Z" fill="currentColor" />
  </svg>
)

const CornerClassyRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6">
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="3" fill="none" />
    <rect x="8" y="8" width="8" height="8" rx="2" fill="currentColor" />
  </svg>
)

const CornerRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6">
    <rect x="3" y="3" width="18" height="18" rx="0" stroke="currentColor" strokeWidth="3" fill="none" />
    <circle cx="12" cy="12" r="4" fill="currentColor" />
  </svg>
)

const CornerInpointIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" fill="none" />
    <rect x="8" y="8" width="8" height="8" rx="2" fill="currentColor" />
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

// Ikony dla wewnętrznych kropek narożników - styl qr.io
const InnerSquareIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6">
    <rect x="4" y="4" width="16" height="16" rx="0" fill="currentColor" />
  </svg>
)

const InnerDotIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6">
    <circle cx="12" cy="12" r="8" fill="currentColor" />
  </svg>
)

const InnerStarIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6">
    <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" fill="currentColor" />
  </svg>
)

const InnerDiamondIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6">
    <path d="M12 2 L22 12 L12 22 L2 12 Z" fill="currentColor" />
  </svg>
)

const InnerRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6">
    <rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" />
  </svg>
)

const InnerClassyIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6">
    <path d="M4 4 L20 4 L20 12 Q20 20 12 20 L4 20 Z" fill="currentColor" />
  </svg>
)

const InnerOutpointIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6">
    <path d="M4 4 L20 12 L4 20 Z" fill="currentColor" />
  </svg>
)

const InnerInpointIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6">
    <path d="M20 4 L4 12 L20 20 Z" fill="currentColor" />
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
