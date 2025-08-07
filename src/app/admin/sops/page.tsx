'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MainLayout from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SOPCreationDialog from '@/components/sop-creation-dialog'
import SOPEditDialog from '@/components/sop-edit-dialog'
import { Search, Trash2, Eye, FileText, Power, PowerOff } from 'lucide-react'

interface SOP {
  id: string
  title: string
  content: string
  version: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
    color?: string
  }
  createdBy: {
    name: string
  }
}

export default function AdminSOPsPage() {
  const { data: session, status } = useSession()
  const [sops, setSOPs] = useState<SOP[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (session && (session.user.role === 'ADMIN' || session.user.role === 'MANAGER')) {
      fetchSOPs()
    }
  }, [session])

  // Check if user is admin/manager
  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
    redirect('/dashboard')
  }

  async function fetchSOPs() {
    try {
      const response = await fetch('/api/sops')
      if (response.ok) {
        const data = await response.json()
        setSOPs(data)
      }
    } catch (error) {
      console.error('Error fetching SOPs:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteSOP(sopId: string) {
    if (!confirm('Are you sure you want to delete this SOP? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/sops/${sopId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchSOPs()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete SOP')
      }
    } catch (error) {
      console.error('Error deleting SOP:', error)
      alert('Failed to delete SOP')
    }
  }

  async function toggleActive(sopId: string, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/sops/${sopId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        fetchSOPs()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update SOP status')
      }
    } catch (error) {
      console.error('Error updating SOP status:', error)
      alert('Failed to update SOP status')
    }
  }

  const filteredSOPs = sops.filter(sop =>
    sop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sop.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sop.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SOP Management</h1>
            <p className="text-gray-600">Create and manage Standard Operating Procedures</p>
          </div>
          <SOPCreationDialog onSOPCreated={fetchSOPs} />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search SOPs by title, content, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total SOPs</CardTitle>
              <FileText className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sops.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Power className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {sops.filter(s => s.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <PowerOff className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {sops.filter(s => !s.isActive).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SOPs List */}
        <Card>
          <CardHeader>
            <CardTitle>All SOPs ({filteredSOPs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSOPs.map((sop) => (
                <div key={sop.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{sop.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sop.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {sop.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: sop.category.color || '#6b7280' }}
                        >
                          {sop.category.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {(() => {
                          const textContent = sop.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')
                          return textContent.length > 100 ? textContent.substring(0, 100) + '...' : textContent
                        })()}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Version: {sop.version}</span>
                        <span>Updated: {formatDate(sop.updatedAt)}</span>
                        <span>Created by: {sop.createdBy.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/sops/${sop.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant={sop.isActive ? 'outline' : 'default'}
                      onClick={() => toggleActive(sop.id, sop.isActive)}
                    >
                      {sop.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <SOPEditDialog sopId={sop.id} onSOPUpdated={fetchSOPs} />
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => deleteSOP(sop.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredSOPs.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No SOPs found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first SOP.'}
                  </p>
                  {!searchTerm && (
                    <SOPCreationDialog onSOPCreated={fetchSOPs} />
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}