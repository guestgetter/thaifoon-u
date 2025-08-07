"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { BookOpen, Clock, Play, CheckCircle } from "lucide-react"
import MainLayout from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  category: {
    name: string
    color: string
  }
  modules: Array<{
    id: string
    title: string
    lessons: Array<{
      id: string
      title: string
      duration?: number
    }>
  }>
  userProgress?: {
    progress: number
    isCompleted: boolean
  }
}

export default function CoursesPage() {
  const { data: session } = useSession()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch actual courses from API
    // For now, using mock data that matches our seed data
    setCourses([
      {
        id: "1",
        title: "Food Safety Fundamentals",
        description: "Essential food safety protocols every team member must know",
        thumbnail: "/course-thumbnails/food-safety.jpg",
        category: {
          name: "Food Safety",
          color: "#ef4444"
        },
        modules: [
          {
            id: "1",
            title: "Personal Hygiene",
            lessons: [
              { id: "1", title: "Handwashing Procedures", duration: 15 },
              { id: "2", title: "Proper Uniform and Appearance", duration: 10 }
            ]
          },
          {
            id: "2",
            title: "Temperature Control",
            lessons: [
              { id: "3", title: "Safe Food Temperatures", duration: 20 }
            ]
          }
        ],
        userProgress: {
          progress: 65,
          isCompleted: false
        }
      },
      {
        id: "2",
        title: "Customer Service Excellence",
        description: "Delivering exceptional customer experiences",
        thumbnail: "/course-thumbnails/customer-service.jpg",
        category: {
          name: "Customer Service",
          color: "#3b82f6"
        },
        modules: [
          {
            id: "3",
            title: "Guest Interaction",
            lessons: [
              { id: "4", title: "Greeting and Seating", duration: 12 },
              { id: "5", title: "Taking Orders", duration: 18 }
            ]
          }
        ],
        userProgress: {
          progress: 100,
          isCompleted: true
        }
      }
    ])
    setLoading(false)
  }, [])

  const calculateTotalDuration = (modules: Course['modules']) => {
    return modules.reduce((total, module) => {
      return total + module.lessons.reduce((moduleTotal, lesson) => {
        return moduleTotal + (lesson.duration || 0)
      }, 0)
    }, 0)
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
            <h1 className="text-3xl font-bold text-gray-900">Training Courses</h1>
            <p className="text-gray-600 mt-2">
              Expand your skills with our comprehensive training programs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const totalDuration = calculateTotalDuration(course.modules)
            const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0)
            
            return (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: course.category.color }}
                    >
                      {course.category.name}
                    </div>
                    {course.userProgress?.isCompleted && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{totalDuration}m</span>
                    </div>
                  </div>

                  {course.userProgress && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.userProgress.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-black h-2 rounded-full transition-all"
                          style={{ width: `${course.userProgress.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Button asChild className="w-full">
                    <Link href={`/courses/${course.id}`} className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      {course.userProgress?.isCompleted ? 'Review Course' : 
                       course.userProgress?.progress ? 'Continue Course' : 'Start Course'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
            <p className="text-gray-600">
              Check back later for new training courses, or contact your manager.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}