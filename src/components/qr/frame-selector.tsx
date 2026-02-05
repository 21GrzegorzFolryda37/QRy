'use client'

import { cn } from '@/lib/utils'
import { FrameStyle, FrameOptions, GradientOptions } from '@/types/database'
import { Input } from '@/components/ui'
import { GradientEditor } from './gradient-editor'

interface FrameStyleOption {
  id: FrameStyle
  label: string
  preview: (color: string) => React.ReactNode
}

const frameStyleOptions: FrameStyleOption[] = [
  {
    id: 'none',
    label: 'Brak',
    preview: () => (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect x="10" y="10" width="40" height="40" fill="#e5e7eb" rx="2" />
        <line x1="10" y1="10" x2="50" y2="50" stroke="#9ca3af" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'simple',
    label: 'Prosta',
    preview: (color) => (
      <svg viewBox="0 0 60 70" className="w-full h-full">
        <rect x="2" y="2" width="56" height="66" fill={color} rx="4" />
        <rect x="6" y="6" width="48" height="48" fill="white" rx="2" />
        <rect x="10" y="10" width="40" height="40" fill="#e5e7eb" rx="2" />
        <text x="30" y="62" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">SCAN ME</text>
      </svg>
    ),
  },
  {
    id: 'rounded',
    label: 'Zaokraglona',
    preview: (color) => (
      <svg viewBox="0 0 60 70" className="w-full h-full">
        <rect x="2" y="2" width="56" height="66" fill={color} rx="12" />
        <rect x="6" y="6" width="48" height="48" fill="white" rx="8" />
        <rect x="10" y="10" width="40" height="40" fill="#e5e7eb" rx="4" />
        <text x="30" y="62" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">SCAN ME</text>
      </svg>
    ),
  },
  {
    id: 'fancy',
    label: 'Elegancka',
    preview: (color) => (
      <svg viewBox="0 0 60 70" className="w-full h-full">
        <rect x="2" y="2" width="56" height="66" fill={color} rx="4" />
        <rect x="4" y="4" width="52" height="62" fill="none" stroke="white" strokeWidth="1" rx="3" strokeDasharray="2,2" />
        <rect x="8" y="8" width="44" height="44" fill="white" rx="2" />
        <rect x="12" y="12" width="36" height="36" fill="#e5e7eb" rx="2" />
        <text x="30" y="62" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">SCAN ME</text>
      </svg>
    ),
  },
  {
    id: 'ticket',
    label: 'Bilet',
    preview: (color) => (
      <svg viewBox="0 0 60 70" className="w-full h-full">
        <path d={`M2 8 Q2 2 8 2 L52 2 Q58 2 58 8 L58 28 Q52 28 52 34 Q52 40 58 40 L58 62 Q58 68 52 68 L8 68 Q2 68 2 62 L2 40 Q8 40 8 34 Q8 28 2 28 Z`} fill={color} />
        <rect x="8" y="8" width="44" height="44" fill="white" rx="2" />
        <rect x="12" y="12" width="36" height="36" fill="#e5e7eb" rx="2" />
        <text x="30" y="62" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">SCAN ME</text>
      </svg>
    ),
  },
  {
    id: 'badge',
    label: 'Odznaka',
    preview: (color) => (
      <svg viewBox="0 0 60 72" className="w-full h-full">
        {/* Thin outer stroke */}
        <circle cx="30" cy="30" r="28" fill="none" stroke={color} strokeWidth="1.5" />
        {/* QR pattern fill hint */}
        <circle cx="30" cy="30" r="26.5" fill={color} opacity="0.25" />
        {/* White circle for QR area */}
        <circle cx="30" cy="30" r="21" fill="white" />
        <rect x="14" y="14" width="32" height="32" fill="#e5e7eb" rx="2" />
        {/* Ribbon */}
        <rect x="20" y="56" width="20" height="14" fill={color} />
        <polygon points="20,56 30,64 40,56" fill={color} />
        <text x="30" y="68" textAnchor="middle" fill="white" fontSize="4" fontWeight="bold">SCAN</text>
      </svg>
    ),
  },
  {
    id: 'minimal',
    label: 'Minimalna',
    preview: (color) => (
      <svg viewBox="0 0 60 70" className="w-full h-full">
        <rect x="10" y="10" width="40" height="40" fill="#e5e7eb" rx="2" />
        {/* Corner decorations */}
        <path d="M8 8 L8 16 M8 8 L16 8" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M52 8 L52 16 M52 8 L44 8" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M8 52 L8 44 M8 52 L16 52" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M52 52 L52 44 M52 52 L44 52" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        <text x="30" y="64" textAnchor="middle" fill={color} fontSize="6" fontWeight="bold">SCAN ME</text>
      </svg>
    ),
  },
]

interface FrameSelectorProps {
  value: FrameOptions | null
  onChange: (value: FrameOptions | null) => void
}

export function FrameSelector({ value, onChange }: FrameSelectorProps) {
  const currentStyle = value?.style || 'none'
  const currentColor = value?.color || '#000000'
  const currentGradient = value?.gradient || null
  const currentTextColor = value?.textColor || '#ffffff'
  const currentText = value?.text || 'Zeskanuj mnie'
  const showText = value?.showText ?? true

  const handleStyleChange = (style: FrameStyle) => {
    if (style === 'none') {
      onChange(null)
    } else {
      onChange({
        style,
        color: currentColor,
        gradient: currentGradient,
        textColor: currentTextColor,
        text: currentText,
        showText,
      })
    }
  }

  const handleColorChange = (color: string) => {
    if (currentStyle !== 'none') {
      onChange({
        style: currentStyle,
        color,
        gradient: currentGradient,
        textColor: currentTextColor,
        text: currentText,
        showText,
      })
    }
  }

  const handleGradientChange = (gradient: GradientOptions | null) => {
    if (currentStyle !== 'none') {
      onChange({
        style: currentStyle,
        color: currentColor,
        gradient,
        textColor: currentTextColor,
        text: currentText,
        showText,
      })
    }
  }

  const handleTextColorChange = (textColor: string) => {
    if (currentStyle !== 'none') {
      onChange({
        style: currentStyle,
        color: currentColor,
        gradient: currentGradient,
        textColor,
        text: currentText,
        showText,
      })
    }
  }

  const handleTextChange = (text: string) => {
    if (currentStyle !== 'none') {
      onChange({
        style: currentStyle,
        color: currentColor,
        gradient: currentGradient,
        textColor: currentTextColor,
        text,
        showText,
      })
    }
  }

  const handleShowTextChange = (showText: boolean) => {
    if (currentStyle !== 'none') {
      onChange({
        style: currentStyle,
        color: currentColor,
        gradient: currentGradient,
        textColor: currentTextColor,
        text: currentText,
        showText,
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Styl ramki</label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {frameStyleOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleStyleChange(option.id)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg border-2 p-2 transition-all',
                currentStyle === option.id
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <div className="h-14 w-12">
                {option.preview(currentColor)}
              </div>
              <span className="text-[10px] text-gray-600">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {currentStyle !== 'none' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kolor ramki
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
              />
              <Input
                value={currentColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <GradientEditor
            label="Gradient ramki"
            value={currentGradient}
            onChange={handleGradientChange}
            baseColor={currentColor}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kolor tekstu
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentTextColor}
                onChange={(e) => handleTextColorChange(e.target.value)}
                className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
              />
              <Input
                value={currentTextColor}
                onChange={(e) => handleTextColorChange(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showText}
                onChange={(e) => handleShowTextChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              Pokaz tekst
            </label>
          </div>

          {showText && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tekst na ramce
              </label>
              <Input
                value={currentText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Zeskanuj mnie"
                maxLength={30}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Export frame render function for preview
export { frameStyleOptions }
