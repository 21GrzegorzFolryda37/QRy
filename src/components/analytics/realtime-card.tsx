'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRecentScans } from '@/hooks/use-analytics'
import { useScansRealtime } from '@/hooks/use-scans-realtime'
import { RecentScan } from '@/types/analytics'
import { formatDistanceToNow } from 'date-fns'
import { pl } from 'date-fns/locale'
import Link from 'next/link'

interface RealtimeCardProps {
  userId: string | undefined
}

function getDeviceIcon(deviceType: string | null) {
  switch (deviceType?.toLowerCase()) {
    case 'mobile':
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    case 'tablet':
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    default:
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
  }
}

function getLocationString(scan: RecentScan): string {
  const parts: string[] = []
  if (scan.city) parts.push(scan.city)
  if (scan.country) parts.push(scan.country)
  return parts.length > 0 ? parts.join(', ') : 'Unknown location'
}

function ScanItem({ scan, isNew }: { scan: RecentScan; isNew: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-500 ${
        isNew ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
      }`}
    >
      <div className="flex-shrink-0 mt-0.5 text-gray-400">
        {getDeviceIcon(scan.deviceType)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/qr-codes/${scan.qrCodeId}`}
            className="text-sm font-medium text-gray-900 hover:underline truncate"
          >
            {scan.qrCodeName}
          </Link>
          {isNew && (
            <span className="flex-shrink-0 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
              Nowy
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
          <span>{getLocationString(scan)}</span>
          <span>-</span>
          <span>{scan.browser || 'Unknown'}</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {formatDistanceToNow(new Date(scan.scannedAt), { addSuffix: true, locale: pl })}
        </div>
      </div>
    </div>
  )
}

export function RealtimeCard({ userId }: RealtimeCardProps) {
  const { data: initialScans, loading, refetch } = useRecentScans(30)
  const [scans, setScans] = useState<RecentScan[]>([])
  const [newScanIds, setNewScanIds] = useState<Set<string>>(new Set())

  // Initialize scans from initial data
  useEffect(() => {
    if (initialScans.length > 0) {
      setScans(initialScans)
    }
  }, [initialScans])

  // Handle new scan from realtime
  const handleNewScan = useCallback((newScan: { id: string }) => {
    // Refetch to get full scan data with QR name
    refetch()
    // Mark as new for animation
    setNewScanIds((prev) => new Set([...prev, newScan.id]))
    // Remove "new" status after 5 seconds
    setTimeout(() => {
      setNewScanIds((prev) => {
        const next = new Set(prev)
        next.delete(newScan.id)
        return next
      })
    }, 5000)
  }, [refetch])

  // Subscribe to realtime updates
  const { connectionStatus } = useScansRealtime({
    userId,
    onNewScan: handleNewScan,
    enabled: !!userId,
  })

  // Update scans when initialScans change (after refetch)
  useEffect(() => {
    if (!loading && initialScans.length > 0) {
      setScans(initialScans)
    }
  }, [initialScans, loading])

  const activeUsersCount = scans.length

  if (loading && scans.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold text-green-600">{activeUsersCount}</div>
          <div className="text-sm text-gray-600">
            {activeUsersCount === 1 ? 'skan' : activeUsersCount < 5 ? 'skany' : 'skanow'} w ostatnich 30 min
          </div>
        </div>
        {connectionStatus === 'connected' && (
          <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </span>
        )}
      </div>

      {scans.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">Brak skanow w ostatnich 30 minutach</p>
          <p className="text-xs text-gray-400 mt-1">Nowe skany pojawia sie tutaj w czasie rzeczywistym</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {scans.slice(0, 10).map((scan) => (
            <ScanItem
              key={scan.id}
              scan={scan}
              isNew={newScanIds.has(scan.id)}
            />
          ))}
          {scans.length > 10 && (
            <div className="text-center text-xs text-gray-500 pt-2">
              + {scans.length - 10} wiecej skanow
            </div>
          )}
        </div>
      )}
    </div>
  )
}
