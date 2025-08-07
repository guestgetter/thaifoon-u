"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Users, 
  BookOpen, 
  FileText, 
  Award, 
  TrendingUp, 
  Calendar,
  Settings,
  PlusCircle,
  BarChart3,
  Shield
} from "lucide-react"
import MainLayout from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalCourses: number
  publishedCourses: number
  totalSOPs: number
  activeSOPs: number
  totalQuizzes: number
  publishedQuizzes: number
  averageQuizScore: number
  coursesCompletedThisMonth: number
}

export default function AdminPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 0,
    publishedCourses: 0,
    totalSOPs: 0,
    activeSOPs: 0,
    totalQuizzes: 0,
    publishedQuizzes: 0,
    averageQuizScore: 0,
    coursesCompletedThisMonth: 0,
  })
  const [loading, setLoading] = useState(true)

  // Check admin/manager permissions
  useEffect(() => {
    if (session && !['ADMIN', 'MANAGER'].includes(session.user?.role || '')) {
      router.push('/dashboard')
      return
    }
  }, [session, router])

  useEffect(() => {
    // TODO: Fetch actual stats from API
    // For now, using mock data
    setStats({
      totalUsers: 45,
      activeUsers: 38,
      totalCourses: 12,
      publishedCourses: 8,
      totalSOPs: 25,
      activeSOPs: 23,
      totalQuizzes: 15,
      publishedQuizzes: 12,
      averageQuizScore: 87.5,
      coursesCompletedThisMonth: 156,
    })
    setLoading(false)
  }, [])

  const isAdmin = session?.user?.role === 'ADMIN'

  if (!session || !['ADMIN', 'MANAGER'].includes(session.user?.role || '')) {
    return null
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
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage content, users, and monitor training progress
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              {session.user.role} Access
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeUsers} active this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.publishedCourses}/{stats.totalCourses}
              </div>
              <p className="text-xs text-muted-foreground">
                Published/Total courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SOPs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.activeSOPs}/{stats.totalSOPs}
              </div>
              <p className="text-xs text-muted-foreground">
                Active/Total SOPs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quiz Performance</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageQuizScore}%</div>
              <p className="text-xs text-muted-foreground">
                Average score across all quizzes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user accounts, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/admin/users">Manage Users</Link>
              </Button>
              {isAdmin && (
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/users/create">Create New User</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Management
              </CardTitle>
              <CardDescription>
                Create and manage training courses and modules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/admin/courses">Manage Courses</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/courses/create">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Course
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                SOP Management
              </CardTitle>
              <CardDescription>
                Create and maintain Standard Operating Procedures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/admin/sops">Manage SOPs</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/sops/create">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create SOP
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Quiz Management
              </CardTitle>
              <CardDescription>
                Create and manage assessments and quizzes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/admin/quizzes">Manage Quizzes</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/quizzes/create">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Quiz
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics & Reports
              </CardTitle>
              <CardDescription>
                View training progress and performance analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/admin/analytics">View Analytics</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/reports">Generate Reports</Link>
              </Button>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Configure system settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/admin/settings">System Settings</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/categories">Manage Categories</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest system activity and user progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Course Completions</p>
                  <p className="text-xs text-gray-600">
                    {stats.coursesCompletedThisMonth} courses completed this month
                  </p>
                </div>
              </div>
              
              <div className="text-center text-gray-600 text-sm py-4">
                <p>Detailed activity logs and user progress tracking coming soon...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}