'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui'
import type QRCodeStylingType from 'qr-code-styling'

type QRType = 'website' | 'email' | 'vcard' | 'wifi' | 'social' | 'pdf' | 'video' | 'facebook' | 'instagram' | 'twitter' | 'bitcoin' | 'mp3' | 'appstore'
type TabType = 'sticker' | 'color' | 'shape' | 'edges' | 'logo'
type DotShape = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'
type CornerSquareShape = 'square' | 'dot' | 'extra-rounded'
type CornerDotShape = 'square' | 'dot'

const qrTypes: { id: QRType; label: string; icon: string }[] = [
  { id: 'website', label: 'Strona www', icon: 'globe' },
  { id: 'pdf', label: 'PDF', icon: 'file' },
  { id: 'email', label: 'E-mail', icon: 'mail' },
  { id: 'social', label: 'Social media', icon: 'share' },
  { id: 'vcard', label: 'Wizytówka', icon: 'user' },
  { id: 'wifi', label: 'WiFi', icon: 'wifi' },
  { id: 'appstore', label: 'Sklepy z aplikacjami', icon: 'download' },
  { id: 'video', label: 'Wideo', icon: 'play' },
  { id: 'facebook', label: 'Facebook', icon: 'facebook' },
  { id: 'instagram', label: 'Instagram', icon: 'instagram' },
  { id: 'twitter', label: 'Twitter/X', icon: 'twitter' },
  { id: 'bitcoin', label: 'Bitcoin', icon: 'bitcoin' },
  { id: 'mp3', label: 'MP3', icon: 'music' },
]

const typeContent: Record<QRType, { title: string; subtitle: string }> = {
  website: { title: 'Przekształć link do strony w kod QR', subtitle: 'Udostępniaj swoją stronę internetową w prosty sposób' },
  email: { title: 'Przekształć adres e-mail w kod QR', subtitle: 'Pozwól klientom szybko się z Tobą skontaktować' },
  vcard: { title: 'Przekształć dane kontaktowe w kod QR vCard', subtitle: 'Rozwój Twojej sieci nigdy nie był łatwiejszy' },
  wifi: { title: 'Udostępnij hasło WiFi przez kod QR', subtitle: 'Goście połączą się jednym skanem' },
  social: { title: 'Wszystkie social media w jednym kodzie QR', subtitle: 'Linki do wszystkich profili w jednym miejscu' },
  pdf: { title: 'Udostępnij plik PDF przez kod QR', subtitle: 'Dokumenty dostępne po zeskanowaniu' },
  video: { title: 'Udostępnij wideo przez kod QR', subtitle: 'Link do YouTube, Vimeo lub własnego wideo' },
  facebook: { title: 'Link do Facebooka w kodzie QR', subtitle: 'Zwiększ liczbę obserwujących' },
  instagram: { title: 'Link do Instagrama w kodzie QR', subtitle: 'Rozwijaj swoje konto Instagram' },
  twitter: { title: 'Link do Twitter/X w kodzie QR', subtitle: 'Połącz się ze swoimi obserwatorami' },
  bitcoin: { title: 'Adres Bitcoin w kodzie QR', subtitle: 'Przyjmuj płatności kryptowalutowe' },
  mp3: { title: 'Udostępnij plik audio przez kod QR', subtitle: 'Muzyka i podcasty po zeskanowaniu' },
  appstore: { title: 'Link do aplikacji w kodzie QR', subtitle: 'App Store i Google Play w jednym kodzie' },
}

type FrameStyle = 'none' | 'simple' | 'rounded' | 'badge-top' | 'badge-bottom' | 'bubble' | 'pointer' | 'ticket' | 'stamp' | 'ribbon' | 'chat' | 'hexagon'

const frameTemplates: { id: FrameStyle; label: string; text?: string }[] = [
  { id: 'none', label: 'Brak' },
  { id: 'simple', label: 'Prosta', text: 'SCAN ME' },
  { id: 'rounded', label: 'Zaokrąglona', text: 'SCAN ME' },
  { id: 'badge-top', label: 'Badge góra', text: 'SCAN ME' },
  { id: 'badge-bottom', label: 'Badge dół', text: 'SKANUJ TUTAJ' },
  { id: 'bubble', label: 'Bąbel', text: 'SCAN ME' },
  { id: 'pointer', label: 'Wskaźnik', text: 'SKANUJ' },
  { id: 'ticket', label: 'Bilet', text: 'SCAN ME' },
  { id: 'stamp', label: 'Pieczątka', text: 'QR CODE' },
  { id: 'ribbon', label: 'Wstążka', text: 'SCAN ME' },
  { id: 'chat', label: 'Chat', text: 'ZESKANUJ!' },
  { id: 'hexagon', label: 'Heksagon', text: 'SCAN' },
]

// Paleta kolorów - górny rząd (9 kolorów) + dolny rząd (5 kolorów)
const colorPaletteTop = [
  '#000000', // Czarny
  '#6b7280', // Szary
  '#7f1d1d', // Ciemny czerwony/bordowy
  '#dc2626', // Czerwony
  '#f97316', // Pomarańczowy
  '#92400e', // Brązowy
  '#ec4899', // Magenta/różowy
  '#8b5cf6', // Fioletowy
]

const colorPaletteBottom = [
  '#1e3a5f', // Ciemny niebieski (granatowy)
  '#3b82f6', // Niebieski
  '#06b6d4', // Jasny niebieski/cyjan
  '#14b8a6', // Turkusowy/morski
  '#22c55e', // Zielony
]

// Kształty kropek QR
const dotShapes: { id: DotShape; label: string }[] = [
  { id: 'square', label: 'Kwadrat' },
  { id: 'dots', label: 'Kropki' },
  { id: 'rounded', label: 'Zaokrąglone' },
  { id: 'extra-rounded', label: 'Bardzo zaokrąglone' },
  { id: 'classy', label: 'Eleganckie' },
  { id: 'classy-rounded', label: 'Eleganckie zaokrąglone' },
]

// Kształty ramki narożnika (zewnętrzny element)
const cornerSquareShapes: { id: CornerSquareShape; label: string }[] = [
  { id: 'square', label: 'Kwadrat' },
  { id: 'dot', label: 'Kropka' },
  { id: 'extra-rounded', label: 'Zaokrąglone' },
]

// Kształty środka narożnika (wewnętrzny element)
const cornerDotShapes: { id: CornerDotShape; label: string }[] = [
  { id: 'square', label: 'Kwadrat' },
  { id: 'dot', label: 'Kropka' },
]

