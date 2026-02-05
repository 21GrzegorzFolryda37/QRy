export type Plan = 'free' | 'starter' | 'pro' | 'enterprise'

export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'trialing'
  | 'incomplete'
  | null

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  plan: Plan
  subscription_status: SubscriptionStatus
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  qr_limit: number
  monthly_scan_limit: number
  current_month_scans: number
  created_at: string
  updated_at: string
}

export interface QrCode {
  id: string
  user_id: string
  name: string
  short_code: string
  destination_url: string
  content_type?: QrCodeContentType // Optional until database column is added
  content_data?: LinkPageData | SurveyData | null // Data for linkpage/survey types
  style: QrStyle
  logo_url: string | null
  logo_size: number | null
  qr_image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  scan_count?: number
}

// Typy kodów QR (kategorie URL)
export type QrCodeContentType =
  | 'website'
  | 'facebook'
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'linkedin'
  | 'twitter'
  | 'whatsapp'
  | 'email'
  | 'phone'
  | 'sms'
  | 'wifi'
  | 'vcard'
  | 'location'
  | 'pdf'
  | 'menu'
  | 'linkpage'
  | 'survey'

// Strona linków (Link-in-bio)
export interface LinkPageLink {
  id: string
  title: string
  url: string
  icon?: string
  order: number
}

export interface LinkPageData {
  title: string
  description?: string
  avatarUrl?: string
  backgroundColor?: string
  textColor?: string
  buttonColor?: string
  buttonTextColor?: string
  links: LinkPageLink[]
}

// Ankiety
export interface SurveyQuestion {
  id: string
  question: string
  type: 'single' | 'multiple' | 'text' | 'rating'
  options?: string[]
  required: boolean
  order: number
}

export interface SurveyData {
  title: string
  description?: string
  questions: SurveyQuestion[]
  thankYouMessage?: string
  backgroundColor?: string
  textColor?: string
}

export interface SurveyResponse {
  id: string
  qr_code_id: string
  answers: Record<string, string | string[] | number>
  submitted_at: string
}

// Typy kształtów modułów QR
// Rozszerzone o kształty z @qr-platform/qr-code.js (generowane server-side)
export type DotsType =
  | 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded'  // qr-code-styling
  | 'diamond' | 'star' | 'vertical-line' | 'horizontal-line' | 'random-dot' | 'small-square' | 'tiny-square'  // @qr-platform

// Kształt całego kodu QR (maska/ramka)
export type FrameShape = 'square' | 'circle' | 'rounded' | 'heart' | 'hexagon' | 'star' | 'diamond'

// Narożniki zewnętrzne - rozszerzone o @qr-platform
export type CornersSquareType =
  | 'square' | 'dot' | 'extra-rounded'  // qr-code-styling
  | 'classy' | 'classy-rounded' | 'dotted' | 'rounded' | 'outpoint' | 'inpoint'  // @qr-platform
  | 'diagonalRounded'
  | 'threeRounded'
  | 'mixedCorners'

// Narożniki wewnętrzne - rozszerzone o @qr-platform
export type CornersDotType =
  | 'square' | 'dot'  // qr-code-styling
  | 'heart' | 'star' | 'diamond' | 'rounded' | 'classy' | 'outpoint' | 'inpoint'  // @qr-platform
export type GradientType = 'linear' | 'radial'

// Ramki dekoracyjne wokół kodu QR
export type FrameStyle =
  | 'none'
  | 'simple'
  | 'rounded'
  | 'fancy'
  | 'ticket'
  | 'badge'
  | 'minimal'

export interface FrameOptions {
  style: FrameStyle
  color: string
  gradient: GradientOptions | null
  textColor: string
  text: string
  showText: boolean
}

export interface GradientColorStop {
  offset: number
  color: string
}

export interface GradientOptions {
  type: GradientType
  rotation: number
  colorStops: GradientColorStop[]
}

export interface QrStyle {
  // Podstawowe kolory
  foregroundColor: string
  backgroundColor: string

  // Ustawienia generowania
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  margin: number
  width: number

  // Kształt całego kodu QR
  frameShape: FrameShape

  // Styl modułów (dots)
  dotsType: DotsType
  dotsGradient: GradientOptions | null

  // Styl narożników (finder patterns)
  cornersSquareType: CornersSquareType
  cornersSquareColor: string | null
  cornersSquareGradient: GradientOptions | null

  // Styl wewnętrznych kropek narożników
  cornersDotType: CornersDotType
  cornersDotColor: string | null
  cornersDotGradient: GradientOptions | null

  // Gradient tła
  backgroundGradient: GradientOptions | null

  // Ramka dekoracyjna
  frame: FrameOptions | null
}

export interface Scan {
  id: string
  qr_code_id: string
  user_id: string
  ip_address: string | null
  country: string | null
  country_code: string | null
  region: string | null
  city: string | null
  latitude: number | null
  longitude: number | null
  device_type: string | null
  browser: string | null
  browser_version: string | null
  os: string | null
  os_version: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
  referrer: string | null
  scanned_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      qr_codes: {
        Row: QrCode
        Insert: Omit<QrCode, 'id' | 'created_at' | 'updated_at' | 'scan_count'>
        Update: Partial<Omit<QrCode, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'scan_count'>>
      }
      scans: {
        Row: Scan
        Insert: Omit<Scan, 'id'>
        Update: never
      }
    }
  }
}
