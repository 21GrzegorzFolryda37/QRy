/* eslint-disable @typescript-eslint/no-explicit-any */

// ============================================
// Google Tag Manager - Analytics Helper
// ============================================

declare global {
  interface Window {
    dataLayer: Record<string, any>[]
    gtag: (...args: any[]) => void
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

export function heroQRUrlEntered(url: string, selectedTemplate?: string) {
  trackEvent('hero_qr_url_entered', {
    url_domain: extractDomain(url),
    selected_template: selectedTemplate || 'none',
  })
}

export function heroQREmailSubmitted(email: string, timeSpent: number, customization: {
  hasFrame: boolean
  hasLogo: boolean
  qrColor: string
  bgColor: string
  frameStyle: string
}) {
  trackEvent('hero_qr_email_submitted', {
    email_domain: email.split('@')[1] || 'unknown',
    time_spent_seconds: Math.round(timeSpent / 1000),
    has_frame: customization.hasFrame,
    has_logo: customization.hasLogo,
    qr_color: customization.qrColor,
    bg_color: customization.bgColor,
    frame_style: customization.frameStyle,
  })
}

export function heroQRSent(email: string, qrId: string, totalTime: number, customization: {
  selectedTemplate: string
  hasFrame: boolean
  hasLogo: boolean
  qrColor: string
  bgColor: string
  frameStyle: string
}, totalCustomizationClicks: number) {
  trackEvent('hero_qr_sent', {
    email_domain: email.split('@')[1] || 'unknown',
    qr_id: qrId,
    total_time_seconds: Math.round(totalTime / 1000),
    selected_template: customization.selectedTemplate,
    has_frame: customization.hasFrame,
    has_logo: customization.hasLogo,
    qr_color: customization.qrColor,
    bg_color: customization.bgColor,
    frame_style: customization.frameStyle,
    total_customization_clicks: totalCustomizationClicks,
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

// ---------- Google Ads Conversion ----------

export function gtagReportConversion(url?: string) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

  const callback = () => {
    if (url) {
      window.location.href = url
    }
  }

  window.gtag('event', 'conversion', {
    send_to: 'AW-11001323592/-o38CJXx590ZEMjA6_0o',
    event_callback: callback,
  })

  if (process.env.NODE_ENV === 'development') {
    console.log('📊 [Google Ads] conversion reported', { url })
  }
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

function secondsSince(start: number): number {
  return Math.round((Date.now() - start) / 1000)
}

// ---------- Hero QR Funnel — Step Events ----------

export function trackHeroTypeSelected(qrType: string) {
  trackEvent('hero_type_selected', { qr_type: qrType })
}

export function trackHeroStep1DataEntered(qrType: string, inputValue: string) {
  const params: Record<string, unknown> = { qr_type: qrType }
  switch (qrType) {
    case 'website':
      params.url_domain = extractDomain(inputValue)
      break
    case 'email':
      params.email_domain = inputValue.includes('@') ? inputValue.split('@')[1] : 'unknown'
      break
    case 'wifi':
      params.wifi_encryption = inputValue
      break
    default:
      params.input_length = inputValue.length
  }
  trackEvent('hero_step1_data_entered', params)
}

export function trackHeroStep1Completed(qrType: string, inputValue: string, startTime: number) {
  const params: Record<string, unknown> = {
    qr_type: qrType,
    time_on_step_seconds: startTime > 0 ? secondsSince(startTime) : 0,
  }
  if (qrType === 'website') {
    params.url_domain = extractDomain(inputValue)
  }
  trackEvent('hero_step1_completed', params)
}

export function trackHeroTemplateApplied(templateId: string) {
  trackEvent('hero_template_applied', { template_id: templateId })
}

export function trackHeroCustomizationChanged(optionType: string, optionValue: string | number | boolean) {
  trackEvent('hero_customization_changed', {
    customization_type: optionType,
    customization_value: String(optionValue),
  })
}

export function trackHeroStep2Completed(params: {
  qrType: string
  selectedTemplate: string
  hasLogo: boolean
  qrColor: string
  bgColor: string
  dotShape: string
  cornerShape: string
  hasGradient: boolean
  customizationClicks: number
  step2StartTime: number
  startTime: number
}) {
  trackEvent('hero_step2_completed', {
    qr_type: params.qrType,
    selected_template: params.selectedTemplate,
    has_logo: params.hasLogo,
    qr_color: params.qrColor,
    bg_color: params.bgColor,
    dot_shape: params.dotShape,
    corner_shape: params.cornerShape,
    has_gradient: params.hasGradient,
    customization_clicks: params.customizationClicks,
    time_on_step_seconds: params.step2StartTime > 0 ? secondsSince(params.step2StartTime) : 0,
    total_time_seconds: params.startTime > 0 ? secondsSince(params.startTime) : 0,
  })
}

export function trackHeroDownloadClicked(params: {
  qrType: string
  codeName: string
  startTime: number
}) {
  trackEvent('hero_download_clicked', {
    qr_type: params.qrType,
    code_name: params.codeName,
    total_time_seconds: params.startTime > 0 ? secondsSince(params.startTime) : 0,
  })
}

export function trackHeroDownloadAbandoned(params: {
  qrType: string
  startTime: number
}) {
  trackEvent('hero_download_abandoned', {
    qr_type: params.qrType,
    total_time_seconds: params.startTime > 0 ? secondsSince(params.startTime) : 0,
  })
}

export const trackHeroEmailSubmitted = (params: {
  qrType: string;
  emailDomain: string;
  startTime: number;
}) => {
  trackEvent('hero_email_submitted', {
    qr_type: params.qrType,
    email_domain: params.emailDomain,
    total_time_seconds: secondsSince(params.startTime),
  });
};

// NOTE: trackHeroAuthCompleted and trackHeroQRSaved should be called from
// UnifiedAuthForm's onSuccess callback once that component exposes it.
export function trackHeroAuthCompleted(params: {
  qrType: string
  selectedTemplate: string
  hasLogo: boolean
  qrColor: string
  bgColor: string
  customizationClicks: number
  codeName: string
  startTime: number
  authMethod: string
}) {
  trackEvent('hero_auth_completed', {
    qr_type: params.qrType,
    selected_template: params.selectedTemplate,
    has_logo: params.hasLogo,
    qr_color: params.qrColor,
    bg_color: params.bgColor,
    customization_clicks: params.customizationClicks,
    code_name: params.codeName,
    total_time_seconds: params.startTime > 0 ? secondsSince(params.startTime) : 0,
    auth_method: params.authMethod,
  })
}

export function trackHeroQRSaved(params: {
  qrType: string
  qrId: string
  selectedTemplate: string
  hasLogo: boolean
  customizationClicks: number
  startTime: number
}) {
  trackEvent('hero_qr_saved', {
    qr_type: params.qrType,
    qr_id: params.qrId,
    selected_template: params.selectedTemplate,
    has_logo: params.hasLogo,
    customization_clicks: params.customizationClicks,
    total_time_seconds: params.startTime > 0 ? secondsSince(params.startTime) : 0,
  })
}
