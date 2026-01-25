'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { QrCode } from '@/types/database'

interface QrCodeWithScanCount extends Omit<QrCode, 'scan_count'> {
  scan_count: number
}

export function useQrCodes() {
  const [qrCodes, setQrCodes] = useState<QrCodeWithScanCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQrCodes = useCallback(async () => {
    const supabase = createClient()
    setLoading(true)
    setError(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Unauthorized')
      setLoading(false)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: fetchError } = await (supabase.from('qr_codes') as any)
      .select(`
        *,
        scan_count:scans(count)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError('Failed to fetch QR codes')
      setLoading(false)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedData: QrCodeWithScanCount[] = (data || []).map((qr: any) => ({
      ...qr,
      scan_count: Array.isArray(qr.scan_count) ? qr.scan_count[0]?.count || 0 : 0,
    }))

    setQrCodes(transformedData)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchQrCodes()
  }, [fetchQrCodes])

  return { qrCodes, loading, error, refetch: fetchQrCodes }
}

export function useQrCode(id: string) {
  const [qrCode, setQrCode] = useState<QrCode | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchQrCode() {
      const supabase = createClient()
      setLoading(true)
      setError(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('Unauthorized')
        setLoading(false)
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: fetchError } = await (supabase.from('qr_codes') as any)
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (fetchError) {
        setError('QR code not found')
        setLoading(false)
        return
      }

      setQrCode(data as QrCode)
      setLoading(false)
    }

    fetchQrCode()
  }, [id])

  return { qrCode, loading, error }
}
