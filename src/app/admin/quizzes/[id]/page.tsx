'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import MainLayout from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Quiz {
  id: string
  title: string
  description?: string
  passingScore: number
  maxAttempts: number
  timeLimit?: number | null
  isPublished: boolean
}

export default function EditQuizPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { data: session, status } = useSession()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/quizzes/${params.id}`)
        if (!res.ok) return
        const data = await res.json()
        setQuiz({
          id: data.id,
          title: data.title || '',
          description: data.description || '',
          passingScore: data.passingScore ?? 70,
          maxAttempts: data.maxAttempts ?? 3,
          timeLimit: data.timeLimit ?? null,
          isPublished: data.isPublished ?? false,
        })
      } finally {
        setLoading(false)
      }
    }
    if (status === 'authenticated') load()
  }, [params.id, status])

  if (status === 'loading') return null
  if (!session || session.user.role !== 'ADMIN') return null

  async function save() {
    if (!quiz) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/quizzes/${quiz.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: quiz.title,
          description: quiz.description,
          passingScore: Number(quiz.passingScore) || 0,
          maxAttempts: Number(quiz.maxAttempts) || 0,
          timeLimit: quiz.timeLimit ? Number(quiz.timeLimit) : null,
          isPublished: quiz.isPublished,
        }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        alert(j?.error || 'Failed to save quiz')
        return
      }
      router.push('/admin/quizzes')
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!quiz) return
    if (!confirm('Delete this quiz? This cannot be undone.')) return
    const res = await fetch(`/api/admin/quizzes/${quiz.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      alert(j?.error || 'Failed to delete quiz')
      return
    }
    router.push('/admin/quizzes')
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Quiz</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/admin/quizzes')}>Back</Button>
            {quiz && (
              <Button asChild variant="outline">
                <a href={`/quizzes/${quiz.id}`} target="_blank" rel="noreferrer">Preview</a>
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div>Loading…</div>
            ) : quiz ? (
              <>
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input value={quiz.title} onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea value={quiz.description || ''} onChange={(e) => setQuiz({ ...quiz, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Passing Score (%)</label>
                    <Input type="number" value={quiz.passingScore} onChange={(e) => setQuiz({ ...quiz, passingScore: Number(e.target.value || '0') })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Max Attempts</label>
                    <Input type="number" value={quiz.maxAttempts} onChange={(e) => setQuiz({ ...quiz, maxAttempts: Number(e.target.value || '0') })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Time Limit (minutes)</label>
                    <Input type="number" value={quiz.timeLimit ?? ''} onChange={(e) => setQuiz({ ...quiz, timeLimit: e.target.value === '' ? null : Number(e.target.value) })} />
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input id="published" type="checkbox" checked={quiz.isPublished} onChange={(e) => setQuiz({ ...quiz, isPublished: e.target.checked })} />
                    <label htmlFor="published" className="text-sm font-medium">Published</label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="destructive" onClick={remove}>Delete</Button>
                  <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
                </div>

                <div className="pt-6 text-sm text-gray-600">
                  <p>Question editing UI is coming next. Existing questions remain unchanged.</p>
                </div>
              </>
            ) : (
              <div>Quiz not found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}


