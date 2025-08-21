'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import MainLayout from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, User, BookOpen, CheckCircle, PlayCircle } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string | null
  isPublished: boolean
  category: {
    name: string
    color: string | null
  }
  createdBy: {
    name: string
  }
  modules: Array<{
    id: string
    title: string
    description: string | null
    orderIndex: number
          lessons: Array<{
        id: string
        title: string
        content: string
        contentType: string
        videoUrl: string | null
        fileUrl: string | null
        duration: number | null
        orderIndex: number
        isRequired: boolean
        userProgress: Array<{
          isCompleted: boolean
          progress: number
        }>
      }>
  }>
}

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(`/api/courses/${params.id}`)
        if (!response.ok) {
          throw new Error('Course not found')
        }
        const data = await response.json()
        setCourse(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCourse()
    }
  }, [params.id])

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </MainLayout>
    )
  }

  if (error || !course) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested course could not be found.'}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </MainLayout>
    )
  }

  const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0)
  const totalDuration = course.modules.reduce((total, module) => 
    total + module.lessons.reduce((moduleTotal, lesson) => moduleTotal + (lesson.duration || 0), 0), 0
  )
  
  // Calculate progress
  const completedLessons = course.modules.reduce((total, module) => 
    total + module.lessons.filter(lesson => lesson.userProgress?.[0]?.isCompleted).length, 0
  )
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const startCourse = () => {
    // Find the first lesson in the first module
    const firstModule = course.modules.sort((a, b) => a.orderIndex - b.orderIndex)[0]
    if (firstModule && firstModule.lessons.length > 0) {
      const firstLesson = firstModule.lessons.sort((a, b) => a.orderIndex - b.orderIndex)[0]
      router.push(`/courses/${course.id}/lessons/${firstLesson.id}`)
    }
  }

  const startLesson = (lessonId: string) => {
    router.push(`/courses/${course.id}/lessons/${lessonId}`)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Course Header */}
        <div className="bg-black text-white rounded-2xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                  {course.category.name}
                </span>
                {course.isPublished && (
                  <span className="px-3 py-1 bg-green-500 bg-opacity-20 rounded-full text-sm font-medium text-green-100">
                    Published
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-gray-300 text-lg mb-6">{course.description}</p>
              
              <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{Math.round(totalDuration / 60)} hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Created by {course.createdBy.name}</span>
                </div>
              </div>
              
              {/* Progress Display */}
              {progressPercentage > 0 && (
                <div className="mt-6 p-4 bg-white bg-opacity-10 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Your Progress</span>
                    <span className="text-sm">{completedLessons}/{totalLessons} lessons</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-sm font-bold">{progressPercentage}% Complete</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full rounded-lg shadow-lg"
                />
              )}
            </div>
          </div>
        </div>

        {/* Course Modules */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
          
          {course.modules
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((module, moduleIndex) => (
              <Card key={module.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-black text-white rounded-full text-sm font-bold">
                      {moduleIndex + 1}
                    </span>
                    {module.title}
                  </CardTitle>
                  {module.description && (
                    <CardDescription>{module.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {module.lessons
                      .sort((a, b) => a.orderIndex - b.orderIndex)
                      .map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                              lesson.userProgress?.[0]?.isCompleted 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {lesson.userProgress?.[0]?.isCompleted ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                lessonIndex + 1
                              )}
                            </span>
                            <div>
                              <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                {lesson.contentType === 'VIDEO' && (
                                  <div className="flex items-center gap-1">
                                    <PlayCircle className="h-3 w-3" />
                                    <span>Video</span>
                                  </div>
                                )}
                                {lesson.duration && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{lesson.duration} min</span>
                                  </div>
                                )}
                                {lesson.isRequired && (
                                  <span className="text-black font-medium">Required</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => startLesson(lesson.id)}
                            >
                              Start Lesson
                            </Button>
                            <CheckCircle className="h-5 w-5 text-gray-300" />
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Course Actions */}
        <div className="flex justify-center pt-6">
          <Button size="lg" className="px-8" onClick={startCourse}>
            Start Course
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}