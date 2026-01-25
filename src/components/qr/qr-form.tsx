'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type QRCodeStylingType from 'qr-code-styling'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { QrCode, QrStyle, DotsType, CornersSquareType, CornersDotType } from '@/types/database'
import { DEFAULT_QR_STYLE } from '@/types/qr'
import { createQrCode, updateQrCode, reserveShortCode } from '@/actions/qr'
import { migrateQrStyle } from '@/lib/utils/style-migration'
import { getRedirectUrl } from '@/lib/utils'
import { generateQrDataUrl } from '@/lib/qr/options'
import { QrPreview } from './qr-preview'
import { ShapeSelector, dotsTypeOptions, cornersSquareTypeOptions, cornersDotTypeOptions } from './shape-selector'
import { GradientEditor } from './gradient-editor'
import { FrameShapeSelector } from './frame-shapes'
import { LogoUploader } from './logo-uploader'

interface QrFormProps {
  qrCode?: QrCode
}

// Sekcja rozwijana
function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Card>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full"
      >
        <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
          <CardTitle>{title}</CardTitle>
          <svg
            className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </CardHeader>
      </button>
      {isOpen && <CardContent className="space-y-4">{children}</CardContent>}
    </Card>
  )
}


export function QrForm({ qrCode }: QrFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [QRCodeStyling, setQRCodeStyling] = useState<typeof QRCodeStylingType | null>(null)

  const [name, setName] = useState(qrCode?.name || '')
  const [destinationUrl, setDestinationUrl] = useState(qrCode?.destination_url || '')
  const [logoUrl, setLogoUrl] = useState(qrCode?.logo_url || '')
  const [logoSize, setLogoSize] = useState(qrCode?.logo_size || 60)

  // Migruj stary styl do nowego formatu
  const initialStyle = qrCode?.style ? migrateQrStyle(qrCode.style) : DEFAULT_QR_STYLE
  const [style, setStyle] = useState<QrStyle>(initialStyle)

  const isEditing = !!qrCode

  // Load qr-code-styling library
  useEffect(() => {
    import('qr-code-styling').then((module) => {
      setQRCodeStyling(() => module.default)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!QRCodeStyling) {
      setError('QR code library not loaded yet. Please wait.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      let shortCode: string
      let redirectUrl: string

      if (isEditing) {
        // Use existing short code for updates
        shortCode = qrCode.short_code
        redirectUrl = getRedirectUrl(shortCode)
      } else {
        // Reserve a new short code for new QR codes
        const reserveResult = await reserveShortCode()
        if (reserveResult.error || !reserveResult.shortCode || !reserveResult.redirectUrl) {
          setError(reserveResult.error || 'Failed to reserve short code')
          setIsLoading(false)
          return
        }
        shortCode = reserveResult.shortCode
        redirectUrl = reserveResult.redirectUrl
      }

      // Generate QR code image client-side with the redirect URL
      // Uses the same shared function as preview for consistency
      const qrImageDataUrl = await generateQrDataUrl(QRCodeStyling, {
        url: redirectUrl,
        style,
        size: style.width,
        logoUrl: logoUrl || undefined,
        logoSize,
      })

      if (!qrImageDataUrl) {
        setError('Failed to generate QR code image')
        setIsLoading(false)
        return
      }

      // Build form data
      const formData = new FormData()
      formData.set('name', name)
      formData.set('destinationUrl', destinationUrl)
      formData.set('style', JSON.stringify(style))
      formData.set('logoUrl', logoUrl)
      formData.set('qrImageDataUrl', qrImageDataUrl)

      if (logoUrl) {
        formData.set('logoSize', logoSize.toString())
      }

      if (!isEditing) {
        formData.set('shortCode', shortCode)
      }

      const result = isEditing
        ? await updateQrCode(qrCode.id, formData)
        : await createQrCode(formData)

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      router.push('/qr-codes')
      router.refresh()
    } catch (err) {
      console.error('Error:', err)
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Podstawowe informacje */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My QR Code"
              required
            />
            <Input
              label="Destination URL"
              type="url"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </CardContent>
        </Card>

        {/* Kształt kodu QR */}
        <CollapsibleSection title="QR Shape" defaultOpen={true}>
          <FrameShapeSelector
            value={style.frameShape}
            onChange={(value) => setStyle({ ...style, frameShape: value })}
          />
        </CollapsibleSection>

        {/* Styl modułów */}
        <CollapsibleSection title="Module Style" defaultOpen={false}>
          <ShapeSelector<DotsType>
            value={style.dotsType}
            onChange={(value) => setStyle({ ...style, dotsType: value })}
            options={dotsTypeOptions}
            label="Module Shape"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Module Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.foregroundColor}
                  onChange={(e) => setStyle({ ...style, foregroundColor: e.target.value })}
                  className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={style.foregroundColor}
                  onChange={(e) => setStyle({ ...style, foregroundColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.backgroundColor}
                  onChange={(e) => setStyle({ ...style, backgroundColor: e.target.value })}
                  className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={style.backgroundColor}
                  onChange={(e) => setStyle({ ...style, backgroundColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <GradientEditor
            label="Module Gradient"
            value={style.dotsGradient}
            onChange={(value) => setStyle({ ...style, dotsGradient: value })}
            baseColor={style.foregroundColor}
          />

          <GradientEditor
            label="Background Gradient"
            value={style.backgroundGradient}
            onChange={(value) => setStyle({ ...style, backgroundGradient: value })}
            baseColor={style.backgroundColor}
          />
        </CollapsibleSection>

        {/* Styl narożników */}
        <CollapsibleSection title="Corner Style">
          <ShapeSelector<CornersSquareType>
            value={style.cornersSquareType}
            onChange={(value) => setStyle({ ...style, cornersSquareType: value })}
            options={cornersSquareTypeOptions}
            label="Corner Square Shape"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Corner Square Color (optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={style.cornersSquareColor !== null}
                onChange={(e) =>
                  setStyle({
                    ...style,
                    cornersSquareColor: e.target.checked ? style.foregroundColor : null,
                  })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              {style.cornersSquareColor !== null && (
                <>
                  <input
                    type="color"
                    value={style.cornersSquareColor}
                    onChange={(e) => setStyle({ ...style, cornersSquareColor: e.target.value })}
                    className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                  />
                  <Input
                    value={style.cornersSquareColor}
                    onChange={(e) => setStyle({ ...style, cornersSquareColor: e.target.value })}
                    className="flex-1"
                  />
                </>
              )}
              {style.cornersSquareColor === null && (
                <span className="text-sm text-gray-500">Uses module color</span>
              )}
            </div>
          </div>

          <GradientEditor
            label="Corner Square Gradient"
            value={style.cornersSquareGradient}
            onChange={(value) => setStyle({ ...style, cornersSquareGradient: value })}
            baseColor={style.cornersSquareColor || style.foregroundColor}
          />

          <div className="border-t border-gray-200 pt-4">
            <ShapeSelector<CornersDotType>
              value={style.cornersDotType}
              onChange={(value) => setStyle({ ...style, cornersDotType: value })}
              options={cornersDotTypeOptions}
              label="Corner Dot Shape"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Corner Dot Color (optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={style.cornersDotColor !== null}
                onChange={(e) =>
                  setStyle({
                    ...style,
                    cornersDotColor: e.target.checked ? style.foregroundColor : null,
                  })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              {style.cornersDotColor !== null && (
                <>
                  <input
                    type="color"
                    value={style.cornersDotColor}
                    onChange={(e) => setStyle({ ...style, cornersDotColor: e.target.value })}
                    className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                  />
                  <Input
                    value={style.cornersDotColor}
                    onChange={(e) => setStyle({ ...style, cornersDotColor: e.target.value })}
                    className="flex-1"
                  />
                </>
              )}
              {style.cornersDotColor === null && (
                <span className="text-sm text-gray-500">Uses module color</span>
              )}
            </div>
          </div>

          <GradientEditor
            label="Corner Dot Gradient"
            value={style.cornersDotGradient}
            onChange={(value) => setStyle({ ...style, cornersDotGradient: value })}
            baseColor={style.cornersDotColor || style.foregroundColor}
          />
        </CollapsibleSection>

        {/* Ustawienia zaawansowane */}
        <CollapsibleSection title="Advanced Settings">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Error Correction Level
            </label>
            <select
              value={style.errorCorrectionLevel}
              onChange={(e) =>
                setStyle({
                  ...style,
                  errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H',
                })
              }
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
            >
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Higher levels allow more damage but result in denser codes. Use H if adding a logo.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Margin: {style.margin}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={style.margin}
                onChange={(e) => setStyle({ ...style, margin: Number(e.target.value) })}
                className="w-full accent-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size: {style.width}px
              </label>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={style.width}
                onChange={(e) => setStyle({ ...style, width: Number(e.target.value) })}
                className="w-full accent-gray-900"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Logo */}
        <CollapsibleSection title="Logo (Optional)">
          <LogoUploader
            value={logoUrl}
            onChange={setLogoUrl}
            onClear={() => setLogoUrl('')}
          />
          {logoUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo Size: {logoSize}px
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={logoSize}
                onChange={(e) => setLogoSize(Number(e.target.value))}
                className="w-full accent-gray-900"
              />
            </div>
          )}
        </CollapsibleSection>

        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" isLoading={isLoading} disabled={!QRCodeStyling}>
            {isEditing ? 'Update QR Code' : 'Create QR Code'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>

      <div className="lg:sticky lg:top-24">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <QrPreview
              url={destinationUrl || 'https://example.com'}
              style={style}
              logoUrl={logoUrl || undefined}
              logoSize={logoSize}
            />
            <p className="mt-4 text-sm text-gray-500 text-center">
              {isEditing
                ? 'Changes will be reflected after saving.'
                : 'This is a preview. The actual QR code will be generated on save.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
