"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Plus, BookOpen, Search, Eye, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import CourseCreationDialog from "@/components/course-creation-dialog"
// Removed CourseEditDialog to make the pencil Edit action open the content editor directly
import CourseStructureView from "@/components/course-structure-view"
import LessonEditor from "@/components/lesson-editor"
import CourseContentEditor from "@/components/course-content-editor"

interface Course {
  id: string
  title: string
  description: string
  isPublished: boolean
  createdAt: string
  category: {
    id: string
    name: string
    color?: string
  }
  createdBy: {
    name: string
  }
  _count: {
    modules: number
  }
  modules?: Module[]
}

interface Module {
  id: string
  title: string
  description?: string
  isPublished: boolean
  order: number
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  type: 'video' | 'text' | 'file'
  duration?: string
  isPublished: boolean
  order: number
}

type View = 'list' | 'course-structure' | 'lesson-editor' | 'course-content-editor'

interface ViewState {
  view: View
  selectedCourseId?: string
  selectedLessonId?: string
  selectedModuleId?: string
}

export default function CleanCourseAdmin() {
  const { data: session } = useSession()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewState, setViewState] = useState<ViewState>({ view: 'list' })
  const [selectedCourseMeta, setSelectedCourseMeta] = useState<Course | null>(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  async function fetchCourses() {
    try {
      const response = await fetch('/api/admin/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }
  async function fetchCourseMeta(courseId: string) {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedCourseMeta(data)
      }
    } catch (error) {
      console.error('Error fetching course meta:', error)
    }
  }

  async function togglePublish(courseId: string, makePublished: boolean) {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: makePublished })
      })
      if (response.ok) {
        // Update list view state
        setCourses(prev => prev.map(c => c.id === courseId ? { ...c, isPublished: makePublished } : c))
        // Update editor header state if open
        setSelectedCourseMeta(prev => prev ? { ...prev, isPublished: makePublished } as Course : prev)
      } else {
        const err = await response.json().catch(() => ({}))
        alert(err?.error || 'Failed to update publish state')
      }
    } catch (error) {
      console.error('Publish toggle failed:', error)
      alert('Failed to update publish state')
    }
  }


  async function fetchCourseWithContent(courseId: string) {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}?includeContent=true`)
      if (response.ok) {
        const courseData = await response.json()
        return courseData
      }
    } catch (error) {
      console.error('Error fetching course content:', error)
    }
    return null
  }

  async function deleteCourse(courseId: string) {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchCourses()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete course')
      }
    } catch (error) {
      console.error('Error deleting course:', error)
      alert('Failed to delete course')
    }
  }

  const handleViewCourseStructure = async (courseId: string) => {
    const courseData = await fetchCourseWithContent(courseId)
    if (courseData) {
      setViewState({ view: 'course-structure', selectedCourseId: courseId })
    }
  }

  const handleEditLesson = (lessonId: string) => {
    setViewState({ 
      view: 'lesson-editor', 
      selectedCourseId: viewState.selectedCourseId,
      selectedLessonId: lessonId 
    })
  }

  const handleAddLesson = (moduleId: string) => {
    setViewState({ 
      view: 'lesson-editor', 
      selectedCourseId: viewState.selectedCourseId,
      selectedModuleId: moduleId 
    })
  }

  const handleAddModule = () => {
    setViewState({ 
      view: 'course-content-editor', 
      selectedCourseId: viewState.selectedCourseId 
    })
  }

  const handleBackToList = () => {
    setViewState({ view: 'list' })
  }

  const handleBackToCourse = () => {
    setViewState({ view: 'course-structure', selectedCourseId: viewState.selectedCourseId })
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Mock course data for structure view - in real implementation, this would come from the API
  const mockCourseData = {
    id: viewState.selectedCourseId || "",
    title: "Sample Course",
    description: "Course description",
    isPublished: true,
    modules: [
      {
        id: "1",
        title: "Welcome Module",
        description: "Introduction to the course",
        isPublished: true,
        order: 1,
        lessons: [
          {
            id: "1",
            title: "Welcome Aboard!",
            type: "video" as const,
            duration: "5 min",
            isPublished: true,
            order: 1
          },
          {
            id: "2",
            title: "Lesson 1: The What",
            type: "text" as const,
            isPublished: true,
            order: 2
          }
        ]
      }
    ]
  }

  if (viewState.view === 'lesson-editor') {
    return (
      <LessonEditor
        lessonId={viewState.selectedLessonId}
        moduleId={viewState.selectedModuleId || ""}
        onBack={handleBackToCourse}
        onSave={(lessonData) => {
          console.log('Save lesson:', lessonData)
          handleBackToCourse()
        }}
      />
    )
  }

  if (viewState.view === 'course-content-editor') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBackToList}>
                ← Back to Courses
              </Button>
              <h1 className="text-xl font-semibold">Course Content Editor</h1>
              {selectedCourseMeta && (
                <Badge 
                  variant={selectedCourseMeta.isPublished ? 'default' : 'secondary'}
                  className={selectedCourseMeta.isPublished ? 'bg-green-100 text-green-800' : ''}
                >
                  {selectedCourseMeta.isPublished ? 'Published' : 'Draft'}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {viewState.selectedCourseId && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/courses/${viewState.selectedCourseId}`, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-1" /> Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => togglePublish(viewState.selectedCourseId!, !(selectedCourseMeta?.isPublished))}
                  >
                    {selectedCourseMeta?.isPublished ? 'Unpublish' : 'Publish'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        <CourseContentEditor 
          courseId={viewState.selectedCourseId || ''} 
          courseName={courses.find(c => c.id === viewState.selectedCourseId)?.title || 'Course'}
        />
      </div>
    )
  }

  if (viewState.view === 'course-structure') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBackToList}>
                ← Back to Courses
              </Button>
              <h1 className="text-xl font-semibold">Course Management</h1>
            </div>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto p-6">
          <CourseStructureView
            course={mockCourseData}
            onEditLesson={handleEditLesson}
            onAddLesson={handleAddLesson}
            onAddModule={handleAddModule}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600">Create and manage your training courses</p>
        </div>
        <CourseCreationDialog onCourseCreated={fetchCourses} />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No courses found' : 'No courses yet'}
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Get started by creating your first course'
              }
            </p>
            {!searchTerm && (
              <CourseCreationDialog onCourseCreated={fetchCourses} />
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant={course.isPublished ? "default" : "secondary"}
                        className={course.isPublished ? "bg-green-100 text-green-800" : ""}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <span 
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: course.category.color || '#6B7280' }}
                      ></span>
                      <span className="text-sm text-gray-600">{course.category.name}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>{course._count.modules} module{course._count.modules !== 1 ? 's' : ''}</span>
                  <span>by {course.createdBy.name}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setViewState({ view: 'course-content-editor', selectedCourseId: course.id })
                      fetchCourseMeta(course.id)
                    }}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`/courses/${course.id}`, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => togglePublish(course.id, !course.isPublished)}
                  >
                    {course.isPublished ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteCourse(course.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}