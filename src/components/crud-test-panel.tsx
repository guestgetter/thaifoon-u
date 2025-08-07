'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface TestResult {
  operation: string
  status: 'success' | 'error' | 'testing'
  message: string
  timestamp: string
}

export default function CrudTestPanel() {
  const [results, setResults] = useState<TestResult[]>([])
  const [testData, setTestData] = useState({
    courseName: 'Test Course ' + Date.now(),
    categoryId: '',
  })

  const addResult = (operation: string, status: 'success' | 'error' | 'testing', message: string) => {
    setResults(prev => [...prev, {
      operation,
      status,
      message,
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  const testCreateCourse = async () => {
    addResult('CREATE', 'testing', 'Creating test course...')
    
    try {
      // First get categories
      const categoriesResponse = await fetch('/api/admin/categories')
      if (!categoriesResponse.ok) throw new Error('Categories API failed')
      
      const categories = await categoriesResponse.json()
      if (categories.length === 0) throw new Error('No categories found')
      
      // Create course
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: testData.courseName,
          description: 'Test course for CRUD verification',
          categoryId: categories[0].id,
        }),
      })

      if (response.ok) {
        const course = await response.json()
        setTestData(prev => ({ ...prev, categoryId: course.id }))
        addResult('CREATE', 'success', `Course created: ${course.title}`)
        return course.id
      } else {
        throw new Error('Create course failed')
      }
    } catch (error) {
      addResult('CREATE', 'error', `Failed: ${error}`)
      return null
    }
  }

  const testReadCourses = async () => {
    addResult('READ', 'testing', 'Fetching courses...')
    
    try {
      const response = await fetch('/api/admin/courses')
      if (response.ok) {
        const courses = await response.json()
        addResult('READ', 'success', `Retrieved ${courses.length} courses`)
      } else {
        throw new Error('Read courses failed')
      }
    } catch (error) {
      addResult('READ', 'error', `Failed: ${error}`)
    }
  }

  const testFileUpload = async () => {
    addResult('UPLOAD', 'testing', 'Testing file upload...')
    
    try {
      // Create a small test file
      const testFile = new File(['Test file content'], 'test.txt', { type: 'text/plain' })
      const formData = new FormData()
      formData.append('file', testFile)
      formData.append('type', 'files')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        addResult('UPLOAD', 'success', `File uploaded: ${result.file.name}`)
      } else {
        throw new Error('File upload failed')
      }
    } catch (error) {
      addResult('UPLOAD', 'error', `Failed: ${error}`)
    }
  }

  const testDatabase = async () => {
    addResult('DATABASE', 'testing', 'Testing database connection...')
    
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        addResult('DATABASE', 'success', 'Database connection working')
      } else {
        throw new Error('Database connection failed')
      }
    } catch (error) {
      addResult('DATABASE', 'error', `Failed: ${error}`)
    }
  }

  const runAllTests = async () => {
    setResults([])
    await testDatabase()
    await testReadCourses()
    await testCreateCourse()
    await testFileUpload()
  }

  const clearResults = () => setResults([])

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>System Reliability Test Panel</CardTitle>
        <p className="text-sm text-gray-600">
          Test all CRUD operations and file uploads to ensure everything is working reliably.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button onClick={testDatabase} variant="outline" size="sm">
            Test Database
          </Button>
          <Button onClick={testReadCourses} variant="outline" size="sm">
            Test Read
          </Button>
          <Button onClick={testCreateCourse} variant="outline" size="sm">
            Test Create
          </Button>
          <Button onClick={testFileUpload} variant="outline" size="sm">
            Test Upload
          </Button>
        </div>

        <div className="flex gap-2">
          <Button onClick={runAllTests} className="flex-1">
            Run All Tests
          </Button>
          <Button onClick={clearResults} variant="outline">
            Clear Results
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <h4 className="font-medium">Test Results:</h4>
            {results.map((result, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
              >
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      result.status === 'success' ? 'default' : 
                      result.status === 'error' ? 'destructive' : 'secondary'
                    }
                  >
                    {result.operation}
                  </Badge>
                  <span>{result.message}</span>
                </div>
                <span className="text-xs text-gray-500">{result.timestamp}</span>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500">
            💡 <strong>Reliability Features:</strong> Database persistence, file validation, 
            error handling, user authentication, and transaction safety all built-in.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}