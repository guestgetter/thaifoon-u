import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    const validTypes = {
      'images': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      'videos': ['video/mp4', 'video/webm', 'video/ogg'],
      'audios': ['audio/mpeg', 'audio/wav', 'audio/ogg'],
      'files': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    }

    if (type && validTypes[type as keyof typeof validTypes]) {
      if (!validTypes[type as keyof typeof validTypes].includes(file.type)) {
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
      }
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'thaifoon-university',
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    const uploadResult = result as { secure_url: string }

    return NextResponse.json({
      file: {
        name: file.name,
        url: uploadResult.secure_url,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}