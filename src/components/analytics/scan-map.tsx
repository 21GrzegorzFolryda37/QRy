'use client'

import { useEffect, useState } from 'react'
import { ScanLocation } from '@/types/analytics'
import { formatDistanceToNow } from 'date-fns'

interface ScanMapProps {
  data: ScanLocation[]
}

export function ScanMap({ data }: ScanMapProps) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{ data: ScanLocation[] }> | null>(null)

  useEffect(() => {
    // Dynamically import Leaflet components only on client side
    import('./scan-map-leaflet').then((mod) => {
      setMapComponent(() => mod.ScanMapLeaflet)
    })
  }, [])

  if (data.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center text-gray-500">
        No location data available
      </div>
    )
  }

  if (!MapComponent) {
    return (
      <div className="flex h-[400px] items-center justify-center text-gray-500">
        Loading map...
      </div>
    )
  }

  return <MapComponent data={data} />
}

// Also export a simple list view as fallback
export function ScanLocationsList({ data }: ScanMapProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-gray-500">
        No location data available
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto">
      {data.slice(0, 20).map((scan) => (
        <div
          key={scan.id}
          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
        >
          <div>
            <p className="text-sm font-medium text-gray-900">
              {scan.city || 'Unknown'}, {scan.country || 'Unknown'}
            </p>
            <p className="text-xs text-gray-500">{scan.qrCodeName}</p>
          </div>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(scan.scannedAt), { addSuffix: true })}
          </span>
        </div>
      ))}
    </div>
  )
}
