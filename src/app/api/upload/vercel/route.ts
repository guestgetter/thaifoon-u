import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

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

    // Generate clean filename with timestamp
    const timestamp = Date.now()
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${type}/${timestamp}-${cleanFileName}`

    // Upload to Vercel Blob - SUPER SIMPLE!
    const blob = await put(fileName, file, {
      access: 'public',
    })

    // Return file information
    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        url: blob.url,
        size: file.size,
        type: fileExtension,
        uploadedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Vercel Blob upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}