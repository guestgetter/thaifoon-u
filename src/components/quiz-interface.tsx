"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Answer {
  id: string
  text: string
  isCorrect: boolean
}

interface Question {
  id: string
  question: string
  answers: Answer[]
}

interface Quiz {
  id: string
  title: string
  description?: string
  questions: Question[]
}

interface AttemptStats {
  totalAttempts: number
  bestScore: number
  averageScore: number
  attemptsToPass: number | null
  currentlyPassed: boolean
}

interface QuizInterfaceProps {
  quiz: Quiz
  onComplete?: (result: { score: number; passed: boolean; attemptNumber: number; correctAnswers: number; totalQuestions: number; attempt: { timeTaken?: number } }) => void
}

export default function QuizInterface({ quiz, onComplete }: QuizInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{ score: number; passed: boolean; attemptNumber: number; correctAnswers: number; totalQuestions: number; attempt: { timeTaken?: number } } | null>(null)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<AttemptStats | null>(null)
  const [startTime, setStartTime] = useState<Date>(new Date())

  const loadAttemptStats = useCallback(async () => {
    try {
      const response = await fetch(`/api/quizzes/${quiz.id}/attempts`)
      if (response.ok) {
        const data = await response.json()
        setStats(data.statistics)
      }
    } catch (error) {
      console.error('Failed to load attempt stats:', error)
    }
  }, [quiz.id])

  useEffect(() => {
    // Load previous attempt statistics
    loadAttemptStats()
    setStartTime(new Date())
  }, [quiz.id, loadAttemptStats])

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }))
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      const timeTaken = Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
      
      const response = await fetch(`/api/quizzes/${quiz.id}/attempt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          timeTaken
        })
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
        setSubmitted(true)
        
        // Reload stats to show updated attempt count
        await loadAttemptStats()
        
        onComplete?.(data)
      } else {
        throw new Error('Failed to submit quiz')
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error)
      alert('Failed to submit quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRetake = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setSubmitted(false)
    setResult(null)
    setStartTime(new Date())
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isAllAnswered = quiz.questions.every(q => answers[q.id])

  if (submitted && result) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Quiz Results
            <Badge variant={result.passed ? "default" : "destructive"}>
              {result.passed ? "PASSED" : "FAILED"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {Math.round(result.score)}%
            </div>
            <div className="text-gray-600">
              {result.correctAnswers} out of {result.totalQuestions} correct
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Attempt Number:</span>
              <div className="text-lg">{result.attemptNumber}</div>
            </div>
            <div>
              <span className="font-semibold">Time Taken:</span>
              <div className="text-lg">
                {result.attempt.timeTaken ? formatTime(result.attempt.timeTaken) : 'N/A'}
              </div>
            </div>
          </div>

          {stats && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Your Performance History</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Attempts:</span>
                  <div className="font-semibold">{stats.totalAttempts}</div>
                </div>
                <div>
                  <span className="text-gray-600">Best Score:</span>
                  <div className="font-semibold">{Math.round(stats.bestScore)}%</div>
                </div>
                <div>
                  <span className="text-gray-600">Average Score:</span>
                  <div className="font-semibold">{Math.round(stats.averageScore)}%</div>
                </div>
                <div>
                  <span className="text-gray-600">Attempts to Pass:</span>
                  <div className="font-semibold">
                    {stats.attemptsToPass ? stats.attemptsToPass : 'Not yet passed'}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {result.score < 85 && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-yellow-800">
                  <strong>Need 85% to pass.</strong> Review the material and try again when ready.
                </p>
              </div>
            )}
            
            {result.passed && result.attemptNumber === 1 && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-green-800">
                  <strong>Excellent!</strong> You passed on your first attempt!
                </p>
              </div>
            )}

            <div className="flex gap-3">
              {result.score < 85 && (
                <Button onClick={handleRetake} className="flex-1">
                  Retake Quiz
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="flex-1"
              >
                Back to Course
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {quiz.title}
          {stats && stats.totalAttempts > 0 && (
            <Badge variant="outline">
              Attempt #{(stats.totalAttempts || 0) + 1}
            </Badge>
          )}
        </CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm text-gray-600">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {stats && stats.totalAttempts > 0 && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Previous attempts:</strong> {stats.totalAttempts} | 
              <strong> Best score:</strong> {Math.round(stats.bestScore)}% |
              {stats.currentlyPassed ? (
                <span className="text-green-600"> ✓ Already passed in {stats.attemptsToPass} attempts</span>
              ) : (
                <span> Working toward 85% passing grade</span>
              )}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
          
          <div className="space-y-3">
            {currentQ.answers.map((answer) => (
              <label
                key={answer.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  answers[currentQ.id] === answer.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={currentQ.id}
                  value={answer.id}
                  checked={answers[currentQ.id] === answer.id}
                  onChange={() => handleAnswerSelect(currentQ.id, answer.id)}
                  className="mr-3"
                />
                <span>{answer.text}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!isAllAnswered || loading}
            >
              {loading ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!answers[currentQ.id]}
            >
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}