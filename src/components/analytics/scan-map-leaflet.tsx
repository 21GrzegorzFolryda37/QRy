'use client'

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { LatLngBounds } from 'leaflet'
import { ScanLocation } from '@/types/analytics'
import { formatDistanceToNow } from 'date-fns'
import 'leaflet/dist/leaflet.css'

interface ScanMapLeafletProps {
  data: ScanLocation[]
}

// Aggregate scans by location (city level) for clustering effect
function aggregateByLocation(data: ScanLocation[]) {
  const aggregated: Record<string, {
    latitude: number
    longitude: number
    city: string | null
    country: string | null
    count: number
    scans: ScanLocation[]
  }> = {}

  data.forEach((scan) => {
    // Round to ~10km precision for grouping nearby scans (prevents overlapping circles)
    const key = `${scan.latitude.toFixed(1)}_${scan.longitude.toFixed(1)}`

    if (!aggregated[key]) {
      aggregated[key] = {
        latitude: scan.latitude,
        longitude: scan.longitude,
        city: scan.city,
        country: scan.country,
        count: 0,
        scans: [],
      }
    }
    aggregated[key].count++
    aggregated[key].scans.push(scan)
  })

  return Object.values(aggregated)
}

export function ScanMapLeaflet({ data }: ScanMapLeafletProps) {
  const aggregatedData = aggregateByLocation(data)

  // Calculate bounds to fit all markers
  const bounds = new LatLngBounds(
    data.map((scan) => [scan.latitude, scan.longitude] as [number, number])
  )

  // Get center point
  const center = bounds.getCenter()

  // Fixed radius for consistent appearance
  const CIRCLE_RADIUS = 18

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={data.length === 1 ? 6 : 3}
      bounds={data.length > 1 ? bounds : undefined}
      style={{ height: '400px', width: '100%', borderRadius: '8px', background: '#f8f9fa' }}
      scrollWheelZoom={true}
      maxZoom={12}
      minZoom={2}
    >
      {/* Clean, minimal map style - CartoDB Positron (no labels version for even cleaner look) */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
      />
      {/* Add country labels on top */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
      />
      {aggregatedData.map((location, index) => (
        <CircleMarker
          key={index}
          center={[location.latitude, location.longitude]}
          radius={CIRCLE_RADIUS}
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.5,
            weight: 2,
          }}
        >
          <Popup>
            <div className="text-sm min-w-[150px]">
              <p className="font-semibold text-gray-900">
                {location.city || 'Unknown'}, {location.country || 'Unknown'}
              </p>
              <p className="text-blue-600 font-medium">
                {location.count} {location.count === 1 ? 'scan' : 'scans'}
              </p>
              <div className="mt-2 pt-2 border-t border-gray-100 max-h-[120px] overflow-y-auto">
                {location.scans.slice(0, 5).map((scan) => (
                  <div key={scan.id} className="text-xs text-gray-500 py-0.5">
                    <span className="font-medium text-gray-700">{scan.qrCodeName}</span>
                    <span className="mx-1">·</span>
                    {formatDistanceToNow(new Date(scan.scannedAt), { addSuffix: true })}
                  </div>
                ))}
                {location.scans.length > 5 && (
                  <p className="text-xs text-gray-400 mt-1">
                    +{location.scans.length - 5} more
                  </p>
                )}
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
