import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Public quizzes list for authenticated users
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Return published quizzes with minimal question metadata and the user's attempts
    const quizzes = await prisma.quiz.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        description: true,
        passingScore: true,
        maxAttempts: true,
        timeLimit: true,
        isPublished: true,
        createdAt: true,
        questions: { select: { id: true, points: true } },
        attempts: {
          where: { userId },
          orderBy: { completedAt: 'asc' },
          select: { id: true, score: true, passed: true, completedAt: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Normalize attempts field name for the UI
    const normalized = quizzes.map((q) => ({
      ...q,
      userAttempts: q.attempts,
      // strip attempts property
      attempts: undefined as unknown as never,
    }))

    return NextResponse.json(normalized)
  } catch (error) {
    console.error('List quizzes error:', error)
    return NextResponse.json({ error: 'Failed to list quizzes' }, { status: 500 })
  }
}


