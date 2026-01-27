'use client'

import * as React from 'react'
import { useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  overlayClassName?: string
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
}

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  overlayClassName,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
}: ModalProps) {
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose()
      }
    },
    [onClose, closeOnEscape]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200',
          overlayClassName
        )}
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            'relative w-full max-w-lg bg-[var(--background)] rounded-xl shadow-2xl animate-in zoom-in-95 duration-200',
            'border border-[var(--border)]',
            className
          )}
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg text-[var(--foreground-muted)] hover:bg-[var(--background-surface)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Zamknij"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

export interface ModalHeaderProps {
  children: React.ReactNode
  className?: string
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
  return <div className={cn('px-6 pt-6 pb-2', className)}>{children}</div>
}

export interface ModalTitleProps {
  children: React.ReactNode
  className?: string
}

export function ModalTitle({ children, className }: ModalTitleProps) {
  return <h2 className={cn('text-lg font-semibold text-[var(--foreground)]', className)}>{children}</h2>
}

export interface ModalDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function ModalDescription({ children, className }: ModalDescriptionProps) {
  return <p className={cn('mt-1 text-sm text-[var(--foreground-muted)]', className)}>{children}</p>
}

export interface ModalContentProps {
  children: React.ReactNode
  className?: string
}

export function ModalContent({ children, className }: ModalContentProps) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}

export interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return <div className={cn('px-6 pb-6 pt-2 flex justify-end gap-3', className)}>{children}</div>
}

// Confirmation modal preset
export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  isLoading?: boolean
  children?: React.ReactNode
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Potwierdz',
  cancelText = 'Anuluj',
  variant = 'default',
  isLoading = false,
  children,
}: ConfirmModalProps) {
  // Import Button dynamically to avoid circular dependency
  const Button = React.lazy(() => import('./button').then((mod) => ({ default: mod.Button })))

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle className={variant === 'destructive' ? 'text-[var(--error)]' : ''}>{title}</ModalTitle>
        {description && <ModalDescription>{description}</ModalDescription>}
      </ModalHeader>

      {children && <ModalContent>{children}</ModalContent>}

      <ModalFooter>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </React.Suspense>
      </ModalFooter>
    </Modal>
  )
}
