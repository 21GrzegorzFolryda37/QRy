'use server'

import { createClient } from '@/lib/supabase/server'
import { stripe, PLANS, PlanId } from '@/lib/stripe'

export async function createCheckoutSession(planId: PlanId): Promise<{ error?: string; url?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const plan = PLANS[planId]

  if (!plan.priceId) {
    return { error: 'Invalid plan' }
  }

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

    // Save customer ID to profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('profiles') as any)
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
    return { error: 'Failed to create checkout session' }
  }

  return { url: session.url }
}

export async function createPortalSession(): Promise<{ error?: string; url?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  const profileData = profile as { stripe_customer_id: string | null } | null

  if (!profileData?.stripe_customer_id) {
    return { error: 'No billing account found' }
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profileData.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  })

  return { url: session.url }
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
    return { error: 'Unauthorized' }
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('plan, subscription_status, qr_limit, monthly_scan_limit, current_month_scans')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return { error: 'Failed to fetch user plan' }
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
