'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import MainLayout from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER'

interface AnswerDraft { id: string; text: string; isCorrect: boolean }
interface QuestionDraft { id: string; question: string; type: QuestionType; points: number; answers: AnswerDraft[] }

export default function CreateQuizPage() {
  const { data: session, status } = useSession()
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [passingScore, setPassingScore] = useState(70)
  const [questions, setQuestions] = useState<QuestionDraft[]>([])

  function addQuestion() {
    setQuestions(q => [...q, { id: crypto.randomUUID(), question: '', type: 'MULTIPLE_CHOICE', points: 1, answers: [
      { id: crypto.randomUUID(), text: '', isCorrect: true },
      { id: crypto.randomUUID(), text: '', isCorrect: false },
    ] }])
  }

  function addAnswer(qid: string) {
    setQuestions(q => q.map(qq => qq.id === qid ? { ...qq, answers: [...qq.answers, { id: crypto.randomUUID(), text: '', isCorrect: false }] } : qq))
  }

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, passingScore, questions })
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        alert(j?.error || 'Failed to create quiz')
        return
      }
      window.location.href = '/admin/quizzes'
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading') return <div>Loading…</div>
  if (!session || session.user.role !== 'ADMIN') return null

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Create Quiz</h1>
        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <label className="text-sm">Title</label>
              <Input value={title} onChange={e=>setTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Description</label>
              <Textarea value={description} onChange={e=>setDescription(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Passing Score (%)</label>
              <Input type="number" value={passingScore} onChange={e=>setPassingScore(parseInt(e.target.value||'0'))} />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Questions ({questions.length})</h2>
          <Button onClick={addQuestion}>Add Question</Button>
        </div>

        {questions.map((q, qi) => (
          <Card key={q.id}>
            <CardHeader>
              <CardTitle className="text-base">Question {qi+1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Question" value={q.question} onChange={e=>setQuestions(prev=>prev.map(qq=>qq.id===q.id?{...qq,question:e.target.value}:qq))} />
              <div className="grid grid-cols-2 gap-2">
                {q.answers.map(a => (
                  <div key={a.id} className="flex items-center gap-2">
                    <input type="checkbox" checked={a.isCorrect} onChange={e=>setQuestions(prev=>prev.map(qq=>qq.id===q.id?{...qq,answers:qq.answers.map(aa=>aa.id===a.id?{...aa,isCorrect:e.target.checked}:aa)}:qq))} />
                    <Input placeholder="Answer" value={a.text} onChange={e=>setQuestions(prev=>prev.map(qq=>qq.id===q.id?{...qq,answers:qq.answers.map(aa=>aa.id===a.id?{...aa,text:e.target.value}:aa)}:qq))} />
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={()=>addAnswer(q.id)}>Add Answer</Button>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving || !title}>Save Quiz</Button>
        </div>
      </div>
    </MainLayout>
  )
}


