import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('quizId')
    const userId = searchParams.get('userId')

    // Get overall assessment statistics
    const whereClause: { quizId?: string; userId?: string } = {}
    if (quizId) whereClause.quizId = quizId
    if (userId) whereClause.userId = userId

    const attempts = await prisma.userQuizAttempt.findMany({
      where: whereClause,
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
      orderBy: [
        { userId: 'asc' },
        { quizId: 'asc' },
        { startedAt: 'asc' }
      ]
    })

    // Group by user and quiz to calculate statistics
    const userQuizStats = new Map()

    attempts.forEach(attempt => {
      const key = `${attempt.userId}-${attempt.quizId}`
      
      if (!userQuizStats.has(key)) {
        userQuizStats.set(key, {
          user: attempt.user,
          quiz: attempt.quiz,
          attempts: [],
          totalAttempts: 0,
          attemptsToPass: null,
          bestScore: 0,
          averageScore: 0,
          currentlyPassed: false,
          firstPassDate: null
        })
      }

      const stats = userQuizStats.get(key)
      stats.attempts.push(attempt)
      stats.totalAttempts++
      stats.bestScore = Math.max(stats.bestScore, attempt.score)
      
      // Calculate attempt number based on order and check if this is first pass
      if (attempt.passed && stats.attemptsToPass === null) {
        stats.attemptsToPass = stats.attempts.length // This is the attempt number
        stats.firstPassDate = attempt.completedAt
        stats.currentlyPassed = true
      }
    })

    // Calculate average scores and finalize stats
    const finalStats = Array.from(userQuizStats.values()).map(stats => {
      stats.averageScore = stats.attempts.reduce((sum: number, a: { score: number }) => sum + a.score, 0) / stats.attempts.length
      stats.bestScore = Math.round(stats.bestScore * 100) / 100
      stats.averageScore = Math.round(stats.averageScore * 100) / 100
      return stats
    })

    // Calculate overall metrics
    const overallMetrics = {
      totalUsers: new Set(attempts.map(a => a.userId)).size,
      totalQuizzes: new Set(attempts.map(a => a.quizId)).size,
      totalAttempts: attempts.length,
      averageAttemptsToPass: 0,
      passRate: 0
    }

    const usersWithPasses = finalStats.filter(s => s.attemptsToPass !== null)
    if (usersWithPasses.length > 0) {
      overallMetrics.averageAttemptsToPass = Math.round(
        (usersWithPasses.reduce((sum, s) => sum + (s.attemptsToPass || 0), 0) / usersWithPasses.length) * 100
      ) / 100
      overallMetrics.passRate = Math.round((usersWithPasses.length / finalStats.length) * 10000) / 100
    }

    return NextResponse.json({
      userQuizStats: finalStats,
      overallMetrics
    })

  } catch (error) {
    console.error('Assessment stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get assessment statistics' },
      { status: 500 }
    )
  }
}