"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface UserQuizStat {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  quiz: {
    id: string
    title: string
  }
  totalAttempts: number
  attemptsToPass: number | null
  bestScore: number
  averageScore: number
  currentlyPassed: boolean
  firstPassDate: string | null
}

interface OverallMetrics {
  totalUsers: number
  totalQuizzes: number
  totalAttempts: number
  averageAttemptsToPass: number
  passRate: number
}

interface AssessmentStatsData {
  userQuizStats: UserQuizStat[]
  overallMetrics: OverallMetrics
}

export default function AssessmentStatsPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<AssessmentStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedQuiz, setSelectedQuiz] = useState<string>('all')
  const [quizzes, setQuizzes] = useState<Array<{ id: string, title: string }>>([])

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      loadData()
      loadQuizzes()
    }
  }, [session])

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      loadData()
    }
  }, [selectedQuiz])

  const loadQuizzes = async () => {
    try {
      const response = await fetch('/api/admin/quizzes')
      if (response.ok) {
        const quizzesData = await response.json()
        setQuizzes(quizzesData)
      }
    } catch (error) {
      console.error('Failed to load quizzes:', error)
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const url = selectedQuiz === 'all' 
        ? '/api/admin/assessment-stats'
        : `/api/admin/assessment-stats?quizId=${selectedQuiz}`
        
      const response = await fetch(url)
      if (response.ok) {
        const statsData = await response.json()
        setData(statsData)
      }
    } catch (error) {
      console.error('Failed to load assessment stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAttemptsBadgeColor = (attempts: number | null) => {
    if (!attempts) return 'destructive'
    if (attempts === 1) return 'default'
    if (attempts <= 3) return 'secondary'
    return 'outline'
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return 'default'
    if (score >= 70) return 'secondary'
    return 'destructive'
  }

  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">You need admin privileges to view this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Statistics</h1>
        <p className="text-gray-600">Track staff assessment performance and attempts to reach 85% passing grade</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4">
          <label htmlFor="quiz-filter" className="text-sm font-medium">Filter by Quiz:</label>
          <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a quiz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quizzes</SelectItem>
              {quizzes.map((quiz) => (
                <SelectItem key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {data && (
        <>
          {/* Overall Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{data.overallMetrics.totalUsers}</div>
                <div className="text-sm text-gray-600">Total Staff</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{data.overallMetrics.totalQuizzes}</div>
                <div className="text-sm text-gray-600">Total Assessments</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{data.overallMetrics.totalAttempts}</div>
                <div className="text-sm text-gray-600">Total Attempts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{data.overallMetrics.averageAttemptsToPass || 'N/A'}</div>
                <div className="text-sm text-gray-600">Avg Attempts to Pass</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{data.overallMetrics.passRate}%</div>
                <div className="text-sm text-gray-600">Pass Rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Assessment Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Staff Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assessment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attempts to Pass
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Attempts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Best Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Average Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        First Pass Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.userQuizStats.map((stat, index) => (
                      <tr key={`${stat.user.id}-${stat.quiz.id}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{stat.user.name}</div>
                            <div className="text-sm text-gray-500">{stat.user.email}</div>
                            <Badge variant="outline" className="text-xs">
                              {stat.user.role}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{stat.quiz.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={stat.currentlyPassed ? "default" : "destructive"}>
                            {stat.currentlyPassed ? "PASSED" : "NOT PASSED"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getAttemptsBadgeColor(stat.attemptsToPass)}>
                            {stat.attemptsToPass || 'N/A'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stat.totalAttempts}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getScoreBadgeColor(stat.bestScore)}>
                            {Math.round(stat.bestScore)}%
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {Math.round(stat.averageScore)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stat.firstPassDate ? new Date(stat.firstPassDate).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.userQuizStats.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No assessment data available for the selected criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.userQuizStats.filter(s => s.attemptsToPass && s.attemptsToPass > 3).length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-800">Staff Needing Support</h4>
                      <p className="text-sm text-yellow-700">
                        {data.userQuizStats.filter(s => s.attemptsToPass && s.attemptsToPass > 3).length} staff members 
                        required more than 3 attempts to pass. Consider additional training.
                      </p>
                    </div>
                  )}
                  
                  {data.userQuizStats.filter(s => s.attemptsToPass === 1).length > 0 && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800">Excellent Performers</h4>
                      <p className="text-sm text-green-700">
                        {data.userQuizStats.filter(s => s.attemptsToPass === 1).length} staff members 
                        passed on their first attempt!
                      </p>
                    </div>
                  )}
                  
                  {data.userQuizStats.filter(s => !s.currentlyPassed).length > 0 && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800">Pending Assessments</h4>
                      <p className="text-sm text-red-700">
                        {data.userQuizStats.filter(s => !s.currentlyPassed).length} staff members 
                        have not yet achieved the 85% passing grade.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.print()}
                  >
                    Export Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={loadData}
                  >
                    Refresh Data
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = '/admin'}
                  >
                    Back to Admin
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}