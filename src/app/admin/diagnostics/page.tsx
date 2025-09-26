'use client'

import { useEffect, useState } from 'react'
import MainLayout from '@/components/layout/main-layout'

interface Summary {
  dbProvider: string
  nextAuthHost: string
  users: { total: number; admins: number; managers: number; staff: number }
  envFlags: { hasNextAuthSecret: boolean }
}

export default function DiagnosticsPage() {
  const [data, setData] = useState<Summary | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/diagnostics').then(async (res) => {
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError(j?.error || 'Failed to load diagnostics')
        return
      }
      setData(await res.json())
    }).catch((e) => setError(String(e)))
  }, [])

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">System Diagnostics</h1>
        {error && (
          <div className="rounded-md bg-red-50 text-red-700 p-3 mb-4">{error}</div>
        )}
        {!data && !error && (
          <div className="text-gray-500">Loading…</div>
        )}
        {data && (
          <div className="grid gap-4">
            <div className="rounded-md border p-4">
              <div className="text-sm text-gray-500">Database</div>
              <div className="text-lg font-medium">{data.dbProvider}</div>
            </div>
            <div className="rounded-md border p-4">
              <div className="text-sm text-gray-500">NextAuth URL Host</div>
              <div className="text-lg font-medium">{data.nextAuthHost || 'not set'}</div>
            </div>
            <div className="rounded-md border p-4">
              <div className="text-sm text-gray-500">Users</div>
              <div className="text-lg font-medium">Total: {data.users.total}</div>
              <div className="text-sm text-gray-600">Admins: {data.users.admins} • Managers: {data.users.managers} • Staff: {data.users.staff}</div>
            </div>
            <div className="rounded-md border p-4">
              <div className="text-sm text-gray-500">Environment</div>
              <div className="text-sm">NEXTAUTH_SECRET: {data.envFlags.hasNextAuthSecret ? 'set' : 'missing'}</div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}


