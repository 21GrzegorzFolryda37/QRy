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
      <div className="flex h-[250px] items-center justify-center text-gray-500">
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
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
        <XAxis type="number" stroke="#9ca3af" fontSize={12} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="country"
          stroke="#9ca3af"
          fontSize={12}
          width={80}
        />
        <Tooltip
          formatter={(value) => [value, 'Scans']}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
          }}
        />
        <Bar dataKey="scans" fill="#111827" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
