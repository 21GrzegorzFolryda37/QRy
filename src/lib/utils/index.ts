import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function getBaseUrl(): string {
  // For QR codes, prefer explicit APP_URL to ensure production URLs
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return 'http://localhost:3000'
}

export function getRedirectUrl(shortCode: string): string {
  return `${getBaseUrl()}/r/${shortCode}`
}

export function extractUtmParams(url: URL): Record<string, string | null> {
  return {
    utm_source: url.searchParams.get('utm_source'),
    utm_medium: url.searchParams.get('utm_medium'),
    utm_campaign: url.searchParams.get('utm_campaign'),
    utm_term: url.searchParams.get('utm_term'),
    utm_content: url.searchParams.get('utm_content'),
  }
}

export function appendUtmParams(destinationUrl: string, utmParams: Record<string, string | null>): string {
  const url = new URL(destinationUrl)
  Object.entries(utmParams).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value)
    }
  })
  return url.toString()
}
