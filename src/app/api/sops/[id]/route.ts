import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const sop = await prisma.standardOperatingProcedure.findUnique({
      where: { id: id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!sop) {
      return NextResponse.json({ error: 'SOP not found' }, { status: 404 })
    }

    // Only show active SOPs to staff users
    if (!sop.isActive && session.user.role === 'STAFF') {
      return NextResponse.json({ error: 'SOP not found' }, { status: 404 })
    }

    return NextResponse.json(sop)
  } catch (error) {
    console.error('Error fetching SOP:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
    const { title, content, categoryId, version, isActive } = body

    // Allow partial updates for isActive toggle
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (categoryId !== undefined) updateData.categoryId = categoryId
    if (version !== undefined) updateData.version = version
    if (isActive !== undefined) updateData.isActive = isActive

    const sop = await prisma.standardOperatingProcedure.update({
      where: { id: id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json(sop)
  } catch (error) {
    console.error('Error updating SOP:', error)
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

    await prisma.standardOperatingProcedure.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'SOP deleted successfully' })
  } catch (error) {
    console.error('Error deleting SOP:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}