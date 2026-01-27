import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[var(--foreground-muted)] mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          className={cn(
            'flex h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background-surface)] px-3 py-2 text-sm text-[var(--foreground)] transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-1 focus:ring-offset-[var(--background)] focus:border-[var(--primary)]',
            'hover:border-[var(--border-hover)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[var(--error)] focus:ring-[var(--error)]',
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-[var(--background-surface)]">
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-sm text-[var(--error)]">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
