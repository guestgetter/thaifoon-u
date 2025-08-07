import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: lessonId } = await params

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Create or update lesson progress
    await prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: lessonId
        }
      },
      update: {
        isCompleted: true,
        progress: 100,
        completedAt: new Date()
      },
      create: {
        userId: session.user.id,
        lessonId: lessonId,
        isCompleted: true,
        progress: 100,
        completedAt: new Date()
      }
    })

    // Update course progress
    const courseProgress = await prisma.userProgress.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: lesson.module.course.id
        }
      }
    })

    // Calculate overall course progress
    const totalLessons = await prisma.lesson.count({
      where: {
        module: {
          courseId: lesson.module.course.id
        }
      }
    })

    const completedLessons = await prisma.userProgress.count({
      where: {
        userId: session.user.id,
        isCompleted: true,
        lesson: {
          module: {
            courseId: lesson.module.course.id
          }
        }
      }
    })

    const overallProgress = Math.round((completedLessons / totalLessons) * 100)
    const isCourseCompleted = overallProgress === 100

    // Update course progress
    await prisma.userProgress.upsert({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: lesson.module.course.id
        }
      },
      update: {
        progress: overallProgress,
        isCompleted: isCourseCompleted,
        completedAt: isCourseCompleted ? new Date() : null
      },
      create: {
        userId: session.user.id,
        courseId: lesson.module.course.id,
        progress: overallProgress,
        isCompleted: isCourseCompleted,
        completedAt: isCourseCompleted ? new Date() : null
      }
    })

    return NextResponse.json({ 
      message: 'Lesson marked as complete',
      progress: overallProgress,
      isCompleted: isCourseCompleted 
    })
  } catch (error) {
    console.error('Error marking lesson as complete:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}