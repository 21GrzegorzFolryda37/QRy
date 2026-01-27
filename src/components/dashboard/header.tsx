'use client'

import { Profile } from '@/types/database'
import { Badge } from '@/components/ui'

interface HeaderProps {
  profile: Profile | null
}

export function Header({ profile }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-6">
      <div />
      <div className="flex items-center gap-4">
        {profile && (
          <>
            <Badge
              variant={profile.plan === 'free' ? 'outline' : 'primary'}
              className="capitalize"
            >
              {profile.plan}
            </Badge>
            <span className="text-sm text-[var(--foreground-muted)]">
              {profile.full_name || profile.email}
            </span>
          </>
        )}
      </div>
    </header>
  )
}
