'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'
import { Scan } from '@/types/database'

interface UseScansRealtimeOptions {
  userId: string | undefined
  onNewScan?: (scan: Scan) => void
  enabled?: boolean
}

export function useScansRealtime({ userId, onNewScan, enabled = true }: UseScansRealtimeOptions) {
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')
  const channelRef = useRef<RealtimeChannel | null>(null)
  const onNewScanRef = useRef(onNewScan)

  // Keep callback ref updated to avoid stale closures
  useEffect(() => {
    onNewScanRef.current = onNewScan
  }, [onNewScan])

  useEffect(() => {
    if (!userId || !enabled) {
      setConnectionStatus('disconnected')
      return
    }

    const supabase = createClient()
    const channelName = `scans-realtime-${userId}`

    const channel = supabase
      .channel(channelName)
      .on<Scan>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'scans',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new.user_id === userId) {
            onNewScanRef.current?.(payload.new as Scan)
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected')
        } else if (status === 'CHANNEL_ERROR') {
          setConnectionStatus('error')
        } else if (status === 'CLOSED') {
          setConnectionStatus('disconnected')
        }
      })

    channelRef.current = channel
    setConnectionStatus('connecting')

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [userId, enabled])

  return { connectionStatus }
}
