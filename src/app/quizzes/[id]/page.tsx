"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import QuizInterface from '@/components/quiz-interface'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface Quiz {
  id: string
  title: string
  description?: string
  questions: Array<{
    id: string
    question: string
    answers: Array<{
      id: string
      text: string
      isCorrect: boolean
    }>
  }>
}

export default function QuizPage() {
  const { data: session } = useSession()
  const params = useParams()
  const quizId = params.id as string
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadQuiz = useCallback(async () => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`)
      if (response.ok) {
        const quizData = await response.json()
        setQuiz(quizData)
      } else if (response.status === 404) {
        setError('Quiz not found')
      } else {
        setError('Failed to load quiz')
      }
    } catch (error) {
      console.error('Failed to load quiz:', error)
      setError('Failed to load quiz')
    } finally {
      setLoading(false)
    }
  }, [quizId])

  useEffect(() => {
    if (quizId) {
      loadQuiz()
    }
  }, [quizId, loadQuiz])

  const handleQuizComplete = (result: { score: number; passed: boolean; attemptNumber: number; correctAnswers: number; totalQuestions: number; attempt: { timeTaken?: number } }) => {
    console.log('Quiz completed:', result)
    // You can add additional logic here, like redirecting or updating progress
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-gray-600">Please log in to take this assessment.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
            <p className="text-gray-600">{error || 'Quiz not found'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-gray-600">{quiz.description}</p>
          )}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-semibold">
              ✅ Passing Grade: 85% or higher
            </p>
            <p className="text-blue-700 text-sm mt-1">
              You can retake this assessment as many times as needed to achieve the passing grade.
            </p>
          </div>
        </div>
        
        <QuizInterface quiz={quiz} onComplete={handleQuizComplete} />
      </div>
    </div>
  )
}