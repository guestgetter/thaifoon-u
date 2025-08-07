import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, description } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const updatedModule = await prisma.module.update({
      where: { id: id },
      data: {
        title,
        description: description || ''
      },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    })

    return NextResponse.json(updatedModule)
  } catch (error) {
    console.error('Error updating module:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.module.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'Module deleted successfully' })
  } catch (error) {
    console.error('Error deleting module:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}