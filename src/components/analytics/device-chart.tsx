'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { DeviceBreakdown } from '@/types/analytics'

interface DeviceChartProps {
  data: DeviceBreakdown[]
}

const COLORS = ['#111827', '#374151', '#6b7280', '#9ca3af', '#d1d5db']

export function DeviceChart({ data }: DeviceChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-gray-500">
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
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
          }}
        />
        <Legend
          formatter={(value, entry) => (
            <span className="text-sm text-gray-600">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
