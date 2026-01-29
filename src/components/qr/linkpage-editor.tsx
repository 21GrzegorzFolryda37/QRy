'use client'

import { useState } from 'react'
import { Button, Input, Card, CardContent } from '@/components/ui'
import type { LinkPageData, LinkPageLink } from '@/types/database'

interface LinkPageEditorProps {
  value: LinkPageData
  onChange: (value: LinkPageData) => void
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

const defaultLink: () => LinkPageLink = () => ({
  id: generateId(),
  title: '',
  url: '',
  order: 0,
})

export const defaultLinkPageData: LinkPageData = {
  title: 'Moje linki',
  description: '',
  backgroundColor: '#0f0f14',
  textColor: '#ffffff',
  buttonColor: '#8b5cf6',
  buttonTextColor: '#ffffff',
  links: [defaultLink()],
}

export function LinkPageEditor({ value, onChange }: LinkPageEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const addLink = () => {
    const newLink = defaultLink()
    newLink.order = value.links.length
    onChange({
      ...value,
      links: [...value.links, newLink],
    })
  }

  const updateLink = (index: number, updates: Partial<LinkPageLink>) => {
    const newLinks = [...value.links]
    newLinks[index] = { ...newLinks[index], ...updates }
    onChange({ ...value, links: newLinks })
  }

  const removeLink = (index: number) => {
    const newLinks = value.links.filter((_, i) => i !== index)
    onChange({ ...value, links: newLinks })
  }

  const moveLink = (fromIndex: number, toIndex: number) => {
    const newLinks = [...value.links]
    const [movedLink] = newLinks.splice(fromIndex, 1)
    newLinks.splice(toIndex, 0, movedLink)
    // Update order
    newLinks.forEach((link, i) => {
      link.order = i
    })
    onChange({ ...value, links: newLinks })
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      moveLink(draggedIndex, index)
      setDraggedIndex(index)
    }
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className="space-y-6">
      {/* Ustawienia strony */}
      <div className="space-y-4">
        <Input
          label="Tytuł strony"
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="Moje linki"
        />
        <Input
          label="Opis (opcjonalnie)"
          value={value.description || ''}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          placeholder="Znajdź mnie w social mediach"
        />
      </div>

      {/* Kolory */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Kolor tła
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value.backgroundColor || '#0f0f14'}
              onChange={(e) => onChange({ ...value, backgroundColor: e.target.value })}
              className="h-10 w-14 rounded border border-[var(--border)] cursor-pointer"
            />
            <Input
              value={value.backgroundColor || '#0f0f14'}
              onChange={(e) => onChange({ ...value, backgroundColor: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Kolor tekstu
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value.textColor || '#ffffff'}
              onChange={(e) => onChange({ ...value, textColor: e.target.value })}
              className="h-10 w-14 rounded border border-[var(--border)] cursor-pointer"
            />
            <Input
              value={value.textColor || '#ffffff'}
              onChange={(e) => onChange({ ...value, textColor: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Kolor przycisków
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value.buttonColor || '#8b5cf6'}
              onChange={(e) => onChange({ ...value, buttonColor: e.target.value })}
              className="h-10 w-14 rounded border border-[var(--border)] cursor-pointer"
            />
            <Input
              value={value.buttonColor || '#8b5cf6'}
              onChange={(e) => onChange({ ...value, buttonColor: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Kolor tekstu przycisków
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value.buttonTextColor || '#ffffff'}
              onChange={(e) => onChange({ ...value, buttonTextColor: e.target.value })}
              className="h-10 w-14 rounded border border-[var(--border)] cursor-pointer"
            />
            <Input
              value={value.buttonTextColor || '#ffffff'}
              onChange={(e) => onChange({ ...value, buttonTextColor: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Lista linków */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Linki ({value.links.length})
        </label>

        {value.links.map((link, index) => (
          <Card
            key={link.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`cursor-move transition-opacity ${draggedIndex === index ? 'opacity-50' : ''}`}
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center justify-center pt-2 text-[var(--foreground-muted)]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    value={link.title}
                    onChange={(e) => updateLink(index, { title: e.target.value })}
                    placeholder="Tytuł linku"
                    className="text-sm"
                  />
                  <Input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(index, { url: e.target.value })}
                    placeholder="https://..."
                    className="text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="p-2 text-[var(--foreground-muted)] hover:text-[var(--error)] transition-colors"
                  disabled={value.links.length <= 1}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button type="button" variant="outline" onClick={addLink} className="w-full">
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Dodaj link
        </Button>
      </div>
    </div>
  )
}
