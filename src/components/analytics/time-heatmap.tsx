'use client'

import { TimePatternData } from '@/types/analytics'

interface TimeHeatmapProps {
  data: TimePatternData | null
}

const DAY_LABELS = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So']
const HOUR_LABELS = ['00', '03', '06', '09', '12', '15', '18', '21']

export function TimeHeatmap({ data }: TimeHeatmapProps) {
  if (!data || data.heatmap.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500">
        No time pattern data available
      </div>
    )
  }

  // Find max count for color scaling
  const maxCount = Math.max(...data.heatmap.map((d) => d.count), 1)

  // Get color intensity based on count
  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-50'
    const intensity = count / maxCount
    if (intensity < 0.2) return 'bg-blue-100'
    if (intensity < 0.4) return 'bg-blue-200'
    if (intensity < 0.6) return 'bg-blue-300'
    if (intensity < 0.8) return 'bg-blue-400'
    return 'bg-blue-500'
  }

  // Reorder days to start from Monday (1, 2, 3, 4, 5, 6, 0)
  const orderedDays = [1, 2, 3, 4, 5, 6, 0]
  const orderedDayLabels = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd']

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
                className="flex-1 text-center text-xs text-gray-400"
              >
                {h % 3 === 0 ? `${h.toString().padStart(2, '0')}` : ''}
              </div>
            ))}
          </div>

          {/* Heatmap rows */}
          {orderedDays.map((day, dayIndex) => (
            <div key={day} className="flex items-center mb-1">
              <div className="w-10 text-xs text-gray-500 font-medium">
                {orderedDayLabels[dayIndex]}
              </div>
              <div className="flex flex-1 gap-0.5">
                {Array.from({ length: 24 }, (_, hour) => {
                  const count = heatmapMap[`${day}-${hour}`] || 0
                  return (
                    <div
                      key={hour}
                      className={`flex-1 h-8 rounded-sm ${getColor(count)} transition-colors hover:ring-2 hover:ring-blue-400 hover:ring-offset-1 cursor-default`}
                      title={`${orderedDayLabels[dayIndex]} ${hour}:00 - ${count} skanów`}
                    />
                  )
                })}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
            <span>Mniej</span>
            <div className="flex gap-0.5">
              <div className="w-4 h-4 rounded-sm bg-gray-50 border border-gray-200" />
              <div className="w-4 h-4 rounded-sm bg-blue-100" />
              <div className="w-4 h-4 rounded-sm bg-blue-200" />
              <div className="w-4 h-4 rounded-sm bg-blue-300" />
              <div className="w-4 h-4 rounded-sm bg-blue-400" />
              <div className="w-4 h-4 rounded-sm bg-blue-500" />
            </div>
            <span>Więcej</span>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        {/* Peak hours */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Szczytowe godziny</h4>
          <div className="space-y-1">
            {data.hourly
              .sort((a, b) => b.count - a.count)
              .slice(0, 3)
              .map((item) => (
                <div key={item.hour} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {item.hour.toString().padStart(2, '0')}:00 - {(item.hour + 1).toString().padStart(2, '0')}:00
                  </span>
                  <span className="font-medium text-gray-900">{item.count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Peak days */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Szczytowe dni</h4>
          <div className="space-y-1">
            {data.daily
              .sort((a, b) => b.count - a.count)
              .slice(0, 3)
              .map((item) => (
                <div key={item.day} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item.dayName}</span>
                  <span className="font-medium text-gray-900">{item.count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
