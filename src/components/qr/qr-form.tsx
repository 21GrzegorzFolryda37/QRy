'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { QrCode, QrStyle, DotsType, CornersSquareType, CornersDotType, QrCodeContentType, LinkPageData, SurveyData } from '@/types/database'
import { DEFAULT_QR_STYLE } from '@/types/qr'
import { createQrCode, updateQrCode, reserveShortCode } from '@/actions/qr'
import { migrateQrStyle } from '@/lib/utils/style-migration'
import { getRedirectUrl, getLinkPageUrl, getSurveyUrl } from '@/lib/utils'
import { QrPreview } from './qr-preview'
import { ShapeSelector, dotsTypeOptions, cornersSquareTypeOptions, cornersDotTypeOptions } from './shape-selector'
import { GradientEditor } from './gradient-editor'
import { LogoUploader } from './logo-uploader'
import { ContentTypeSelector, getContentTypeOption } from './content-type-selector'
import { LinkPageEditor, defaultLinkPageData } from './linkpage-editor'
import { SurveyEditor, defaultSurveyData } from './survey-editor'

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
        <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-[var(--background-elevated)] transition-colors">
          <CardTitle>{title}</CardTitle>
          <svg
            className={`h-5 w-5 text-[var(--foreground-subtle)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
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

  const [name, setName] = useState(qrCode?.name || '')
  const [destinationUrl, setDestinationUrl] = useState(qrCode?.destination_url || '')
  const [contentType, setContentType] = useState<QrCodeContentType>(qrCode?.content_type || 'website')
  const [contentData, setContentData] = useState<LinkPageData | SurveyData | null>(
    qrCode?.content_data || null
  )
  const [logoUrl, setLogoUrl] = useState(qrCode?.logo_url || '')
  const [logoSize, setLogoSize] = useState(qrCode?.logo_size || 80)

  // Obsługa zmiany typu - inicjalizacja danych dla linkpage/survey
  const handleContentTypeChange = (newType: QrCodeContentType) => {
    setContentType(newType)
    if (newType === 'linkpage' && (!contentData || !('links' in contentData))) {
      setContentData(defaultLinkPageData)
      setDestinationUrl('') // URL będzie generowany automatycznie
    } else if (newType === 'survey' && (!contentData || !('questions' in contentData))) {
      setContentData(defaultSurveyData)
      setDestinationUrl('') // URL będzie generowany automatycznie
    } else if (newType !== 'linkpage' && newType !== 'survey') {
      setContentData(null)
    }
  }

  // Sprawdź czy typ wymaga edytora zamiast URL
  const isSpecialType = contentType === 'linkpage' || contentType === 'survey'

  // Migruj stary styl do nowego formatu
  const initialStyle = qrCode?.style ? migrateQrStyle(qrCode.style) : DEFAULT_QR_STYLE
  const [style, setStyle] = useState<QrStyle>(initialStyle)

  // Get current content type info for placeholder
  const contentTypeInfo = getContentTypeOption(contentType)

  const isEditing = !!qrCode

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setIsLoading(true)
    setError(null)

    try {
      let shortCode: string
      let redirectUrl: string

      if (isEditing) {
        // Use existing short code for updates
        shortCode = qrCode.short_code
      } else {
        // Reserve a new short code for new QR codes
        const reserveResult = await reserveShortCode()
        if (reserveResult.error || !reserveResult.shortCode || !reserveResult.redirectUrl) {
          setError(reserveResult.error || 'Nie udalo sie zarezerwowac kodu')
          setIsLoading(false)
          return
        }
        shortCode = reserveResult.shortCode
      }

      // Generate appropriate URL based on content type
      if (contentType === 'linkpage') {
        redirectUrl = getLinkPageUrl(shortCode)
      } else if (contentType === 'survey') {
        redirectUrl = getSurveyUrl(shortCode)
      } else {
        redirectUrl = getRedirectUrl(shortCode)
      }

      // Generate QR code via server-side API
      // Uses @qr-platform/qr-code.js for extended shape support
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: redirectUrl,
          style,
          size: style.width,
          logoUrl: logoUrl || undefined,
          logoSize,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Nie udalo sie wygenerowac obrazu kodu QR')
        setIsLoading(false)
        return
      }

      const { dataUrl: qrImageDataUrl } = await response.json()

      if (!qrImageDataUrl) {
        setError('Nie udalo sie wygenerowac obrazu kodu QR')
        setIsLoading(false)
        return
      }

      // Build form data
      const formData = new FormData()
      formData.set('name', name)
      formData.set('contentType', contentType)
      formData.set('style', JSON.stringify(style))
      formData.set('logoUrl', logoUrl)
      formData.set('qrImageDataUrl', qrImageDataUrl)

      // Dla linkpage/survey, URL będzie generowany automatycznie
      if (isSpecialType) {
        formData.set('destinationUrl', redirectUrl) // Używamy redirect URL jako placeholder
        if (contentData) {
          formData.set('contentData', JSON.stringify(contentData))
        }
      } else {
        formData.set('destinationUrl', destinationUrl)
      }

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
      setError('Wystapil nieoczekiwany blad')
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 items-start">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Typ kodu QR */}
        <Card>
          <CardHeader>
            <CardTitle>Typ kodu QR</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentTypeSelector value={contentType} onChange={handleContentTypeChange} />
          </CardContent>
        </Card>

        {/* Podstawowe informacje */}
        <Card>
          <CardHeader>
            <CardTitle>Szczegoly kodu QR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Nazwa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Moj kod QR"
              required
            />
            {!isSpecialType && (
              <div>
                <Input
                  label="Adres URL"
                  type="url"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  placeholder={contentTypeInfo.placeholder}
                  required
                />
                {contentTypeInfo.hint && (
                  <p className="mt-1 text-xs text-[var(--foreground-muted)]">{contentTypeInfo.hint}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edytor strony linków */}
        {contentType === 'linkpage' && contentData && 'links' in contentData && (
          <Card>
            <CardHeader>
              <CardTitle>Strona linków</CardTitle>
            </CardHeader>
            <CardContent>
              <LinkPageEditor
                value={contentData}
                onChange={(data) => setContentData(data)}
              />
            </CardContent>
          </Card>
        )}

        {/* Edytor ankiety */}
        {contentType === 'survey' && contentData && 'questions' in contentData && (
          <Card>
            <CardHeader>
              <CardTitle>Ankieta</CardTitle>
            </CardHeader>
            <CardContent>
              <SurveyEditor
                value={contentData}
                onChange={(data) => setContentData(data)}
              />
            </CardContent>
          </Card>
        )}

        {/* Styl modułów */}
        <CollapsibleSection title="Styl modulow" defaultOpen={false}>
          <ShapeSelector<DotsType>
            value={style.dotsType}
            onChange={(value) => setStyle({ ...style, dotsType: value })}
            options={dotsTypeOptions}
            label="Ksztalt modulow"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Kolor modulow
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.foregroundColor}
                  onChange={(e) => setStyle({ ...style, foregroundColor: e.target.value })}
                  className="h-10 w-14 rounded border border-[var(--border)] cursor-pointer"
                />
                <Input
                  value={style.foregroundColor}
                  onChange={(e) => setStyle({ ...style, foregroundColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Kolor tla
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.backgroundColor}
                  onChange={(e) => setStyle({ ...style, backgroundColor: e.target.value })}
                  className="h-10 w-14 rounded border border-[var(--border)] cursor-pointer"
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
            label="Gradient modulow"
            value={style.dotsGradient}
            onChange={(value) => setStyle({ ...style, dotsGradient: value })}
            baseColor={style.foregroundColor}
          />

          <GradientEditor
            label="Gradient tla"
            value={style.backgroundGradient}
            onChange={(value) => setStyle({ ...style, backgroundGradient: value })}
            baseColor={style.backgroundColor}
          />
        </CollapsibleSection>

        {/* Styl narożników */}
        <CollapsibleSection title="Styl naroznikow">
          <ShapeSelector<CornersSquareType>
            value={style.cornersSquareType}
            onChange={(value) => setStyle({ ...style, cornersSquareType: value })}
            options={cornersSquareTypeOptions}
            label="Ksztalt zewnetrzny"
          />

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Kolor zewnetrzny (opcjonalnie)
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
                className="h-4 w-4 rounded border-[var(--border)]"
              />
              {style.cornersSquareColor !== null && (
                <>
                  <input
                    type="color"
                    value={style.cornersSquareColor}
                    onChange={(e) => setStyle({ ...style, cornersSquareColor: e.target.value })}
                    className="h-10 w-14 rounded border border-[var(--border)] cursor-pointer"
                  />
                  <Input
                    value={style.cornersSquareColor}
                    onChange={(e) => setStyle({ ...style, cornersSquareColor: e.target.value })}
                    className="flex-1"
                  />
                </>
              )}
              {style.cornersSquareColor === null && (
                <span className="text-sm text-[var(--foreground-muted)]">Uzywa koloru modulow</span>
              )}
            </div>
          </div>

          <GradientEditor
            label="Gradient zewnetrzny"
            value={style.cornersSquareGradient}
            onChange={(value) => setStyle({ ...style, cornersSquareGradient: value })}
            baseColor={style.cornersSquareColor || style.foregroundColor}
          />

          <div className="border-t border-[var(--border)] pt-4">
            <ShapeSelector<CornersDotType>
              value={style.cornersDotType}
              onChange={(value) => setStyle({ ...style, cornersDotType: value })}
              options={cornersDotTypeOptions}
              label="Ksztalt wewnetrzny"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Kolor wewnetrzny (opcjonalnie)
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
                className="h-4 w-4 rounded border-[var(--border)]"
              />
              {style.cornersDotColor !== null && (
                <>
                  <input
                    type="color"
                    value={style.cornersDotColor}
                    onChange={(e) => setStyle({ ...style, cornersDotColor: e.target.value })}
                    className="h-10 w-14 rounded border border-[var(--border)] cursor-pointer"
                  />
                  <Input
                    value={style.cornersDotColor}
                    onChange={(e) => setStyle({ ...style, cornersDotColor: e.target.value })}
                    className="flex-1"
                  />
                </>
              )}
              {style.cornersDotColor === null && (
                <span className="text-sm text-[var(--foreground-muted)]">Uzywa koloru modulow</span>
              )}
            </div>
          </div>

          <GradientEditor
            label="Gradient wewnetrzny"
            value={style.cornersDotGradient}
            onChange={(value) => setStyle({ ...style, cornersDotGradient: value })}
            baseColor={style.cornersDotColor || style.foregroundColor}
          />
        </CollapsibleSection>

        {/* Ustawienia zaawansowane */}
        <CollapsibleSection title="Ustawienia zaawansowane">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Poziom korekcji bledow
            </label>
            <select
              value={style.errorCorrectionLevel}
              onChange={(e) =>
                setStyle({
                  ...style,
                  errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H',
                })
              }
              className="flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background-surface)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-1"
            >
              <option value="L">Niski (7%)</option>
              <option value="M">Sredni (15%)</option>
              <option value="Q">Wysoki (25%)</option>
              <option value="H">Maksymalny (30%)</option>
            </select>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Wyzszy poziom pozwala na wieksze uszkodzenia, ale kod jest gestszy. Uzyj H jesli dodajesz logo.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Margines: {style.margin}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={style.margin}
                onChange={(e) => setStyle({ ...style, margin: Number(e.target.value) })}
                className="w-full accent-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Rozmiar: {style.width}px
              </label>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={style.width}
                onChange={(e) => setStyle({ ...style, width: Number(e.target.value) })}
                className="w-full accent-[var(--primary)]"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Logo */}
        <CollapsibleSection title="Logo (opcjonalnie)">
          <LogoUploader
            value={logoUrl}
            onChange={setLogoUrl}
            onClear={() => setLogoUrl('')}
          />
        </CollapsibleSection>

        {error && (
          <div className="rounded-md bg-[var(--error)]/10 p-3">
            <p className="text-sm text-[var(--error)]">{error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? 'Zaktualizuj kod QR' : 'Utworz kod QR'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Anuluj
          </Button>
        </div>
      </form>

      {/* Sticky Preview */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardHeader>
            <CardTitle>Podglad</CardTitle>
          </CardHeader>
          <CardContent>
            <QrPreview
              url={destinationUrl || 'https://example.com'}
              style={style}
              logoUrl={logoUrl || undefined}
              logoSize={logoSize}
            />
            <p className="mt-4 text-sm text-[var(--foreground-muted)] text-center">
              {isEditing
                ? 'Zmiany beda widoczne po zapisaniu.'
                : 'To jest podglad. Kod QR zostanie wygenerowany po zapisaniu.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
