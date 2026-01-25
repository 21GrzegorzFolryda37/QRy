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
      <div className="grid grid-cols-3 gap-2">
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

// Opcje dla kształtów modułów
export const dotsTypeOptions: ShapeOption<DotsType>[] = [
  { id: 'square', label: 'Kwadrat', icon: <DotsSquareIcon /> },
  { id: 'rounded', label: 'Zaokrąglony', icon: <DotsRoundedIcon /> },
  { id: 'dots', label: 'Kropki', icon: <DotsCircleIcon /> },
  { id: 'classy', label: 'Classy', icon: <DotsClassyIcon /> },
  { id: 'classy-rounded', label: 'Classy Round', icon: <DotsClassyRoundedIcon /> },
  { id: 'extra-rounded', label: 'Extra Round', icon: <DotsExtraRoundedIcon /> },
]

// Ikony dla narożników
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

const CornerRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <rect x="2" y="2" width="20" height="20" rx="4" strokeWidth="4" stroke="currentColor" fill="none" />
    <rect x="7" y="7" width="10" height="10" rx="2" />
  </svg>
)

const CornerExtraRoundedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <rect x="2" y="2" width="20" height="20" rx="6" strokeWidth="4" stroke="currentColor" fill="none" />
    <rect x="7" y="7" width="10" height="10" rx="3" />
  </svg>
)

// Opcje dla narożników kwadratowych
export const cornersSquareTypeOptions: ShapeOption<CornersSquareType>[] = [
  { id: 'square', label: 'Kwadrat', icon: <CornerSquareIcon /> },
  { id: 'dot', label: 'Okrągły', icon: <CornerDotIcon /> },
  { id: 'rounded', label: 'Zaokrąglony', icon: <CornerRoundedIcon /> },
  { id: 'extra-rounded', label: 'Extra Round', icon: <CornerExtraRoundedIcon /> },
]

// Opcje dla wewnętrznych kropek narożników
// qr-code-styling obsługuje tylko 'square' i 'dot' dla cornersDotOptions
export const cornersDotTypeOptions: ShapeOption<CornersDotType>[] = [
  { id: 'square', label: 'Kwadrat', icon: <DotsSquareIcon /> },
  { id: 'dot', label: 'Kropka', icon: <DotsCircleIcon /> },
]
