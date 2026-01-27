import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link' | 'gradient' | 'primary' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50'

    const variants = {
      default: 'bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--foreground-muted)]',
      destructive: 'bg-[var(--error)] text-white hover:bg-red-500',
      outline: 'border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--background-surface)] hover:border-[var(--border-hover)]',
      ghost: 'text-[var(--foreground-muted)] hover:bg-[var(--background-surface)] hover:text-[var(--foreground)]',
      link: 'text-[var(--primary)] underline-offset-4 hover:underline hover:text-[var(--primary-hover)]',
      gradient: 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white hover:opacity-90 shadow-lg shadow-[var(--primary-muted)]',
      primary: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-md shadow-[var(--primary-muted)]',
      secondary: 'bg-[var(--secondary)] text-white hover:bg-[var(--secondary-hover)] shadow-md shadow-[var(--secondary-muted)]',
    }

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3 text-xs',
      lg: 'h-12 rounded-lg px-8 text-base',
      icon: 'h-10 w-10',
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
