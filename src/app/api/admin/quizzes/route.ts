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

    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        _count: {
          select: {
            questions: true,
            attempts: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(quizzes)

  } catch (error) {
    console.error('Get quizzes error:', error)
    return NextResponse.json(
      { error: 'Failed to get quizzes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, passingScore, questions } = body
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description: description || null,
        passingScore: passingScore ?? 70,
        createdById: session.user.id,
      }
    })

    if (Array.isArray(questions)) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        const createdQ = await prisma.question.create({
          data: {
            quizId: quiz.id,
            question: q.question || `Question ${i+1}`,
            type: q.type || 'MULTIPLE_CHOICE',
            points: q.points || 1,
            orderIndex: i + 1,
          }
        })
        if (Array.isArray(q.answers)) {
          type IncomingAnswer = {
            text?: string
            isCorrect?: boolean
          }
          const answers = (q.answers as IncomingAnswer[]).map((a, idx: number) => ({
            questionId: createdQ.id,
            text: a?.text || `Answer ${idx + 1}`,
            isCorrect: Boolean(a?.isCorrect),
            orderIndex: idx + 1,
          }))
          await prisma.answer.createMany({ data: answers })
        }
      }
    }

    return NextResponse.json(quiz, { status: 201 })
  } catch (error) {
    console.error('Create quiz error:', error)
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 })
  }
}