// Predefiniowane loga marek
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
    id: 'pinterest',
    name: 'Pinterest',
    svg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E60023'%3E%3Cpath d='M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z'/%3E%3C/svg%3E"
  },
  {
    id: 'gmail',
    name: 'Gmail',
    svg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23EA4335' d='M1 5.5V18.5C1 19.88 2.12 21 3.5 21H5V8L12 13L19 8V21H20.5C21.88 21 23 19.88 23 18.5V5.5C23 3.5 21 2 19 3L12 8L5 3C3 2 1 3.5 1 5.5Z'/%3E%3Cpath fill='%2334A853' d='M5 21H3.5C2.12 21 1 19.88 1 18.5V5.5L5 8V21Z'/%3E%3Cpath fill='%234285F4' d='M19 21H20.5C21.88 21 23 19.88 23 18.5V5.5L19 8V21Z'/%3E%3Cpath fill='%23FBBC05' d='M19 8L23 5.5C23 3.5 21 2 19 3L12 8L19 13V8Z'/%3E%3Cpath fill='%23C5221F' d='M5 8L1 5.5C1 3.5 3 2 5 3L12 8L5 13V8Z'/%3E%3C/svg%3E"
  },
  {
    id: 'youtube',
    name: 'YouTube',
    svg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FF0000' d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z'/%3E%3Cpath fill='%23FFFFFF' d='M9.545 15.568V8.432L15.818 12l-6.273 3.568z'/%3E%3C/svg%3E"
  },
  {
    id: 'spotify',
    name: 'Spotify',
    svg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='12' fill='%231DB954'/%3E%3Cpath fill='%23191414' d='M17.9 10.9c-2.9-1.7-7.6-1.9-10.4-1-.4.1-.9-.1-1-.6-.1-.4.1-.9.6-1 3.2-1 8.5-.8 11.8 1.2.4.2.5.8.3 1.2-.3.3-.8.4-1.3.2zm-.3 2.9c-.2.4-.7.5-1 .2-2.4-1.5-6-1.9-8.8-1-.4.1-.8-.1-.9-.5-.1-.4.1-.8.5-.9 3.2-1 7.2-.5 10 1.2.3.2.4.6.2 1zm-1.1 2.8c-.2.3-.5.4-.8.2-2.1-1.3-4.7-1.6-7.8-.9-.3.1-.6-.1-.7-.4-.1-.3.1-.6.4-.7 3.4-.8 6.3-.4 8.7 1 .3.2.4.5.2.8z'/%3E%3C/svg%3E"
  },
]

