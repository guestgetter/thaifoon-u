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
    const includeStats = searchParams.get('includeStats') === 'true'

    const employees = await prisma.user.findMany({
      where: {
        role: {
          in: ['STAFF', 'MANAGER'] // Exclude ADMIN from employee list
        }
      },
      include: {
        employeeProfile: true,
        employeeNotes: {
          orderBy: { createdAt: 'desc' },
          take: 5, // Latest 5 notes
          include: {
            createdBy: {
              select: { name: true, email: true }
            }
          }
        },
        quizAttempts: includeStats ? {
          include: {
            quiz: {
              select: { title: true }
            }
          },
          orderBy: { startedAt: 'desc' }
        } : false,
        _count: {
          select: {
            employeeNotes: true,
            quizAttempts: true
          }
        }
      },
      orderBy: [
        { name: 'asc' }
      ]
    })

    // Calculate assessment statistics if requested
    const employeesWithStats = includeStats ? employees.map(employee => {
      const attempts = employee.quizAttempts || []
      const passedAttempts = attempts.filter(a => a.passed)
      const uniqueQuizzes = new Set(attempts.map(a => a.quizId))
      
      return {
        ...employee,
        stats: {
          totalAttempts: attempts.length,
          totalQuizzesTaken: uniqueQuizzes.size,
          totalQuizzesPassed: new Set(passedAttempts.map(a => a.quizId)).size,
          averageScore: attempts.length > 0 ? 
            Math.round((attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length) * 100) / 100 : 0,
          recentNotes: employee.employeeNotes.length,
          lastActivity: attempts.length > 0 ? attempts[0].startedAt : employee.updatedAt
        }
      }
    }) : employees

    return NextResponse.json(employeesWithStats)

  } catch (error) {
    console.error('Get employees error:', error)
    return NextResponse.json(
      { error: 'Failed to get employees' },
      { status: 500 }
    )
  }
}