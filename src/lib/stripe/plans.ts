// Price IDs are loaded from env on server, but we need to know if plan is paid on client
export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    qrLimit: 5,
    scanLimit: 1000,
    priceId: null as string | null,
    isPaid: false,
  },
  starter: {
    name: 'Starter',
    price: 29,
    qrLimit: 25,
    scanLimit: 10000,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || null,
    isPaid: true,
  },
  pro: {
    name: 'Pro',
    price: 79,
    qrLimit: 100,
    scanLimit: 100000,
    priceId: process.env.STRIPE_PRO_PRICE_ID || null,
    isPaid: true,
  },
  enterprise: {
    name: 'Enterprise',
    price: 199,
    qrLimit: -1, // Unlimited
    scanLimit: -1, // Unlimited
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || null,
    isPaid: true,
  },
} as const

export type PlanId = keyof typeof PLANS

export function getPlanLimits(plan: PlanId) {
  return {
    qrLimit: PLANS[plan].qrLimit,
    scanLimit: PLANS[plan].scanLimit,
  }
}

export function getPlanByPriceId(priceId: string): PlanId | null {
  for (const [planId, plan] of Object.entries(PLANS)) {
    if (plan.priceId === priceId) {
      return planId as PlanId
    }
  }
  return null
}
