'use client'

import { useState } from 'react'
import { Button, Input, Card, CardContent } from '@/components/ui'
import type { SurveyData, SurveyQuestion } from '@/types/database'

interface SurveyEditorProps {
  value: SurveyData
  onChange: (value: SurveyData) => void
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

const questionTypes = [
  { id: 'single', label: 'Jednokrotny wybór', icon: '○' },
  { id: 'multiple', label: 'Wielokrotny wybór', icon: '☐' },
  { id: 'text', label: 'Tekst', icon: '✎' },
  { id: 'rating', label: 'Ocena (1-5)', icon: '★' },
] as const

const defaultQuestion: () => SurveyQuestion = () => ({
  id: generateId(),
  question: '',
  type: 'single',
  options: ['Opcja 1', 'Opcja 2'],
  required: false,
  order: 0,
})

export const defaultSurveyData: SurveyData = {
  title: 'Moja ankieta',
  description: '',
  questions: [defaultQuestion()],
  thankYouMessage: 'Dziękujemy za wypełnienie ankiety!',
  backgroundColor: '#0f0f14',
  textColor: '#ffffff',
}

export function SurveyEditor({ value, onChange }: SurveyEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const addQuestion = () => {
    const newQuestion = defaultQuestion()
    newQuestion.order = value.questions.length
    onChange({
      ...value,
      questions: [...value.questions, newQuestion],
    })
  }

  const updateQuestion = (index: number, updates: Partial<SurveyQuestion>) => {
    const newQuestions = [...value.questions]
    newQuestions[index] = { ...newQuestions[index], ...updates }
    onChange({ ...value, questions: newQuestions })
  }

  const removeQuestion = (index: number) => {
    const newQuestions = value.questions.filter((_, i) => i !== index)
    onChange({ ...value, questions: newQuestions })
  }

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    const newQuestions = [...value.questions]
    const [movedQuestion] = newQuestions.splice(fromIndex, 1)
    newQuestions.splice(toIndex, 0, movedQuestion)
    newQuestions.forEach((q, i) => {
      q.order = i
    })
    onChange({ ...value, questions: newQuestions })
  }

  const addOption = (questionIndex: number) => {
    const question = value.questions[questionIndex]
    const newOptions = [...(question.options || []), `Opcja ${(question.options?.length || 0) + 1}`]
    updateQuestion(questionIndex, { options: newOptions })
  }

  const updateOption = (questionIndex: number, optionIndex: number, newValue: string) => {
    const question = value.questions[questionIndex]
    const newOptions = [...(question.options || [])]
    newOptions[optionIndex] = newValue
    updateQuestion(questionIndex, { options: newOptions })
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = value.questions[questionIndex]
    const newOptions = (question.options || []).filter((_, i) => i !== optionIndex)
    updateQuestion(questionIndex, { options: newOptions })
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      moveQuestion(draggedIndex, index)
      setDraggedIndex(index)
    }
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className="space-y-6">
      {/* Ustawienia ankiety */}
      <div className="space-y-4">
        <Input
          label="Tytuł ankiety"
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="Moja ankieta"
        />
        <Input
          label="Opis (opcjonalnie)"
          value={value.description || ''}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          placeholder="Wypełnij krótką ankietę"
        />
        <Input
          label="Wiadomość po wypełnieniu"
          value={value.thankYouMessage || ''}
          onChange={(e) => onChange({ ...value, thankYouMessage: e.target.value })}
          placeholder="Dziękujemy za wypełnienie ankiety!"
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
      </div>

      {/* Lista pytań */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Pytania ({value.questions.length})
        </label>

        {value.questions.map((question, qIndex) => (
          <Card
            key={question.id}
            draggable
            onDragStart={() => handleDragStart(qIndex)}
            onDragOver={(e) => handleDragOver(e, qIndex)}
            onDragEnd={handleDragEnd}
            className={`transition-opacity ${draggedIndex === qIndex ? 'opacity-50' : ''}`}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center justify-center pt-2 text-[var(--foreground-muted)] cursor-move">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                </div>
                <div className="flex-1 space-y-3">
                  {/* Pytanie */}
                  <Input
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, { question: e.target.value })}
                    placeholder="Treść pytania"
                  />

                  {/* Typ pytania */}
                  <div className="flex flex-wrap gap-2">
                    {questionTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => updateQuestion(qIndex, { type: type.id })}
                        className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                          question.type === type.id
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                            : 'border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--foreground-subtle)]'
                        }`}
                      >
                        <span className="mr-1">{type.icon}</span>
                        {type.label}
                      </button>
                    ))}
                  </div>

                  {/* Opcje dla single/multiple */}
                  {(question.type === 'single' || question.type === 'multiple') && (
                    <div className="space-y-2 pl-4 border-l-2 border-[var(--border)]">
                      {question.options?.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <span className="text-[var(--foreground-muted)]">
                            {question.type === 'single' ? '○' : '☐'}
                          </span>
                          <Input
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            placeholder={`Opcja ${oIndex + 1}`}
                            className="flex-1 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(qIndex, oIndex)}
                            className="p-1 text-[var(--foreground-muted)] hover:text-[var(--error)]"
                            disabled={(question.options?.length || 0) <= 2}
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(qIndex)}
                        className="text-sm text-[var(--primary)] hover:underline"
                      >
                        + Dodaj opcję
                      </button>
                    </div>
                  )}

                  {/* Wymagane */}
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={question.required}
                      onChange={(e) => updateQuestion(qIndex, { required: e.target.checked })}
                      className="h-4 w-4 rounded border-[var(--border)]"
                    />
                    <span className="text-[var(--foreground-muted)]">Wymagane</span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="p-2 text-[var(--foreground-muted)] hover:text-[var(--error)] transition-colors"
                  disabled={value.questions.length <= 1}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Dodaj pytanie
        </Button>
      </div>
    </div>
  )
}
