"use client"

import { useState, useEffect } from "react"
import { Plus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SOPEditor from "@/components/sop-editor"
import FileUpload, { UploadedFile } from "@/components/file-upload"
import { sopTemplates, getTemplateById } from "@/lib/sop-templates"
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

interface SOPCreationDialogProps {
  onSOPCreated: () => void
}

export default function SOPCreationDialog({ onSOPCreated }: SOPCreationDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categoryId: "",
    version: "1.0",
    attachments: [] as UploadedFile[],
  })

  useEffect(() => {
    if (open) {
      fetchCategories()
    }
  }, [open])

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!formData.title || !formData.content || !formData.categoryId) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/sops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          attachments: formData.attachments.map(file => ({
            name: file.name,
            url: file.url,
            type: file.type,
            size: file.size,
            uploadedAt: file.uploadedAt
          }))
        }),
      })

      if (response.ok) {
        setFormData({ title: "", content: "", categoryId: "", version: "1.0", attachments: [] })
        setOpen(false)
        onSOPCreated()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create SOP')
      }
    } catch (error) {
      console.error('Error creating SOP:', error)
      alert('Failed to create SOP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create SOP
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New SOP</DialogTitle>
          <DialogDescription>
            Create a new Standard Operating Procedure for your restaurant.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} onReset={() => setOpen(false)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Start from Template (Optional)
              </label>
              <Select onValueChange={(templateId) => {
                if (templateId && templateId !== 'blank') {
                  const template = getTemplateById(templateId)
                  if (template) {
                    setFormData({
                      ...formData,
                      title: template.name,
                      content: template.content,
                      categoryId: categories.find(c => c.name === template.category)?.id || formData.categoryId
                    })
                  }
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template or start blank..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blank">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Start Blank
                    </div>
                  </SelectItem>
                  {sopTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-gray-500">{template.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

            <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <label className="text-sm font-medium">
                File Attachments
              </label>
              <FileUpload
                type="files"
                onFileUploaded={(file) => setFormData({ 
                  ...formData, 
                  attachments: [...formData.attachments, file] 
                })}
                maxSize={50}
              />
              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">Attached Files:</p>
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">({Math.round(file.size / 1024)}KB)</span>
                      </div>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={() => setFormData({ 
                          ...formData, 
                          attachments: formData.attachments.filter((_, i) => i !== index) 
                        })}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500">
                Upload PDFs, documents, images, or other files to support your SOP.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create SOP'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}