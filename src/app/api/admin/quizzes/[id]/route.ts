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
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: { answers: true },
          orderBy: { orderIndex: 'asc' }
        }
      }
    })
    if (!quiz) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(quiz)
  } catch (e) {
    console.error('Quiz get error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, description, passingScore, maxAttempts, timeLimit, isPublished } = body

    const quiz = await prisma.quiz.update({
      where: { id },
      data: { title, description, passingScore, maxAttempts, timeLimit, isPublished }
    })
    return NextResponse.json(quiz)
  } catch (e) {
    console.error('Quiz update error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.quiz.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Quiz delete error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


