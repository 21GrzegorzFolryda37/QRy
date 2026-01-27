'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PLANS, PlanId, getPlanLimits } from '@/lib/stripe/plans'

// Check if Stripe is configured
function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_SECRET_KEY.length > 0
  )
}

// Lazy load stripe to avoid errors when not configured
async function getStripe() {
  if (!isStripeConfigured()) {
    throw new Error('Stripe nie jest skonfigurowany')
  }
  const { stripe } = await import('@/lib/stripe')
  return stripe
}

export async function createCheckoutSession(planId: PlanId): Promise<{ error?: string; url?: string }> {
  if (!isStripeConfigured()) {
    return { error: 'Platnosci nie sa jeszcze dostepne. Stripe nie jest skonfigurowany.' }
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Musisz byc zalogowany' }
  }

  const plan = PLANS[planId]

  if (!plan.priceId) {
    return { error: 'Ten plan nie jest dostepny do zakupu' }
  }

  try {
    const stripe = await getStripe()

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single()

    const profileData = profile as { stripe_customer_id: string | null; email: string } | null
    let customerId = profileData?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profileData?.email || user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID to profile using admin client
      const adminClient = createAdminClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (adminClient.from('profiles') as any)
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
        },
      },
    })

    if (!session.url) {
      return { error: 'Nie udalo sie utworzyc sesji platnosci' }
    }

    return { url: session.url }
  } catch (error) {
    console.error('Stripe error:', error)
    return { error: 'Wystapil blad podczas tworzenia sesji platnosci' }
  }
}

export async function createPortalSession(): Promise<{ error?: string; url?: string }> {
  if (!isStripeConfigured()) {
    return { error: 'Platnosci nie sa jeszcze dostepne. Stripe nie jest skonfigurowany.' }
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Musisz byc zalogowany' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  const profileData = profile as { stripe_customer_id: string | null } | null

  if (!profileData?.stripe_customer_id) {
    return { error: 'Nie masz aktywnej subskrypcji' }
  }

  try {
    const stripe = await getStripe()

    const session = await stripe.billingPortal.sessions.create({
      customer: profileData.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    })

    return { url: session.url }
  } catch (error) {
    console.error('Stripe portal error:', error)
    return { error: 'Nie udalo sie otworzyc portalu platnosci' }
  }
}

export async function getUserPlan(): Promise<{
  error?: string
  data?: {
    plan: PlanId
    subscriptionStatus: string | null
    qrLimit: number
    scanLimit: number
    currentMonthScans: number
  }
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Musisz byc zalogowany' }
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('plan, subscription_status, qr_limit, monthly_scan_limit, current_month_scans')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return { error: 'Nie udalo sie pobrac danych o planie' }
  }

  const profileData = profile as {
    plan: string
    subscription_status: string | null
    qr_limit: number
    monthly_scan_limit: number
    current_month_scans: number
  }

  return {
    data: {
      plan: profileData.plan as PlanId,
      subscriptionStatus: profileData.subscription_status,
      qrLimit: profileData.qr_limit,
      scanLimit: profileData.monthly_scan_limit,
      currentMonthScans: profileData.current_month_scans,
    },
  }
}

export interface DowngradeInfo {
  currentPlan: PlanId
  targetPlan: PlanId
  currentQrCount: number
  targetQrLimit: number
  excessQrCodes: number
  currentMonthScans: number
  targetScanLimit: number
  canDowngrade: boolean
  warnings: string[]
}

