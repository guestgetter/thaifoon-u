import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const type: string = data.get('type') as string || 'files'

    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 })
    }

    // Validate file type
    const validTypes = {
      files: ['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx'],
      images: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      videos: ['mp4', 'webm', 'mov', 'avi'],
      audio: ['mp3', 'wav', 'ogg', 'm4a']
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (!fileExtension || !validTypes[type as keyof typeof validTypes]?.includes(fileExtension)) {
      return NextResponse.json({ 
        error: `Invalid file type. Allowed types for ${type}: ${validTypes[type as keyof typeof validTypes]?.join(', ')}` 
      }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const uniqueFilename = `${timestamp}-${randomSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file to public/uploads directory
    const uploadDir = join(process.cwd(), 'public', 'uploads', type)
    const filePath = join(uploadDir, uniqueFilename)
    
    await writeFile(filePath, buffer)

    // Return file information
    const fileUrl = `/uploads/${type}/${uniqueFilename}`
    
    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        url: fileUrl,
        size: file.size,
        type: fileExtension,
        uploadedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}