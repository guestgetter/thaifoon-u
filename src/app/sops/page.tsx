"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { FileText, Search, Calendar, Tag, Eye } from "lucide-react"
import MainLayout from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

export default function SOPsPage() {
  const { data: session } = useSession()
  const [sops, setSOPs] = useState<SOP[]>([])
  const [filteredSOPs, setFilteredSOPs] = useState<SOP[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchSOPs()
  }, [])

  async function fetchSOPs() {
    try {
      setLoading(true)
      const response = await fetch('/api/sops')
      if (response.ok) {
        const data = await response.json()
        setSOPs(data)
      } else {
        console.error('Failed to fetch SOPs')
      }
    } catch (error) {
      console.error('Error fetching SOPs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const filtered = sops.filter(sop =>
      sop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sop.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sop.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredSOPs(filtered)
  }, [sops, searchTerm])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getContentPreview = (content: string) => {
    // Strip HTML tags and get first 150 characters
    const textContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')
    return textContent.length > 150 ? textContent.substring(0, 150) + '...' : textContent
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Standard Operating Procedures</h1>
            <p className="text-gray-600 mt-2">
              Access important operational procedures and guidelines
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search SOPs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* SOPs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSOPs.map((sop) => (
            <Card key={sop.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div
                    className="px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: sop.category.color || '#6b7280' }}
                  >
                    {sop.category.name}
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    v{sop.version}
                  </div>
                </div>
                <CardTitle className="text-xl">{sop.title}</CardTitle>
                <CardDescription className="text-sm">
                  {getContentPreview(sop.content)}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Updated {formatDate(sop.updatedAt)}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-600">
                  <span>Created by {sop.createdBy.name}</span>
                </div>

                <Button asChild className="w-full" variant="outline">
                  <Link href={`/sops/${sop.id}`} className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View SOP
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSOPs.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No SOPs found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or browse all procedures.
            </p>
          </div>
        )}

        {sops.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No SOPs available</h3>
            <p className="text-gray-600">
              Standard Operating Procedures will appear here once they are created.
            </p>
          </div>
        )}

        {/* Category Legend */}
        {sops.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {Array.from(new Set(sops.map(sop => JSON.stringify(sop.category))))
                  .map(categoryStr => JSON.parse(categoryStr))
                  .map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: category.color || '#6b7280' }}
                    >
                      <Tag className="h-3 w-3" />
                      {category.name}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}