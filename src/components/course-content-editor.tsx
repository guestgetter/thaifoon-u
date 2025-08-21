"use client"

import { useState, useEffect } from "react"
import { BookOpen, Plus, Edit2, Trash2, ChevronDown, ChevronRight, Play, FileText, Video, Link, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
}

interface Module {
  id: string
  title: string
  description?: string
  orderIndex: number
  lessons: Lesson[]
}

interface CourseContentEditorProps {
  courseId: string
  courseName: string
}

export default function CourseContentEditor({ courseId, courseName }: CourseContentEditorProps) {
  const [open, setOpen] = useState(false)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  // Module dialog state
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [moduleForm, setModuleForm] = useState({ title: '', description: '' })

  // Lesson dialog state
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [currentModuleId, setCurrentModuleId] = useState<string>('')
  const [lessonForm, setLessonForm] = useState({
    title: '',
    content: '',
    contentType: 'TEXT' as 'TEXT' | 'VIDEO' | 'FILE' | 'MIXED',
    videoUrl: '',
    fileUrl: '',
    duration: '',
    isRequired: true
  })

  useEffect(() => {
    fetchModules()
  }, [courseId])

  async function fetchModules() {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/courses/${courseId}/modules`)
      if (response.ok) {
        const data = await response.json()
        setModules(data)
        // Expand all modules by default
        setExpandedModules(new Set(data.map((m: Module) => m.id)))
      }
    } catch (error) {
      console.error('Error fetching modules:', error)
    } finally {
      setLoading(false)
    }
  }

  // Module management
  async function handleModuleSubmit() {
    if (!moduleForm.title) {
      alert('Module title is required')
      return
    }

    try {
      const url = editingModule 
        ? `/api/admin/modules/${editingModule.id}` 
        : `/api/admin/courses/${courseId}/modules`
      
      const method = editingModule ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleForm)
      })

      if (response.ok) {
        await fetchModules()
        setModuleDialogOpen(false)
        setEditingModule(null)
        setModuleForm({ title: '', description: '' })
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save module')
      }
    } catch (error) {
      console.error('Error saving module:', error)
      alert('Failed to save module')
    }
  }

  async function deleteModule(moduleId: string) {
    if (!confirm('Are you sure you want to delete this module? This will also delete all lessons in it.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/modules/${moduleId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchModules()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete module')
      }
    } catch (error) {
      console.error('Error deleting module:', error)
      alert('Failed to delete module')
    }
  }

  // Lesson management
  async function handleLessonSubmit() {
    if (!lessonForm.title || !lessonForm.content) {
      alert('Lesson title and content are required')
      return
    }

    try {
      const url = editingLesson 
        ? `/api/admin/lessons/${editingLesson.id}` 
        : `/api/admin/modules/${currentModuleId}/lessons`
      
      const method = editingLesson ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonForm)
      })

      if (response.ok) {
        await fetchModules()
        setLessonDialogOpen(false)
        setEditingLesson(null)
        setLessonForm({
          title: '',
          content: '',
          contentType: 'TEXT',
          videoUrl: '',
          fileUrl: '',
          duration: '',
          isRequired: true
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save lesson')
      }
    } catch (error) {
      console.error('Error saving lesson:', error)
      alert('Failed to save lesson')
    }
  }

  async function deleteLesson(lessonId: string) {
    if (!confirm('Are you sure you want to delete this lesson?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchModules()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete lesson')
      }
    } catch (error) {
      console.error('Error deleting lesson:', error)
      alert('Failed to delete lesson')
    }
  }

  function openModuleDialog(module?: Module) {
    setEditingModule(module || null)
    setModuleForm({
      title: module?.title || '',
      description: module?.description || ''
    })
    setModuleDialogOpen(true)
  }

  function openLessonDialog(moduleId: string, lesson?: Lesson) {
    setCurrentModuleId(moduleId)
    setEditingLesson(lesson || null)
    setLessonForm({
      title: lesson?.title || '',
      content: lesson?.content || '',
      contentType: lesson?.contentType || 'TEXT',
      videoUrl: lesson?.videoUrl || '',
      fileUrl: lesson?.fileUrl || '',
      duration: lesson?.duration?.toString() || '',
      isRequired: lesson?.isRequired !== undefined ? lesson.isRequired : true
    })
    setLessonDialogOpen(true)
  }

  function toggleModule(moduleId: string) {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
  }

  function getContentIcon(contentType: string) {
    switch (contentType) {
      case 'VIDEO': return <Video className="h-4 w-4" />
      case 'FILE': return <Link className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BookOpen className="h-4 w-4 mr-2" />
          Edit Content
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Course Content Editor</DialogTitle>
          <DialogDescription>
            Manage modules and lessons for &quot;{courseName}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Modules ({modules.length})</h3>
            <Button onClick={() => openModuleDialog()} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          )}

          <div className="space-y-4">
            {modules.map((module) => (
              <Card key={module.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleModule(module.id)}
                      >
                        {expandedModules.has(module.id) ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </Button>
                      <div>
                        <CardTitle className="text-base">{module.title}</CardTitle>
                        {module.description && (
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openLessonDialog(module.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openModuleDialog(module)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteModule(module.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {expandedModules.has(module.id) && (
                  <CardContent className="pt-0">
                    <div className="space-y-2 ml-6">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {getContentIcon(lesson.contentType)}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{lesson.title}</span>
                                {!lesson.isRequired && (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    Optional
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                <span className="capitalize">{lesson.contentType.toLowerCase()}</span>
                                {lesson.duration && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {lesson.duration}m
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openLessonDialog(module.id, lesson)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteLesson(lesson.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {module.lessons.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No lessons yet</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => openLessonDialog(module.id)}
                          >
                            Add First Lesson
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}

            {modules.length === 0 && !loading && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
                <p className="text-gray-600 mb-4">
                  Start building your course by adding your first module.
                </p>
                <Button onClick={() => openModuleDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Module
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Module Dialog */}
      <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingModule ? 'Edit Module' : 'Add Module'}
            </DialogTitle>
            <DialogDescription>
              {editingModule ? 'Update module information' : 'Create a new module for this course'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Module Title</label>
              <Input
                placeholder="Enter module title..."
                value={moduleForm.title}
                onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea
                placeholder="Enter module description..."
                value={moduleForm.description}
                onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModuleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleModuleSubmit}>
              {editingModule ? 'Update' : 'Create'} Module
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? 'Edit Lesson' : 'Add Lesson'}
            </DialogTitle>
            <DialogDescription>
              {editingLesson ? 'Update lesson content' : 'Create a new lesson'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Lesson Title</label>
              <Input
                placeholder="Enter lesson title..."
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Content Type</label>
              <Select
                value={lessonForm.contentType}
                onValueChange={(value: 'TEXT' | 'VIDEO' | 'FILE' | 'MIXED') => setLessonForm({ ...lessonForm, contentType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEXT">Text Content</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="FILE">File/Document</SelectItem>
                  <SelectItem value="MIXED">Mixed Media</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                placeholder="Enter lesson content..."
                className="min-h-[120px]"
                value={lessonForm.content}
                onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
              />
            </div>

            {(lessonForm.contentType === 'VIDEO' || lessonForm.contentType === 'MIXED') && (
              <div>
                <label className="text-sm font-medium">Video URL</label>
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={lessonForm.videoUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                />
              </div>
            )}

            {(lessonForm.contentType === 'FILE' || lessonForm.contentType === 'MIXED') && (
              <div>
                <label className="text-sm font-medium">File URL</label>
                <Input
                  placeholder="https://example.com/document.pdf"
                  value={lessonForm.fileUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, fileUrl: e.target.value })}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Duration (minutes)</label>
                <Input
                  type="number"
                  placeholder="15"
                  value={lessonForm.duration}
                  onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isRequired"
                  checked={lessonForm.isRequired}
                  onChange={(e) => setLessonForm({ ...lessonForm, isRequired: e.target.checked })}
                />
                <label htmlFor="isRequired" className="text-sm font-medium">
                  Required Lesson
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLessonDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLessonSubmit}>
              {editingLesson ? 'Update' : 'Create'} Lesson
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}