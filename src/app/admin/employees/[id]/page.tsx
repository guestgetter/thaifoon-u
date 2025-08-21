"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  AlertTriangle, 
  Clock, 
  Plus,
  Edit,
  Star,
  TrendingUp,
  FileText
} from 'lucide-react'

interface Employee {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  employeeProfile?: {
    employeeId?: string
    department?: string
    position?: string
    hireDate?: string
    phoneNumber?: string
    emergencyContact?: string
    emergencyPhone?: string
    notes?: string
  }
  employeeNotes: Array<{
    id: string
    type: string
    priority: string
    title: string
    content: string
    isPrivate: boolean
    followUpDate?: string
    isResolved: boolean
    createdAt: string
    createdBy: {
      name: string
      email: string
    }
  }>
  assessmentStats: Array<{
    quiz: { id: string, title: string }
    attempts: any[]
    totalAttempts: number
    passed: boolean
    attemptsToPass: number | null
    bestScore: number
    averageScore: number
  }>
  noteStats: {
    totalNotes: number
    notesByType: Record<string, number>
    recentNotes: number
    pendingFollowUps: number
  }
}

export default function EmployeeProfilePage() {
  const { data: session } = useSession()
  const params = useParams()
  const employeeId = params.id as string
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNoteForm, setShowNoteForm] = useState(false)

  useEffect(() => {
    if (employeeId && session?.user?.role === 'ADMIN') {
      loadEmployee()
    }
  }, [employeeId, session])

  const loadEmployee = async () => {
    try {
      const response = await fetch(`/api/admin/employees/${employeeId}`)
      if (response.ok) {
        const data = await response.json()
        setEmployee(data)
      }
    } catch (error) {
      console.error('Failed to load employee:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNoteTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'PERFORMANCE_WIN': 'bg-green-100 text-green-800',
      'PERFORMANCE_ISSUE': 'bg-red-100 text-red-800',
      'ATTENDANCE_LATE': 'bg-yellow-100 text-yellow-800',
      'ATTENDANCE_ABSENT': 'bg-orange-100 text-orange-800',
      'DISCIPLINARY_VERBAL': 'bg-red-100 text-red-800',
      'DISCIPLINARY_WRITTEN': 'bg-red-200 text-red-900',
      'DISCIPLINARY_FINAL': 'bg-red-300 text-red-900',
      'TRAINING_COMPLETED': 'bg-blue-100 text-blue-800',
      'TRAINING_NEEDED': 'bg-purple-100 text-purple-800',
      'PROMOTION': 'bg-green-200 text-green-900',
      'GENERAL': 'bg-gray-100 text-gray-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'URGENT': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'HIGH': return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'MEDIUM': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'LOW': return <Clock className="h-4 w-4 text-green-500" />
      default: return null
    }
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
          <p className="mt-4 text-gray-600">Loading employee profile...</p>
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Employee Not Found</h1>
          <p className="text-gray-600 mt-2">The requested employee could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{employee.name}</h1>
            <p className="text-gray-600">{employee.employeeProfile?.position || 'Staff Member'}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button onClick={() => setShowNoteForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {employee.assessmentStats.filter(s => s.passed).length}
                </div>
                <div className="text-sm text-gray-600">Assessments Passed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {employee.assessmentStats.length > 0 ? 
                    Math.round(employee.assessmentStats.reduce((sum, s) => sum + s.bestScore, 0) / employee.assessmentStats.length) : 0}%
                </div>
                <div className="text-sm text-gray-600">Avg Best Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{employee.noteStats.totalNotes}</div>
                <div className="text-sm text-gray-600">Total Notes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{employee.noteStats.pendingFollowUps}</div>
                <div className="text-sm text-gray-600">Pending Follow-ups</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="notes">Notes & Records</TabsTrigger>
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{employee.email}</span>
                </div>
                {employee.employeeProfile?.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{employee.employeeProfile.phoneNumber}</span>
                  </div>
                )}
                {employee.employeeProfile?.hireDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Hired: {new Date(employee.employeeProfile.hireDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{employee.role}</Badge>
                  {employee.employeeProfile?.department && (
                    <Badge variant="secondary">{employee.employeeProfile.department}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Recent Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employee.assessmentStats.slice(0, 3).map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{stat.quiz.title}</div>
                        <div className="text-sm text-gray-600">
                          {stat.totalAttempts} attempts • {stat.passed ? 'Passed' : 'Not passed'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{Math.round(stat.bestScore)}%</div>
                        <div className="text-sm text-gray-600">Best Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employee.assessmentStats.map((stat, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{stat.quiz.title}</h3>
                      <Badge variant={stat.passed ? "default" : "destructive"}>
                        {stat.passed ? "PASSED" : "NOT PASSED"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Attempts:</span>
                        <div className="font-semibold">{stat.totalAttempts}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Best Score:</span>
                        <div className="font-semibold">{Math.round(stat.bestScore)}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Average Score:</span>
                        <div className="font-semibold">{Math.round(stat.averageScore)}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Attempts to Pass:</span>
                        <div className="font-semibold">
                          {stat.attemptsToPass || 'Not yet passed'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {employee.assessmentStats.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No assessments taken yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Notes & Records
                <Button onClick={() => setShowNoteForm(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employee.employeeNotes.map((note) => (
                  <div key={note.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(note.priority)}
                        <h4 className="font-semibold">{note.title}</h4>
                        <Badge className={getNoteTypeColor(note.type)} variant="secondary">
                          {note.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{note.content}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-600">
                        By: {note.createdBy.name}
                      </div>
                      <div className="flex gap-2">
                        {note.followUpDate && !note.isResolved && (
                          <Badge variant="outline">
                            Follow-up: {new Date(note.followUpDate).toLocaleDateString()}
                          </Badge>
                        )}
                        {note.isPrivate && (
                          <Badge variant="secondary">Private</Badge>
                        )}
                        {note.isResolved && (
                          <Badge variant="default">Resolved</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {employee.employeeNotes.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No notes recorded yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Employee ID</label>
                    <div className="mt-1">{employee.employeeProfile?.employeeId || 'Not set'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Department</label>
                    <div className="mt-1">{employee.employeeProfile?.department || 'Not set'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Position</label>
                    <div className="mt-1">{employee.employeeProfile?.position || 'Not set'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Hire Date</label>
                    <div className="mt-1">
                      {employee.employeeProfile?.hireDate ? 
                        new Date(employee.employeeProfile.hireDate).toLocaleDateString() : 
                        'Not set'
                      }
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Emergency Contact</label>
                    <div className="mt-1">{employee.employeeProfile?.emergencyContact || 'Not set'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Emergency Phone</label>
                    <div className="mt-1">{employee.employeeProfile?.emergencyPhone || 'Not set'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">General Notes</label>
                    <div className="mt-1">{employee.employeeProfile?.notes || 'No notes'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}