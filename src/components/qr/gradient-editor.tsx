'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { GradientOptions, GradientType, GradientColorStop } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface GradientEditorProps {
  value: GradientOptions | null
  onChange: (value: GradientOptions | null) => void
  label: string
  baseColor: string // kolor używany gdy gradient jest wyłączony
}

const DEFAULT_GRADIENT: GradientOptions = {
  type: 'linear',
  rotation: 0,
  colorStops: [
    { offset: 0, color: '#000000' },
    { offset: 1, color: '#333333' },
  ],
}

export function GradientEditor({ value, onChange, label, baseColor }: GradientEditorProps) {
  const [isEnabled, setIsEnabled] = useState(value !== null)

  const handleToggle = () => {
    if (isEnabled) {
      onChange(null)
      setIsEnabled(false)
    } else {
      onChange({
        ...DEFAULT_GRADIENT,
        colorStops: [
          { offset: 0, color: baseColor },
          { offset: 1, color: adjustBrightness(baseColor, -30) },
        ],
      })
      setIsEnabled(true)
    }
  }

  const handleTypeChange = (type: GradientType) => {
    if (!value) return
    onChange({ ...value, type })
  }

  const handleRotationChange = (rotation: number) => {
    if (!value) return
    onChange({ ...value, rotation })
  }

  const handleColorStopChange = (index: number, field: keyof GradientColorStop, newValue: string | number) => {
    if (!value) return
    const newColorStops = [...value.colorStops]
    newColorStops[index] = { ...newColorStops[index], [field]: newValue }
    onChange({ ...value, colorStops: newColorStops })
  }

  const addColorStop = () => {
    if (!value || value.colorStops.length >= 5) return
    const lastColor = value.colorStops[value.colorStops.length - 1]
    const newOffset = Math.min(lastColor.offset + 0.25, 1)
    onChange({
      ...value,
      colorStops: [...value.colorStops, { offset: newOffset, color: lastColor.color }],
    })
  }

  const removeColorStop = (index: number) => {
    if (!value || value.colorStops.length <= 2) return
    const newColorStops = value.colorStops.filter((_, i) => i !== index)
    onChange({ ...value, colorStops: newColorStops })
  }

  // Generuj CSS gradient dla podglądu
  const gradientPreview = value
    ? value.type === 'linear'
      ? `linear-gradient(${value.rotation}deg, ${value.colorStops.map((s) => `${s.color} ${s.offset * 100}%`).join(', ')})`
      : `radial-gradient(circle, ${value.colorStops.map((s) => `${s.color} ${s.offset * 100}%`).join(', ')})`
    : baseColor

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            isEnabled ? 'bg-gray-900' : 'bg-gray-200'
          )}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      </div>

      {isEnabled && value && (
        <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
          {/* Podgląd gradientu */}
          <div
            className="h-8 w-full rounded-md border border-gray-200"
            style={{ background: gradientPreview }}
          />

          {/* Typ gradientu */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange('linear')}
              className={cn(
                'flex-1 rounded-md px-3 py-1.5 text-sm transition-colors',
                value.type === 'linear'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 hover:bg-gray-100'
              )}
            >
              Liniowy
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('radial')}
              className={cn(
                'flex-1 rounded-md px-3 py-1.5 text-sm transition-colors',
                value.type === 'radial'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 hover:bg-gray-100'
              )}
            >
              Radialny
            </button>
          </div>

          {/* Rotacja (tylko dla liniowego) */}
          {value.type === 'linear' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Rotacja</span>
                <span className="text-xs text-gray-500">{value.rotation}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={value.rotation}
                onChange={(e) => handleRotationChange(Number(e.target.value))}
                className="w-full accent-gray-900"
              />
            </div>
          )}

          {/* Color stops */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Kolory</span>
              {value.colorStops.length < 5 && (
                <button
                  type="button"
                  onClick={addColorStop}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  + Dodaj kolor
                </button>
              )}
            </div>
            {value.colorStops.map((stop, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => handleColorStopChange(index, 'color', e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-gray-200"
                />
                <Input
                  type="text"
                  value={stop.color}
                  onChange={(e) => handleColorStopChange(index, 'color', e.target.value)}
                  className="h-8 flex-1 text-xs"
                  placeholder="#000000"
                />
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={Math.round(stop.offset * 100)}
                  onChange={(e) => handleColorStopChange(index, 'offset', Number(e.target.value) / 100)}
                  className="h-8 w-16 text-xs"
                />
                <span className="text-xs text-gray-400">%</span>
                {value.colorStops.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeColorStop(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Pomocnicza funkcja do rozjaśniania/przyciemniania koloru
 */
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max(Math.min((num >> 16) + amt, 255), 0)
  const G = Math.max(Math.min(((num >> 8) & 0x00ff) + amt, 255), 0)
  const B = Math.max(Math.min((num & 0x0000ff) + amt, 255), 0)
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}
