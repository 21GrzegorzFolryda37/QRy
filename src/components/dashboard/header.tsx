'use client'

import Image from 'next/image'
import { Profile } from '@/types/database'
import { Badge } from '@/components/ui'
import { MobileSidebarToggle } from './sidebar'

interface HeaderProps {
  profile: Profile | null
}

export function Header({ profile }: HeaderProps) {
  return (
    <header className="sticky top-0 z-[1000] flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-4 lg:px-6">
      {/* Mobile menu toggle */}
      <div className="flex items-center gap-4">
        <MobileSidebarToggle />
        {/* Mobile logo */}
        <span className="lg:hidden text-lg font-bold gradient-text">QRenixy</span>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3">
        {profile && (
          <>
            <Badge
              variant={profile.plan === 'free' ? 'outline' : 'primary'}
              className="capitalize hidden sm:inline-flex"
            >
              {profile.plan}
            </Badge>
            <span className="text-sm text-[var(--foreground-muted)] truncate max-w-[150px] sm:max-w-none">
              {profile.full_name || profile.email}
            </span>
            <Image
              src="/logo.webp"
              alt="QRenixy"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
          </>
        )}
      </div>
    </header>
  )
}
