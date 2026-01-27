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
      <div className="flex h-[300px] items-center justify-center text-[var(--foreground-muted)]">
        No scan data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(date) => format(parseISO(date), 'MMM d')}
          stroke="var(--foreground-subtle)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="var(--foreground-subtle)"
          fontSize={12}
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          labelFormatter={(date) => format(parseISO(date as string), 'MMM d, yyyy')}
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
        />
        <Area
          type="monotone"
          dataKey="scans"
          stroke="url(#strokeGradient)"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorScans)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
