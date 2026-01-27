import { Card, CardContent } from '@/components/ui'
import { formatNumber } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon?: React.ReactNode
}

export function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
  const displayValue = typeof value === 'number' ? formatNumber(value) : value

  return (
    <Card hover className="relative overflow-hidden">
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--foreground-muted)]">{title}</p>
            <p className="text-3xl font-bold text-[var(--foreground)]">{displayValue}</p>
            {subtitle && <p className="mt-1 text-sm text-[var(--foreground-subtle)]">{subtitle}</p>}
          </div>
          {icon && <div className="text-[var(--primary)]">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