export async function getDowngradeInfo(targetPlanId: PlanId): Promise<{
  error?: string
  data?: DowngradeInfo
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Musisz byc zalogowany' }
  }

  // Get current profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('plan, current_month_scans')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { error: 'Nie udalo sie pobrac danych uzytkownika' }
  }

  const profileData = profile as { plan: string; current_month_scans: number }
  const currentPlan = profileData.plan as PlanId

  // Get QR code count
  const { count: qrCount } = await supabase
    .from('qr_codes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const currentQrCount = qrCount || 0
  const targetPlan = PLANS[targetPlanId]
  const targetQrLimit = targetPlan.qrLimit
  const targetScanLimit = targetPlan.scanLimit

  const warnings: string[] = []

  // Check QR limit
  const excessQrCodes = targetQrLimit !== -1 ? Math.max(0, currentQrCount - targetQrLimit) : 0
  if (excessQrCodes > 0) {
    warnings.push(
      `Masz ${currentQrCount} kodow QR, a plan ${targetPlan.name} pozwala na ${targetQrLimit}. ` +
      `${excessQrCodes} kodow zostanie dezaktywowanych.`
    )
  }

  // Check scan limit
  if (targetScanLimit !== -1 && profileData.current_month_scans > targetScanLimit) {
    warnings.push(
      `Twoj biezacy licznik skanow (${profileData.current_month_scans}) przekracza limit planu ${targetPlan.name} (${targetScanLimit}).`
    )
  }

  return {
    data: {
      currentPlan,
      targetPlan: targetPlanId,
      currentQrCount,
      targetQrLimit,
      excessQrCodes,
      currentMonthScans: profileData.current_month_scans,
      targetScanLimit,
      canDowngrade: true,
      warnings,
    },
  }
}

export async function downgradePlan(targetPlanId: PlanId): Promise<{
  error?: string
  url?: string
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Musisz byc zalogowany' }
  }

  // If downgrading to free, redirect to Stripe portal for cancellation
  if (targetPlanId === 'free') {
    return createPortalSession()
  }

  // For paid plan changes - check if Stripe is configured
  if (!isStripeConfigured()) {
    return { error: 'Platnosci nie sa dostepne. Stripe nie jest skonfigurowany.' }
  }

  const targetPlan = PLANS[targetPlanId]

  if (!targetPlan.priceId) {
    return { error: 'Nieprawidlowy plan' }
  }

  // Get Stripe subscription
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, stripe_subscription_id')
    .eq('id', user.id)
    .single()

  const profileData = profile as { stripe_customer_id: string | null; stripe_subscription_id: string | null } | null

  if (!profileData?.stripe_customer_id || !profileData?.stripe_subscription_id) {
    return { error: 'Nie masz aktywnej subskrypcji' }
  }

  try {
    const stripe = await getStripe()

    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(profileData.stripe_subscription_id)

    // Update subscription to new plan
    await stripe.subscriptions.update(profileData.stripe_subscription_id, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: targetPlan.priceId,
        },
      ],
      proration_behavior: 'create_prorations',
    })

    // Deactivate excess QR codes using admin client
    const targetQrLimit = targetPlan.qrLimit
    if (targetQrLimit !== -1) {
      const adminClient = createAdminClient()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: qrCodes } = await (adminClient.from('qr_codes') as any)
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (qrCodes && qrCodes.length > targetQrLimit) {
        const codesToDeactivate = qrCodes.slice(targetQrLimit)
        const idsToDeactivate = codesToDeactivate.map((qr: { id: string }) => qr.id)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (adminClient.from('qr_codes') as any)
          .update({ is_active: false })
          .in('id', idsToDeactivate)
      }
    }

    return { url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true` }
  } catch (error) {
    console.error('Error downgrading plan:', error)
    return { error: 'Nie udalo sie zmienic planu. Sprobuj ponownie.' }
  }
}

// Manual plan upgrade for development/testing without Stripe
export async function manualPlanUpgrade(targetPlanId: PlanId): Promise<{
  error?: string
  success?: boolean
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Musisz byc zalogowany' }
  }

  const limits = getPlanLimits(targetPlanId)
  const adminClient = createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (adminClient.from('profiles') as any)
    .update({
      plan: targetPlanId,
      qr_limit: limits.qrLimit,
      monthly_scan_limit: limits.scanLimit,
      subscription_status: targetPlanId === 'free' ? null : 'active',
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating plan:', error)
    return { error: 'Nie udalo sie zmienic planu' }
  }

  return { success: true }
}
