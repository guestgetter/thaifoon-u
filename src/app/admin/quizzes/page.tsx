'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import MainLayout from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface QuizSummary {
  id: string
  title: string
  description?: string
  _count: { questions: number; attempts: number }
}

export default function AdminQuizzesPage() {
  const { data: session, status } = useSession()
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/admin/quizzes').then(async (r) => {
        if (r.ok) setQuizzes(await r.json())
        setLoading(false)
      })
    }
  }, [status])

  if (status === 'loading') return <div>Loading...</div>
  if (!session || session.user.role !== 'ADMIN') return null

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quiz Management</h1>
          <Button disabled variant="outline">Create Quiz (coming soon)</Button>
        </div>

        {loading ? (
          <div>Loading…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((q) => (
              <Card key={q.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{q.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 mb-2">{q.description || '—'}</div>
                  <div className="text-sm text-gray-600">{q._count.questions} questions • {q._count.attempts} attempts</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}


