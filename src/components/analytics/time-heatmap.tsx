'use client'

import { TimePatternData } from '@/types/analytics'

interface TimeHeatmapProps {
  data: TimePatternData | null
}

const DAY_LABELS = ['Nd', 'Pn', 'Wt', 'Sr', 'Cz', 'Pt', 'So']
const HOUR_LABELS = ['00', '03', '06', '09', '12', '15', '18', '21']

export function TimeHeatmap({ data }: TimeHeatmapProps) {
  if (!data || data.heatmap.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-[var(--foreground-muted)]">
        No time pattern data available
      </div>
    )
  }

  // Find max count for color scaling
  const maxCount = Math.max(...data.heatmap.map((d) => d.count), 1)

  // Get color intensity based on count - using violet to cyan gradient
  const getColor = (count: number) => {
    if (count === 0) return 'bg-[var(--background-elevated)]'
    const intensity = count / maxCount
    if (intensity < 0.2) return 'bg-violet-900/30'
    if (intensity < 0.4) return 'bg-violet-700/50'
    if (intensity < 0.6) return 'bg-violet-500/60'
    if (intensity < 0.8) return 'bg-cyan-500/70'
    return 'bg-cyan-400/90'
  }

  // Reorder days to start from Monday (1, 2, 3, 4, 5, 6, 0)
  const orderedDays = [1, 2, 3, 4, 5, 6, 0]
  const orderedDayLabels = ['Pn', 'Wt', 'Sr', 'Cz', 'Pt', 'So', 'Nd']

  // Create a lookup map for quick access
  const heatmapMap: Record<string, number> = {}
  data.heatmap.forEach((item) => {
    heatmapMap[`${item.day}-${item.hour}`] = item.count
  })

  return (
    <div className="space-y-4">
      {/* Heatmap grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour labels */}
          <div className="flex mb-1">
            <div className="w-10" /> {/* Spacer for day labels */}
            {Array.from({ length: 24 }, (_, h) => (
              <div
                key={h}
                className="flex-1 text-center text-xs text-[var(--foreground-subtle)]"
              >
                {h % 3 === 0 ? `${h.toString().padStart(2, '0')}` : ''}
              </div>
            ))}
          </div>

          {/* Heatmap rows */}
          {orderedDays.map((day, dayIndex) => (
            <div key={day} className="flex items-center mb-1">
              <div className="w-10 text-xs text-[var(--foreground-muted)] font-medium">
                {orderedDayLabels[dayIndex]}
              </div>
              <div className="flex flex-1 gap-0.5">
                {Array.from({ length: 24 }, (_, hour) => {
                  const count = heatmapMap[`${day}-${hour}`] || 0
                  return (
                    <div
                      key={hour}
                      className={`flex-1 h-8 rounded-sm ${getColor(count)} transition-all duration-200 hover:ring-2 hover:ring-[var(--primary)] hover:ring-offset-1 hover:ring-offset-[var(--background)] cursor-default`}
                      title={`${orderedDayLabels[dayIndex]} ${hour}:00 - ${count} skanow`}
                    />
                  )
                })}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-4 text-xs text-[var(--foreground-muted)]">
            <span>Mniej</span>
            <div className="flex gap-0.5">
              <div className="w-4 h-4 rounded-sm bg-[var(--background-elevated)] border border-[var(--border)]" />
              <div className="w-4 h-4 rounded-sm bg-violet-900/30" />
              <div className="w-4 h-4 rounded-sm bg-violet-700/50" />
              <div className="w-4 h-4 rounded-sm bg-violet-500/60" />
              <div className="w-4 h-4 rounded-sm bg-cyan-500/70" />
              <div className="w-4 h-4 rounded-sm bg-cyan-400/90" />
            </div>
            <span>Wiecej</span>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
        {/* Peak hours */}
        <div>
          <h4 className="text-sm font-medium text-[var(--foreground)] mb-2">Szczytowe godziny</h4>
          <div className="space-y-1">
            {data.hourly
              .sort((a, b) => b.count - a.count)
              .slice(0, 3)
              .map((item) => (
                <div key={item.hour} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--foreground-muted)]">
                    {item.hour.toString().padStart(2, '0')}:00 - {(item.hour + 1).toString().padStart(2, '0')}:00
                  </span>
                  <span className="font-medium text-[var(--primary)]">{item.count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Peak days */}
        <div>
          <h4 className="text-sm font-medium text-[var(--foreground)] mb-2">Szczytowe dni</h4>
          <div className="space-y-1">
            {data.daily
              .sort((a, b) => b.count - a.count)
              .slice(0, 3)
              .map((item) => (
                <div key={item.day} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--foreground-muted)]">{item.dayName}</span>
                  <span className="font-medium text-[var(--secondary)]">{item.count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
