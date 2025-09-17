import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const databaseUrl = process.env.DATABASE_URL || ''
    const nextAuthUrl = process.env.NEXTAUTH_URL || ''

    const dbProvider = databaseUrl.startsWith('postgres')
      ? 'postgresql'
      : databaseUrl.startsWith('file:')
        ? 'sqlite'
        : 'unknown'

    const [totalUsers, admins, managers, staff] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'MANAGER' } }),
      prisma.user.count({ where: { role: 'STAFF' } }),
    ])

    const summary = {
      dbProvider,
      nextAuthHost: (() => {
        try {
          return nextAuthUrl ? new URL(nextAuthUrl).host : ''
        } catch {
          return ''
        }
      })(),
      users: { total: totalUsers, admins, managers, staff },
      envFlags: {
        hasNextAuthSecret: Boolean(process.env.NEXTAUTH_SECRET),
      },
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Diagnostics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


