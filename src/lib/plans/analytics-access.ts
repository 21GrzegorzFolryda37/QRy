import type { Plan } from '@/types/database'

export type AnalyticsFeature =
  | 'scan_map'
  | 'time_heatmap'
  | 'realtime_card'
  | 'comparison_view'
  | 'compare_button'

const PLAN_LEVEL: Record<Plan, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  enterprise: 3,
}

const FEATURE_MIN_PLAN: Record<AnalyticsFeature, Plan> = {
  scan_map: 'pro',
  time_heatmap: 'pro',
  realtime_card: 'pro',
  comparison_view: 'pro',
  compare_button: 'pro',
}

export const FEATURE_LABELS: Record<AnalyticsFeature, string> = {
  scan_map: 'Mapa lokalizacji skanów',
  time_heatmap: 'Wzorce czasowe (heatmapa)',
  realtime_card: 'Skany w czasie rzeczywistym',
  comparison_view: 'Porównanie kodów QR',
  compare_button: 'Przycisk porównania',
}

/** Whether the plan has access to the analytics dashboard at all (>= starter) */
export function canAccessAnalytics(plan: Plan): boolean {
  return PLAN_LEVEL[plan] >= PLAN_LEVEL['starter']
}

/** Whether the plan can access a specific analytics feature */
export function canAccessFeature(plan: Plan, feature: AnalyticsFeature): boolean {
  const requiredPlan = FEATURE_MIN_PLAN[feature]
  return PLAN_LEVEL[plan] >= PLAN_LEVEL[requiredPlan]
}

/** Returns the minimum plan required for a feature */
export function getRequiredPlan(feature: AnalyticsFeature): Plan {
  return FEATURE_MIN_PLAN[feature]
}
