'use client'

import type { LinkPageData } from '@/types/database'

interface LinkPageViewProps {
  data: LinkPageData
}

export function LinkPageView({ data }: LinkPageViewProps) {
  const {
    title,
    description,
    avatarUrl,
    backgroundColor = '#0f0f14',
    textColor = '#ffffff',
    buttonColor = '#8b5cf6',
    buttonTextColor = '#ffffff',
    links,
  } = data

  // Sort links by order
  const sortedLinks = [...links].sort((a, b) => a.order - b.order)

  return (
    <div
      className="min-h-screen flex flex-col items-center py-12 px-4"
      style={{ backgroundColor }}
    >
      <div className="w-full max-w-md space-y-6">
        {/* Avatar */}
        {avatarUrl && (
          <div className="flex justify-center">
            <img
              src={avatarUrl}
              alt={title}
              className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
            />
          </div>
        )}

        {/* Title & Description */}
        <div className="text-center space-y-2">
          <h1
            className="text-2xl font-bold"
            style={{ color: textColor }}
          >
            {title}
          </h1>
          {description && (
            <p
              className="text-sm opacity-80"
              style={{ color: textColor }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {sortedLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-4 rounded-xl text-center font-medium transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{
                backgroundColor: buttonColor,
                color: buttonTextColor,
              }}
            >
              {link.title || link.url}
            </a>
          ))}
        </div>

        {/* Branding */}
        <div className="text-center pt-8">
          <a
            href="/"
            className="text-xs opacity-50 hover:opacity-80 transition-opacity"
            style={{ color: textColor }}
          >
            Powered by QRapple
          </a>
        </div>
      </div>
    </div>
  )
}
