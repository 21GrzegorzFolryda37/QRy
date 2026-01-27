'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { GeographicData } from '@/types/analytics'

interface GeoChartProps {
  data: GeographicData[]
  limit?: number
}

export function GeoChart({ data, limit = 5 }: GeoChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-[var(--foreground-muted)]">
        No geographic data available
      </div>
    )
  }

  const chartData = data.slice(0, limit)

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis
          type="number"
          stroke="var(--foreground-subtle)"
          fontSize={12}
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="country"
          stroke="var(--foreground-subtle)"
          fontSize={12}
          width={80}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value) => [value, 'Scans']}
          contentStyle={{
            backgroundColor: 'var(--background-elevated)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--foreground)',
          }}
          labelStyle={{
            color: 'var(--foreground-muted)',
          }}
          cursor={{ fill: 'var(--primary-muted)' }}
        />
        <Bar dataKey="scans" fill="url(#barGradient)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
