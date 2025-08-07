"use client"

import { useState } from "react"
import { ArrowLeft, Upload, Video, Mic, Eye, Image, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import FileUpload, { UploadedFile } from "./file-upload"

interface LessonEditorProps {
  lessonId?: string
  moduleId: string
  onBack: () => void
  onSave: (lessonData: LessonData) => void
}

interface LessonData {
  title: string
  content: string
  videoUrl?: string
  audioUrl?: string
  imageUrl?: string
  attachedFiles?: AttachedFile[]
}

interface AttachedFile {
  id: string
  name: string
  url: string
  type: string
  size?: number
  uploadedAt?: string
}

export default function LessonEditor({ lessonId, moduleId, onBack, onSave }: LessonEditorProps) {
  const [lessonData, setLessonData] = useState({
    title: "",
    content: "",
    contentType: "text" as "text" | "video" | "audio",
    videoUrl: "",
    audioUrl: "",
    imageUrl: "",
    attachedFiles: [] as AttachedFile[]
  })

  const [showPreview, setShowPreview] = useState(false)

  const handleSave = () => {
    onSave(lessonData)
  }

  const handleVideoUploaded = (uploadedFile: UploadedFile) => {
    setLessonData({
      ...lessonData,
      videoUrl: uploadedFile.url
    })
  }

  const handleAudioUploaded = (uploadedFile: UploadedFile) => {
    setLessonData({
      ...lessonData,
      audioUrl: uploadedFile.url
    })
  }

  const handleImageUploaded = (uploadedFile: UploadedFile) => {
    setLessonData({
      ...lessonData,
      imageUrl: uploadedFile.url
    })
  }

  const handleFileUploaded = (uploadedFile: UploadedFile) => {
    const newFile: AttachedFile = {
      id: Date.now().toString(),
      name: uploadedFile.name,
      url: uploadedFile.url,
      type: uploadedFile.type,
      size: uploadedFile.size,
      uploadedAt: uploadedFile.uploadedAt
    }
    setLessonData({
      ...lessonData,
      attachedFiles: [...lessonData.attachedFiles, newFile]
    })
  }

  const removeFile = (fileId: string) => {
    setLessonData({
      ...lessonData,
      attachedFiles: lessonData.attachedFiles.filter(f => f.id !== fileId)
    })
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Preview Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setShowPreview(false)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Editor
              </Button>
              <h1 className="text-xl font-semibold">{lessonData.title || "Untitled Lesson"}</h1>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardContent className="p-8">
              {lessonData.contentType === "video" && lessonData.videoUrl && (
                <div className="mb-6">
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                    <span className="text-white">Video Player Placeholder</span>
                  </div>
                </div>
              )}
              
              {lessonData.contentType === "audio" && lessonData.audioUrl && (
                <div className="mb-6">
                  <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                    <span className="text-gray-600">Audio Player Placeholder</span>
                  </div>
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                {lessonData.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {lessonData.attachedFiles.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Attached Files</h3>
                  <div className="space-y-2">
                    {lessonData.attachedFiles.map((file) => (
                      <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {file.type.toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Product
            </Button>
            <h1 className="text-xl font-semibold">{lessonData.title || "New Lesson"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Media Upload */}
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-600 mb-6">
                  Select what media you would like to attach to this lesson.
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Video Upload</h4>
                    <FileUpload
                      type="videos"
                      onFileUploaded={handleVideoUploaded}
                      maxSize={200}
                    />
                    {lessonData.videoUrl && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-700">
                          Video uploaded: {lessonData.videoUrl.split('/').pop()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Audio Upload</h4>
                    <FileUpload
                      type="audio"
                      onFileUploaded={handleAudioUploaded}
                      maxSize={100}
                    />
                    {lessonData.audioUrl && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-700">
                          Audio uploaded: {lessonData.audioUrl.split('/').pop()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lesson Details */}
            <Card>
              <CardHeader>
                <CardTitle>Lesson Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <Input
                    value={lessonData.title}
                    onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                    placeholder="Enter lesson title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <Select
                    value={lessonData.category}
                    onValueChange={(value) => setLessonData({ ...lessonData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Course Contents">Course Contents</SelectItem>
                      <SelectItem value="Bonus Materials">Bonus Materials</SelectItem>
                      <SelectItem value="Resources">Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <div className="border rounded-lg">
                    {/* Simple toolbar */}
                    <div className="border-b px-4 py-2 bg-gray-50 rounded-t-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Paragraph</span>
                        <span className="text-gray-300">|</span>
                        <Button variant="ghost" size="sm" className="h-auto p-1">
                          <strong>B</strong>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-auto p-1">
                          <em>I</em>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-auto p-1">
                          <u>U</u>
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={lessonData.content}
                      onChange={(e) => setLessonData({ ...lessonData, content: e.target.value })}
                      placeholder="Enter lesson description..."
                      className="min-h-[200px] border-none rounded-t-none focus-visible:ring-0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lesson Visibility */}
            <Card>
              <CardHeader>
                <CardTitle>Lesson Visibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="visibility"
                      checked={lessonData.isPublished}
                      onChange={() => setLessonData({ ...lessonData, isPublished: true })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>Published</span>
                    {lessonData.isPublished && (
                      <Badge className="bg-green-100 text-green-800">✓ Published</Badge>
                    )}
                  </label>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="visibility"
                      checked={!lessonData.isPublished}
                      onChange={() => setLessonData({ ...lessonData, isPublished: false })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>Draft</span>
                    {!lessonData.isPublished && (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Lesson Thumbnail */}
            <Card>
              <CardHeader>
                <CardTitle>Lesson Thumbnail</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  type="images"
                  onFileUploaded={handleImageUploaded}
                  maxSize={10}
                />
                {lessonData.imageUrl && (
                  <div className="mt-3">
                    <img 
                                              src={lessonData.imageUrl} 
                      alt="Lesson thumbnail" 
                      className="w-32 h-20 object-cover rounded border"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delete Lesson */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Video Thumbnail</CardTitle>
                  <div className="text-sm text-blue-600 cursor-pointer">Lesson Thumbnail</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2">
                  <Image className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500 text-center">
                    Recommended dimensions of<br />1280×720
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleImageUpload}
                    className="mt-2"
                  >
                    Upload Image
                  </Button>
                  {lessonData.imageUrl && (
                    <Button variant="ghost" size="sm" className="text-red-600">
                      Remove
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Attached Files */}
            <Card>
              <CardHeader>
                <CardTitle>Attached Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lessonData.attachedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <FileUpload
                    type="files"
                    onFileUploaded={handleFileUploaded}
                    className="mt-3"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delete Lesson */}
            <Card>
              <CardContent className="pt-6">
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Lesson
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}