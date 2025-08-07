'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface StorageStatus {
  local: boolean
  s3: boolean
  cloudinary: boolean
}

export default function StorageConfig() {
  const [status, setStatus] = useState<StorageStatus>({
    local: true, // Current setup
    s3: false,   // AWS S3 available
    cloudinary: false // Cloudinary available
  })

  const checkStorageConfig = async () => {
    try {
      // Check if S3 is configured
      const s3Response = await fetch('/api/upload/s3-test')
      const s3Available = s3Response.ok

      // Check if Cloudinary is configured  
      const cloudinaryResponse = await fetch('/api/upload/cloudinary-test')
      const cloudinaryAvailable = cloudinaryResponse.ok

      setStatus({
        local: true,
        s3: s3Available,
        cloudinary: cloudinaryAvailable
      })
    } catch (error) {
      console.error('Storage check failed:', error)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>File Storage Configuration</CardTitle>
        <p className="text-sm text-gray-600">
          Current setup uses local storage. For distributed staff access, upgrade to cloud storage.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <h4 className="font-medium">Local Storage</h4>
              <p className="text-sm text-gray-600">Files stored on server (current)</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">Development Only</Badge>
              <Badge variant={status.local ? "default" : "secondary"}>
                {status.local ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <h4 className="font-medium">AWS S3</h4>
              <p className="text-sm text-gray-600">Enterprise cloud storage + CDN</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">Production Ready</Badge>
              <Badge variant={status.s3 ? "default" : "secondary"}>
                {status.s3 ? "Configured" : "Not Setup"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <h4 className="font-medium">Cloudinary</h4>
              <p className="text-sm text-gray-600">Easy setup with image optimization</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">Production Ready</Badge>
              <Badge variant={status.cloudinary ? "default" : "secondary"}>
                {status.cloudinary ? "Configured" : "Not Setup"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={checkStorageConfig} className="w-full">
            Check Storage Configuration
          </Button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            See DEPLOYMENT.md for setup instructions
          </p>
        </div>

        {!status.s3 && !status.cloudinary && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm font-medium text-yellow-800">
              ⚠️ Current setup not suitable for distributed teams
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              Local storage requires all staff to access the same server. Set up cloud storage for global access.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}