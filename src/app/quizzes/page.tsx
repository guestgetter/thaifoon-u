"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Award, Clock, Users, Target, CheckCircle, AlertCircle, Play } from "lucide-react"
import MainLayout from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Quiz {
  id: string
  title: string
  description: string
  passingScore: number
  maxAttempts: number
  timeLimit?: number
  isPublished: boolean
  createdAt: string
  questions: Array<{
    id: string
    points: number
  }>
  userAttempts?: Array<{
    id: string
    score: number
    passed: boolean
    completedAt: string
  }>
}

export default function QuizzesPage() {
  const { data: session } = useSession()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/quizzes')
        if (res.ok) {
          const data = await res.json()
          setQuizzes(data)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getQuizStatus = (quiz: Quiz) => {
    if (!quiz.userAttempts || quiz.userAttempts.length === 0) {
      return {
        status: 'not_started',
        text: 'Not Started',
        color: 'text-gray-600',
        icon: Play
      }
    }

    const latestAttempt = quiz.userAttempts[quiz.userAttempts.length - 1]
    
    if (latestAttempt.passed) {
      return {
        status: 'passed',
        text: `Passed (${latestAttempt.score}%)`,
        color: 'text-green-600',
        icon: CheckCircle
      }
    }

    if (quiz.userAttempts.length >= quiz.maxAttempts) {
      return {
        status: 'failed',
        text: 'Max Attempts Reached',
        color: 'text-gray-700',
        icon: AlertCircle
      }
    }

    return {
      status: 'in_progress',
      text: `Last Score: ${latestAttempt.score}%`,
      color: 'text-yellow-600',
      icon: AlertCircle
    }
  }

  const canTakeQuiz = (quiz: Quiz) => {
    if (!quiz.userAttempts || quiz.userAttempts.length === 0) return true
    
    const latestAttempt = quiz.userAttempts[quiz.userAttempts.length - 1]
    return !latestAttempt.passed && quiz.userAttempts.length < quiz.maxAttempts
  }

  const getTotalPoints = (questions: Quiz['questions']) => {
    return questions.reduce((total, question) => total + question.points, 0)
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quizzes & Assessments</h1>
            <p className="text-gray-600 mt-2">
              Test your knowledge and earn certifications
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => {
            const status = getQuizStatus(quiz)
            const StatusIcon = status.icon
            const totalPoints = getTotalPoints(quiz.questions)
            
            return (
              <Card key={quiz.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-medium">Quiz</span>
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${status.color}`}>
                      <StatusIcon className="h-4 w-4" />
                      <span>{status.text}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {quiz.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Target className="h-4 w-4" />
                      <span>{quiz.questions.length} questions</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{totalPoints} points</span>
                    </div>
                    {quiz.timeLimit && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{quiz.timeLimit}m limit</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-gray-600">
                      <Target className="h-4 w-4" />
                      <span>{quiz.passingScore}% to pass</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div>Attempts: {quiz.userAttempts?.length || 0}/{quiz.maxAttempts}</div>
                  </div>

                  {quiz.userAttempts && quiz.userAttempts.length > 0 && (
                    <div className="border-t pt-3 space-y-2">
                      <h4 className="text-sm font-medium">Previous Attempts:</h4>
                      {quiz.userAttempts.map((attempt, index) => (
                        <div key={attempt.id} className="flex justify-between items-center text-sm">
                          <span>Attempt {index + 1}</span>
                          <div className="flex items-center gap-2">
                            <span className={attempt.passed ? 'text-black' : 'text-gray-600'}>
                              {attempt.score}%
                            </span>
                            {attempt.passed && <CheckCircle className="h-3 w-3 text-green-600" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button 
                    asChild 
                    className="w-full" 
                    disabled={!canTakeQuiz(quiz)}
                    variant={status.status === 'passed' ? 'outline' : 'default'}
                  >
                    <Link href={`/quizzes/${quiz.id}`} className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      {status.status === 'passed' ? 'Review Quiz' :
                       status.status === 'in_progress' ? 'Retake Quiz' : 
                       status.status === 'failed' ? 'Max Attempts' : 'Start Quiz'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes available</h3>
            <p className="text-gray-600">
              Check back later for new assessments, or contact your manager.
            </p>
          </div>
        )}

        {/* Quiz Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quiz Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <ul className="list-disc list-inside space-y-1">
              <li>Read each question carefully before selecting your answer</li>
              <li>You can review and change answers before submitting</li>
              <li>Time limits are enforced - save frequently if available</li>
              <li>Passing scores vary by quiz - check requirements before starting</li>
              <li>You have limited attempts per quiz - use them wisely</li>
              <li>Contact your supervisor if you need additional help or attempts</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}