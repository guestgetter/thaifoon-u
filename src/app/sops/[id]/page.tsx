'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import MainLayout from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, User, Tag, FileText, Download, Printer } from 'lucide-react'

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

export default function SOPPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [sop, setSOP] = useState<SOP | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSOP() {
      try {
        const response = await fetch(`/api/sops/${params.id}`)
        if (!response.ok) {
          throw new Error('SOP not found')
        }
        const data = await response.json()
        setSOP(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load SOP')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchSOP()
    }
  }, [params.id])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    if (!sop) return
    
    const content = `
# ${sop.title}
Version: ${sop.version}
Category: ${sop.category.name}
Last Updated: ${formatDate(sop.updatedAt)}
Created by: ${sop.createdBy.name}

---

${sop.content}
    `
    
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${sop.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_v${sop.version}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (error || !sop) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">SOP Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested Standard Operating Procedure could not be found.'}</p>
          <Button onClick={() => router.push('/sops')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to SOPs
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6 print:max-w-none print:mx-0">
        {/* Header */}
        <div className="flex items-center justify-between print:hidden">
          <Button variant="outline" onClick={() => router.push('/sops')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to SOPs
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* SOP Content */}
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: sop.category.color || '#6b7280' }}
                  >
                    <Tag className="h-3 w-3 inline mr-1" />
                    {sop.category.name}
                  </div>
                  <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    Version {sop.version}
                  </div>
                  {sop.isActive && (
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Active
                    </div>
                  )}
                </div>
                <CardTitle className="text-3xl text-gray-900 mb-4">{sop.title}</CardTitle>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Last Updated: {formatDate(sop.updatedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Created by: {sop.createdBy.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="prose prose-gray prose-lg max-w-none prose-headings:text-gray-900 prose-strong:text-gray-900">
              <div 
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sop.content }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <Card className="print:hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Standard Operating Procedure</span>
              </div>
              <div>
                Document ID: {sop.id}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}