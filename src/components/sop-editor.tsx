"use client"

import { useState, useEffect } from "react"
import { Plus, Minus, Eye, EyeOff, Clock, AlertTriangle, CheckCircle, Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SOPSection {
  id: string
  type: 'overview' | 'steps' | 'safety' | 'equipment' | 'quality' | 'troubleshooting' | 'resources'
  title: string
  content: string
  items?: string[]
  timeEstimate?: string
  importance?: 'low' | 'medium' | 'high' | 'critical'
  links?: Array<{url: string, title: string, type: 'link' | 'pdf' | 'doc'}>
}

interface SOPEditorProps {
  initialContent?: string
  onChange: (content: string) => void
}

export default function SOPEditor({ initialContent = "", onChange }: SOPEditorProps) {
  const [sections, setSections] = useState<SOPSection[]>([])
  const [preview, setPreview] = useState(false)
  const [generatedHTML, setGeneratedHTML] = useState("")

  // Initialize sections from HTML content
  useEffect(() => {
    if (initialContent && sections.length === 0) {
      // Parse existing HTML content into sections
      parseHTMLToSections(initialContent)
    }
  }, [initialContent, sections.length])

  // Generate HTML whenever sections change
  useEffect(() => {
    const html = generateHTMLFromSections(sections)
    setGeneratedHTML(html)
    onChange(html)
  }, [sections])

  const parseHTMLToSections = (html: string) => {
    // Simple parser - in production, you'd want a more robust solution
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    
    const newSections: SOPSection[] = []
    
    // Look for existing structure or create default
    const h2Elements = tempDiv.querySelectorAll('h2')
    if (h2Elements.length > 0) {
      h2Elements.forEach((h2, index) => {
        const section: SOPSection = {
          id: `section-${index}`,
          type: 'steps',
          title: h2.textContent || '',
          content: '',
          items: []
        }
        
        // Get content after this h2 until next h2
        let nextElement = h2.nextElementSibling
        let contentParts: string[] = []
        
        while (nextElement && nextElement.tagName !== 'H2') {
          if (nextElement.tagName === 'OL' || nextElement.tagName === 'UL') {
            const items = Array.from(nextElement.querySelectorAll('li')).map(li => li.textContent || '')
            section.items = items
          } else {
            contentParts.push(nextElement.textContent || '')
          }
          nextElement = nextElement.nextElementSibling
        }
        
        section.content = contentParts.join(' ')
        newSections.push(section)
      })
    } else {
      // Create default structure
      newSections.push({
        id: 'overview',
        type: 'overview',
        title: 'Overview',
        content: '',
        timeEstimate: ''
      })
    }
    
    setSections(newSections)
  }

  const generateHTMLFromSections = (sections: SOPSection[]): string => {
    return sections.map(section => {
      let html = `<h2 style="color: #1f2937; font-size: 1.5rem; font-weight: 600; margin: 2rem 0 1rem 0;">${section.title}</h2>\n`
      
      if (section.timeEstimate) {
        html += `<p style="margin: 1rem 0; padding: 0.75rem; background-color: #f3f4f6; border-radius: 0.5rem; border-left: 4px solid #3b82f6;"><strong>⏱️ Time Required:</strong> ${section.timeEstimate}</p>\n`
      }
      
      if (section.content) {
        html += `<p style="margin: 1rem 0; line-height: 1.6; color: #374151;">${section.content}</p>\n`
      }
      
      if (section.items && section.items.length > 0) {
        const listType = section.type === 'steps' ? 'ol' : 'ul'
        html += `<${listType} style="margin: 1rem 0; padding-left: 1.5rem; line-height: 1.8;">\n`
        section.items.forEach(item => {
          if (item.trim()) {
            html += `  <li style="margin: 0.5rem 0; color: #374151;">${item}</li>\n`
          }
        })
        html += `</${listType}>\n`
      }

      if (section.links && section.links.length > 0) {
        html += `<div style="margin: 1rem 0;">\n`
        section.links.forEach(link => {
          if (link.url && link.title) {
            const icon = link.type === 'pdf' ? '📄' : link.type === 'doc' ? '📝' : '🔗'
            html += `  <div style="margin: 0.5rem 0; padding: 0.75rem; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.375rem;">\n`
            html += `    <a href="${link.url}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: none; font-weight: 500;">\n`
            html += `      ${icon} ${link.title}\n`
            html += `    </a>\n`
            html += `  </div>\n`
          }
        })
        html += `</div>\n`
      }
      
      return html + '\n'
    }).join('\n')
  }

  const addSection = (type: SOPSection['type']) => {
    const sectionTitles = {
      overview: 'Overview',
      steps: 'Procedure Steps',
      safety: 'Safety Requirements',
      equipment: 'Required Equipment',
      quality: 'Quality Standards',
      troubleshooting: 'Troubleshooting',
      resources: 'Resources & Files'
    }
    
    const newSection: SOPSection = {
      id: `section-${Date.now()}`,
      type,
      title: sectionTitles[type],
      content: '',
      items: type === 'steps' || type === 'safety' || type === 'equipment' ? [''] : undefined,
      timeEstimate: type === 'overview' ? '' : undefined,
      links: type === 'resources' ? [] : undefined
    }
    
    setSections([...sections, newSection])
  }

  const updateSection = (id: string, updates: Partial<SOPSection>) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    ))
  }

  const removeSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id))
  }

  const addItem = (sectionId: string) => {
    updateSection(sectionId, {
      items: [...(sections.find(s => s.id === sectionId)?.items || []), '']
    })
  }

  const updateItem = (sectionId: string, itemIndex: number, value: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section?.items) return
    
    const newItems = [...section.items]
    newItems[itemIndex] = value
    updateSection(sectionId, { items: newItems })
  }

  const removeItem = (sectionId: string, itemIndex: number) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section?.items) return
    
    const newItems = section.items.filter((_, index) => index !== itemIndex)
    updateSection(sectionId, { items: newItems })
  }

  const addLink = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section?.links) return
    
    const newLinks = [...section.links, { url: '', title: '', type: 'link' as const }]
    updateSection(sectionId, { links: newLinks })
  }

  const updateLink = (sectionId: string, linkIndex: number, updates: Partial<{url: string, title: string, type: 'link' | 'pdf' | 'doc'}>) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section?.links) return
    
    const newLinks = [...section.links]
    newLinks[linkIndex] = { ...newLinks[linkIndex], ...updates }
    updateSection(sectionId, { links: newLinks })
  }

  const removeLink = (sectionId: string, linkIndex: number) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section?.links) return
    
    const newLinks = section.links.filter((_, index) => index !== linkIndex)
    updateSection(sectionId, { links: newLinks })
  }

  const getSectionIcon = (type: SOPSection['type']) => {
    switch (type) {
      case 'overview': return <Users className="h-4 w-4" />
      case 'steps': return <CheckCircle className="h-4 w-4" />
      case 'safety': return <AlertTriangle className="h-4 w-4" />
      case 'equipment': return <Clock className="h-4 w-4" />
      case 'resources': return <FileText className="h-4 w-4" />
      default: return <CheckCircle className="h-4 w-4" />
    }
  }

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Preview</h3>
          <Button type="button" variant="outline" onClick={() => setPreview(false)}>
            <EyeOff className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div 
              className="prose prose-gray prose-lg max-w-none prose-headings:text-gray-900 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: generatedHTML }}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">SOP Editor</h3>
        <Button type="button" variant="outline" onClick={() => setPreview(true)}>
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
      </div>

      {sections.map((section, index) => (
        <Card key={section.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getSectionIcon(section.type)}
                <Input
                  value={section.title}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                  className="font-semibold text-lg border-none p-0 h-auto"
                  placeholder="Section title..."
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSection(section.id)}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.type === 'overview' && (
              <div>
                <label className="text-sm font-medium text-gray-700">Time Required</label>
                <Input
                  placeholder="e.g., 15 minutes, 30 minutes before service"
                  value={section.timeEstimate || ''}
                  onChange={(e) => updateSection(section.id, { timeEstimate: e.target.value })}
                />
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Textarea
                placeholder="Brief description or context for this section..."
                value={section.content}
                onChange={(e) => updateSection(section.id, { content: e.target.value })}
                className="min-h-[80px]"
              />
            </div>

            {section.items && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    {section.type === 'steps' ? 'Steps' : 'Items'}
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addItem(section.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add {section.type === 'steps' ? 'Step' : 'Item'}
                  </Button>
                </div>
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 min-w-[24px]">
                        {section.type === 'steps' ? `${itemIndex + 1}.` : '•'}
                      </span>
                      <Input
                        placeholder={`Enter ${section.type === 'steps' ? 'step' : 'item'}...`}
                        value={item}
                        onChange={(e) => updateItem(section.id, itemIndex, e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(section.id, itemIndex)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.links && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Links & Files
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addLink(section.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Link
                  </Button>
                </div>
                <div className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="p-3 border border-gray-200 rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <Select
                          value={link.type}
                          onValueChange={(value: 'link' | 'pdf' | 'doc') => updateLink(section.id, linkIndex, { type: value })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">🔗 Link</SelectItem>
                            <SelectItem value="pdf">📄 PDF</SelectItem>
                            <SelectItem value="doc">📝 Doc</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Link title..."
                          value={link.title}
                          onChange={(e) => updateLink(section.id, linkIndex, { title: e.target.value })}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLink(section.id, linkIndex)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Enter URL (Google Doc, PDF, website, etc.)..."
                        value={link.url}
                        onChange={(e) => updateLink(section.id, linkIndex, { url: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => addSection('overview')}>
              <Users className="h-4 w-4 mr-1" />
              Overview
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => addSection('steps')}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Procedure Steps
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => addSection('safety')}>
              <AlertTriangle className="h-4 w-4 mr-1" />
              Safety Requirements
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => addSection('equipment')}>
              <Clock className="h-4 w-4 mr-1" />
              Required Equipment
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => addSection('quality')}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Quality Standards
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => addSection('troubleshooting')}>
              <AlertTriangle className="h-4 w-4 mr-1" />
              Troubleshooting
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => addSection('resources')}>
              <FileText className="h-4 w-4 mr-1" />
              Resources & Files
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}