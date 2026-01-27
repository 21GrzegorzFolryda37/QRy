'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { DeviceBreakdown } from '@/types/analytics'

interface DeviceChartProps {
  data: DeviceBreakdown[]
}

const COLORS = ['#8b5cf6', '#06b6d4', '#a78bfa', '#22d3ee', '#c4b5fd']

export function DeviceChart({ data }: DeviceChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-[var(--foreground-muted)]">
        No device data available
      </div>
    )
  }

  const chartData = data.map((item) => ({
    name: item.deviceType,
    value: item.count,
    percentage: item.percentage,
  }))

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
