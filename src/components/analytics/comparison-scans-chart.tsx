'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { ComparisonScansOverTime } from '@/hooks/use-comparison'
import { format, parseISO } from 'date-fns'

interface ComparisonScansChartProps {
  data: ComparisonScansOverTime[]
  nameA: string
  nameB: string
}

export function ComparisonScansChart({ data, nameA, nameB }: ComparisonScansChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-[var(--foreground-muted)]">
        Brak danych o skanach
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorScansA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorScansB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
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
        <Legend />
        <Area
          type="monotone"
          dataKey="scansA"
          name={nameA}
          stroke="#8b5cf6"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorScansA)"
        />
        <Area
          type="monotone"
          dataKey="scansB"
          name={nameB}
          stroke="#06b6d4"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorScansB)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
