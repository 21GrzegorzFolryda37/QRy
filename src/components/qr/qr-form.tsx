'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { QrCode, QrStyle, DotsType, CornersSquareType, CornersDotType, QrCodeContentType, LinkPageData, SurveyData, GradientOptions } from '@/types/database'
import { DEFAULT_QR_STYLE } from '@/types/qr'
import { createQrCode, updateQrCode, reserveShortCode } from '@/actions/qr'
import { migrateQrStyle } from '@/lib/utils/style-migration'
import { getRedirectUrl, getLinkPageUrl, getSurveyUrl } from '@/lib/utils'
import { QrPreview } from './qr-preview'
import { ShapeSelector, dotsTypeOptions, cornersSquareTypeOptions, cornersDotTypeOptions } from './shape-selector'
import { GradientEditor } from './gradient-editor'
import { LogoUploader, brandLogos } from './logo-uploader'
import { ContentTypeSelector, getContentTypeOption } from './content-type-selector'
import { LinkPageEditor, defaultLinkPageData } from './linkpage-editor'
import { SurveyEditor, defaultSurveyData } from './survey-editor'
import { generateQrCodeImage } from '@/lib/qr/options'
import type QRCodeStylingType from 'qr-code-styling'

interface QrFormProps {
  qrCode?: QrCode
}

// Gotowe szablony marek
interface BrandTemplate {
  id: string
  name: string
  logoId: string
  color: string // kolor marki do obramowania kafelka
  style: Partial<QrStyle>
}

