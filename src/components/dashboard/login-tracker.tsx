'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { trackLogin } from '@/lib/analytics'

export function LoginTracker() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const login = searchParams.get('login')

    if (login === 'success') {
      trackLogin('email')
      router.replace('/dashboard', { scroll: false })
    }
  }, [searchParams, router])

  return null
}
