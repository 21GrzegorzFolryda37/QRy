'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon, LatLngBounds } from 'leaflet'
import { ScanLocation } from '@/types/analytics'
import { formatDistanceToNow } from 'date-fns'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon in Leaflet with webpack
const markerIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface ScanMapLeafletProps {
  data: ScanLocation[]
}

export function ScanMapLeaflet({ data }: ScanMapLeafletProps) {
  // Calculate bounds to fit all markers
  const bounds = new LatLngBounds(
    data.map((scan) => [scan.latitude, scan.longitude] as [number, number])
  )

  // Get center point
  const center = bounds.getCenter()

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={data.length === 1 ? 10 : 4}
      bounds={data.length > 1 ? bounds : undefined}
      style={{ height: '400px', width: '100%', borderRadius: '8px' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.map((scan) => (
        <Marker
          key={scan.id}
          position={[scan.latitude, scan.longitude]}
          icon={markerIcon}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{scan.qrCodeName}</p>
              <p className="text-gray-600">
                {scan.city || 'Unknown'}, {scan.country || 'Unknown'}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {formatDistanceToNow(new Date(scan.scannedAt), { addSuffix: true })}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
