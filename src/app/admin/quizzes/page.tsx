"use client"

import { useEffect, useState } from 'react'
import MainLayout from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Quiz {
  id: string
  title: string
  isPublished: boolean
}

export default function AdminQuizzesIndex() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/quizzes')
        if (res.ok) {
          const data = await res.json()
          setQuizzes(data)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quizzes</h1>
          <Button asChild>
            <Link href="/admin/quizzes/create">Create Quiz</Link>
          </Button>
        </div>
        {loading ? (
          <p>Loading…</p>
        ) : quizzes.length === 0 ? (
          <p className="text-gray-600">No quizzes yet.</p>
        ) : (
          <ul className="space-y-3">
            {quizzes.map((q) => (
              <li key={q.id} className="flex items-center justify-between border rounded p-3">
                <div>
                  <p className="font-medium">{q.title}</p>
                  <p className="text-xs text-gray-500">{q.isPublished ? 'Published' : 'Draft'}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/admin/quizzes/${q.id}`}>Edit</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </MainLayout>
  )
}
