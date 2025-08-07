'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import MainLayout from '@/components/layout/main-layout'
import CleanCourseAdmin from '@/components/clean-course-admin'

export default function AdminCoursesPage() {
  const { data: session, status } = useSession()

  // Check if user is admin/manager
  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
    redirect('/dashboard')
  }

  return (
    <MainLayout>
      <CleanCourseAdmin />
    </MainLayout>
  )
}