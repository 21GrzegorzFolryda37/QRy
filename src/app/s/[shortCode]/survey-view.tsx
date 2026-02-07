'use client'

import { useState } from 'react'
import type { SurveyData, SurveyQuestion } from '@/types/database'
import { submitSurveyResponse } from './actions'

interface SurveyViewProps {
  data: SurveyData
  qrCodeId: string
  shortCode: string
}

export function SurveyView({ data, qrCodeId }: SurveyViewProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    title,
    description,
    questions,
    thankYouMessage = 'Dziękujemy za wypełnienie ankiety!',
    backgroundColor = '#0f0f14',
    textColor = '#ffffff',
  } = data

  // Sort questions by order
  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order)

  const handleSingleChoice = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleMultipleChoice = (questionId: string, value: string, checked: boolean) => {
    setAnswers((prev) => {
      const currentValues = (prev[questionId] as string[]) || []
      if (checked) {
        return { ...prev, [questionId]: [...currentValues, value] }
      } else {
        return { ...prev, [questionId]: currentValues.filter((v) => v !== value) }
      }
    })
  }

  const handleTextInput = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleRating = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const validateAnswers = (): boolean => {
    for (const question of sortedQuestions) {
      if (question.required) {
        const answer = answers[question.id]
        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
          setError(`Proszę odpowiedzieć na pytanie: "${question.question}"`)
          return false
        }
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateAnswers()) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitSurveyResponse(qrCodeId, answers)
      if (result.error) {
        setError(result.error)
      } else {
        setSubmitted(true)
      }
    } catch {
      setError('Wystąpił błąd podczas wysyłania odpowiedzi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center py-12 px-4"
        style={{ backgroundColor }}
      >
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: textColor }}>
            {thankYouMessage}
          </h1>
          <a
            href="/"
            className="inline-block text-sm opacity-50 hover:opacity-80 transition-opacity"
            style={{ color: textColor }}
          >
            Powered by QRenixy
          </a>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor }}
    >
      <div className="w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-2xl font-bold" style={{ color: textColor }}>
            {title}
          </h1>
          {description && (
            <p className="text-sm opacity-80" style={{ color: textColor }}>
              {description}
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {sortedQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              value={answers[question.id]}
              onSingleChoice={handleSingleChoice}
              onMultipleChoice={handleMultipleChoice}
              onTextInput={handleTextInput}
              onRating={handleRating}
              textColor={textColor}
            />
          ))}

          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl font-medium transition-all bg-[#8b5cf6] text-white hover:bg-[#7c3aed] disabled:opacity-50"
          >
            {isSubmitting ? 'Wysyłanie...' : 'Wyślij odpowiedzi'}
          </button>
        </form>

        {/* Branding */}
        <div className="text-center pt-8">
          <a
            href="/"
            className="text-xs opacity-50 hover:opacity-80 transition-opacity"
            style={{ color: textColor }}
          >
            Powered by QRenixy
          </a>
        </div>
      </div>
    </div>
  )
}

interface QuestionCardProps {
  question: SurveyQuestion
  index: number
  value: string | string[] | number | undefined
  onSingleChoice: (questionId: string, value: string) => void
  onMultipleChoice: (questionId: string, value: string, checked: boolean) => void
  onTextInput: (questionId: string, value: string) => void
  onRating: (questionId: string, value: number) => void
  textColor: string
}

function QuestionCard({
  question,
  index,
  value,
  onSingleChoice,
  onMultipleChoice,
  onTextInput,
  onRating,
  textColor,
}: QuestionCardProps) {
  return (
    <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
      <div className="mb-3">
        <span className="text-sm opacity-50" style={{ color: textColor }}>
          {index + 1}.
        </span>
        <span className="ml-2 font-medium" style={{ color: textColor }}>
          {question.question}
          {question.required && <span className="text-red-400 ml-1">*</span>}
        </span>
      </div>

      {/* Single choice */}
      {question.type === 'single' && (
        <div className="space-y-2">
          {question.options?.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
            >
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={value === option}
                onChange={() => onSingleChoice(question.id, option)}
                className="w-4 h-4 accent-[#8b5cf6]"
              />
              <span style={{ color: textColor }}>{option}</span>
            </label>
          ))}
        </div>
      )}

      {/* Multiple choice */}
      {question.type === 'multiple' && (
        <div className="space-y-2">
          {question.options?.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
            >
              <input
                type="checkbox"
                value={option}
                checked={(value as string[] | undefined)?.includes(option) || false}
                onChange={(e) => onMultipleChoice(question.id, option, e.target.checked)}
                className="w-4 h-4 accent-[#8b5cf6]"
              />
              <span style={{ color: textColor }}>{option}</span>
            </label>
          ))}
        </div>
      )}

      {/* Text input */}
      {question.type === 'text' && (
        <textarea
          value={(value as string) || ''}
          onChange={(e) => onTextInput(question.id, e.target.value)}
          placeholder="Twoja odpowiedź..."
          rows={3}
          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-[#8b5cf6] focus:outline-none resize-none"
          style={{ color: textColor }}
        />
      )}

      {/* Rating */}
      {question.type === 'rating' && (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onRating(question.id, rating)}
              className={`w-10 h-10 rounded-lg text-lg transition-all ${
                (value as number) >= rating
                  ? 'bg-[#8b5cf6] text-white'
                  : 'bg-white/10 text-white/50 hover:bg-white/20'
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
