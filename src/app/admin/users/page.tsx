'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Loader2, ShieldAlert, Check, Edit } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import { useRouter } from 'next/navigation'

interface UserAccount {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  // Form State
  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('admin')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Edit Form State
  const [showEditForm, setShowEditForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [editRole, setEditRole] = useState('admin')
  const [editDpFile, setEditDpFile] = useState<File | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string | null; title: string }>({ id: null, title: '' })
  const [isDeleting, setIsDeleting] = useState(false)

  const router = useRouter()

  const checkAuthAndFetchUsers = async () => {
    try {
      const meRes = await fetch('/api/admin/auth/me')
      if (!meRes.ok) {
        router.push('/admin/login')
        return
      }
      
      const meData = await meRes.json()
      setCurrentUser(meData.user)

      if (meData.user.role !== 'super_admin') {
        setAuthorized(false)
        setLoading(false)
        return
      }

      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      } else {
        toast.error('Failed to load user accounts')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuthAndFetchUsers()
  }, [])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          isActive: true
        })
      })

      if (res.ok) {
        toast.success('Admin account created successfully!')
        setName('')
        setEmail('')
        setPassword('')
        setShowAddForm(false)
        checkAuthAndFetchUsers() // reload
      } else {
        const data = await res.json()
        toast.error(data.message || 'Failed to create user')
      }
    } catch (err) {
      toast.error('Error creating user')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClick = (user: UserAccount) => {
    setEditId(user.id)
    setEditName(user.name)
    setEditEmail(user.email)
    setEditRole(user.role)
    setEditPassword('')
    setEditDpFile(null)
    setShowEditForm(true)
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editId) return

    setIsUpdating(true)
    try {
      const formData = new FormData()
      formData.append('name', editName)
      formData.append('email', editEmail)
      formData.append('role', editRole)
      if (editPassword) formData.append('password', editPassword)
      if (editDpFile) formData.append('dpFile', editDpFile)

      const res = await fetch(`/api/admin/users/${editId}`, {
        method: 'PATCH',
        body: formData,
      })

      if (res.ok) {
        toast.success('Admin account updated successfully!')
        setShowEditForm(false)
        checkAuthAndFetchUsers() // reload
      } else {
        const data = await res.json()
        toast.error(data.message || 'Failed to update user')
      }
    } catch (err) {
      toast.error('Error updating user')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (currentUser?.id === id) {
      toast.error('Cannot delete your own account!')
      return
    }

    setItemToDelete({ id, title: name })
    setDeleteDialogOpen(true)
  }

  const executeDelete = async () => {
    if (!itemToDelete.id) return
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/admin/users/${itemToDelete.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Account deleted successfully')
        setUsers(users.filter((u) => u.id !== itemToDelete.id))
      } else {
        const data = await res.json()
        toast.error(data.message || 'Failed to delete account')
      }
    } catch (e) {
      console.error(e)
      toast.error('Error executing delete action')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#DB9E30]" />
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="max-w-md mx-auto py-16 px-6 text-center bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm space-y-4 shadow-sm">
        <ShieldAlert className="h-12 w-12 text-[#e05326] mx-auto" />
        <h2 className="font-cinzel text-lg font-bold text-[#35170f] dark:text-white uppercase tracking-wider">
          Access Restricted
        </h2>
        <p className="text-xs text-[#8b8178] dark:text-white/60 leading-relaxed">
          Only Super Administrator accounts are authorized to manage admin users and role permissions.
        </p>
        <div className="pt-2">
          <Link
            href="/admin"
            className="btn-primary-hover inline-block text-white font-cinzel font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-sm"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-5">
        <div className="space-y-1">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#DB9E30] hover:text-[#57a68f] uppercase tracking-widest font-bold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#35170f] dark:text-white uppercase tracking-wider">
            Manage Admin Users
          </h1>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary-hover flex items-center justify-center gap-1.5 text-white font-cinzel font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-sm shadow-md transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" /> {showAddForm ? 'Close Form' : 'Add Admin User'}
        </button>
      </div>

      {/* Add New User Form Section */}
      {showAddForm && (
        <form onSubmit={handleCreateUser} className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm p-6 space-y-4 max-w-xl shadow-sm">
          <h3 className="font-cinzel text-xs font-bold text-[#35170f] dark:text-white uppercase tracking-widest border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-2">
            New Admin Account Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-cinzel font-bold text-[#35170f] dark:text-white uppercase tracking-widest block">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-gray-800 dark:text-white rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#DB9E30]"
                placeholder="Name"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-cinzel font-bold text-[#35170f] dark:text-white uppercase tracking-widest block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-gray-800 dark:text-white rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#DB9E30]"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-cinzel font-bold text-[#35170f] dark:text-white uppercase tracking-widest block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-gray-800 dark:text-white rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#DB9E30]"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-cinzel font-bold text-[#35170f] dark:text-white uppercase tracking-widest block">
                Role Permission
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-gray-800 dark:text-white rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#DB9E30] cursor-pointer"
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
                <option value="tester">Tester (Read-Only)</option>
              </select>
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-hover px-6 py-2.5 text-white font-cinzel font-bold text-xs uppercase tracking-widest rounded-sm shadow-md disabled:bg-zinc-300 active:scale-98"
            >
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      )}

      {/* Edit User Form Section */}
      {showEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm p-6 w-full max-w-xl shadow-xl">
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-2">
                <h3 className="font-cinzel text-xs font-bold text-[#35170f] dark:text-white uppercase tracking-widest">
                  Edit Admin Account
                </h3>
                <button type="button" onClick={() => setShowEditForm(false)} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white">✕</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-cinzel font-bold text-[#35170f] dark:text-white uppercase tracking-widest block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-gray-800 dark:text-white rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#DB9E30]"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-cinzel font-bold text-[#35170f] dark:text-white uppercase tracking-widest block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-gray-800 dark:text-white rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#DB9E30]"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-cinzel font-bold text-[#35170f] dark:text-white uppercase tracking-widest block">
                    New Password <span className="text-zinc-400 font-normal">(Leave empty to keep)</span>
                  </label>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-gray-800 dark:text-white rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#DB9E30]"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-cinzel font-bold text-[#35170f] dark:text-white uppercase tracking-widest block">
                    Role Permission
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-gray-800 dark:text-white rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#DB9E30] cursor-pointer"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="tester">Tester (Read-Only)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-cinzel font-bold text-[#35170f] dark:text-white uppercase tracking-widest block">
                  Profile Picture (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditDpFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-gray-800 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-[#DB9E30]/10 file:text-[#DB9E30] hover:file:bg-[#DB9E30]/20"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-6 py-2.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-[#2a211a] dark:hover:bg-[#3d3126] text-[#35170f] dark:text-white font-cinzel font-bold text-xs uppercase tracking-widest rounded-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-primary-hover px-6 py-2.5 text-white font-cinzel font-bold text-xs uppercase tracking-widest rounded-sm shadow-md disabled:bg-zinc-300 active:scale-98"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users table */}
      {users.length > 0 ? (
        <div className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e8dfc8]/80 dark:border-[#2a211a]/80 bg-[#fbfaf8] dark:bg-[#1c1510] text-xs font-cinzel tracking-wider text-[#35170f] dark:text-[#DB9E30] font-bold">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Active</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8dfc8]/30 dark:divide-[#2a211a]/30 text-xs font-medium text-[#5a5048] dark:text-white/70">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#fbfaf8] dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-[#35170f] dark:text-white">{user.name}</td>
                  <td className="p-4 font-mono text-[#5a5048] dark:text-white/60">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-sm border ${
                        user.role === 'super_admin' ? 'bg-[#e05326]/10 border-[#e05326]/20 text-[#e05326] dark:text-[#ff784e]' : ''
                      } ${
                        user.role === 'admin' ? 'bg-[#57a68f]/10 border-[#57a68f]/20 text-[#42816f] dark:text-[#57a68f]' : ''
                      } ${
                        user.role === 'sub_admin' ? 'bg-[#DB9E30]/10 border-[#DB9E30]/20 text-[#DB9E30] dark:text-[#f9d976]' : ''
                      } ${
                        user.role === 'tester' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400' : ''
                      }`}
                    >
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#42816f] dark:text-[#57a68f]">
                      <Check className="w-3.5 h-3.5" /> Active
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="p-2 bg-[#DB9E30]/10 hover:bg-[#DB9E30] border border-[#DB9E30]/20 text-[#DB9E30] hover:text-white rounded-sm transition-all cursor-pointer"
                        title="Edit User"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      {currentUser?.id !== user.id && (
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="p-2 bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white rounded-sm transition-all cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm bg-white dark:bg-[#17110d]">
          <p className="text-[#8b8178] dark:text-white/40 text-xs">No admin accounts registered.</p>
        </div>
      )}

      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={executeDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete admin account "${itemToDelete.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  )
}

