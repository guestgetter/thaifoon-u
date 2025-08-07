import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: currentLessonId } = await params

    // Get current lesson with module and course info
    const currentLesson = await prisma.lesson.findUnique({
      where: { id: currentLessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    lessons: {
                      orderBy: { orderIndex: 'asc' }
                    }
                  },
                  orderBy: { orderIndex: 'asc' }
                }
              }
            }
          }
        }
      }
    })

    if (!currentLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Flatten all lessons in course order
    const allLessons = currentLesson.module.course.modules.flatMap(module => 
      module.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        moduleTitle: module.title,
        orderIndex: lesson.orderIndex,
        moduleOrderIndex: module.orderIndex
      }))
    )

    // Sort by module order, then lesson order
    allLessons.sort((a, b) => {
      if (a.moduleOrderIndex !== b.moduleOrderIndex) {
        return a.moduleOrderIndex - b.moduleOrderIndex
      }
      return a.orderIndex - b.orderIndex
    })

    // Find current lesson index
    const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId)
    
    const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

    return NextResponse.json({
      previous: previousLesson,
      next: nextLesson,
      current: {
        index: currentIndex + 1,
        total: allLessons.length
      }
    })
  } catch (error) {
    console.error('Error fetching lesson navigation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}