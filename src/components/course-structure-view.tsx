"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Play, FileText, Eye, MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Lesson {
  id: string
  title: string
  type: 'video' | 'text' | 'file'
  duration?: string
  isPublished: boolean
  order: number
}

interface Module {
  id: string
  title: string
  description?: string
  isPublished: boolean
  order: number
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  description?: string
  isPublished: boolean
  modules: Module[]
}

interface CourseStructureViewProps {
  course: Course
  onEditLesson: (lessonId: string) => void
  onAddLesson: (moduleId: string) => void
  onAddModule: () => void
}

export default function CourseStructureView({ 
  course, 
  onEditLesson, 
  onAddLesson, 
  onAddModule 
}: CourseStructureViewProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (expandedModules.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />
      case 'text': return <FileText className="h-4 w-4" />
      case 'file': return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Course Contents</h2>
            </div>
            <Badge 
              variant={course.isPublished ? "default" : "secondary"}
              className={course.isPublished ? "bg-green-100 text-green-800" : ""}
            >
              {course.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onAddModule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Module
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-100">
        {course.modules.map((module) => (
          <div key={module.id}>
            {/* Module Header */}
            <div 
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => toggleModule(module.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-gray-400">
                    {expandedModules.has(module.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{module.title}</h3>
                    {module.description && (
                      <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={module.isPublished ? "default" : "secondary"}
                    className={module.isPublished ? "bg-green-100 text-green-800" : ""}
                  >
                    {module.isPublished ? "Published" : "Draft"}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Module Lessons */}
            {expandedModules.has(module.id) && (
              <div className="bg-gray-50">
                {module.lessons.map((lesson) => (
                  <div 
                    key={lesson.id}
                    className="px-6 py-3 ml-8 flex items-center justify-between hover:bg-white cursor-pointer transition-colors border-l-2 border-gray-200"
                    onClick={() => onEditLesson(lesson.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400">
                        {getContentIcon(lesson.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                        {lesson.duration && (
                          <p className="text-sm text-gray-500">{lesson.duration}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={lesson.isPublished ? "default" : "secondary"}
                        className={lesson.isPublished ? "bg-green-100 text-green-800" : ""}
                      >
                        {lesson.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add Lesson Button */}
                <div 
                  className="px-6 py-3 ml-8 border-l-2 border-gray-200 cursor-pointer hover:bg-white transition-colors"
                  onClick={() => onAddLesson(module.id)}
                >
                  <div className="flex items-center gap-3 text-blue-600 hover:text-blue-700">
                    <Plus className="h-4 w-4" />
                    <span className="font-medium">Add Lesson</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add Module Button */}
        {course.modules.length === 0 && (
          <div 
            className="px-6 py-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={onAddModule}
          >
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Plus className="h-8 w-8" />
              <p className="font-medium">Add your first module</p>
              <p className="text-sm">Organize your course content into modules</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}