'use client'

import { Profile } from '@/types/database'
import { Badge } from '@/components/ui'

interface HeaderProps {
  profile: Profile | null
}

export function Header({ profile }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div />
      <div className="flex items-center gap-4">
        {profile && (
          <>
            <Badge
              variant={profile.plan === 'free' ? 'outline' : 'success'}
              className="capitalize"
            >
              {profile.plan}
            </Badge>
            <span className="text-sm text-gray-600">
              {profile.full_name || profile.email}
            </span>
          </>
        )}
      </div>
    </header>
  )
}
