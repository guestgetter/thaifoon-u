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
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: quizId } = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || session.user.id

    // Check if user has admin access for viewing other users' attempts
    if (userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const attempts = await prisma.userQuizAttempt.findMany({
      where: {
        userId: userId,
        quizId: quizId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        quiz: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        startedAt: 'asc'
      }
    })

    // Calculate statistics
    const totalAttempts = attempts.length
    const passedAttempts = attempts.filter(a => a.passed).length
    const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : 0
    const averageScore = attempts.length > 0 ? 
      attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length : 0
    
    const firstPassAttempt = attempts.find(a => a.passed)
    const attemptsToPass = firstPassAttempt ? attempts.findIndex(a => a.id === firstPassAttempt.id) + 1 : null

    return NextResponse.json({
      attempts,
      statistics: {
        totalAttempts,
        passedAttempts,
        bestScore: Math.round(bestScore * 100) / 100,
        averageScore: Math.round(averageScore * 100) / 100,
        attemptsToPass,
        currentlyPassed: passedAttempts > 0
      }
    })

  } catch (error) {
    console.error('Get quiz attempts error:', error)
    return NextResponse.json(
      { error: 'Failed to get quiz attempts' },
      { status: 500 }
    )
  }
}