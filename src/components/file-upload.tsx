'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, File, Image, Video, Music } from 'lucide-react'

interface FileUploadProps {
  type: 'files' | 'images' | 'videos' | 'audio'
  onFileUploaded: (file: UploadedFile) => void
  accept?: string
  maxSize?: number // in MB
  className?: string
}

export interface UploadedFile {
  name: string
  url: string
  size: number
  type: string
  uploadedAt: string
}

const getIcon = (type: string) => {
  switch (type) {
    case 'images': return <Image className="h-4 w-4" />
    case 'videos': return <Video className="h-4 w-4" />
    case 'audio': return <Music className="h-4 w-4" />
    default: return <File className="h-4 w-4" />
  }
}

const getAcceptString = (type: string) => {
  switch (type) {
    case 'images': return 'image/*'
    case 'videos': return 'video/*'
    case 'audio': return 'audio/*'
    case 'files': return '.pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx'
    default: return '*/*'
  }
}

export default function FileUpload({ 
  type, 
  onFileUploaded, 
  accept, 
  maxSize = 50,
  className = ''
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`)
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        onFileUploaded(result.file)
      } else {
        alert(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  return (
    <div className={`${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept || getAcceptString(type)}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Uploading...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-gray-600">
                {getIcon(type)}
                <Upload className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Drop your {type === 'files' ? 'file' : type.slice(0, -1)} here or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Max size: {maxSize}MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}