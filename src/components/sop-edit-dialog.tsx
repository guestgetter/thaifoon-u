"use client"

import { useState, useEffect } from "react"
import { Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SOPEditor from "@/components/sop-editor"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Category {
  id: string
  name: string
  color?: string
}

interface SOP {
  id: string
  title: string
  content: string
  version: string
  isActive: boolean
  category: {
    id: string
    name: string
    color?: string
  }
}

interface SOPEditDialogProps {
  sopId: string
  onSOPUpdated: () => void
}

export default function SOPEditDialog({ sopId, onSOPUpdated }: SOPEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [initialLoading, setInitialLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categoryId: "",
    version: "",
    isActive: true,
  })

  useEffect(() => {
    if (open) {
      fetchCategories()
      fetchSOP()
    }
  }, [open, sopId])

  async function fetchCategories() {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  async function fetchSOP() {
    if (!sopId) return
    
    setInitialLoading(true)
    try {
      const response = await fetch(`/api/sops/${sopId}`)
      if (response.ok) {
        const sop: SOP = await response.json()
        setFormData({
          title: sop.title,
          content: sop.content,
          categoryId: sop.category.id,
          version: sop.version,
          isActive: sop.isActive,
        })
      } else {
        console.error('Failed to fetch SOP')
      }
    } catch (error) {
      console.error('Error fetching SOP:', error)
    } finally {
      setInitialLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!formData.title || !formData.content || !formData.categoryId) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/sops/${sopId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setOpen(false)
        onSOPUpdated()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update SOP')
      }
    } catch (error) {
      console.error('Error updating SOP:', error)
      alert('Failed to update SOP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit SOP</DialogTitle>
          <DialogDescription>
            Update the Standard Operating Procedure details.
          </DialogDescription>
        </DialogHeader>
        
        {initialLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} onReset={() => setOpen(false)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  SOP Title *
                </label>
                <Input
                  id="title"
                  placeholder="Enter SOP title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category *
                  </label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="version" className="text-sm font-medium">
                    Version
                  </label>
                  <Input
                    id="version"
                    placeholder="1.0"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select
                    value={formData.isActive ? "active" : "inactive"}
                    onValueChange={(value) => setFormData({ ...formData, isActive: value === "active" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  SOP Content *
                </label>
                <div className="border rounded-lg p-4 bg-gray-50 max-h-[400px] overflow-y-auto">
                  <SOPEditor
                    initialContent={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Use the structured editor to create comprehensive SOPs with steps, safety notes, equipment lists, and more.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update SOP'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}