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
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: quizId } = await params
    const body = await request.json()
    const { answers, timeTaken } = body

    // Get the quiz to calculate score
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            answers: true
          }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Calculate score
    let correctAnswers = 0
    const totalQuestions = quiz.questions.length

    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id]
      const correctAnswer = question.answers.find(a => a.isCorrect)
      
      if (userAnswer === correctAnswer?.id) {
        correctAnswers++
      }
    })

    const score = (correctAnswers / totalQuestions) * 100
    const passed = score >= 85 // 85% passing grade

    // Get current attempt number
    const previousAttempts = await prisma.userQuizAttempt.count({
      where: {
        userId: session.user.id,
        quizId: quizId
      }
    })

    const attemptNumber = previousAttempts + 1

    // Create the attempt record
    const attempt = await prisma.userQuizAttempt.create({
      data: {
        userId: session.user.id,
        quizId: quizId,
        score: score,
        passed: passed,
        attemptNumber: attemptNumber,
        timeTaken: timeTaken,
        answers: answers,
        completedAt: new Date()
      }
    })

    return NextResponse.json({
      attempt,
      score,
      passed,
      attemptNumber,
      correctAnswers,
      totalQuestions
    })

  } catch (error) {
    console.error('Quiz attempt error:', error)
    return NextResponse.json(
      { error: 'Failed to record quiz attempt' },
      { status: 500 }
    )
  }
}