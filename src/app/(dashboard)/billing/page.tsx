import { getUserPlan } from '@/actions/billing'
import { BillingClient } from './billing-client'
import { PlanId } from '@/lib/stripe'

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string; checkout?: string }>
}) {
  const [params, planResult] = await Promise.all([
    searchParams,
    getUserPlan(),
  ])

  const plan = planResult.data?.plan || 'free'
  const subscriptionStatus = planResult.data?.subscriptionStatus || null
  const checkoutPlan = (params.checkout as PlanId) || null

  return (
    <BillingClient
      initialPlan={plan}
      initialSubscriptionStatus={subscriptionStatus}
      success={params.success === 'true'}
      canceled={params.canceled === 'true'}
      checkoutPlan={checkoutPlan}
    />
  )
}
