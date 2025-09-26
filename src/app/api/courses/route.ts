import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isStaff = session.user.role === 'STAFF'

    const courses = await prisma.course.findMany({
      where: isStaff ? { isPublished: true } : {},
      include: {
        category: true,
        modules: {
          include: {
            lessons: {
              include: {
                userProgress: {
                  where: { userId: session.user.id },
                  select: { isCompleted: true }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Map to lightweight client shape with simple progress calc
    const result = courses.map(c => {
      const allLessons = c.modules.flatMap(m => m.lessons)
      const totalLessons = allLessons.length
      const completed = allLessons.filter(l => l.userProgress.some(up => up.isCompleted)).length
      const progressPct = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0

      return {
        id: c.id,
        title: c.title,
        description: c.description,
        thumbnail: c.thumbnail,
        category: {
          name: c.category.name,
          color: c.category.color || '#6B7280'
        },
        modules: c.modules.map(m => ({
          id: m.id,
          title: m.title,
          lessons: m.lessons.map(l => ({
            id: l.id,
            title: l.title,
            duration: l.duration || 0
          }))
        })),
        userProgress: {
          progress: progressPct,
          isCompleted: progressPct === 100
        }
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('List courses error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


