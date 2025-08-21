import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: noteId } = await params
    const body = await request.json()
    const { type, priority, title, content, isPrivate, followUpDate, isResolved } = body

    const note = await prisma.employeeNote.update({
      where: { id: noteId },
      data: {
        type,
        priority,
        title,
        content,
        isPrivate,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        isResolved: isResolved || false
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json(note)

  } catch (error) {
    console.error('Update employee note error:', error)
    return NextResponse.json(
      { error: 'Failed to update employee note' },
      { status: 500 }
    )
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

    const { id: noteId } = await params

    await prisma.employeeNote.delete({
      where: { id: noteId }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete employee note error:', error)
    return NextResponse.json(
      { error: 'Failed to delete employee note' },
      { status: 500 }
    )
  }
}