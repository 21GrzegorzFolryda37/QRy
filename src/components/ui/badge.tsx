import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline' | 'primary' | 'secondary' | 'gradient'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--background-elevated)] text-[var(--foreground-muted)] border border-[var(--border)]',
    success: 'bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/30',
    warning: 'bg-[var(--warning)]/15 text-[var(--warning)] border border-[var(--warning)]/30',
    error: 'bg-[var(--error)]/15 text-[var(--error)] border border-[var(--error)]/30',
    outline: 'border border-[var(--border)] text-[var(--foreground-muted)] bg-transparent',
    primary: 'bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/30',
    secondary: 'bg-[var(--secondary)]/15 text-[var(--secondary)] border border-[var(--secondary)]/30',
    gradient: 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white border-0',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
