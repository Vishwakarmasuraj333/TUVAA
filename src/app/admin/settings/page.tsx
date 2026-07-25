'use client'

import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Save, Loader2, User, Key, Globe } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'site'>('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(null)

  // Profile Fields
  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')

  // Password Fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Site Settings Fields
  const [logo, setLogo] = useState('')
  const [phone, setPhone] = useState('')
  const [siteEmail, setSiteEmail] = useState('')
  const [address, setAddress] = useState('')
  const [facebook, setFacebook] = useState('')
  const [instagram, setInstagram] = useState('')
  const [footerText, setFooterText] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch Current User
        const userRes = await fetch('/api/admin/auth/me')
        if (userRes.ok) {
          const userData = await userRes.json()
          setCurrentUser(userData.user)
          setProfileName(userData.user.name || '')
          setProfileEmail(userData.user.email || '')
        }

        // Fetch Site Settings
        const settingsRes = await fetch('/api/admin/settings')
        if (settingsRes.ok) {
          const config = await settingsRes.json()
          setLogo(config.logo || '/images/tuvaa-final-png.png')
          setPhone(config.phone || '07385932327')
          setSiteEmail(config.email || 'info@tuvaa.org.uk')
          setAddress(config.address || '')
          setFacebook(config.facebook || '')
          setInstagram(config.instagram || '')
          setFooterText(config.footerText || '')
        }
      } catch (e) {
        toast.error('Failed to load settings data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileName || !profileEmail) {
      toast.error('Name and Email are required')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'PROFILE',
          name: profileName,
          email: profileEmail,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        toast.success('Profile updated successfully!')
        if (currentUser) {
          setCurrentUser({ ...currentUser, name: profileName, email: profileEmail })
        }
      } else {
        const err = await res.json()
        toast.error(err.message || 'Failed to update profile')
      }
    } catch (e) {
      toast.error('Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required')
      return
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Confirm password does not match')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'PASSWORD',
          currentPassword,
          newPassword,
        }),
      })

      if (res.ok) {
        toast.success('Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        const err = await res.json()
        toast.error(err.message || 'Failed to change password')
      }
    } catch (e) {
      toast.error('Error changing password')
    } finally {
      setSaving(false)
    }
  }

  const handleSiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentUser?.role !== 'super_admin') {
      toast.error('Forbidden: Super Admin access required')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SITE_SETTINGS',
          siteSettings: {
            logo,
            phone,
            email: siteEmail,
            address,
            facebook,
            instagram,
            footerText,
          },
        }),
      })

      if (res.ok) {
        toast.success('Site settings saved successfully!')
      } else {
        const err = await res.json()
        toast.error(err.message || 'Failed to save settings')
      }
    } catch (e) {
      toast.error('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center text-[#DB9E30]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const isSuperAdmin = currentUser?.role === 'super_admin'

  return (
    <div className="space-y-6 text-left max-w-4xl">
      
      {/* Top Header */}
      <div className="border-b border-[#DB9E30]/20 pb-4">
        <h1 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wider flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-[#DB9E30]" /> Account & Site Settings
        </h1>
        <p className="text-xs opacity-60 mt-1">Configure profile details, credentials, and global brand options.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#f7f3e8] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded p-0.5 self-start w-fit">
        <button
          onClick={() => setActiveTab('profile')}
          className={cn(
            'px-4 py-2 text-xs font-cinzel tracking-wider uppercase rounded-sm transition-all cursor-pointer font-bold flex items-center gap-2',
            activeTab === 'profile'
              ? 'bg-[#DB9E30] text-[#0d0905]'
              : 'text-[#8b8178] hover:text-[#DB9E30]'
          )}
        >
          <User className="w-4 h-4" /> Profile Info
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={cn(
            'px-4 py-2 text-xs font-cinzel tracking-wider uppercase rounded-sm transition-all cursor-pointer font-bold flex items-center gap-2',
            activeTab === 'password'
              ? 'bg-[#DB9E30] text-[#0d0905]'
              : 'text-[#8b8178] hover:text-[#DB9E30]'
          )}
        >
          <Key className="w-4 h-4" /> Change Password
        </button>
        <button
          onClick={() => setActiveTab('site')}
          className={cn(
            'px-4 py-2 text-xs font-cinzel tracking-wider uppercase rounded-sm transition-all cursor-pointer font-bold flex items-center gap-2',
            activeTab === 'site'
              ? 'bg-[#DB9E30] text-[#0d0905]'
              : 'text-[#8b8178] hover:text-[#DB9E30]'
          )}
        >
          <Globe className="w-4 h-4" /> Site Settings
        </button>
      </div>

      {/* Form Area */}
      <div className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded p-6 shadow-md">
        
        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <h3 className="font-cinzel text-xs font-bold text-[#DB9E30] uppercase tracking-widest border-b border-[#e8dfc8] dark:border-[#2a211a] pb-2 mb-4">
              Edit Profile Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-cinzel text-[#DB9E30] uppercase tracking-widest font-bold">Display Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-[#DB9E30] text-sm text-gray-800 dark:text-white"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-cinzel text-[#DB9E30] uppercase tracking-widest font-bold">Login Email</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-[#DB9E30] text-sm text-gray-800 dark:text-white"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#DB9E30] to-[#b37a1e] hover:from-[#e9ab2d] hover:to-[#c9881d] disabled:opacity-50 text-[#0d0905] font-cinzel font-bold text-xs uppercase tracking-widest px-6 py-3 rounded transition-all active:scale-95 cursor-pointer shadow-md"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4" /> Save Profile
            </button>
          </form>
        )}

        {/* Tab 2: Password */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <h3 className="font-cinzel text-xs font-bold text-[#DB9E30] uppercase tracking-widest border-b border-[#e8dfc8] dark:border-[#2a211a] pb-2 mb-4">
              Update Password
            </h3>
            <div className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-cinzel text-[#DB9E30] uppercase tracking-widest font-bold">Current Password *</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-[#DB9E30] text-sm text-gray-800 dark:text-white"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-cinzel text-[#DB9E30] uppercase tracking-widest font-bold">New Password (Min 8 chars) *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-[#DB9E30] text-sm text-gray-800 dark:text-white"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-cinzel text-[#DB9E30] uppercase tracking-widest font-bold">Confirm New Password *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-[#DB9E30] text-sm text-gray-800 dark:text-white"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#DB9E30] to-[#b37a1e] hover:from-[#e9ab2d] hover:to-[#c9881d] disabled:opacity-50 text-[#0d0905] font-cinzel font-bold text-xs uppercase tracking-widest px-6 py-3 rounded transition-all active:scale-95 cursor-pointer shadow-md"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4" /> Save Password
            </button>
          </form>
        )}

        {/* Tab 3: Site Settings */}
        {activeTab === 'site' && (
          <div>
            {!isSuperAdmin ? (
              <div className="p-6 text-center text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded">
                Access Denied: Global Site Settings can only be configured by the <strong>Super Admin</strong>.
              </div>
            ) : (
              <form onSubmit={handleSiteSubmit} className="space-y-6">
                <h3 className="font-cinzel text-xs font-bold text-[#DB9E30] uppercase tracking-widest border-b border-[#e8dfc8] dark:border-[#2a211a] pb-2 mb-4">
                  Global Site Configuration
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-cinzel text-[#DB9E30] uppercase tracking-widest font-bold">Logo File Path</label>
                    <input
                      type="text"
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-[#DB9E30] text-sm text-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-cinzel text-[#DB9E30] uppercase tracking-widest font-bold">Contact Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-[#DB9E30] text-sm text-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-cinzel text-[#DB9E30] uppercase tracking-widest font-bold">Contact Email</label>
                    <input
                      type="email"
                      value={siteEmail}
                      onChange={(e) => setSiteEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-[#DB9E30] text-sm text-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-cinzel text-[#DB9E30] uppercase tracking-widest font-bold">Copyright Footer Text</label>
                    <input
                      type="text"
                      value={footerText}
                      onChange={(e) => setFooterText(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-[#DB9E30] text-sm text-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-cinzel text-[#DB9E30] uppercase tracking-widest font-bold">Facebook URL</label>
                    <input
                      type="text"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-[#DB9E30] text-sm text-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-cinzel text-[#DB9E30] uppercase tracking-widest font-bold">Instagram URL</label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-[#DB9E30] text-sm text-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-cinzel text-[#DB9E30] uppercase tracking-widest font-bold">Operating Address</label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-[#DB9E30] text-sm text-gray-800 dark:text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-[#DB9E30] to-[#b37a1e] hover:from-[#e9ab2d] hover:to-[#c9881d] disabled:opacity-50 text-[#0d0905] font-cinzel font-bold text-xs uppercase tracking-widest px-6 py-3 rounded transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Save className="h-4 w-4" /> Save Site Settings
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
