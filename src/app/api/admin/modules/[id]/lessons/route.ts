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
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: moduleId } = await params
    const body = await request.json()
    const { title, content, contentType, videoUrl, fileUrl, duration, isRequired } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Get the next order index
    const lastLesson = await prisma.lesson.findFirst({
      where: { moduleId },
      orderBy: { orderIndex: 'desc' }
    })

    const orderIndex = (lastLesson?.orderIndex || 0) + 1

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        contentType: contentType || 'TEXT',
        videoUrl: videoUrl || null,
        fileUrl: fileUrl || null,
        duration: duration ? parseInt(duration) : null,
        isRequired: isRequired !== undefined ? isRequired : true,
        moduleId,
        orderIndex
      }
    })

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}