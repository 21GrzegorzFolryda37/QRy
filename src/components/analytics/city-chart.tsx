'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { CityBreakdown } from '@/types/analytics'

interface CityChartProps {
  data: CityBreakdown[]
}

const COLORS = ['#8b5cf6', '#06b6d4', '#a78bfa', '#22d3ee', '#c4b5fd', '#67e8f9', '#ddd6fe']

export function CityChart({ data }: CityChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-[var(--foreground-muted)]">
        Brak danych o lokalizacji
      </div>
    )
  }

  // Limit to top 6 cities, group rest as "Inne"
  const topCities = data.slice(0, 6)
  const otherCities = data.slice(6)

  let chartData = topCities.map((item) => ({
    name: item.city,
    value: item.count,
    percentage: item.percentage,
  }))

  if (otherCities.length > 0) {
    const otherCount = otherCities.reduce((sum, city) => sum + city.count, 0)
    const otherPercentage = otherCities.reduce((sum, city) => sum + city.percentage, 0)
    chartData.push({
      name: 'Inne',
      value: otherCount,
      percentage: otherPercentage,
    })
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => {
            const payload = props.payload as { percentage?: number }
            return [`${value} (${payload?.percentage ?? 0}%)`, name]
          }}
          contentStyle={{
            backgroundColor: 'var(--background-elevated)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--foreground)',
          }}
        />
        <Legend
          formatter={(value) => (
            <span className="text-sm text-[var(--foreground-muted)]">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
