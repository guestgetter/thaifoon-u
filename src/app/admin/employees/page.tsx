"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  FileText, 
  Search,
  Eye,
  TrendingUp,
  Clock,
  AlertTriangle
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
  }
  employeeNotes: Array<{
    id: string
    type: string
    priority: string
    createdAt: string
  }>
  stats?: {
    totalAttempts: number
    totalQuizzesTaken: number
    totalQuizzesPassed: number
    averageScore: number
    recentNotes: number
    lastActivity: string
  }
  _count: {
    employeeNotes: number
    quizAttempts: number
  }
}

export default function EmployeesPage() {
  const { data: session } = useSession()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      loadEmployees()
    }
  }, [session])

  const loadEmployees = async () => {
    try {
      const response = await fetch('/api/admin/employees?includeStats=true')
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      }
    } catch (error) {
      console.error('Failed to load employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRecentNotesPriority = (notes: Array<{type: string, priority: string, createdAt: string}>) => {
    const recentNotes = notes.filter(note => 
      new Date(note.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    )
    
    if (recentNotes.some(n => n.priority === 'URGENT')) return 'URGENT'
    if (recentNotes.some(n => n.priority === 'HIGH')) return 'HIGH'
    if (recentNotes.some(n => n.type.includes('DISCIPLINARY'))) return 'MEDIUM'
    return 'LOW'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600'
      case 'HIGH': return 'text-orange-600'
      case 'MEDIUM': return 'text-yellow-600'
      default: return 'text-green-600'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'URGENT':
      case 'HIGH':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (employee.employeeProfile?.position?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    
    const matchesDepartment = !departmentFilter || 
                             employee.employeeProfile?.department === departmentFilter

    return matchesSearch && matchesDepartment
  })

  const departments = [...new Set(employees
    .map(e => e.employeeProfile?.department)
    .filter(Boolean)
  )]

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
          <p className="mt-4 text-gray-600">Loading employees...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Management</h1>
        <p className="text-gray-600">Manage staff profiles, track performance, and maintain HR records</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search employees by name, email, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{employees.length}</div>
                <div className="text-sm text-gray-600">Total Employees</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {employees.filter(e => e.stats && e.stats.totalQuizzesPassed > 0).length}
                </div>
                <div className="text-sm text-gray-600">Active in Training</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {employees.reduce((sum, e) => sum + e._count.employeeNotes, 0)}
                </div>
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
                <div className="text-2xl font-bold">
                  {employees.filter(e => getRecentNotesPriority(e.employeeNotes) === 'URGENT' || 
                                        getRecentNotesPriority(e.employeeNotes) === 'HIGH').length}
                </div>
                <div className="text-sm text-gray-600">Need Attention</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => {
          const notePriority = getRecentNotesPriority(employee.employeeNotes)
          
          return (
            <Card key={employee.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                      <p className="text-sm text-gray-600">{employee.employeeProfile?.position || 'Staff'}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ${getPriorityColor(notePriority)}`}>
                    {getPriorityIcon(notePriority)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{employee.email}</span>
                </div>

                {employee.employeeProfile?.department && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{employee.employeeProfile.department}</Badge>
                    <Badge variant="outline">{employee.role}</Badge>
                  </div>
                )}

                {employee.employeeProfile?.hireDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Hired: {new Date(employee.employeeProfile.hireDate).toLocaleDateString()}</span>
                  </div>
                )}

                {/* Performance Summary */}
                {employee.stats && (
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span>Avg Score:</span>
                      </div>
                      <span className="font-semibold">{Math.round(employee.stats.averageScore)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Assessments Passed:</span>
                      <span className="font-semibold">{employee.stats.totalQuizzesPassed}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Recent Notes:</span>
                      <span className="font-semibold">{employee._count.employeeNotes}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button asChild className="flex-1" size="sm">
                    <Link href={`/admin/employees/${employee.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
          <p className="text-gray-600">
            {searchTerm || departmentFilter 
              ? 'Try adjusting your search or filter criteria.'
              : 'No employees have been added yet.'
            }
          </p>
        </div>
      )}
    </div>
  )
}