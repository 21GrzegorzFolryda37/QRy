'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ScansOverTime } from '@/types/analytics'
import { format, parseISO } from 'date-fns'

interface ScansChartProps {
  data: ScansOverTime[]
}

export function ScansChart({ data }: ScansChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500">
        No scan data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#111827" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#111827" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tickFormatter={(date) => format(parseISO(date), 'MMM d')}
          stroke="#9ca3af"
          fontSize={12}
        />
        <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
        <Tooltip
          labelFormatter={(date) => format(parseISO(date as string), 'MMM d, yyyy')}
          formatter={(value) => [value, 'Scans']}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
          }}
        />
        <Area
          type="monotone"
          dataKey="scans"
          stroke="#111827"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorScans)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
