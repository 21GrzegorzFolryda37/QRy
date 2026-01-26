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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{displayValue}</p>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
