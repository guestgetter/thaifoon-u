import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const fileUrl = searchParams.get('url')

    if (!fileUrl) {
      return NextResponse.json({ error: 'File URL is required' }, { status: 400 })
    }

    // Extract file path from URL
    // URL format: /uploads/type/filename
    if (!fileUrl.startsWith('/uploads/')) {
      return NextResponse.json({ error: 'Invalid file URL' }, { status: 400 })
    }

    // Convert URL to file system path
    const filePath = join(process.cwd(), 'public', fileUrl)

    try {
      await unlink(filePath)
      return NextResponse.json({ success: true, message: 'File deleted successfully' })
    } catch (error) {
      console.error('File deletion error:', error)
      // File might not exist, which is fine
      return NextResponse.json({ success: true, message: 'File already deleted or not found' })
    }

  } catch (error) {
    console.error('Delete request error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}