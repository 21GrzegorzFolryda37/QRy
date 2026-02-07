'use client'

import { useState, useRef } from 'react'
import { useActionState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter,
} from '@/components/ui'
import { useToast } from '@/components/ui/toast'
import { Profile } from '@/types/database'
import { updateProfile, deleteAccount, type ProfileActionResponse } from '@/actions/profile'

interface SettingsClientProps {
  profile: Profile | null
  userId: string
}

export function SettingsClient({ profile, userId }: SettingsClientProps) {
  const { success, error } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Track previous state to detect changes
  const prevUpdateStateRef = useRef<ProfileActionResponse | null>(null)

  // Profile update form state
  const [updateState, updateAction, isUpdating] = useActionState<ProfileActionResponse | null, FormData>(
    async (prevState, formData) => {
      const result = await updateProfile(prevState, formData)
      return result
    },
    null
  )

  // Handle update result - compare with previous to avoid re-firing
  if (updateState && updateState !== prevUpdateStateRef.current) {
    prevUpdateStateRef.current = updateState
    if (updateState.success) {
      success('Profil zostal zaktualizowany')
      setIsEditing(false)
    } else if (updateState.error) {
      error(updateState.error)
    }
  }

  // Handle delete account
  async function handleDeleteAccount() {
    if (deleteConfirmText !== 'USUN') return

    setIsDeleting(true)
    try {
      const result = await deleteAccount()
      if (result.error) {
        error(result.error)
        setIsDeleting(false)
      }
      // If successful, user will be redirected
    } catch {
      error('Wystapil blad podczas usuwania konta')
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Ustawienia</h1>
        <p className="text-[var(--foreground-muted)]">Zarzadzaj ustawieniami konta</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Informacje o profilu</CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edytuj
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form action={updateAction} className="space-y-4">
              <Input
                name="fullName"
                label="Imie i nazwisko"
                defaultValue={profile?.full_name || ''}
                required
              />
              <Input
                label="Email"
                defaultValue={profile?.email || ''}
                disabled
                className="bg-[var(--background-surface)]"
              />
              <p className="text-xs text-[var(--foreground-subtle)]">
                Email nie moze byc zmieniony. Skontaktuj sie z pomoca techniczna, jesli potrzebujesz zmienic adres email.
              </p>
              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" isLoading={isUpdating}>
                  Zapisz zmiany
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isUpdating}
                >
                  Anuluj
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <Input
                label="Imie i nazwisko"
                defaultValue={profile?.full_name || ''}
                disabled
              />
              <Input
                label="Email"
                defaultValue={profile?.email || ''}
                disabled
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Szczegoly konta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-[var(--foreground-muted)]">ID konta</p>
              <p className="text-sm text-[var(--foreground)] font-mono">{userId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground-muted)]">Data utworzenia</p>
              <p className="text-sm text-[var(--foreground)]">
                {new Date(profile?.created_at || '').toLocaleDateString('pl-PL')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground-muted)]">Aktualny plan</p>
              <p className="text-sm text-[var(--foreground)] capitalize">{profile?.plan || 'Free'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground-muted)]">Status subskrypcji</p>
              <p className="text-sm text-[var(--foreground)] capitalize">
                {profile?.subscription_status || 'Brak'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wykorzystanie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-[var(--foreground-muted)]">Kody QR</p>
              <p className="text-sm text-[var(--foreground)]">
                {profile?.qr_limit === -1
                  ? 'Bez limitu'
                  : `Limit: ${profile?.qr_limit || 5}`}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground-muted)]">Skany miesieczne</p>
              <p className="text-sm text-[var(--foreground)]">
                {profile?.current_month_scans || 0} /{' '}
                {profile?.monthly_scan_limit === -1
                  ? 'Bez limitu'
                  : profile?.monthly_scan_limit || 1000}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[var(--error)]">Strefa niebezpieczna</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[var(--foreground-muted)]">
            Po usunieciu konta nie ma mozliwosci jego przywrocenia. Wszystkie Twoje kody QR zostana
            dezaktywowane, a dane osobowe usuniete.
          </p>
          <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
            Usun konto
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <ModalHeader>
          <ModalTitle className="text-[var(--error)]">Usun konto</ModalTitle>
          <ModalDescription>
            Ta operacja jest nieodwracalna. Wszystkie Twoje dane zostana trwale usuniete.
          </ModalDescription>
        </ModalHeader>
        <ModalContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30 p-4">
              <p className="text-sm text-[var(--error)]">
                <strong>Uwaga:</strong> Usuniecie konta spowoduje:
              </p>
              <ul className="mt-2 text-sm text-[var(--error)]/80 list-disc list-inside space-y-1">
                <li>Dezaktywacje wszystkich kodow QR</li>
                <li>Utrate dostepu do statystyk i analityki</li>
                <li>Usuniecie danych osobowych</li>
                <li>Anulowanie aktywnej subskrypcji</li>
              </ul>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Wpisz <span className="font-bold text-[var(--error)]">USUN</span> aby potwierdzic
              </label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="USUN"
                className="font-mono"
              />
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => {
              setShowDeleteModal(false)
              setDeleteConfirmText('')
            }}
            disabled={isDeleting}
          >
            Anuluj
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={deleteConfirmText !== 'USUN' || isDeleting}
            isLoading={isDeleting}
          >
            Usun konto na zawsze
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
