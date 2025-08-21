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
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = searchParams.get('limit')

    const whereClause: any = { employeeId }
    if (type) whereClause.type = type

    const notes = await prisma.employeeNote.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined
    })

    return NextResponse.json(notes)

  } catch (error) {
    console.error('Get employee notes error:', error)
    return NextResponse.json(
      { error: 'Failed to get employee notes' },
      { status: 500 }
    )
  }
}

export async function POST(
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
    const { type, priority, title, content, isPrivate, followUpDate } = body

    // Validate employee exists
    const employee = await prisma.user.findUnique({
      where: { id: employeeId }
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    const note = await prisma.employeeNote.create({
      data: {
        type,
        priority: priority || 'MEDIUM',
        title,
        content,
        isPrivate: isPrivate || false,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        employeeId,
        createdById: session.user.id
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json(note)

  } catch (error) {
    console.error('Create employee note error:', error)
    return NextResponse.json(
      { error: 'Failed to create employee note' },
      { status: 500 }
    )
  }
}