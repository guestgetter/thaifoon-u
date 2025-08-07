'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import MainLayout from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, CheckCircle, Clock, FileText, Video, Download, ExternalLink } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  content: string
  contentType: 'VIDEO' | 'TEXT' | 'FILE' | 'MIXED'
  videoUrl?: string
  fileUrl?: string
  duration?: number
  isRequired: boolean
  orderIndex: number
  module: {
    id: string
    title: string
    course: {
      id: string
      title: string
    }
  }
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [navigation, setNavigation] = useState<{
    previous: { id: string; title: string; moduleTitle: string } | null
    next: { id: string; title: string; moduleTitle: string } | null
    current: { index: number; total: number }
  } | null>(null)

  useEffect(() => {
    async function fetchLessonData() {
      try {
        // Fetch lesson and navigation data in parallel
        const [lessonResponse, navResponse] = await Promise.all([
          fetch(`/api/lessons/${params.lessonId}`),
          fetch(`/api/lessons/${params.lessonId}/navigation`)
        ])

        if (!lessonResponse.ok) {
          throw new Error('Lesson not found')
        }

        const lessonData = await lessonResponse.json()
        setLesson(lessonData)

        if (navResponse.ok) {
          const navData = await navResponse.json()
          setNavigation(navData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lesson')
      } finally {
        setLoading(false)
      }
    }

    if (params.lessonId) {
      fetchLessonData()
    }
  }, [params.lessonId])

  const handleMarkComplete = async () => {
    if (!lesson) return

    try {
      const response = await fetch(`/api/lessons/${lesson.id}/complete`, {
        method: 'POST'
      })
      
      if (response.ok) {
        setCompleted(true)
        
        // Auto-advance to next lesson after a short delay
        setTimeout(() => {
          if (navigation?.next) {
            router.push(`/courses/${lesson.module.course.id}/lessons/${navigation.next.id}`)
          } else {
            // If this was the last lesson, go back to course overview
            handleBackToCourse()
          }
        }, 1500)
      }
    } catch (error) {
      console.error('Error marking lesson as complete:', error)
    }
  }

  const handleBackToCourse = () => {
    if (lesson) {
      router.push(`/courses/${lesson.module.course.id}`)
    }
  }

  const getVideoEmbedUrl = (url: string) => {
    // Convert YouTube URLs to embed format
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    // Convert Vimeo URLs to embed format
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]
      return `https://player.vimeo.com/video/${videoId}`
    }
    return url
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </MainLayout>
    )
  }

  if (error || !lesson) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested lesson could not be found.'}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBackToCourse}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">{lesson.module.course.title}</p>
            <p className="text-sm text-gray-600">{lesson.module.title}</p>
            {navigation && (
              <p className="text-xs text-gray-500">
                Lesson {navigation.current.index} of {navigation.current.total}
              </p>
            )}
          </div>
        </div>

        {/* Lesson Content */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{lesson.title}</CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    {lesson.contentType === 'VIDEO' && <Video className="h-4 w-4" />}
                    {lesson.contentType === 'FILE' && <FileText className="h-4 w-4" />}
                    {lesson.contentType === 'TEXT' && <FileText className="h-4 w-4" />}
                    {lesson.contentType === 'MIXED' && <FileText className="h-4 w-4" />}
                    <span className="capitalize">{lesson.contentType.toLowerCase()}</span>
                  </div>
                  {lesson.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{lesson.duration} minutes</span>
                    </div>
                  )}
                  {lesson.isRequired && (
                    <span className="bg-black text-white px-2 py-1 rounded text-xs font-medium">
                      Required
                    </span>
                  )}
                </div>
              </div>
              
              {completed ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              ) : (
                <Button onClick={handleMarkComplete}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Video Content */}
            {(lesson.contentType === 'VIDEO' || lesson.contentType === 'MIXED') && lesson.videoUrl && (
              <div className="aspect-video">
                <iframe
                  src={getVideoEmbedUrl(lesson.videoUrl)}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  title={lesson.title}
                />
              </div>
            )}

            {/* File Content */}
            {(lesson.contentType === 'FILE' || lesson.contentType === 'MIXED') && lesson.fileUrl && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-gray-600" />
                    <div>
                      <h4 className="font-medium">Course Material</h4>
                      <p className="text-sm text-gray-600">Download or view the lesson file</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={lesson.fileUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={lesson.fileUrl} download>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Text Content */}
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {lesson.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          {navigation?.previous ? (
            <Button 
              variant="outline"
              onClick={() => router.push(`/courses/${lesson?.module.course.id}/lessons/${navigation.previous!.id}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous: {navigation.previous.title}
            </Button>
          ) : (
            <div></div>
          )}
          
          {navigation?.next ? (
            <Button
              onClick={() => router.push(`/courses/${lesson?.module.course.id}/lessons/${navigation.next!.id}`)}
            >
              Next: {navigation.next.title}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleBackToCourse}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Course
            </Button>
          )}
        </div>
      </div>
    </MainLayout>
  )
}