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

    const { id: employeeId } = await params

    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
      include: {
        employeeProfile: true,
        employeeNotes: {
          orderBy: { createdAt: 'desc' },
          include: {
            createdBy: {
              select: { name: true, email: true }
            }
          }
        },
        quizAttempts: {
          include: {
            quiz: {
              select: { id: true, title: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    // Calculate detailed assessment statistics
    const attempts = employee.quizAttempts
    const quizStats = new Map()

    attempts.forEach(attempt => {
      const quizId = attempt.quizId
      if (!quizStats.has(quizId)) {
        quizStats.set(quizId, {
          quiz: attempt.quiz,
          attempts: [],
          totalAttempts: 0,
          passed: false,
          attemptsToPass: null,
          bestScore: 0,
          averageScore: 0
        })
      }

      const stats = quizStats.get(quizId)
      stats.attempts.push(attempt)
      stats.totalAttempts++
      stats.bestScore = Math.max(stats.bestScore, attempt.score)
      
      if (attempt.passed && stats.attemptsToPass === null) {
        stats.attemptsToPass = attempt.attemptNumber
        stats.passed = true
      }
    })

    // Calculate averages
    quizStats.forEach(stats => {
      stats.averageScore = stats.attempts.reduce((sum: number, a: { score: number }) => sum + a.score, 0) / stats.attempts.length
      stats.bestScore = Math.round(stats.bestScore * 100) / 100
      stats.averageScore = Math.round(stats.averageScore * 100) / 100
    })

    const assessmentStats = Array.from(quizStats.values())

    // Calculate note statistics
    const notesByType = employee.employeeNotes.reduce((acc: Record<string, number>, note) => {
      acc[note.type] = (acc[note.type] || 0) + 1
      return acc
    }, {})

    const recentNotes = employee.employeeNotes.filter(note => 
      new Date(note.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    )

    return NextResponse.json({
      ...employee,
      assessmentStats,
      noteStats: {
        totalNotes: employee.employeeNotes.length,
        notesByType,
        recentNotes: recentNotes.length,
        pendingFollowUps: employee.employeeNotes.filter(note => 
          note.followUpDate && new Date(note.followUpDate) <= new Date() && !note.isResolved
        ).length
      }
    })

  } catch (error) {
    console.error('Get employee error:', error)
    return NextResponse.json(
      { error: 'Failed to get employee' },
      { status: 500 }
    )
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

    const { id: employeeId } = await params
    const body = await request.json()
    const { profile, user } = body

    // Update user basic info if provided
    if (user) {
      await prisma.user.update({
        where: { id: employeeId },
        data: {
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    }

    // Update or create employee profile if provided
    if (profile) {
      await prisma.employeeProfile.upsert({
        where: { userId: employeeId },
        update: {
          employeeId: profile.employeeId,
          department: profile.department,
          position: profile.position,
          hireDate: profile.hireDate ? new Date(profile.hireDate) : null,
          phoneNumber: profile.phoneNumber,
          emergencyContact: profile.emergencyContact,
          emergencyPhone: profile.emergencyPhone,
          notes: profile.notes
        },
        create: {
          userId: employeeId,
          employeeId: profile.employeeId,
          department: profile.department,
          position: profile.position,
          hireDate: profile.hireDate ? new Date(profile.hireDate) : null,
          phoneNumber: profile.phoneNumber,
          emergencyContact: profile.emergencyContact,
          emergencyPhone: profile.emergencyPhone,
          notes: profile.notes
        }
      })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Update employee error:', error)
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    )
  }
}