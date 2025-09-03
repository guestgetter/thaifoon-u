'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Edit2 } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

interface UserEditDialogProps {
  userId: string
  onUserUpdated: () => void
}

export default function UserEditDialog({ userId, onUserUpdated }: UserEditDialogProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: ''
  })

  useEffect(() => {
    if (open && userId) {
      fetchUser()
    }
  }, [open, userId])

  async function fetchUser() {
    setInitialLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setFormData({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          password: '' // Always empty for security
        })
      } else {
        console.error('Failed to fetch user')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setInitialLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Only send fields that have values
      const updateData: any = {}
      if (formData.name.trim()) updateData.name = formData.name.trim()
      if (formData.email.trim()) updateData.email = formData.email.trim()
      if (formData.role) updateData.role = formData.role
      if (formData.password.trim()) updateData.password = formData.password.trim()

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        setOpen(false)
        onUserUpdated()
        // Reset password field
        setFormData(prev => ({ ...prev, password: '' }))
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Failed to update user')
    } finally {
      setLoading(false)
    }
  }

  // Check permissions
  const canEditRole = session?.user.role === 'ADMIN'
  const canEditUser = session?.user.role === 'ADMIN' || 
    (session?.user.role === 'MANAGER' && user?.role === 'STAFF')

  if (!canEditUser) {
    return null // Don't render the button if user can't edit
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions.
          </DialogDescription>
        </DialogHeader>
        
        {initialLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : user ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter full name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address..."
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                  disabled={!canEditRole}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STAFF">Staff</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    {canEditRole && <SelectItem value="ADMIN">Admin</SelectItem>}
                  </SelectContent>
                </Select>
                {!canEditRole && (
                  <p className="text-xs text-gray-500">
                    Only admins can change user roles
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  New Password (optional)
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Leave empty to keep current password..."
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  Only enter a password if you want to change it
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update User'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Failed to load user data</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
