"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, FileText, Award, Clock, TrendingUp, Users } from "lucide-react"
import MainLayout from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DashboardStats {
  totalCourses: number
  completedCourses: number
  totalSOPs: number
  totalQuizzes: number
  completedQuizzes: number
  averageScore: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    completedCourses: 0,
    totalSOPs: 0,
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
  })

  useEffect(() => {
    // TODO: Fetch actual stats from API
    // For now, using mock data
    setStats({
      totalCourses: 12,
      completedCourses: 8,
      totalSOPs: 25,
      totalQuizzes: 15,
      completedQuizzes: 10,
      averageScore: 87,
    })
  }, [])

  const isAdmin = session?.user?.role === "ADMIN"
  const isManager = session?.user?.role === "MANAGER" || isAdmin

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-black rounded-2xl text-white p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {session?.user?.name}! 👋
              </h1>
              <p className="text-gray-300 text-lg">
                Continue your learning journey with Thaifoon University
              </p>
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
                Role: {session?.user?.role}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-4xl">🎓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Course Progress</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.completedCourses}/{stats.totalCourses}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.completedCourses / stats.totalCourses) * 100)}% completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SOPs Available</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSOPs}</div>
              <p className="text-xs text-muted-foreground">
                Standard Operating Procedures
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quiz Performance</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.completedQuizzes}/{stats.totalQuizzes}
              </div>
              <p className="text-xs text-muted-foreground">
                Quizzes completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                Across all quizzes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Training Courses
              </CardTitle>
              <CardDescription>
                Access interactive training modules and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Standard Operating Procedures
              </CardTitle>
              <CardDescription>
                Review and reference important operational procedures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/sops">View SOPs</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Assessments
              </CardTitle>
              <CardDescription>
                Test your knowledge with quizzes and earn certifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/quizzes">Take Quizzes</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Admin Quick Actions */}
        {isManager && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Management Tools
              </CardTitle>
              <CardDescription>
                Access administrative features for content management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="sm">
                  <Link href="/admin/users">Manage Users</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/courses">Manage Courses</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/sops">Manage SOPs</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/quizzes">Manage Quizzes</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}