export function Hero() {
  const [selectedType, setSelectedType] = useState<QRType>('website')
  const [activeTab, setActiveTab] = useState<TabType>('sticker')

  // Form fields
  const [formData, setFormData] = useState<Record<string, string>>({})

  // QR customization
  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>('simple')
  const [frameText, setFrameText] = useState('SCAN ME')
  const [dotColor, setDotColor] = useState('#000000')
  const [dotGradient, setDotGradient] = useState(false)
  const [dotGradientColors, setDotGradientColors] = useState<[string, string]>(['#000000', '#3b82f6'])
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [cornerSquareColor, setCornerSquareColor] = useState('#000000')
  const [cornerSquareGradient, setCornerSquareGradient] = useState(false)
  const [cornerSquareGradientColors, setCornerSquareGradientColors] = useState<[string, string]>(['#000000', '#3b82f6'])
  const [cornerDotColor, setCornerDotColor] = useState('#000000')
  const [cornerDotGradient, setCornerDotGradient] = useState(false)
  const [cornerDotGradientColors, setCornerDotGradientColors] = useState<[string, string]>(['#000000', '#3b82f6'])
  const [dotShape, setDotShape] = useState<DotShape>('square')
  const [cornerSquareShape, setCornerSquareShape] = useState<CornerSquareShape>('square')
  const [cornerDotShape, setCornerDotShape] = useState<CornerDotShape>('square')
  const [logo, setLogo] = useState<string | null>(null)

  // Download state
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const qrRef = useRef<HTMLDivElement>(null)
  const qrCodeRef = useRef<QRCodeStylingType | null>(null)
  const [QRCodeStyling, setQRCodeStyling] = useState<typeof QRCodeStylingType | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getQRData = () => {
    switch (selectedType) {
      case 'website':
        return formData.url || 'https://example.com'
      case 'email':
        return `mailto:${formData.email || 'example@email.com'}?subject=${encodeURIComponent(formData.subject || '')}&body=${encodeURIComponent(formData.body || '')}`
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${formData.name || 'Jan Kowalski'}\nTEL:${formData.phone || ''}\nEMAIL:${formData.email || ''}\nORG:${formData.company || ''}\nEND:VCARD`
      case 'wifi':
        return `WIFI:T:${formData.encryption || 'WPA'};S:${formData.ssid || 'NetworkName'};P:${formData.password || ''};H:${formData.hidden === 'true' ? 'true' : 'false'};;`
      case 'facebook':
        return `https://facebook.com/${formData.username || ''}`
      case 'instagram':
        return `https://instagram.com/${formData.username || ''}`
      case 'twitter':
        return `https://twitter.com/${formData.username || ''}`
      case 'bitcoin':
        return `bitcoin:${formData.address || ''}${formData.amount ? `?amount=${formData.amount}` : ''}`
      default:
        return formData.url || 'https://example.com'
    }
  }

  const isFormValid = () => {
    switch (selectedType) {
      case 'website':
        return !!formData.url
      case 'email':
        return !!formData.email
      case 'vcard':
        return !!formData.name
      case 'wifi':
        return !!formData.ssid
      case 'facebook':
      case 'instagram':
      case 'twitter':
        return !!formData.username
      case 'bitcoin':
        return !!formData.address
      default:
        return !!formData.url
    }
  }

  
  // Load QR code styling library (client-side only)
  useEffect(() => {
    import('qr-code-styling').then((module) => {
      setQRCodeStyling(() => module.default)
    })
  }, [])

  // Helper function to create gradient or color options
  const getDotsOptions = () => {
    if (dotGradient) {
      return {
        type: dotShape,
        gradient: {
          type: 'linear' as const,
          rotation: 45,
          colorStops: [
            { offset: 0, color: dotGradientColors[0] },
            { offset: 1, color: dotGradientColors[1] }
          ]
        }
      }
    }
    return { color: dotColor, type: dotShape }
  }

  const getCornerSquareOptions = () => {
    if (cornerSquareGradient) {
      return {
        type: cornerSquareShape,
        gradient: {
          type: 'linear' as const,
          rotation: 45,
          colorStops: [
            { offset: 0, color: cornerSquareGradientColors[0] },
            { offset: 1, color: cornerSquareGradientColors[1] }
          ]
        }
      }
    }
    return { color: cornerSquareColor, type: cornerSquareShape }
  }

  const getCornerDotOptions = () => {
    if (cornerDotGradient) {
      return {
        type: cornerDotShape,
        gradient: {
          type: 'linear' as const,
          rotation: 45,
          colorStops: [
            { offset: 0, color: cornerDotGradientColors[0] },
            { offset: 1, color: cornerDotGradientColors[1] }
          ]
        }
      }
    }
    return { color: cornerDotColor, type: cornerDotShape }
  }

  // Initialize QR code
  useEffect(() => {
    if (!QRCodeStyling || !qrRef.current) return

    qrCodeRef.current = new QRCodeStyling({
      width: 200,
      height: 200,
      type: 'svg',
      data: getQRData(),
      dotsOptions: getDotsOptions(),
      cornersSquareOptions: getCornerSquareOptions(),
      cornersDotOptions: getCornerDotOptions(),
      backgroundOptions: { color: backgroundColor },
      imageOptions: { crossOrigin: 'anonymous', margin: 8, imageSize: 0.35 },
    })
    qrRef.current.innerHTML = ''
    qrCodeRef.current.append(qrRef.current)
  }, [QRCodeStyling])

  // Update QR code
  useEffect(() => {
    if (qrCodeRef.current) {
      qrCodeRef.current.update({
        data: getQRData(),
        dotsOptions: getDotsOptions(),
        cornersSquareOptions: getCornerSquareOptions(),
        cornersDotOptions: getCornerDotOptions(),
        backgroundOptions: { color: backgroundColor },
        image: logo || undefined,
      })
    }
  }, [formData, selectedType, dotColor, dotGradient, dotGradientColors, backgroundColor, cornerSquareColor, cornerSquareGradient, cornerSquareGradientColors, cornerDotColor, cornerDotGradient, cornerDotGradientColors, dotShape, cornerSquareShape, cornerDotShape, logo])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => setLogo(event.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleDownloadClick = () => {
    if (!isFormValid()) {
      return
    }
    setShowEmailCapture(true)
    setSendStatus('idle')
  }

  const handleSendToEmail = async () => {
    if (!userEmail.trim() || !userEmail.includes('@')) return
    setIsSending(true)
    setSendStatus('idle')
    try {
      const qrBlob = await qrCodeRef.current?.getRawData('png')
      if (!qrBlob) throw new Error('Failed to generate QR')
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(qrBlob as Blob)
      })
      const response = await fetch('/api/send-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, qrCodeBase64: base64, url: getQRData() }),
      })
      setSendStatus(response.ok ? 'success' : 'error')
    } catch {
      setSendStatus('error')
    } finally {
      setIsSending(false)
    }
  }

  const currentFrame = frameTemplates.find(f => f.id === selectedFrame)
  const tabs: { id: TabType; label: string }[] = [
    { id: 'sticker', label: 'RAMKA' },
    { id: 'color', label: 'KOLOR' },
    { id: 'shape', label: 'KSZTAŁT' },
    { id: 'edges', label: 'KRAWĘDZIE' },
    { id: 'logo', label: 'LOGO' },
  ]

  const renderForm = () => {
    const inputClass = "w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-white text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--success)] focus:border-transparent transition-all"

    switch (selectedType) {
      case 'website':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Adres URL strony</label>
              <input type="url" value={formData.url || ''} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://twoja-strona.pl" className={inputClass} />
            </div>
          </div>
        )
      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Adres e-mail</label>
              <input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="kontakt@firma.pl" className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Temat (opcjonalnie)</label>
                <input type="text" value={formData.subject || ''} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="Temat wiadomości" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Treść (opcjonalnie)</label>
                <input type="text" value={formData.body || ''} onChange={(e) => setFormData({ ...formData, body: e.target.value })} placeholder="Treść wiadomości" className={inputClass} />
              </div>
            </div>
          </div>
        )
      case 'vcard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Imię i nazwisko *</label>
                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Jan Kowalski" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Firma</label>
                <input type="text" value={formData.company || ''} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="Nazwa firmy" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Telefon</label>
                <input type="tel" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+48 123 456 789" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">E-mail</label>
                <input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="jan@firma.pl" className={inputClass} />
              </div>
            </div>
          </div>
        )
      case 'wifi':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Nazwa sieci (SSID) *</label>
                <input type="text" value={formData.ssid || ''} onChange={(e) => setFormData({ ...formData, ssid: e.target.value })} placeholder="MojaSiec" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Hasło</label>
                <input type="text" value={formData.password || ''} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="haslo123" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Szyfrowanie</label>
              <select value={formData.encryption || 'WPA'} onChange={(e) => setFormData({ ...formData, encryption: e.target.value })} className={inputClass}>
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Brak hasła</option>
              </select>
            </div>
          </div>
        )
      case 'facebook':
      case 'instagram':
      case 'twitter':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Nazwa użytkownika *</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-[var(--border)] bg-[var(--background-surface)] text-[var(--foreground-muted)] text-sm">@</span>
                <input type="text" value={formData.username || ''} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="twoj_profil" className={`${inputClass} rounded-l-none`} />
              </div>
            </div>
          </div>
        )
      case 'bitcoin':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Adres Bitcoin *</label>
              <input type="text" value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Kwota (opcjonalnie)</label>
              <input type="text" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="0.001" className={inputClass} />
            </div>
          </div>
        )
      default:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5">Link URL *</label>
              <input type="url" value={formData.url || ''} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://..." className={inputClass} />
            </div>
          </div>
        )
    }
  }

  return (
    <section className="pt-24 pb-16 sm:pt-28 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
            <span className="text-[var(--foreground)]">Darmowy generator </span>
            <span className="gradient-text">kodów QR</span>
          </h1>
        </div>

        {/* QR Type Selector - Scrollable on mobile */}
        <div className="mb-6 -mx-4 sm:mx-0">
          <div className="flex gap-2 overflow-x-auto px-4 sm:px-0 pb-2 sm:pb-0 sm:flex-wrap sm:justify-center scrollbar-hide">
            {qrTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => { setSelectedType(type.id); setFormData({}) }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedType === type.id
                    ? 'border-[var(--success)] text-[var(--success)] bg-[var(--success)]/5'
                    : 'border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--border-hover)] bg-white'
                }`}
              >
                <TypeIcon type={type.icon} className={`w-4 h-4 ${selectedType === type.id ? 'text-[var(--success)]' : ''}`} />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generator Card */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-[var(--border)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column */}
              <div className="lg:col-span-8 p-6 lg:p-8 space-y-6">
                {/* Section 1: Content */}
                <div>
                  <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                    {typeContent[selectedType].title}
                  </h2>
                  <p className="text-[var(--foreground-muted)] mb-4">
                    {typeContent[selectedType].subtitle}
                  </p>

                  <div className="animate-fade-in-up">
                    {renderForm()}
                  </div>
                </div>

                {/* Section 2: Customization */}
                <div className="pt-6 border-t border-[var(--border)]">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--warning)] text-white text-sm font-bold">2</span>
                    <h2 className="text-lg font-semibold text-[var(--foreground)]">Zaprojektuj kod QR <span className="text-[var(--foreground-muted)] font-normal">(opcjonalnie)</span></h2>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-[var(--border)] mb-4">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
                          activeTab === tab.id
                            ? 'border-[var(--primary)] text-[var(--primary)] font-semibold'
                            : 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-[160px]">
                    {activeTab === 'sticker' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 gap-2">
                          {frameTemplates.map((frame) => (
                            <button
                              key={frame.id}
                              onClick={() => {
                                setSelectedFrame(frame.id)
                                if (frame.text) setFrameText(frame.text)
                              }}
                              className={`aspect-square rounded-lg border-2 p-1.5 transition-all flex items-center justify-center ${
                                selectedFrame === frame.id
                                  ? 'border-[var(--success)] bg-[var(--success)]/5'
                                  : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                              }`}
                              title={frame.label}
                            >
                              <FramePreviewIcon frameId={frame.id} className="w-full h-full" />
                            </button>
                          ))}
                        </div>
                        {selectedFrame !== 'none' && (
                          <div>
                            <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">Tekst ramki</label>
                            <input
                              type="text"
                              value={frameText}
                              onChange={(e) => setFrameText(e.target.value.toUpperCase())}
                              placeholder="SCAN ME"
                              maxLength={20}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--success)]"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'color' && (
                      <div className="space-y-3">
                        {/* Toggle gradient */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setDotGradient(false)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                              !dotGradient
                                ? 'bg-[var(--primary)] text-white'
                                : 'bg-[var(--background-surface)] text-[var(--foreground-muted)] hover:bg-[var(--border)]'
                            }`}
                          >
                            Kolor
                          </button>
                          <button
                            onClick={() => setDotGradient(true)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                              dotGradient
                                ? 'bg-[var(--primary)] text-white'
                                : 'bg-[var(--background-surface)] text-[var(--foreground-muted)] hover:bg-[var(--border)]'
                            }`}
                          >
                            Gradient
                          </button>
                        </div>

                        {!dotGradient ? (
                          <>
                            {/* Górny rząd: color picker + 8 kolorów */}
                            <div className="flex gap-2">
                              <label className="relative w-9 h-9 rounded-lg cursor-pointer overflow-hidden border-2 border-[var(--border)] hover:border-[var(--border-hover)] transition-all flex-shrink-0">
                                <div className="w-full h-full" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} />
                                <input
                                  type="color"
                                  value={dotColor}
                                  onChange={(e) => setDotColor(e.target.value)}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                              </label>
                              {colorPaletteTop.map((color) => (
                                <button
                                  key={color}
                                  onClick={() => setDotColor(color)}
                                  className={`w-9 h-9 rounded-lg border-2 transition-all flex-shrink-0 ${
                                    dotColor === color ? 'border-gray-800 ring-1 ring-gray-400' : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            {/* Dolny rząd: 5 kolorów */}
                            <div className="flex gap-2">
                              {colorPaletteBottom.map((color) => (
                                <button
                                  key={color}
                                  onClick={() => setDotColor(color)}
                                  className={`w-9 h-9 rounded-lg border-2 transition-all flex-shrink-0 ${
                                    dotColor === color ? 'border-gray-800 ring-1 ring-gray-400' : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="space-y-3">
                            {/* Gradient preview */}
                            <div
                              className="h-8 rounded-lg border border-[var(--border)]"
                              style={{ background: `linear-gradient(90deg, ${dotGradientColors[0]}, ${dotGradientColors[1]})` }}
                            />
                            {/* Kolor 1 */}
                            <div>
                              <p className="text-xs text-[var(--foreground-muted)] mb-1">Kolor 1</p>
                              <div className="flex gap-1.5 flex-wrap">
                                <label className="relative w-7 h-7 rounded-md cursor-pointer overflow-hidden border-2 border-[var(--border)] hover:border-[var(--border-hover)] transition-all flex-shrink-0">
                                  <div className="w-full h-full" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} />
                                  <input type="color" value={dotGradientColors[0]} onChange={(e) => setDotGradientColors([e.target.value, dotGradientColors[1]])} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                </label>
                                {[...colorPaletteTop, ...colorPaletteBottom].map((color) => (
                                  <button
                                    key={`g1-${color}`}
                                    onClick={() => setDotGradientColors([color, dotGradientColors[1]])}
                                    className={`w-7 h-7 rounded-md border-2 transition-all flex-shrink-0 ${
                                      dotGradientColors[0] === color ? 'border-gray-800 ring-1 ring-gray-400' : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                                    }`}
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                            </div>
                            {/* Kolor 2 */}
                            <div>
                              <p className="text-xs text-[var(--foreground-muted)] mb-1">Kolor 2</p>
                              <div className="flex gap-1.5 flex-wrap">
                                <label className="relative w-7 h-7 rounded-md cursor-pointer overflow-hidden border-2 border-[var(--border)] hover:border-[var(--border-hover)] transition-all flex-shrink-0">
                                  <div className="w-full h-full" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} />
                                  <input type="color" value={dotGradientColors[1]} onChange={(e) => setDotGradientColors([dotGradientColors[0], e.target.value])} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                </label>
                                {[...colorPaletteTop, ...colorPaletteBottom].map((color) => (
                                  <button
                                    key={`g2-${color}`}
                                    onClick={() => setDotGradientColors([dotGradientColors[0], color])}
                                    className={`w-7 h-7 rounded-md border-2 transition-all flex-shrink-0 ${
                                      dotGradientColors[1] === color ? 'border-gray-800 ring-1 ring-gray-400' : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                                    }`}
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'shape' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {dotShapes.map((shape) => (
                            <button
                              key={shape.id}
                              onClick={() => setDotShape(shape.id)}
                              className={`aspect-square rounded-lg border-2 p-2 transition-all flex items-center justify-center ${
                                dotShape === shape.id
                                  ? 'border-[var(--success)] bg-[var(--success)]/5'
                                  : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                              }`}
                              title={shape.label}
                            >
                              <DotShapePreview shapeId={shape.id} />
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-[var(--foreground-muted)]">
                          Wybrany: <span className="font-medium">{dotShapes.find(s => s.id === dotShape)?.label}</span>
                        </p>
                      </div>
                    )}

                    {activeTab === 'edges' && (
                      <div className="space-y-4">
                        {/* Ramka narożnika */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-[var(--foreground-muted)]">Ramka narożnika</p>
                            <div className="flex gap-1">
                              <button
                                onClick={() => setCornerSquareGradient(false)}
                                className={`px-2 py-0.5 text-[10px] font-medium rounded transition-all ${
                                  !cornerSquareGradient ? 'bg-[var(--primary)] text-white' : 'bg-[var(--background-surface)] text-[var(--foreground-muted)]'
                                }`}
                              >
                                Kolor
                              </button>
                              <button
                                onClick={() => setCornerSquareGradient(true)}
                                className={`px-2 py-0.5 text-[10px] font-medium rounded transition-all ${
                                  cornerSquareGradient ? 'bg-[var(--primary)] text-white' : 'bg-[var(--background-surface)] text-[var(--foreground-muted)]'
                                }`}
                              >
                                Gradient
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-2 mb-2">
                            {cornerSquareShapes.map((shape) => (
                              <button
                                key={shape.id}
                                onClick={() => setCornerSquareShape(shape.id)}
                                className={`w-10 h-10 rounded-lg border-2 p-1.5 transition-all flex items-center justify-center ${
                                  cornerSquareShape === shape.id
                                    ? 'border-[var(--success)] bg-[var(--success)]/5'
                                    : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                                }`}
                                title={shape.label}
                              >
                                <CornerSquareShapePreview shapeId={shape.id} />
                              </button>
                            ))}
                          </div>
                          {!cornerSquareGradient ? (
                            <div className="flex gap-1.5 flex-wrap">
                              <label className="relative w-7 h-7 rounded-md cursor-pointer overflow-hidden border-2 border-[var(--border)] hover:border-[var(--border-hover)] transition-all flex-shrink-0">
                                <div className="w-full h-full" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} />
                                <input type="color" value={cornerSquareColor} onChange={(e) => setCornerSquareColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                              </label>
                              {[...colorPaletteTop, ...colorPaletteBottom].map((color) => (
                                <button
                                  key={`csq-${color}`}
                                  onClick={() => setCornerSquareColor(color)}
                                  className={`w-7 h-7 rounded-md border-2 transition-all flex-shrink-0 ${
                                    cornerSquareColor === color ? 'border-gray-800 ring-1 ring-gray-400' : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="h-6 rounded border border-[var(--border)]" style={{ background: `linear-gradient(90deg, ${cornerSquareGradientColors[0]}, ${cornerSquareGradientColors[1]})` }} />
                              <div className="flex gap-1.5 flex-wrap">
                                <label className="relative w-6 h-6 rounded cursor-pointer overflow-hidden border border-[var(--border)]">
                                  <div className="w-full h-full" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} />
                                  <input type="color" value={cornerSquareGradientColors[0]} onChange={(e) => setCornerSquareGradientColors([e.target.value, cornerSquareGradientColors[1]])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </label>
                                {[...colorPaletteTop.slice(0, 5), ...colorPaletteBottom.slice(0, 3)].map((color) => (
                                  <button key={`csqg1-${color}`} onClick={() => setCornerSquareGradientColors([color, cornerSquareGradientColors[1]])} className={`w-6 h-6 rounded border ${cornerSquareGradientColors[0] === color ? 'border-gray-800' : 'border-[var(--border)]'}`} style={{ backgroundColor: color }} />
                                ))}
                                <span className="text-[10px] text-[var(--foreground-subtle)] self-center mx-1">→</span>
                                <label className="relative w-6 h-6 rounded cursor-pointer overflow-hidden border border-[var(--border)]">
                                  <div className="w-full h-full" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} />
                                  <input type="color" value={cornerSquareGradientColors[1]} onChange={(e) => setCornerSquareGradientColors([cornerSquareGradientColors[0], e.target.value])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </label>
                                {[...colorPaletteTop.slice(0, 5), ...colorPaletteBottom.slice(0, 3)].map((color) => (
                                  <button key={`csqg2-${color}`} onClick={() => setCornerSquareGradientColors([cornerSquareGradientColors[0], color])} className={`w-6 h-6 rounded border ${cornerSquareGradientColors[1] === color ? 'border-gray-800' : 'border-[var(--border)]'}`} style={{ backgroundColor: color }} />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Środek narożnika */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-[var(--foreground-muted)]">Środek narożnika</p>
                            <div className="flex gap-1">
                              <button
                                onClick={() => setCornerDotGradient(false)}
                                className={`px-2 py-0.5 text-[10px] font-medium rounded transition-all ${
                                  !cornerDotGradient ? 'bg-[var(--primary)] text-white' : 'bg-[var(--background-surface)] text-[var(--foreground-muted)]'
                                }`}
                              >
                                Kolor
                              </button>
                              <button
                                onClick={() => setCornerDotGradient(true)}
                                className={`px-2 py-0.5 text-[10px] font-medium rounded transition-all ${
                                  cornerDotGradient ? 'bg-[var(--primary)] text-white' : 'bg-[var(--background-surface)] text-[var(--foreground-muted)]'
                                }`}
                              >
                                Gradient
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-2 mb-2">
                            {cornerDotShapes.map((shape) => (
                              <button
                                key={shape.id}
                                onClick={() => setCornerDotShape(shape.id)}
                                className={`w-10 h-10 rounded-lg border-2 p-1.5 transition-all flex items-center justify-center ${
                                  cornerDotShape === shape.id
                                    ? 'border-[var(--success)] bg-[var(--success)]/5'
                                    : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                                }`}
                                title={shape.label}
                              >
                                <CornerDotShapePreview shapeId={shape.id} />
                              </button>
                            ))}
                          </div>
                          {!cornerDotGradient ? (
                            <div className="flex gap-1.5 flex-wrap">
                              <label className="relative w-7 h-7 rounded-md cursor-pointer overflow-hidden border-2 border-[var(--border)] hover:border-[var(--border-hover)] transition-all flex-shrink-0">
                                <div className="w-full h-full" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} />
                                <input type="color" value={cornerDotColor} onChange={(e) => setCornerDotColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                              </label>
                              {[...colorPaletteTop, ...colorPaletteBottom].map((color) => (
                                <button
                                  key={`cd-${color}`}
                                  onClick={() => setCornerDotColor(color)}
                                  className={`w-7 h-7 rounded-md border-2 transition-all flex-shrink-0 ${
                                    cornerDotColor === color ? 'border-gray-800 ring-1 ring-gray-400' : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="h-6 rounded border border-[var(--border)]" style={{ background: `linear-gradient(90deg, ${cornerDotGradientColors[0]}, ${cornerDotGradientColors[1]})` }} />
                              <div className="flex gap-1.5 flex-wrap">
                                <label className="relative w-6 h-6 rounded cursor-pointer overflow-hidden border border-[var(--border)]">
                                  <div className="w-full h-full" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} />
                                  <input type="color" value={cornerDotGradientColors[0]} onChange={(e) => setCornerDotGradientColors([e.target.value, cornerDotGradientColors[1]])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </label>
                                {[...colorPaletteTop.slice(0, 5), ...colorPaletteBottom.slice(0, 3)].map((color) => (
                                  <button key={`cdg1-${color}`} onClick={() => setCornerDotGradientColors([color, cornerDotGradientColors[1]])} className={`w-6 h-6 rounded border ${cornerDotGradientColors[0] === color ? 'border-gray-800' : 'border-[var(--border)]'}`} style={{ backgroundColor: color }} />
                                ))}
                                <span className="text-[10px] text-[var(--foreground-subtle)] self-center mx-1">→</span>
                                <label className="relative w-6 h-6 rounded cursor-pointer overflow-hidden border border-[var(--border)]">
                                  <div className="w-full h-full" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} />
                                  <input type="color" value={cornerDotGradientColors[1]} onChange={(e) => setCornerDotGradientColors([cornerDotGradientColors[0], e.target.value])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </label>
                                {[...colorPaletteTop.slice(0, 5), ...colorPaletteBottom.slice(0, 3)].map((color) => (
                                  <button key={`cdg2-${color}`} onClick={() => setCornerDotGradientColors([cornerDotGradientColors[0], color])} className={`w-6 h-6 rounded border ${cornerDotGradientColors[1] === color ? 'border-gray-800' : 'border-[var(--border)]'}`} style={{ backgroundColor: color }} />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'logo' && (
                      <div className="space-y-4">
                        {/* Predefiniowane loga */}
                        <div>
                          <p className="text-xs font-medium text-[var(--foreground-muted)] mb-2">Popularne marki</p>
                          <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
                            {brandLogos.map((brand) => (
                              <button
                                key={brand.id}
                                onClick={() => setLogo(brand.svg)}
                                className={`aspect-square rounded-lg border-2 p-2 transition-all flex items-center justify-center ${
                                  logo === brand.svg
                                    ? 'border-[var(--success)] bg-[var(--success)]/5'
                                    : 'border-[var(--border)] hover:border-[var(--border-hover)] bg-white'
                                }`}
                                title={brand.name}
                              >
                                <img src={brand.svg} alt={brand.name} className="w-6 h-6 object-contain" />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Upload własnego logo */}
                        <div>
                          <p className="text-xs font-medium text-[var(--foreground-muted)] mb-2">Własne logo</p>
                          {!logo || brandLogos.some(b => b.svg === logo) ? (
                            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-[var(--border)] rounded-xl cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--primary-muted)] transition-all">
                              <UploadIcon className="w-5 h-5 text-[var(--foreground-muted)] mb-1" />
                              <span className="text-xs text-[var(--foreground-muted)]">Dodaj własne logo</span>
                              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                            </label>
                          ) : (
                            <div className="flex items-center gap-3 p-3 bg-[var(--background-surface)] rounded-xl">
                              <img src={logo} alt="Logo" className="w-10 h-10 object-contain rounded-lg border border-[var(--border)]" />
                              <div className="flex-1">
                                <p className="text-xs font-medium text-[var(--foreground)]">Własne logo</p>
                                <button onClick={() => { setLogo(null); if (fileInputRef.current) fileInputRef.current.value = '' }} className="text-xs text-[var(--error)] hover:underline">Usuń</button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Usuń logo */}
                        {logo && (
                          <button
                            onClick={() => { setLogo(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                            className="w-full py-2 text-xs text-[var(--foreground-muted)] hover:text-[var(--error)] transition-colors"
                          >
                            Usuń logo
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Preview */}
              <div className="lg:col-span-4 p-6 lg:p-8 bg-[var(--background-surface)] border-t lg:border-t-0 lg:border-l border-[var(--border)] lg:sticky lg:top-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--success)] text-white text-sm font-bold">3</span>
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">Pobierz swój kod QR</h2>
                </div>

                {/* QR Preview */}
                <div className="flex items-center justify-center mb-6">
                  <QRFrameWrapper frameStyle={selectedFrame} text={frameText} dotColor={dotColor}>
                    <div ref={qrRef} className="w-[180px] h-[180px] flex items-center justify-center" />
                  </QRFrameWrapper>
                </div>

                {/* Download */}
                {!showEmailCapture ? (
                  <Button
                    variant="gradient"
                    size="lg"
                    className={`w-full ${!isFormValid() ? 'opacity-50' : ''}`}
                    style={{ background: isFormValid() ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : '#9ca3af' }}
                    onClick={handleDownloadClick}
                    disabled={!isFormValid()}
                  >
                    {isFormValid() ? 'Pobierz QR' : 'Wypełnij formularz'}
                  </Button>
                ) : (
                  <div className="space-y-3 animate-fade-in-up">
                    {sendStatus === 'success' ? (
                      <div className="text-center p-4 bg-[var(--success)]/10 rounded-xl">
                        <CheckIcon className="w-8 h-8 text-[var(--success)] mx-auto mb-2" />
                        <p className="text-sm font-medium text-[var(--success)]">Wysłano na {userEmail}!</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-[var(--foreground-muted)] text-center">Podaj e-mail, aby otrzymać kod QR</p>
                        <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="twoj@email.com" className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-white text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--success)]" />
                        <Button variant="gradient" size="lg" className="w-full" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }} onClick={handleSendToEmail} disabled={isSending || !userEmail.includes('@')}>
                          {isSending ? 'Wysyłanie...' : 'Wyślij na e-mail'}
                        </Button>
                        {sendStatus === 'error' && <p className="text-xs text-[var(--error)] text-center">Błąd. Spróbuj ponownie.</p>}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Icons
function CheckIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
}

function UploadIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
}

function DotShapePreview({ shapeId }: { shapeId: DotShape }) {
  const shapes: Record<DotShape, React.ReactNode> = {
    square: (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <rect x="4" y="4" width="10" height="10" fill="currentColor" />
        <rect x="18" y="4" width="10" height="10" fill="currentColor" />
        <rect x="4" y="18" width="10" height="10" fill="currentColor" />
        <rect x="26" y="18" width="10" height="10" fill="currentColor" />
        <rect x="11" y="26" width="10" height="10" fill="currentColor" />
        <rect x="26" y="26" width="10" height="10" fill="currentColor" />
      </svg>
    ),
    dots: (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <circle cx="9" cy="9" r="5" fill="currentColor" />
        <circle cx="23" cy="9" r="5" fill="currentColor" />
        <circle cx="9" cy="23" r="5" fill="currentColor" />
        <circle cx="31" cy="23" r="5" fill="currentColor" />
        <circle cx="16" cy="31" r="5" fill="currentColor" />
        <circle cx="31" cy="31" r="5" fill="currentColor" />
      </svg>
    ),
    rounded: (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <rect x="4" y="4" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="18" y="4" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="4" y="18" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="26" y="18" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="11" y="26" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="26" y="26" width="10" height="10" rx="2" fill="currentColor" />
      </svg>
    ),
    'extra-rounded': (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <rect x="4" y="4" width="10" height="10" rx="4" fill="currentColor" />
        <rect x="18" y="4" width="10" height="10" rx="4" fill="currentColor" />
        <rect x="4" y="18" width="10" height="10" rx="4" fill="currentColor" />
        <rect x="26" y="18" width="10" height="10" rx="4" fill="currentColor" />
        <rect x="11" y="26" width="10" height="10" rx="4" fill="currentColor" />
        <rect x="26" y="26" width="10" height="10" rx="4" fill="currentColor" />
      </svg>
    ),
    classy: (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <path d="M4 4h10v10H4z" fill="currentColor" />
        <path d="M18 4h10v6a4 4 0 01-4 4h-6V4z" fill="currentColor" />
        <path d="M4 18h6a4 4 0 014 4v6H4V18z" fill="currentColor" />
        <path d="M26 18h10v10H26z" fill="currentColor" />
        <path d="M11 26h10v10H11z" fill="currentColor" />
        <path d="M26 26h10v10H26z" fill="currentColor" />
      </svg>
    ),
    'classy-rounded': (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <rect x="4" y="4" width="10" height="10" rx="2" fill="currentColor" />
        <path d="M18 6a2 2 0 012-2h6a2 2 0 012 2v4a6 6 0 01-6 6h-2a2 2 0 01-2-2V6z" fill="currentColor" />
        <path d="M6 18a2 2 0 00-2 2v6a2 2 0 002 2h4a6 6 0 006-6v-2a2 2 0 00-2-2H6z" fill="currentColor" />
        <rect x="26" y="18" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="11" y="26" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="26" y="26" width="10" height="10" rx="2" fill="currentColor" />
      </svg>
    ),
  }
  return shapes[shapeId] || shapes.square
}

function CornerSquareShapePreview({ shapeId }: { shapeId: CornerSquareShape }) {
  const shapes: Record<CornerSquareShape, React.ReactNode> = {
    square: (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <rect x="4" y="4" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="6" />
      </svg>
    ),
    dot: (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="6" />
      </svg>
    ),
    'extra-rounded': (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <rect x="4" y="4" width="32" height="32" rx="10" fill="none" stroke="currentColor" strokeWidth="6" />
      </svg>
    ),
  }
  return shapes[shapeId] || shapes.square
}

function CornerDotShapePreview({ shapeId }: { shapeId: CornerDotShape }) {
  const shapes: Record<CornerDotShape, React.ReactNode> = {
    square: (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <rect x="10" y="10" width="20" height="20" fill="currentColor" />
      </svg>
    ),
    dot: (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <circle cx="20" cy="20" r="10" fill="currentColor" />
      </svg>
    ),
  }
  return shapes[shapeId] || shapes.square
}

function TypeIcon({ type, className }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    globe: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.916 17.916 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />,
    file: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />,
    mail: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />,
    share: <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />,
    user: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />,
    wifi: <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />,
    download: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />,
    play: <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />,
    facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    instagram: <><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></>,
    twitter: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />,
    bitcoin: <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />,
    music: <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />,
  }
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">{icons[type]}</svg>
}

function FramePreviewIcon({ frameId, className }: { frameId: string; className?: string }) {
  const frames: Record<string, React.ReactNode> = {
    none: (
      <>
        <rect x="8" y="8" width="24" height="24" fill="#e5e7eb" rx="2" />
        <line x1="6" y1="6" x2="34" y2="34" stroke="#9ca3af" strokeWidth="2" />
      </>
    ),
    simple: (
      <>
        <rect x="4" y="4" width="32" height="32" stroke="#000" strokeWidth="2" fill="white" />
        <rect x="10" y="10" width="20" height="20" fill="#e5e7eb" rx="1" />
      </>
    ),
    rounded: (
      <>
        <rect x="4" y="4" width="32" height="32" rx="6" stroke="#000" strokeWidth="2" fill="white" />
        <rect x="10" y="10" width="20" height="20" fill="#e5e7eb" rx="2" />
      </>
    ),
    'badge-top': (
      <>
        <rect x="4" y="10" width="32" height="26" stroke="#000" strokeWidth="2" fill="white" />
        <rect x="10" y="4" width="20" height="8" fill="#000" rx="2" />
        <rect x="10" y="16" width="20" height="16" fill="#e5e7eb" rx="1" />
      </>
    ),
    'badge-bottom': (
      <>
        <rect x="4" y="4" width="32" height="26" stroke="#000" strokeWidth="2" fill="white" />
        <rect x="10" y="28" width="20" height="8" fill="#000" rx="2" />
        <rect x="10" y="8" width="20" height="16" fill="#e5e7eb" rx="1" />
      </>
    ),
    bubble: (
      <>
        <rect x="4" y="4" width="32" height="28" rx="8" stroke="#000" strokeWidth="2" fill="white" />
        <polygon points="20,32 16,36 24,36" fill="#000" />
        <rect x="10" y="8" width="20" height="18" fill="#e5e7eb" rx="2" />
      </>
    ),
    pointer: (
      <>
        <rect x="4" y="8" width="32" height="28" stroke="#000" strokeWidth="2" fill="white" />
        <polygon points="20,8 16,2 24,2" fill="#000" />
        <rect x="10" y="14" width="20" height="16" fill="#e5e7eb" rx="1" />
      </>
    ),
    ticket: (
      <>
        <path d="M4 10 Q4 4 10 4 L30 4 Q36 4 36 10 L36 30 Q36 36 30 36 L10 36 Q4 36 4 30 Z" stroke="#000" strokeWidth="2" fill="white" strokeDasharray="4 2" />
        <rect x="10" y="10" width="20" height="20" fill="#e5e7eb" rx="1" />
      </>
    ),
    stamp: (
      <>
        <circle cx="20" cy="20" r="16" stroke="#000" strokeWidth="2" fill="white" />
        <circle cx="20" cy="20" r="12" stroke="#000" strokeWidth="1" fill="none" strokeDasharray="2 2" />
        <rect x="12" y="12" width="16" height="16" fill="#e5e7eb" rx="1" />
      </>
    ),
    ribbon: (
      <>
        <rect x="4" y="8" width="32" height="28" stroke="#000" strokeWidth="2" fill="white" />
        <path d="M8 4 L32 4 L32 12 L20 8 L8 12 Z" fill="#000" />
        <rect x="10" y="14" width="20" height="16" fill="#e5e7eb" rx="1" />
      </>
    ),
    chat: (
      <>
        <path d="M4 4 L36 4 L36 28 L24 28 L20 36 L16 28 L4 28 Z" stroke="#000" strokeWidth="2" fill="white" />
        <rect x="10" y="8" width="20" height="16" fill="#e5e7eb" rx="1" />
      </>
    ),
    hexagon: (
      <>
        <polygon points="20,2 36,10 36,30 20,38 4,30 4,10" stroke="#000" strokeWidth="2" fill="white" />
        <rect x="10" y="12" width="20" height="16" fill="#e5e7eb" rx="1" />
      </>
    ),
  }
  return <svg className={className} viewBox="0 0 40 40" fill="none">{frames[frameId] || frames.none}</svg>
}

function QRFrameWrapper({
  frameStyle,
  text,
  dotColor,
  children
}: {
  frameStyle: FrameStyle
  text: string
  dotColor: string
  children: React.ReactNode
}) {
  // Completely stable structure - children ALWAYS at the exact same DOM position
  // Only CSS changes, never the structure

  const isNone = frameStyle === 'none'
  const hasColoredBorder = ['simple', 'rounded', 'ticket'].includes(frameStyle)
  const showBottomText = ['simple', 'rounded', 'ticket', 'pointer', 'hexagon', 'bubble'].includes(frameStyle)

  // Outer wrapper styles based on frame type
  const getOuterStyle = (): React.CSSProperties => {
    if (isNone) return {}
    if (hasColoredBorder) return { backgroundColor: dotColor }
    if (frameStyle === 'stamp') return { borderColor: dotColor }
    return {}
  }

  const getOuterClasses = () => {
    if (isNone) return 'shadow-lg'
    if (frameStyle === 'simple') return 'p-1 shadow-lg'
    if (frameStyle === 'rounded') return 'p-1 shadow-lg rounded-2xl'
    if (frameStyle === 'ticket') return 'p-1 shadow-lg rounded-xl relative'
    if (frameStyle === 'stamp') return 'p-3 shadow-lg rounded-full border-4 border-dashed'
    return 'shadow-lg'
  }

  // Inner container (QR holder) styles
  const getInnerClasses = () => {
    const base = 'bg-white flex items-center justify-center'
    if (isNone) return `${base} rounded-xl p-4 border border-[var(--border)]`
    if (frameStyle === 'simple') return `${base} p-3`
    if (frameStyle === 'rounded') return `${base} rounded-xl p-3`
    if (frameStyle === 'badge-top') return `${base} rounded-b-xl rounded-t-none p-4 border-2`
    if (frameStyle === 'badge-bottom') return `${base} rounded-t-xl rounded-b-none p-4 border-2`
    if (frameStyle === 'bubble') return `${base} rounded-2xl p-4 border-2`
    if (frameStyle === 'pointer') return `${base} rounded-xl p-4 border-2`
    if (frameStyle === 'ticket') return `${base} rounded-lg p-3`
    if (frameStyle === 'stamp') return `${base} rounded-lg p-2`
    if (frameStyle === 'ribbon') return `${base} rounded-xl p-4 border-2`
    if (frameStyle === 'chat') return `${base} rounded-2xl rounded-bl-none p-4 border-2`
    if (frameStyle === 'hexagon') return `${base} p-3`
    return `${base} rounded-xl p-4`
  }

  const getInnerStyle = (): React.CSSProperties => {
    if (isNone || hasColoredBorder) return {}
    return { borderColor: dotColor }
  }

  return (
    <div className="relative">
      {/* Badge top - always rendered, hidden when not needed */}
      <div
        className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-t-lg text-[10px] font-bold tracking-wider text-white transition-opacity"
        style={{
          backgroundColor: dotColor,
          opacity: frameStyle === 'badge-top' ? 1 : 0,
          pointerEvents: frameStyle === 'badge-top' ? 'auto' : 'none'
        }}
      >
        {text}
      </div>

      {/* Pointer arrow - always rendered */}
      <div
        className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[12px] border-l-transparent border-r-transparent transition-opacity"
        style={{
          borderBottomColor: dotColor,
          opacity: frameStyle === 'pointer' ? 1 : 0
        }}
      />

      {/* Ribbon - always rendered */}
      <div
        className="absolute -top-5 left-1/2 -translate-x-1/2 z-10 transition-opacity"
        style={{ opacity: frameStyle === 'ribbon' ? 1 : 0, pointerEvents: frameStyle === 'ribbon' ? 'auto' : 'none' }}
      >
        <div className="relative">
          <div className="px-6 py-1 text-[10px] font-bold tracking-wider text-white" style={{ backgroundColor: dotColor }}>
            {text}
          </div>
          <div className="absolute -left-2 bottom-0 w-0 h-0 border-t-[8px] border-r-[8px] border-t-transparent" style={{ borderRightColor: dotColor, filter: 'brightness(0.7)' }} />
          <div className="absolute -right-2 bottom-0 w-0 h-0 border-t-[8px] border-l-[8px] border-t-transparent" style={{ borderLeftColor: dotColor, filter: 'brightness(0.7)' }} />
        </div>
      </div>

      {/* Main outer wrapper - stable structure */}
      <div className={getOuterClasses()} style={getOuterStyle()}>
        {/* Ticket notches - always rendered but hidden */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--background-surface)] transition-opacity"
          style={{ opacity: frameStyle === 'ticket' ? 1 : 0 }}
        />
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-[var(--background-surface)] transition-opacity"
          style={{ opacity: frameStyle === 'ticket' ? 1 : 0 }}
        />

        {/* QR Code container - ALWAYS at this exact position */}
        <div className={getInnerClasses()} style={getInnerStyle()}>
          {children}
        </div>

        {/* Bottom text for colored border frames */}
        <div
          className="text-center py-1.5 text-[10px] font-bold tracking-wider text-white transition-all"
          style={{
            opacity: hasColoredBorder ? 1 : 0,
            height: hasColoredBorder ? 'auto' : 0,
            padding: hasColoredBorder ? undefined : 0,
            overflow: 'hidden'
          }}
        >
          {text}
        </div>
      </div>

      {/* Badge bottom */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-b-lg text-[10px] font-bold tracking-wider text-white transition-opacity"
        style={{
          backgroundColor: dotColor,
          opacity: frameStyle === 'badge-bottom' ? 1 : 0,
          pointerEvents: frameStyle === 'badge-bottom' ? 'auto' : 'none'
        }}
      >
        {text}
      </div>

      {/* Bubble arrow */}
      <div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent transition-opacity"
        style={{
          borderTopColor: dotColor,
          opacity: frameStyle === 'bubble' ? 1 : 0
        }}
      />

      {/* Chat tail */}
      <div
        className="absolute -bottom-0 left-4 w-0 h-0 border-t-[12px] border-r-[12px] border-r-transparent transition-opacity"
        style={{
          borderTopColor: dotColor,
          opacity: frameStyle === 'chat' ? 1 : 0
        }}
      />

      {/* Chat text */}
      <div
        className="absolute -bottom-5 left-8 text-[10px] font-bold tracking-wider transition-opacity"
        style={{
          color: dotColor,
          opacity: frameStyle === 'chat' ? 1 : 0
        }}
      >
        {text}
      </div>

      {/* Stamp text */}
      <div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded text-[9px] font-bold tracking-wider text-white transition-opacity"
        style={{
          backgroundColor: dotColor,
          opacity: frameStyle === 'stamp' ? 1 : 0
        }}
      >
        {text}
      </div>

      {/* Bottom text for pointer, hexagon, bubble */}
      <div
        className="text-center mt-2 text-[10px] font-bold tracking-wider transition-opacity"
        style={{
          color: dotColor,
          opacity: ['pointer', 'hexagon', 'bubble'].includes(frameStyle) ? 1 : 0,
          height: ['pointer', 'hexagon', 'bubble'].includes(frameStyle) ? 'auto' : 0
        }}
      >
        {text}
      </div>
    </div>
  )
}
