'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/admin/auth/me')
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          router.push('/admin/login')
        }
      } catch (err) {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [router])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      })

      if (res.ok) {
        toast.success('Password changed successfully')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to change password')
      }
    } catch (err) {
      toast.error('Error changing password')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#DB9E30]" />
      </div>
    )
  }

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-5">
        <div className="space-y-1">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#DB9E30] hover:text-[#57a68f] uppercase tracking-widest font-bold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#35170f] dark:text-white uppercase tracking-wider">
            Profile & Settings
          </h1>
        </div>
      </div>

      <div className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm p-6 shadow-sm">
        <h3 className="font-cinzel text-sm font-bold text-[#35170f] dark:text-white uppercase tracking-widest border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-3 mb-4">
          Account Information
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-cinzel font-bold text-[#8b8178] uppercase tracking-widest">Name</p>
            <p className="text-sm font-bold text-[#35170f] dark:text-white">{user?.name}</p>
          </div>
          <div>
            <p className="text-[10px] font-cinzel font-bold text-[#8b8178] uppercase tracking-widest">Email</p>
            <p className="text-sm font-mono text-[#35170f] dark:text-white/80">{user?.email}</p>
          </div>
          <div>
            <p className="text-[10px] font-cinzel font-bold text-[#8b8178] uppercase tracking-widest">Role</p>
            <span className="inline-block mt-1 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border bg-[#57a68f]/10 border-[#57a68f]/20 text-[#42816f]">
              {user?.role.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm p-6 shadow-sm">
        <h3 className="font-cinzel text-sm font-bold text-[#35170f] dark:text-white uppercase tracking-widest border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-3 mb-4">
          Change Password
        </h3>
        
        {user?.role === 'tester' ? (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded text-xs leading-relaxed">
            As a Tester, you cannot change your password.
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-5">
            <div>
              <label className="text-[10px] font-cinzel font-bold text-[#35170f] dark:text-white uppercase tracking-widest block mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-gray-800 dark:text-white rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-[#DB9E30]"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-cinzel font-bold text-[#35170f] dark:text-white uppercase tracking-widest block mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-gray-800 dark:text-white rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-[#DB9E30]"
                />
              </div>
              <div>
                <label className="text-[10px] font-cinzel font-bold text-[#35170f] dark:text-white uppercase tracking-widest block mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-gray-800 dark:text-white rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-[#DB9E30]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary-hover flex items-center justify-center gap-2 text-white font-cinzel font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
