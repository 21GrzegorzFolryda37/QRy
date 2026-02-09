/* eslint-disable @typescript-eslint/no-explicit-any */

// ============================================
// Google Tag Manager - Analytics Helper
// ============================================

declare global {
  interface Window {
    dataLayer: Record<string, any>[]
  }
}

// ---------- Base ----------

function trackEvent(event: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params })

  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 [GTM] ${event}`, params)
  }
}

// ---------- Hero QR Funnel ----------

export function heroQRStarted() {
  trackEvent('hero_qr_started')
}

export function heroQRUrlEntered(url: string) {
  trackEvent('hero_qr_url_entered', {
    url_domain: extractDomain(url),
  })
}

export function heroQREmailSubmitted(email: string, timeSpent: number) {
  trackEvent('hero_qr_email_submitted', {
    email_domain: email.split('@')[1] || 'unknown',
    time_spent_seconds: Math.round(timeSpent / 1000),
  })
}

export function heroQRSent(email: string, qrId: string, totalTime: number) {
  trackEvent('hero_qr_sent', {
    email_domain: email.split('@')[1] || 'unknown',
    qr_id: qrId,
    total_time_seconds: Math.round(totalTime / 1000),
  })
}

// ---------- Auth ----------

export function signupStarted(method: 'email' | 'google', source: string) {
  trackEvent('signup_started', { method, source })
}

export function signupCompleted(userId: string, method: 'email' | 'google') {
  trackEvent('signup_completed', { user_id: userId, method })
}

export function trackLogin(method: 'email' | 'google') {
  trackEvent('login', { method })
}

// ---------- QR Codes ----------

export function qrCreated(params: {
  userId: string
  qrId: string
  qrType: string
  hasLogo: boolean
  isFirstQR: boolean
  userPlan: string
}) {
  trackEvent('qr_created', {
    user_id: params.userId,
    qr_id: params.qrId,
    qr_type: params.qrType,
    has_logo: params.hasLogo,
    is_first_qr: params.isFirstQR,
    user_plan: params.userPlan,
  })
}

export function qrDownloaded(params: {
  userId: string
  qrId: string
  format: string
  size: number
}) {
  trackEvent('qr_downloaded', {
    user_id: params.userId,
    qr_id: params.qrId,
    format: params.format,
    size: params.size,
  })
}

// ---------- Billing ----------

export function pricingViewed(userId: string | null, source: string) {
  trackEvent('pricing_viewed', {
    user_id: userId,
    source,
  })
}

export function checkoutStarted(params: {
  userId: string
  plan: string
  billingCycle: 'monthly' | 'yearly'
  value: number
}) {
  trackEvent('checkout_started', {
    user_id: params.userId,
    plan: params.plan,
    billing_cycle: params.billingCycle,
    value: params.value,
    currency: 'PLN',
  })
}

export function purchase(params: {
  userId: string
  plan: string
  billingCycle: 'monthly' | 'yearly'
  value: number
  transactionId: string
}) {
  trackEvent('purchase', {
    user_id: params.userId,
    plan: params.plan,
    billing_cycle: params.billingCycle,
    value: params.value,
    currency: 'PLN',
    transaction_id: params.transactionId,
  })
}

// ---------- Helpers ----------

function extractDomain(url: string): string {
  try {
    const withProtocol = url.startsWith('http') ? url : `https://${url}`
    return new URL(withProtocol).hostname
  } catch {
    return 'invalid'
  }
}
