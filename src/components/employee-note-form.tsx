"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, AlertTriangle, CheckCircle, X } from 'lucide-react'

interface EmployeeNoteFormProps {
  employeeId: string
  employeeName: string
  onSave: (note: { id: string; type: string; priority: string; title: string; content: string; isPrivate: boolean; followUpDate?: string; createdAt: string; createdBy: { name: string; email: string } }) => void
  onCancel: () => void
}

const NOTE_TYPES = [
  { value: 'GENERAL', label: 'General Note', color: 'bg-gray-100 text-gray-800' },
  { value: 'PERFORMANCE_WIN', label: 'Performance Win', color: 'bg-green-100 text-green-800' },
  { value: 'PERFORMANCE_ISSUE', label: 'Performance Issue', color: 'bg-red-100 text-red-800' },
  { value: 'ATTENDANCE_LATE', label: 'Late Attendance', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'ATTENDANCE_ABSENT', label: 'Absent', color: 'bg-orange-100 text-orange-800' },
  { value: 'DISCIPLINARY_VERBAL', label: 'Verbal Warning', color: 'bg-red-100 text-red-800' },
  { value: 'DISCIPLINARY_WRITTEN', label: 'Written Warning', color: 'bg-red-200 text-red-900' },
  { value: 'DISCIPLINARY_FINAL', label: 'Final Warning', color: 'bg-red-300 text-red-900' },
  { value: 'TRAINING_COMPLETED', label: 'Training Completed', color: 'bg-blue-100 text-blue-800' },
  { value: 'TRAINING_NEEDED', label: 'Training Needed', color: 'bg-purple-100 text-purple-800' },
  { value: 'PROMOTION', label: 'Promotion', color: 'bg-green-200 text-green-900' },
  { value: 'RESIGNATION', label: 'Resignation', color: 'bg-gray-200 text-gray-900' },
  { value: 'TERMINATION', label: 'Termination', color: 'bg-red-400 text-red-900' }
]

const PRIORITY_LEVELS = [
  { value: 'LOW', label: 'Low', icon: Clock, color: 'text-green-500' },
  { value: 'MEDIUM', label: 'Medium', icon: Clock, color: 'text-yellow-500' },
  { value: 'HIGH', label: 'High', icon: AlertTriangle, color: 'text-orange-500' },
  { value: 'URGENT', label: 'Urgent', icon: AlertTriangle, color: 'text-red-500' }
]

export default function EmployeeNoteForm({ employeeId, employeeName, onSave, onCancel }: EmployeeNoteFormProps) {
  const [formData, setFormData] = useState({
    type: '',
    priority: 'MEDIUM',
    title: '',
    content: '',
    isPrivate: false,
    followUpDate: ''
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/employees/${employeeId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          followUpDate: formData.followUpDate || null
        })
      })

      if (response.ok) {
        const note = await response.json()
        onSave(note)
        setFormData({
          type: '',
          priority: 'MEDIUM',
          title: '',
          content: '',
          isPrivate: false,
          followUpDate: ''
        })
      } else {
        throw new Error('Failed to save note')
      }
    } catch (error) {
      console.error('Failed to save note:', error)
      alert('Failed to save note. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const selectedNoteType = NOTE_TYPES.find(type => type.value === formData.type)
  const selectedPriority = PRIORITY_LEVELS.find(priority => priority.value === formData.priority)

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Add Note for {employeeName}</span>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Note Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note Type *
            </label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select note type" />
              </SelectTrigger>
              <SelectContent>
                {NOTE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <Badge className={type.color} variant="secondary">
                        {type.label}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <Select 
              value={formData.priority} 
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_LEVELS.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    <div className="flex items-center gap-2">
                      <priority.icon className={`h-4 w-4 ${priority.color}`} />
                      {priority.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief summary of the note"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Details *
            </label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Detailed description of the event, issue, or achievement..."
              rows={4}
              required
            />
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Follow-up Date (Optional)
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Set a reminder date for follow-up actions
            </p>
          </div>

          {/* Privacy */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPrivate"
              checked={formData.isPrivate}
              onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700">
              Private note (not visible to employee)
            </label>
          </div>

          {/* Preview */}
          {formData.type && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Preview:</h4>
              <div className="flex items-center gap-2 mb-2">
                {selectedNoteType && (
                  <Badge className={selectedNoteType.color} variant="secondary">
                    {selectedNoteType.label}
                  </Badge>
                )}
                {selectedPriority && (
                  <div className="flex items-center gap-1">
                    <selectedPriority.icon className={`h-3 w-3 ${selectedPriority.color}`} />
                    <span className="text-xs text-gray-600">{selectedPriority.label}</span>
                  </div>
                )}
                {formData.isPrivate && (
                  <Badge variant="outline" className="text-xs">Private</Badge>
                )}
              </div>
              {formData.title && (
                <div className="font-medium text-sm">{formData.title}</div>
              )}
              {formData.content && (
                <div className="text-sm text-gray-600 mt-1">{formData.content}</div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={!formData.type || !formData.title || !formData.content || saving}
              className="flex-1"
            >
              {saving ? 'Saving...' : 'Save Note'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}