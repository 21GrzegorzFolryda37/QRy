'use client'

import { useState, useRef, useCallback } from 'react'

// Predefiniowane loga marek (identyczne jak w Hero)
const brandLogos: { id: string; name: string; svg: string }[] = [
  {
    id: 'x',
    name: 'X (Twitter)',
    svg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'/%3E%3C/svg%3E"
  },
  {
    id: 'facebook',
    name: 'Facebook',
    svg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231877F2'%3E%3Cpath d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/%3E%3C/svg%3E"
  },
  {
    id: 'instagram',
    name: 'Instagram',
    svg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cdefs%3E%3CradialGradient id='ig1' cx='30%25' cy='107%25' r='150%25'%3E%3Cstop offset='0%25' stop-color='%23fdf497'/%3E%3Cstop offset='5%25' stop-color='%23fdf497'/%3E%3Cstop offset='45%25' stop-color='%23fd5949'/%3E%3Cstop offset='60%25' stop-color='%23d6249f'/%3E%3Cstop offset='90%25' stop-color='%23285AEB'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='24' height='24' rx='6' fill='url(%23ig1)'/%3E%3Crect x='3' y='3' width='18' height='18' rx='4' fill='none' stroke='white' stroke-width='1.5'/%3E%3Ccircle cx='12' cy='12' r='4' fill='none' stroke='white' stroke-width='1.5'/%3E%3Ccircle cx='17.5' cy='6.5' r='1.2' fill='white'/%3E%3C/svg%3E"
  },
  {
    id: 'telegram',
    name: 'Telegram',
    svg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2326A5E4'%3E%3Cpath d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.1.154.234.17.332.015.098.034.321.019.495z'/%3E%3C/svg%3E"
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    svg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2325D366'%3E%3Cpath d='M12.031 0C5.505 0 .162 5.335.157 11.852c-.002 2.09.544 4.13 1.58 5.93L0 24l6.387-1.674a11.88 11.88 0 005.641 1.436h.005c6.52 0 11.863-5.335 11.868-11.852C23.904 5.336 18.557 0 12.031 0zm5.985 16.644c-.25.703-1.46 1.303-2.042 1.387-.583.084-1.124.398-3.683-.767-3.075-1.4-5.02-4.537-5.172-4.747-.152-.21-1.24-1.649-1.24-3.145s.784-2.232 1.063-2.537c.278-.304.608-.38.81-.38.203 0 .405.002.583.01.187.01.438-.07.685.523.25.602.853 2.08.928 2.232.075.152.125.33.025.531-.1.202-.15.329-.298.505-.15.177-.315.394-.45.528-.15.152-.306.316-.132.62.175.305.779 1.284 1.672 2.08 1.15 1.023 2.12 1.34 2.42 1.49.302.152.478.127.654-.076.177-.202.757-.883.96-1.187.202-.304.404-.253.683-.152.278.101 1.769.834 2.07.987.303.152.506.228.58.355.078.127.078.733-.17 1.436z'/%3E%3C/svg%3E"
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    svg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z'/%3E%3C/svg%3E"
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    svg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230A66C2'%3E%3Cpath d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/%3E%3C/svg%3E"
  },
  {
    id: 'youtube',
    name: 'YouTube',
    svg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FF0000' d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z'/%3E%3Cpath fill='%23FFFFFF' d='M9.545 15.568V8.432L15.818 12l-6.273 3.568z'/%3E%3C/svg%3E"
  },
  {
    id: 'spotify',
    name: 'Spotify',
    svg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%231DB954'/%3E%3Cpath d='M34.8 33.5c-.4 0-.7-.1-1-.4-5.5-3.3-12.4-4-18.2-2.1-.6.2-1.2.3-1.6.4-.8.2-1.5-.3-1.7-1-.2-.8.3-1.5 1-1.7.5-.1 1.1-.3 1.8-.5 6.6-2.1 14.4-1.2 20.6 2.5.7.4.9 1.3.5 2-.2.5-.8.8-1.4.8zm2-6.2c-.4 0-.8-.1-1.1-.4-6.5-4-15.5-5-22.7-2.7-.6.2-1.3.4-1.7.5-1 .3-2-.3-2.2-1.2-.3-1 .3-2 1.2-2.2.5-.2 1.3-.4 2-.6 8.2-2.6 18.2-1.4 25.6 3.1.8.5 1.1 1.6.6 2.5-.4.6-1 1-1.7 1zm2.3-7.1c-.4 0-.9-.1-1.3-.4-7.5-4.5-19.5-4.9-26.5-2.7-.6.2-1.2.4-1.6.5-1.1.3-2.3-.4-2.6-1.5-.3-1.1.4-2.3 1.5-2.6.5-.2 1.2-.4 1.9-.6 8-2.5 21.3-2 29.9 3.2 1 .6 1.3 1.9.7 2.9-.4.7-1.2 1.2-2 1.2z' fill='%23191414'/%3E%3C/svg%3E"
  },
  {
    id: 'discord',
    name: 'Discord',
    svg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%235865F2'%3E%3Cpath d='M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z'/%3E%3C/svg%3E"
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    svg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E60023'%3E%3Cpath d='M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z'/%3E%3C/svg%3E"
  },
  {
    id: 'paypal',
    name: 'PayPal',
    svg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23003087' d='M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z'/%3E%3Cpath fill='%230070E0' d='M23.95 7.784c-.005.072-.012.144-.02.218-.996 5.107-4.397 6.883-8.743 6.883h-2.21a1.053 1.053 0 0 0-1.04.898l-1.13 7.177-.32 2.032a.55.55 0 0 0 .544.638h3.833c.46 0 .85-.334.922-.788l.038-.196.73-4.627.047-.255a.93.93 0 0 1 .919-.787h.578c3.746 0 6.68-1.522 7.537-5.926.36-1.836.173-3.37-.776-4.446a3.737 3.737 0 0 0-1.07-.821h.161z'/%3E%3Cpath fill='%23003087' d='M22.705 7.002a8.14 8.14 0 0 0-1.005-.221 12.803 12.803 0 0 0-2.038-.148h-6.18a.93.93 0 0 0-.918.787l-1.314 8.327-.038.243a1.053 1.053 0 0 1 1.04-.898h2.21c4.346 0 7.747-1.776 8.743-6.883.03-.151.055-.298.077-.442a4.297 4.297 0 0 0-.577-.765z'/%3E%3C/svg%3E"
  },
]

