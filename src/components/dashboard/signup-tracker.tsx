'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { signupCompleted } from '@/lib/analytics'

export function SignupTracker() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const signup = searchParams.get('signup')
    const uid = searchParams.get('uid')

    if (signup === 'success' && uid) {
      signupCompleted(uid, 'email')
      // Clean URL params
      router.replace('/dashboard', { scroll: false })
    }
  }, [searchParams, router])

  return null
}
