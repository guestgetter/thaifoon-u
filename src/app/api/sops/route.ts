import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only show active SOPs to regular users
    const whereClause = session.user.role === 'STAFF' 
      ? { isActive: true }
      : {}

    const sops = await prisma.standardOperatingProcedure.findMany({
      where: whereClause,
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
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(sops)
  } catch (error) {
    console.error('Error fetching SOPs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, categoryId, version } = body

    if (!title || !content || !categoryId) {
      return NextResponse.json({ error: 'Title, content, and category are required' }, { status: 400 })
    }

    const sop = await prisma.standardOperatingProcedure.create({
      data: {
        title,
        content,
        categoryId,
        version: version || '1.0',
        createdById: session.user.id,
        isActive: true,
      },
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

    return NextResponse.json(sop, { status: 201 })
  } catch (error) {
    console.error('Error creating SOP:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}