interface LogoUploaderProps {
  value: string
  onChange: (dataUrl: string) => void
  onClear: () => void
}

export function LogoUploader({ value, onChange, onClear }: LogoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    setError(null)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, SVG, etc.)')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image is too large. Maximum size is 2MB.')
      return
    }

    // Convert to data URL
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      if (dataUrl) {
        onChange(dataUrl)
      }
    }
    reader.onerror = () => {
      setError('Failed to read the file. Please try again.')
    }
    reader.readAsDataURL(file)
  }, [onChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }, [processFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }, [processFile])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Check if current value is a brand logo
  const isCustomLogo = value && !brandLogos.some(b => b.svg === value)
  const selectedBrandId = brandLogos.find(b => b.svg === value)?.id || null

  return (
    <div className="space-y-4">
      {/* Predefined brand logos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Popularne marki
        </label>
        <div className="grid grid-cols-6 gap-2">
          {brandLogos.map((brand) => (
            <button
              key={brand.id}
              type="button"
              onClick={() => onChange(brand.svg)}
              title={brand.name}
              className={`
                w-10 h-10 rounded-lg border-2 flex items-center justify-center
                transition-all duration-200 hover:scale-105
                ${selectedBrandId === brand.id
                  ? 'border-gray-900 bg-gray-100 ring-2 ring-gray-900 ring-offset-1'
                  : 'border-gray-200 hover:border-gray-400 bg-white'
                }
              `}
            >
              <img
                src={brand.svg}
                alt={brand.name}
                className="w-6 h-6 object-contain"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Custom logo upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Wlasne logo
        </label>

        {isCustomLogo ? (
          // Preview when custom logo is uploaded
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <img
                src={value}
                alt="Logo preview"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">Wlasne logo</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClick}
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Zmien
                </button>
                <button
                  type="button"
                  onClick={onClear}
                  className="text-sm text-red-600 hover:text-red-700 underline"
                >
                  Usun
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Drop zone when no custom logo
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
              transition-colors duration-200
              ${isDragging
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }
            `}
          >
            <svg
              className="mx-auto h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-1 text-sm text-gray-600">
              <span className="font-medium text-gray-900">Kliknij</span> lub przeciagnij plik
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, SVG do 2MB
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Clear button when any logo is selected */}
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="w-full py-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Usun logo
        </button>
      )}

      <p className="text-xs text-gray-500">
        Dla najlepszych rezultatow, uzyj kwadratowego obrazu i ustaw korekcje bledow na Wysoki.
      </p>
    </div>
  )
}