const brandTemplates: BrandTemplate[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    logoId: 'instagram',
    color: '#E1306C',
    style: {
      foregroundColor: '#E1306C',
      dotsType: 'random-dot',
      dotsGradient: { type: 'linear', rotation: 225, colorStops: [{ offset: 0, color: '#f77737' }, { offset: 0.4, color: '#fd5949' }, { offset: 0.7, color: '#d6249f' }, { offset: 1, color: '#405de6' }] },
      cornersSquareType: 'extra-rounded',
      cornersSquareColor: '#d6249f',
      cornersDotType: 'dot',
      cornersDotColor: '#fd5949',
    },
  },
  {
    id: 'spotify',
    name: 'Spotify',
    logoId: 'spotify',
    color: '#1DB954',
    style: {
      foregroundColor: '#1DB954',
      dotsType: 'dots',
      dotsGradient: { type: 'linear', rotation: 180, colorStops: [{ offset: 0, color: '#1DB954' }, { offset: 1, color: '#191414' }] },
      cornersSquareType: 'dot',
      cornersSquareColor: '#1DB954',
      cornersDotType: 'dot',
      cornersDotColor: '#191414',
    },
  },
  {
    id: 'facebook',
    name: 'Facebook',
    logoId: 'facebook',
    color: '#1877F2',
    style: {
      foregroundColor: '#1877F2',
      dotsType: 'rounded',
      dotsGradient: null,
      cornersSquareType: 'extra-rounded',
      cornersSquareColor: '#1877F2',
      cornersDotType: 'dot',
      cornersDotColor: '#1877F2',
    },
  },
  {
    id: 'youtube',
    name: 'YouTube',
    logoId: 'youtube',
    color: '#FF0000',
    style: {
      foregroundColor: '#FF0000',
      dotsType: 'dots',
      dotsGradient: { type: 'linear', rotation: 180, colorStops: [{ offset: 0, color: '#FF0000' }, { offset: 1, color: '#282828' }] },
      cornersSquareType: 'extra-rounded',
      cornersSquareColor: '#FF0000',
      cornersDotType: 'dot',
      cornersDotColor: '#FF0000',
    },
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    logoId: 'tiktok',
    color: '#00f2ea',
    style: {
      foregroundColor: '#000000',
      dotsType: 'rounded',
      dotsGradient: { type: 'linear', rotation: 135, colorStops: [{ offset: 0, color: '#4de8e0' }, { offset: 0.4, color: '#2b2b2b' }, { offset: 0.6, color: '#2b2b2b' }, { offset: 1, color: '#e0345b' }] },
      cornersSquareType: 'classy-rounded',
      cornersSquareColor: '#000000',
      cornersDotType: 'dot',
      cornersDotColor: '#000000',
    },
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    logoId: 'whatsapp',
    color: '#25D366',
    style: {
      foregroundColor: '#25D366',
      dotsType: 'rounded',
      dotsGradient: { type: 'linear', rotation: 180, colorStops: [{ offset: 0, color: '#25D366' }, { offset: 1, color: '#128C7E' }] },
      cornersSquareType: 'extra-rounded',
      cornersSquareColor: '#25D366',
      cornersDotType: 'dot',
      cornersDotColor: '#128C7E',
    },
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    logoId: 'linkedin',
    color: '#0A66C2',
    style: {
      foregroundColor: '#0A66C2',
      dotsType: 'square',
      dotsGradient: null,
      cornersSquareType: 'square',
      cornersSquareColor: '#0A66C2',
      cornersDotType: 'square',
      cornersDotColor: '#0A66C2',
    },
  },
  {
    id: 'x',
    name: 'X',
    logoId: 'x',
    color: '#000000',
    style: {
      foregroundColor: '#000000',
      dotsType: 'square',
      dotsGradient: null,
      cornersSquareType: 'square',
      cornersSquareColor: '#000000',
      cornersDotType: 'square',
      cornersDotColor: '#000000',
    },
  },
]

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

  // Dynamic import of qr-code-styling for client-side QR generation
  const [QRCodeStyling, setQRCodeStyling] = useState<typeof QRCodeStylingType | null>(null)

  useEffect(() => {
    import('qr-code-styling').then((module) => {
      setQRCodeStyling(() => module.default)
    })
  }, [])

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

      // Generate QR code client-side
      const qrImageDataUrl = await generateQrCodeImage(QRCodeStyling, {
        url: redirectUrl,
        style,
        size: style.width,
        logoUrl: logoUrl || undefined,
        logoSize,
      })

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

        {/* Gotowe szablony */}
        <CollapsibleSection title="Gotowe szablony" defaultOpen={true}>
          <div className="grid grid-cols-4 gap-2">
            {brandTemplates.map((template) => {
              const brandLogo = brandLogos.find(b => b.id === template.logoId)
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => {
                    setStyle({ ...DEFAULT_QR_STYLE, ...template.style })
                    setLogoUrl(brandLogo?.svg || '')
                  }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    logoUrl === brandLogo?.svg
                      ? 'border-[var(--primary)] bg-[var(--primary)]/5 ring-2 ring-[var(--primary)]/20'
                      : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  {brandLogo && (
                    <img
                      src={brandLogo.svg}
                      alt={template.name}
                      className="w-8 h-8"
                    />
                  )}
                  <span className="text-xs font-medium text-[var(--foreground)]">{template.name}</span>
                </button>
              )
            })}
          </div>
          <p className="text-xs text-[var(--foreground-muted)]">
            Kliknij szablon, aby zastosowac kolory, gradienty i logo marki.
          </p>
        </CollapsibleSection>

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

        {/* Logo */}
        <CollapsibleSection title="Logo (opcjonalnie)">
          <LogoUploader
            value={logoUrl}
            onChange={setLogoUrl}
            onClear={() => setLogoUrl('')}
          />
        </CollapsibleSection>

        {/* Ustawienia zaawansowane */}
        <CollapsibleSection title="Ustawienia zaawansowane">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Poziom korekcji bledow
            </label>
            <select
              value={logoUrl ? 'H' : style.errorCorrectionLevel}
              onChange={(e) =>
                setStyle({
                  ...style,
                  errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H',
                })
              }
              disabled={!!logoUrl}
              className="flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background-surface)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="L">Niski (7%)</option>
              <option value="M">Sredni (15%)</option>
              <option value="Q">Wysoki (25%)</option>
              <option value="H">Maksymalny (30%)</option>
            </select>
            {logoUrl ? (
              <p className="mt-1 text-xs text-amber-600">
                Korekcja bledow ustawiona automatycznie na Maksymalny (H) - wymagane przy logo.
              </p>
            ) : (
              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                Wyzszy poziom pozwala na wieksze uszkodzenia, ale kod jest gestszy.
              </p>
            )}
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
